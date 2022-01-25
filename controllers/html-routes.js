const router = require('express').Router();
const { Op } = require('sequelize');
const { sequelize } = require('../config/connection');
const { User, UserSkill, Skill } = require('../models');
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
    // display everything except the user's hashed password
    attributes: {
      exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'],
    },
    where: { id: req.params.id },
    include: [
      {
        model: Skill,
        attributes: ['id', 'skill_name'],
      },
    ],
  });

  const plainUserData = user.get({ plain: true });
  console.log(plainUserData.skills);
  if (!user) {
    res.status(404).json({ message: 'User with this id not found! ' });
    return;
  }

  res.render('profile', {
    username: req.session.username,
    loggedIn: req.session.loggedIn,
    userID: req.session.user_id,
    user: plainUserData,
    skills: plainUserData.skills,
  });
});

// GET /search
router.get('/search', withAuth, (req, res) => {
  res.render('search', {
    loggedIn: req.session.loggedIn,
    userID: req.session.user_id,
  });
});

// GET /results/:queryStr
router.get('/results/:queryStr', withAuth, async (req, res) => {
  // if no query string provided, rerender search view
  if (!req.query) {
    res.render('search', {
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
    });
  }

  // extract variables from req.query
  const { city, state, skills } = req.query;

  // convert skill section of query string into array of skill objects
  let skillsArr = [];
  const skillsObjArr = [];
  if (skills) {
    skillsArr = skills.split(';');
    skillsArr.pop();
    skillsArr.forEach((skill) => {
      skillsObjArr.push({ id: skill });
    });
  }

  console.log(skillsObjArr);

  // convert city/state into location array of objects if they exist
  const locationArr = [];
  if (city) locationArr.push({ city });
  if (state) locationArr.push({ state });
  console.log(locationArr);

  // find users based on data extrapolated from query string
  const users = await User.findAll({
    attributes: {
      exclude: [
        'password',
        'resetPasswordToken',
        'resetPasswordExpires',
        'blocked_users',
      ],
    },
    where: {
      [Op.and]: locationArr,
    },
    include: [
      {
        model: Skill,
        attributes: ['skill_name'],
        required: skillsObjArr.length > 0 ? true : false,
      },
    ],
    nest: true,
    order: sequelize.random(),
  });

  // if we found some users...
  if (users) {
    // convert results to array of plain data for easier parsing
    const plainUsers = [];
    users.forEach((user) => {
      plainUsers.push(user.get({ plain: true }));
    });

    // now filter out the users that don't match every specified skill
    const resultingUsers = [];
    plainUsers.forEach((user) => {
      const userSkills = [];
      user.skills.forEach((skill) => {
        userSkills.push(skill.user_skill.skill_id);
      });

      // start out assuming we will include the user in the final results
      let includeUser = true;
      skillsArr.forEach((skill) => {
        // if the user is lacking one of the searched-for skills, cut the user out of inclusion
        if (userSkills.indexOf(parseInt(skill)) === -1 && includeUser) {
          includeUser = false;
        }
      });
      // otherwise, push the user to the resultingUsers arr
      if (includeUser) {
        resultingUsers.push(user);
      }
    });

    res.render('results', {
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
      users: resultingUsers.length !== 0 ? plainUsers : resultingUsers,
    });
  } else {
    // if we did not find users... shame...
    res.render('results', {
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
      users: false,
    });
  }
});

module.exports = router;
