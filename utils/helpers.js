const { Op } = require('sequelize');
const { User, Message } = require('../models');

// returns true if user is on his/her own profile
function ownProfile(id1, id2) {
  return id1 === id2;
}

// return a user's number of unread messages
async function notificationCount(userID) {
  return await Message.count({
    where: {
      recipient_id: userID,
      read: false,
    },
  });
}

async function chatList(userID) {
  // find all messages where user is either sender or receiver
  const messages = await Message.findAll({
    where: {
      // find all messages where user is either a sender or a recipient
      [Op.or]: [{ sender_id: userID }, { recipient_id: userID }],
    },
    include: {
      model: User,
      attributes: ['id', 'email', 'username'],
    },
    // sort the messages in descending order by ID so that the most recent message is first
    order: [['id', 'DESC']],
  });

  // convert data to plain data
  const plainData = [];
  messages.forEach((data) => {
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
        createdAt: data.createdAt,
        room: data.room,
      });
    }
    if (activeChatUsers.indexOf(data.sender_id) === -1) {
      activeChatUsers.push(data.sender_id);
      activeChatMessages.push({
        sender: data.sender_id,
        message: data.body,
        read: data.read,
        createdAt: data.createdAt,
        room: data.room,
      });
    }
  });

  // to do: look up the user by id then filter out blocked users from the list of active chats
  const userData = await User.findByPk(userID);

  // convert string of recipient's blocked user IDs to array of integers, which is some tomfoolery we have to do since Sequelize/MySQL doesn't support array datatypes
  const blockedUsersIntArray = userData.dataValues.blocked_users
    .split(';')
    .map((id) => parseInt(id));

  // go through list of user's blocked users and only add to their active chats the users who are not blocked

  const newActiveChatMessages = [];
  activeChatMessages.forEach((message) => {
    if (
      blockedUsersIntArray.indexOf(message.sender) === -1 &&
      message.sender !== userID
    ) {
      newActiveChatMessages.push(message);
    }
  });
  for (const chat of newActiveChatMessages) {
    const user = await User.findByPk(chat.sender, {
      attributes: ['username'],
    });
    chat.username = user.dataValues.username;
  }

  return newActiveChatMessages;
}

module.exports = { notificationCount, chatList, ownProfile };
