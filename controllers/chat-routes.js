const router = require('express').Router();
const { sequelize } = require('../config/connection');
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
      attributes: ['id', 'email'],
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
router.get('/:id', withAuth, (req, res) => {
  // get senderID from session data, recipientID from req params
  const senderId = req.session.user_id;
  const recipientId = req.params.id;

  // find recipient
  User.findByPk(recipientId).then((dbUserData) => {
    // if recipient ID does not exist, send user back to chats
    if (!dbUserData) {
      res.render('chats', {
        loggedIn: req.session.loggedIn,
        userID: req.session.user_id,
      });
      return;
    }

    // convert string of recipient's blocked user IDs to array of integers, which is some tomfoolery we have to do since Sequelize/MySQL doesn't support array datatypes
    const blockedUsersIntArray = dbUserData.dataValues.blocked_users
      .split(';')
      .map((id) => parseInt(id));

    // check if senderID is in recipientID's list of blocked users
    if (blockedUsersIntArray.indexOf(senderId) === -1) {
      // if not, proceed with the chat
      res.render('chat', {
        senderId,
        recipientId,
        loggedIn: req.session.loggedIn,
        userID: req.session.user_id,
      });
    } else {
      // otherwise, inform the sender they're blocked
      res.render('blocked', {
        recipientId,
        loggedIn: req.session.loggedIn,
      });
    }
  });
});

module.exports = router;
