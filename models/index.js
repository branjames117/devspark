const User = require('./User');
const Message = require('./Message');
const Skill = require('./Skill');
const Stack = require('./Stack');

// create relationships between user and message models
User.hasMany(Message, {
  foreignKey: 'sender_id',
});

User.hasMany(Message, {
  foreignKey: 'recipient_id',
});

Message.belongsTo(User, {
  foreignKey: 'sender_id',
});

Skill.belongsToMany(User, {
  through: Stack,
  foreignKey: 'skill_id',
});

User.belongsToMany(Skill, {
  through: Stack,
  foreignKey: 'user_id',
});

module.exports = { User, Message, Skill, Stack };
