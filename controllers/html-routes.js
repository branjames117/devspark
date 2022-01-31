const router = require('express').Router();
const { Op } = require('sequelize');
const { sequelize } = require('../config/connection');
const { User, Skill, UserSkill } = require('../models');
const withAuth = require('../utils/auth');

// GET / (root route - will eventually be the landing page)
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect(`/profile/${req.session.user_id}`);
    return;
  }

  res.render('landing');
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
  if (req.session.loggedIn) {
    res.redirect(`/profile/${req.session.user_id}`);
    return;
  }

  res.render('forgot-password');
});

// GET /reset/:token
router.get('/reset/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        reset_password_token: req.params.token,
        reset_password_expires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.redirect('/forgot');
    }

    res.render('reset', { token: req.params.token });
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// GET /profile/editor
router.get('/profile/editor', withAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: {
        exclude: [
          'password',
          'reset_password_token',
          'reset_password_expires',
          'matched_users',
          'blocked_users',
          'skills',
        ],
      },
      where: {
        id: req.session.user_id,
      },
      raw: true,
    });

    res.render('profile-editor', {
      username: req.session.username,
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
      user,
    });
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

router.get('/profile/:id', withAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      // display everything except the user's hashed password
      attributes: {
        exclude: [
          'password',
          'reset_password_token',
          'reset_password_expires',
          'blocked_users',
          'matched_users',
        ],
      },
      where: { id: req.params.id },
      include: [
        {
          model: Skill,
          attributes: ['id', 'skill_name'],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: 'User with this id not found! ' });
    }

    const plainUser = user.get({ plain: true });

    // check if we've already 'sparked' the user whose profile we're visiting
    const { matched_users } = await User.findOne({
      where: { id: req.session.user_id },
      attributes: ['matched_users'],
      raw: true,
    });

    const notMatched = matched_users.indexOf(req.params.id) === -1;

    res.render('profile', {
      username: req.session.username,
      loggedIn: req.session.loggedIn,
      userID: req.session.user_id,
      user: plainUser,
      skills: plainUser.skills,
      notMatched,
    });
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// server-side storage to reduce db calls
const userStore = {};

// GET /blocklist
router.get('/blocklist', withAuth, async (req, res) => {
  const id = req.session.user_id;

  try {
    const { blocked_users } = await User.findOne({
      // display everything except the user's hashed password
      attributes: ['blocked_users'],
      where: { id },
      raw: true,
    });

    const blockedUsersArr = blocked_users.split(';').filter((user) => {
      return user.length > 0;
    });

    const newBlockedUsersArr = [];

    for (const userID of blockedUsersArr) {
      if (!userStore[userID]) {
        const blockedUser = await User.findByPk(userID, {
          attributes: ['username'],
          raw: true,
        });
        userStore[userID] = blockedUser.username;
      }
      newBlockedUsersArr.push({ id: userID, username: userStore[userID] });
    }

    res.render('blocklist', {
      username: req.session.username,
      loggedIn: req.session.loggedIn,
      blockedUsers: newBlockedUsersArr,
    });
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
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
  const { city, state, skills, gender_identity, sexual_orientation } =
    req.query;

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

  // convert city/state into location array of objects if they exist
  const optionsArr = [];
  if (city) optionsArr.push({ city });
  if (state) optionsArr.push({ state });
  if (gender_identity) optionsArr.push({ gender_identity });
  if (sexual_orientation) optionsArr.push({ sexual_orientation });

  try {
    // grab the current user, we need their blocklist
    const { blocked_users } = await User.findOne({
      where: { id: req.session.user_id },
      attributes: ['blocked_users'],
      raw: true,
    });
    const blockedUsers = blocked_users.split(';');
    blockedUsers.pop();

    // find users based on data extrapolated from query string
    const users = await User.findAll({
      attributes: {
        exclude: [
          'password',
          'reset_password_token',
          'reset_password_expires',
          'blocked_users',
        ],
      },
      where: {
        [Op.and]: optionsArr,
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
          if (userSkills.indexOf(parseInt(skill)) === -1) {
            includeUser = false;
          }
        });
        // otherwise, push the user to the resultingUsers arr
        if (includeUser) {
          resultingUsers.push(user);
        }
      });

      // the user transformations continue...
      const penUltimateUsers =
        resultingUsers.length === 0 ? plainUsers : resultingUsers;

      // and one more for the road...
      // filter out both the searching user and any users the searching user has already blocked
      const finalUsers = penUltimateUsers.filter((user) => {
        return (
          user.id != req.session.user_id &&
          blockedUsers.indexOf(user.id + '') === -1
        );
      });

      res.render('results', {
        loggedIn: req.session.loggedIn,
        userID: req.session.user_id,
        users: finalUsers,
      });
    } else {
      // if we did not find users... shame...
      res.render('results', {
        loggedIn: req.session.loggedIn,
        userID: req.session.user_id,
        users: false,
      });
    }
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

module.exports = router;
