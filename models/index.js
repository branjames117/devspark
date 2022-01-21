const User = require('./User');
const Message = require('./Message');
const Image = require('./Image');

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
