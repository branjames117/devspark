const { User } = require('../models');

const userData = [
  {
    username: 'Brandon',
    email: 'brandon@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Murfreesboro',
  },
  {
    username: 'Eric',
    email: 'eric@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Nashville',
  },
  {
    username: 'Cody',
    email: 'cody@gmail.com',
    password: 'password',
    state: 'Michigan',
    city: 'Nashville',
  },
  {
    username: 'Olivia',
    email: 'olivia@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Nashville',
  },
  {
    username: 'Shannon',
    email: 'shannon@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Nashville',
  },
  {
    username: 'Bianka',
    email: 'bianka@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Nashville',
  },
  {
    username: 'Collin',
    email: 'collin@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
  },
  {
    username: 'JohnG',
    email: 'johng@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
  },
  {
    username: 'Marshall',
    email: 'marshall@gmail.com',
    password: 'password',
    state: 'Alaska',
    city: 'Juno',
  },
  {
    username: 'Shania',
    email: 'shania@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Los Angeles',
  },
];

const seedUsers = () => User.bulkCreate(userData, { individualHooks: true });

module.exports = seedUsers;
