const router = require('express').Router();
const sequelize = require('../config/connection');
const { Op } = require('sequelize');
const { Message } = require('../models');

router.get('/', (req, res) => {
  const userId = req.session.user_id;

  Message.findAll({
    where: {
      [Op.or]: [{ sender_id: userId }, { recipient_id: userId }],
    },
    order: [['id', 'DESC']],
  }).then((data) => {
    const activeChats = [];
    const plainData = [];
    data.forEach((data) => {
      plainData.push(data.get({ plain: true }));
    });

    // convert the messages into a plain array
    plainData.forEach((data) => {
      if (activeChats.indexOf(data.recipient_id) === -1) {
        activeChats.push(data.recipient_id);
      }
    });

    res.render('chats', {
      loggedIn: req.session.loggedIn,
      activeChats: activeChats.filter((id) => id !== userId),
    });
  });
});

// display chatroom sandbox
router.get('/:id', (req, res) => {
  // hardcoding userID of 3, will eventually get this data from user's session data
  const senderId = req.session.user_id;
  const recipientId = req.params.id;

  // to do:
  // use Sequelize to grab the messages FROM senderId TO recipientId
  // use Sequelize to grab the messages FROM recipientId TO senderId
  // combine the messages, then sort chronologically, then deliver the whole batch of messages to the user

  res.render('chat', {
    senderId,
    recipientId,
    loggedIn: req.session.loggedIn,
  });
});

module.exports = router;
