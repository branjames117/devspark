const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

class Stack extends Model {}

Stack.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    skill_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'skill',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'stack',
  }
);

module.exports = Stack;
