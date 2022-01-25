const { UserSkill } = require('../models');

const userSkillData = [
  {
    user_id: 1,
    skill_id: 1,
  },
  {
    user_id: 1,
    skill_id: 3,
  },
  {
    user_id: 1,
    skill_id: 4,
  },
  {
    user_id: 1,
    skill_id: 5,
  },
  {
    user_id: 2,
    skill_id: 3,
  },
  {
    user_id: 2,
    skill_id: 4,
  },
  {
    user_id: 2,
    skill_id: 6,
  },
  {
    user_id: 3,
    skill_id: 1,
  },
  {
    user_id: 3,
    skill_id: 3,
  },
  {
    user_id: 3,
    skill_id: 10,
  },
  {
    user_id: 3,
    skill_id: 22,
  },
  {
    user_id: 3,
    skill_id: 26,
  },
  {
    user_id: 4,
    skill_id: 1,
  },
  {
    user_id: 4,
    skill_id: 2,
  },
  {
    user_id: 4,
    skill_id: 3,
  },
  {
    user_id: 5,
    skill_id: 6,
  },
  {
    user_id: 5,
    skill_id: 7,
  },
  {
    user_id: 5,
    skill_id: 9,
  },
  {
    user_id: 6,
    skill_id: 1,
  },
  {
    user_id: 6,
    skill_id: 12,
  },
  {
    user_id: 1,
    skill_id: 14,
  },
];

const seedUserSkills = () => UserSkill.bulkCreate(userSkillData);

module.exports = seedUserSkills;
