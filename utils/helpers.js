const { Message } = require('../models');

// return a user's number of unread messages
async function notificationCount(userID) {
  return await Message.count({
    where: {
      recipient_id: userID,
      read: false,
    },
  });
}

module.exports = { notificationCount };
