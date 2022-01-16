const router = require('express').Router();
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
  res.render('chatroom', { loggedIn: req.session.loggedIn });
});

// display chatroom sandbox
router.get('/:id', (req, res) => {
  // hardcoding userID of 3, will eventually get this data from user's session data
  const senderId = req.session.user_id;

  console.log(senderId);
  // :id param will be the id of the user to be messaged
  const recipientId = req.params.id;
  console.log(recipientId);

  // to do:
  // use Sequelize to grab the messages FROM senderId TO recipientId
  // use Sequelize to grab the messages FROM recipientId TO senderId
  // combine the messages, then sort chronologically, then deliver the whole batch of messages to the user

  res.render('chatroom', {
    senderId,
    recipientId,
    loggedIn: req.session.loggedIn,
  });
});

module.exports = router;
