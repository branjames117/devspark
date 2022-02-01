const { UserSkill } = require('../models');

// this seeds the userskill model to give all our 150 virtual profiles some skills to play with

const skillOptions = [
  1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6,
  6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
];

const numberOfUsers = 150;

const userSkillData = [];

for (let i = 1; i <= numberOfUsers; i++) {
  // user profile ID: i
  // give each user between 0 and 12 skills
  const thisUserSkills = [];
  for (let i = 0; i < Math.floor(Math.random() * 12); i++) {
    const skill = skillOptions[Math.floor(Math.random() * skillOptions.length)];
    // guarantee that the user gets only one copy of each skill
    if (thisUserSkills.indexOf(skill) === -1) {
      thisUserSkills.push(skill);
    }
  }

  // how many skills did the wheels of fate determine?
  thisUserSkills.forEach((skill) => {
    userSkillData.push({ user_id: i, skill_id: skill });
  });
}

const seedUserSkills = () => UserSkill.bulkCreate(userSkillData);

module.exports = seedUserSkills;
