const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');
const bcrypt = require('bcrypt');

class Image extends Model {}


module.exports = Image;
