const router = require('express').Router();
const { Op } = require('Sequelize');
const { User } = require('../models');
const withAuth = require('../utils/auth');

// GET / (root route)
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// GET /login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// GET /signup
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/profile');
    return;
  }

  res.render('signup');
});

// GET /forgot
router.get('/forgot', (req, res) => {
  // get user email
  res.render('forgot-password');
});

// GET /reset/:token
router.get('/reset/:token', async (req, res) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    return res.redirect('/forgot');
  }

  res.render('reset', { token: req.params.token });
});

// GET /profile
router.get('/profile', withAuth, (req, res) => {
  res.render('profile', {
    username: req.session.username,
    loggedIn: req.session.loggedIn,
    userID: req.session.user_id,
  });
});

module.exports = router;
