require('dotenv').config();
const Sequelize = require('sequelize');
const cloudinary = require('cloudinary');
const multer = require('multer');

// in this file we configure our Sequelize, multer, and Cloudinary connections

let sequelize;

// set up sequelize connection based on whether or not JawsDB is hooked up
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
    }
  );
}

// set up multer

// variable to limit image file size
const limits = {fileSize: 1024 * 1024}
const upload = multer({
  storage: multer.diskStorage({}),
  limits: limits,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb({ message: 'Unsupported file format' }, false);
    }
  },
});

// configure cloudinary API connection
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// configure multer, the middleware for handling multipart/form-data

module.exports = { sequelize, cloudinary, upload };
