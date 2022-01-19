// configure Sequelize, Multer, and Cloudinary connections
require('dotenv').config();
const Sequelize = require('sequelize');
const cloudinary = require('cloudinary');
const multer = require('multer');

// set up sequelize connection based on whether or not JawsDB is hooked up
let sequelize;

// use JAWSDB if deployed to Heroku, otherwise use local MySQL database
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

// configure multer
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb({ message: 'Unsupported file format' }, false);
    }
  },
});

// configure cloudinary API
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = { sequelize, cloudinary, upload };
