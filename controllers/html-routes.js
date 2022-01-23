const router = require('express').Router();
const { Op } = require('sequelize');
const { User, Skill, UserSkill } = require('../models');
const withAuth = require('../utils/auth');

// GET / (root route - will eventually be the landing page)
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect(`/profile/${req.session.user_id}`);
    return;
  }

  res.render('login');
});

// GET /login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect(`/profile/${req.session.user_id}`);
    return;
  }

  res.render('login');
});

// GET /signup
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect(`/profile/${req.session.user_id}`);
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
router.get('/profile/editor', withAuth, async (req, res) => {
  const user = await User.findOne({
    attributes: {
      exclude: [
        'password',
        'resetPasswordToken',
        'resetPasswordExpires',
        'skills',
      ],
    },
    where: {
      id: req.session.user_id,
    },
    raw: true,
  });

  console.log(user);

  res.render('profile-editor', {
    username: req.session.username,
    loggedIn: req.session.loggedIn,
    userID: req.session.user_id,
    user,
  });
});

router.get('/profile/:id', withAuth, async (req, res) => {
  const user = await User.findOne({
    attributes: {
      exclude: [
        'password',
        'resetPasswordToken',
        'resetPasswordExpires',
        'skills',
        'blocked_users',
      ],
    },
    where: {
      id: req.params.id,
    },
    raw: true,
  });

  console.log(user);

  if (!user) {
    res.status(404).json({ message: 'User with this id not found! ' });
    return;
  }

  res.render('profile', {
    username: req.session.username,
    loggedIn: req.session.loggedIn,
    userID: req.session.user_id,
    user,
  });
});

module.exports = router;
