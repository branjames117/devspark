const router = require('express').Router();
const { Op } = require('sequelize');
const { User, Message } = require('../models');
const withAuth = require('../utils/auth');

// temporary GET /chat displays list of all user's conversations
router.get('/', withAuth, (req, res) => {
  const userId = req.session.user_id;

  Message.findAll({
    where: {
      // find all messages where user is either a sender or a recipient
      [Op.or]: [{ sender_id: userId }, { recipient_id: userId }],
    },
    include: {
      model: User,
      attributes: ['id', 'email', 'username'],
    },
    // sort the messages in descending order by ID so that the most recent message is first
    order: [['id', 'DESC']],
  }).then((data) => {
    // convert data to plain data
    const plainData = [];
    data.forEach((data) => {
      plainData.push(data.get({ plain: true }));
    });

    // find all unique IDs involved in the user's chats and store the latest messages
    const activeChatUsers = [];
    const activeChatMessages = [];
    plainData.forEach((data) => {
      if (activeChatUsers.indexOf(data.recipient_id) === -1) {
        activeChatUsers.push(data.recipient_id);
        activeChatMessages.push({
          sender: data.recipient_id,
          message: data.body,
          read: data.read,
        });
      }
      if (activeChatUsers.indexOf(data.sender_id) === -1) {
        activeChatUsers.push(data.sender_id);
        activeChatMessages.push({
          sender: data.sender_id,
          message: data.body,
          read: data.read,
        });
      }
    });

    // to do: look up the user by id then filter out blocked users from the list of active chats
    User.findByPk(userId).then((dbUserData) => {
      // convert string of recipient's blocked user IDs to array of integers, which is some tomfoolery we have to do since Sequelize/MySQL doesn't support array datatypes
      const blockedUsersIntArray = dbUserData.dataValues.blocked_users
        .split(';')
        .map((id) => parseInt(id));

      // go through list of user's blocked users and only add to their active chats the users who are not blocked

      const newActiveChatMessages = [];
      activeChatMessages.forEach((message) => {
        if (blockedUsersIntArray.indexOf(message.sender) === -1) {
          newActiveChatMessages.push(message);
        }
      });

      res.render('chats', {
        loggedIn: req.session.loggedIn,
        // filter out the user's own ID from the list of active chats, otherwise user will see themselves as an active chat
        activeChats: newActiveChatMessages.filter(
          (message) => message.sender !== userId
        ),
        userID: req.session.user_id,
      });
    });
  });
});

// GET /chat/1 opens chatroom with userID of 1
router.get('/:id', withAuth, async (req, res) => {
  // get senderID from session data, recipientID from req params
  const senderId = req.session.user_id;
  const recipientId = req.params.id;

  // if user is trying to message themselves, redirect back to chats
  if (senderId == recipientId) {
    console.log('redirecting');
    res.render('chats', {
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
    });
    return;
  }

  const sender = await User.findByPk(senderId, { raw: true });
  const recipient = await User.findByPk(recipientId, { raw: true });

  // if recipient does not exist, redirect back to /chat
  if (!recipient) {
    res.render('chats', {
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
    });
    return;
  }

  console.log(sender, recipient);

  console.log(sender.blocked_users);
  console.log(recipient.blocked_users);

  // convert string of recipient's blocked user IDs to array of integers, which is some tomfoolery we have to do since Sequelize/MySQL doesn't support array datatypes
  const blockedUsersIntArray = sender.blocked_users
    .split(';')
    .map((id) => parseInt(id));

  // check if senderID is in recipientID's list of blocked users
  if (blockedUsersIntArray.indexOf(parseInt(recipientId)) === -1) {
    // if not, proceed with the chat
    res.render('chat', {
      senderId,
      recipientId,
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
      username: req.session.username,
      recipient_name: recipient.username,
    });
  } else {
    res.render('chats', {
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
    });
    return;
  }
});

module.exports = router;
