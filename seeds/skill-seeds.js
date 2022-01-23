const { Skill } = require('../models');

const skillData = [
  {
    skill_name: 'JavaScript',
  },
  {
    skill_name: 'HTML/CSS',
  },
  {
    skill_name: 'Node.js',
  },
  {
    skill_name: 'React',
  },
  {
    skill_name: 'AngularJS',
  },
  {
    skill_name: 'Vue.js',
  },
  {
    skill_name: 'MySQL',
  },
  {
    skill_name: 'Express',
  },
  {
    skill_name: 'NoSQL',
  },
  {
    skill_name: 'TypeScript',
  },
  {
    skill_name: 'Python',
  },
  {
    skill_name: 'Java',
  },
  {
    skill_name: 'PHP',
  },
  {
    skill_name: 'C/C++',
  },
  {
    skill_name: 'C#',
  },
  {
    skill_name: 'R',
  },
  {
    skill_name: 'Swift',
  },
  {
    skill_name: 'Objective-C',
  },
  {
    skill_name: 'Bash/Shell',
  },
  {
    skill_name: 'Go',
  },
  {
    skill_name: 'Rust',
  },
  {
    skill_name: 'Perl',
  },
  {
    skill_name: 'Ruby',
  },
  {
    skill_name: 'Ruby on Rails',
  },
  {
    skill_name: 'VB.NET',
  },
  {
    skill_name: 'Scala',
  },
];

const seedSkills = () => Skill.bulkCreate(skillData);

module.exports = seedSkills;
