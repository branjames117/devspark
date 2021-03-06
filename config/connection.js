require('dotenv').config();
const Sequelize = require('sequelize');
const cloudinary = require('cloudinary');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// in this file we configure our Sequelize, multer, and Cloudinary connections

let sequelize;

// set up sequelize connection based on whether or not Heroku/JawsDB is hooked up
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
const limits = { fileSize: 1024 * 1024 };
const upload = multer({
  storage: multer.diskStorage({}),
  limits,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      req.invalidFile = true;
    }
    cb(null, true);
  },
});

// configure cloudinary API connection
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// configure gmail transporter for nodemailer
// create the transporter for our gmail-based forgot-password message
const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    return transporter;
  } catch (error) {
    console.log(error);
    console.log({
      message: 'Something went wrong with the Gmail/Nodemailer configuration.',
      error,
    });
  }
};

module.exports = { sequelize, cloudinary, upload, createTransporter };
