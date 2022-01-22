const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

class Skill extends Model {}

Skill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    skill_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'skill',
  }
);

module.exports = Skill;
