const User = require('./User');
const Message = require('./Message');
const Skill = require('./Skill');
const UserSkill = require('./UserSkill');

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

User.belongsToMany(Skill, {
  through: UserSkill,
  foreignKey: 'user_id',
});

Skill.belongsToMany(User, {
  through: UserSkill,
  foreignKey: 'skill_id',
});

module.exports = { User, Message, Skill, UserSkill };
