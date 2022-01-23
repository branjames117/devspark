const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

class Skill extends Model {}

Skill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    skill_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'message',
  }
);

module.exports = Skill;
