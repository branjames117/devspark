const router = require('express').Router();
const { sequelize } = require('../config/connection');
const { User, Message } = require('../models');

// GET / (root route)
router.get('/', (req, res) => {
  res.render('home', { loggedIn: req.session.loggedIn });
});

// GET /login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// GET /signup
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
