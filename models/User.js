const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
  // add check password method to user model
  // compares entered password with password stored in instance
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    // this is a string that looks like 0;5;15;6; and will ultimately be split into an array of user IDs that are blocked
    blocked_users: {
      type: DataTypes.TEXT,
      defaultValue: '0;',
    },
  },
  {
    hooks: {
      // before storing new user in db, hash the password
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // before updating user in db, hash the password
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        updatedUserData.blocked_users += updatedUserData.blocked_users;
        return updatedUserData;
      },
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
