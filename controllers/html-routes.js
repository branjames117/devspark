const router = require('express').Router();
const sequelize = require('../config/connection');

// display home route (Home Page)
router.get('/', (req, res) => {
  res.render('chatroom');
});

module.exports = router;
