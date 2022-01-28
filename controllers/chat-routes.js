const router = require('express').Router();
const { Op } = require('sequelize');
const { User, Message } = require('../models');
const withAuth = require('../utils/auth');

// GET /chat - displays list of all user's conversations
router.get('/', withAuth, async (req, res) => {
  const id = req.session.user_id;

  try {
    const messages = await Message.findAll({
      where: {
        // find all messages where user is either a sender or a recipient
        [Op.or]: [{ sender_id: id }, { recipient_id: id }],
      },
      include: {
        model: User,
        attributes: ['id', 'username'],
      },
      raw: true,
      // sort the messages in descending order by ID so that the most recent message is first
      order: [['id', 'DESC']],
    });

    // find all unique IDs involved in the user's chats and store the latest messages
    const activeChatUsers = [];
    const activeChatMessages = [];
    messages.forEach((message) => {
      if (activeChatUsers.indexOf(message.recipient_id) === -1) {
        activeChatUsers.push(message.recipient_id);
        activeChatMessages.push({
          sender: message.recipient_id,
          message: message.body,
          read: message.read,
        });
      }
      if (activeChatUsers.indexOf(message.sender_id) === -1) {
        activeChatUsers.push(message.sender_id);
        activeChatMessages.push({
          sender: message.sender_id,
          message: message.body,
          read: message.read,
        });
      }
    });

    // look up the user by id then filter out blocked users from the list of active chats
    const { blocked_users } = await User.findByPk(id, {
      attributes: ['blocked_users'],
      raw: true,
    });

    // convert string of recipient's blocked user IDs to array of integers, which is some tomfoolery we have to do since Sequelize/MySQL doesn't support array datatypes
    const blockedUsersIntArray = blocked_users
      .split(';')
      .map((id) => parseInt(id));

    // go through list of user's blocked users and only add to their active chats the users who are not blocked
    const newActiveChatMessages = [];
    activeChatMessages.forEach((message) => {
      if (
        blockedUsersIntArray.indexOf(message.sender) === -1 &&
        message.sender !== id
      ) {
        newActiveChatMessages.push(message);
      }
    });

    res.render('chats', {
      loggedIn: req.session.loggedIn,
      // filter out the user's own ID from the list of active chats, otherwise user will see themselves as an active chat
      activeChats: newActiveChatMessages,
      userID: req.session.user_id,
    });
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// GET /chat/1 opens chatroom with userID of 1
router.get('/:id', withAuth, async (req, res) => {
  // get senderID from session data, recipientID from req params
  const senderId = req.session.user_id;
  const recipientId = req.params.id;

  // if user is trying to message themselves, redirect back to chats
  if (senderId == recipientId) {
    return res.render('chats', {
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
    });
  }

  try {
    const { blocked_users } = await User.findByPk(senderId, {
      attributes: ['blocked_users'],
      raw: true,
    });
    const recipient = await User.findByPk(recipientId, {
      attributes: ['username'],
      raw: true,
    });

    // if recipient does not exist, redirect back to /chat
    if (!recipient) {
      return res.render('chats', {
        loggedIn: req.session.loggedIn,
        userID: req.session.user_id,
      });
    }

    // convert string of recipient's blocked user IDs to array of integers, which is some tomfoolery we have to do since Sequelize/MySQL doesn't support array datatypes
    const blockedUsersIntArray = blocked_users
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
      return res.render('chats', {
        loggedIn: req.session.loggedIn,
        userID: req.session.user_id,
      });
    }
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

module.exports = router;
