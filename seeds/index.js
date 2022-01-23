// const seedUsers = require('./user-seeds');
const seedSkills = require('./skill-seeds');

const { sequelize } = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');
  await seedSkills();
  console.log('\n-----  SKILLS SEEDED  -----\n');
  // await seedUsers();
  // console.log('\n-----  USERS SEEDED  ----\n');
  process.exit(0);
};

seedAll();
