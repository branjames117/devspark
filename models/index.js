const User = require('./User');
const Message = require('./Message');

// create relationships between user and message models
User.hasMany(Message, {
  foreignKey: 'sender',
});

User.hasMany(Message, {
  foreignKey: 'recipient_id',
});

Message.belongsTo(User, {
  foreignKey: 'sender_id',
});

module.exports = { User, Message };
