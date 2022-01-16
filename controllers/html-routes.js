const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Message } = require('../models');

router.get('/', (req, res) => {
  res.render('home', { loggedIn: req.session.loggedIn });
});

// display login prompt (Login Page)
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// display login prompt (Login Page)
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
