const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

class UserSkill extends Model {}

UserSkill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    skill_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'skill',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_skill',
  }
);

module.exports = UserSkill;
