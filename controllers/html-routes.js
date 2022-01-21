const router = require('express').Router();
const { sequelize } = require('../config/connection');
const { User, Message } = require('../models');

router.get('/', async (req, res) => {
  console.log(req.session)
  const user= await User.findOne({
    where: {
      id: req.session.user_id
    }
  })
  console.log(user.dataValues)
  console.log(req.session)
  res.render('home', { loggedIn: req.session.loggedIn, session: req.session, user: user.dataValues });
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
