const seedUsers = require('./user-seeds');
const seedSkills = require('./skill-seeds');
const seedUserSkills = require('./userskill-seeds');

const { sequelize } = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');
  await seedSkills();
  console.log('\n-----  SKILLS SEEDED  -----\n');
  await seedUsers();
  console.log('\n-----  USERS SEEDED  ----\n');
  await seedUserSkills();
  console.log('\n-----  USER SKILLS SEEDED  ----\n');
};

module.exports = seedAll;
