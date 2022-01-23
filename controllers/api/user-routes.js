const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Sequelize, Op } = require('sequelize');
const { User, Message } = require('../../models');
const { randomBytes } = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// GET /api/users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['password'],
    },
  });

  if (!users) {
    res.status(500).json({ message: 'Something went wrong' });
    return;
  } else {
    res.json(users);
  }
});

// POST /api/users/block
router.post('/block', withAuth, async (req, res) => {
  const id = req.session.user_id;
  const idToBlock = req.body.blockedID;

  const user = await User.update(
    {
      // use Sequelize to concat the current blocked_users list with the new blocked userID, adding also a ';' to the end of the string, important for splitting the string into an array later, since MySQL does not support Array datatypes
      blocked_users: Sequelize.fn(
        'CONCAT',
        Sequelize.col('blocked_users'),
        idToBlock,
        ';'
      ),
    },
    {
      where: {
        id,
      },
    }
  );

  if (!user) {
    res.status(404).json({ message: 'No user found with this id' });
    return;
  } else {
    res.redirect('/chat');
  }
});

// POST /api/users/unblock
router.post('/unblock', withAuth, async (req, res) => {
  const id = req.session.user_id;
  const idToUnblock = req.body.unblockedID;

  // need to get user's current block list
  const user = await User.findByPk(id);

  const blockedUsers = user.dataValues.blocked_users.split(';');

  // filter out the user to be unblocked
  const updatedBlockedUsers = blockedUsers.filter(
    (user) => user != idToUnblock
  );

  // convert the array to a string with ';' between each id
  const updatedBlockedStr =
    updatedBlockedUsers.flat().toString().replaceAll(',', ';') + ';';

  // now update the user
  const updatedUser = await User.update(
    { blocked_users: updatedBlockedStr },
    { where: { id } }
  );

  if (!updatedUser) {
    res.status(404).json({ message: 'No user found with this id' });
    return;
  } else {
    res.redirect('/chat');
  }
});

// POST /api/users/delete-conversation
router.post('/delete-conversation', withAuth, async (req, res) => {
  const user1 = req.session.user_id;
  const user2 = req.body.deletedID;

  const room = user1 < user2 ? `${user1}x${user2}` : `${user2}x${user1}`;

  await Message.destroy({ where: { room } });

  res.redirect('/chat');
});

// POST /api/users/profile
router.post('/profile', async (req, res) => {
  const id = req.session.user_id;
  console.log(req.body);

  console.log(req.body.yearStartCoding);

  // create a new object so we only update the fields the user filled out
  const updatedInfo = {};
  if (req.body.birthday) updatedInfo.birthday = req.body.birthday;
  if (req.body.yearStartCoding)
    updatedInfo.yearStartCoding = req.body.yearStartCoding;
  if (req.body.github) updatedInfo.github = req.body.github;
  if (req.body.bio) updatedInfo.bio = req.body.bio;
  if (req.body.city) updatedInfo.city = req.body.city;
  if (req.body.state) updatedInfo.state = req.body.state;
  if (req.body.education) updatedInfo.education = req.body.education;

  const updatedUser = await User.update(updatedInfo, {
    where: { id },
  });

  if (updatedUser) {
    console.log('======');
    console.log('success');
    res.redirect('/api/users');
  } else {
    console.log('Something went wrong.');
  }
});

// create the transporter for our gmail-based forgot-password message
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'devspark003@gmail.com',
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  return transporter;
};

// POST /api/users/forgot
router.post('/forgot', async function (req, res) {
  // generate a token
  const token = randomBytes(20).toString('hex');

  // update the requested email address with the token
  const userFound = await User.update(
    {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 360000,
    },
    { where: { email: req.body.email } }
  );

  // then, if we found the user to update, send the email with the token
  if (userFound) {
    var mailOptions = {
      to: req.body.email,
      from: 'devspark003@gmail.com',
      subject: 'DevSpark Password Reset',
      text: 'For clients with plaintext support only',
      html: `
            <p>You are receiving this link because you have requested the reset of your password for your account ${req.body.email}.
            'Please click on the following link, or paste this into your browser to complete this process:</p>
            <a href="https://devsparkio.herokuapp.com/reset/${token}">Reset link</a>
            <p>If you did not request a password reset. Please ignore this email.</p>`,
    };

    const sendEmail = async (emailOptions) => {
      let emailTransporter = await createTransporter();
      await emailTransporter.sendMail(emailOptions);
    };

    await sendEmail(mailOptions);

    res.status(200).json({ status: 'success', message: 'message sent' });
  }
});

// POST /api/users/reset/:token
router.post('/reset/:token', async (req, res) => {
  if (req.body.password !== req.body.confirm) {
    // res.flash('error', 'Password reset token is invalid or has expired');
    return;
  }

  const user = await User.findOne({
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { [Op.gt]: Date.now() },
    },
  });

  if (user) {
    const rowsUpdated = await User.update(
      {
        resetPasswordToken: null,
        resetPasswordExpires: null,
        password: req.body.password,
      },
      {
        where: { resetPasswordToken: req.params.token },
        individualHooks: true,
      }
    );

    if (rowsUpdated) {
      res.render('login');
    } else {
      console.log('Something went wrong.');
    }
  }
});

// GET /api/users/1
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({
    // display everything except the user's hashed password
    attributes: { exclude: ['password'] },
    where: { id },
    include: [
      // include user's messages
      {
        model: Message,
        attributes: [
          'id',
          'body',
          'sender_id',
          'recipient_id',
          'read',
          'created_at',
        ],
      },
    ],
  });

  if (!user) {
    res.status(404).json({ message: 'No user found with this id' });
    return;
  } else {
    res.json(user);
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  // verify that required fields were submitted
  if (!req.body.email || !req.body.username || !req.body.password) {
    res.status(500).json({ message: 'Need username and password!' });
  }

  // req.body must be object with username and password
  const newUser = await User.create(req.body);

  // save new user's session
  req.session.save(() => {
    req.session.user_id = newUser.id;
    req.session.email = newUser.email;
    req.session.username = newUser.username;
    req.session.loggedIn = true;

    res.redirect('/profile');
  });
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  // find user based on username or password
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: req.body.login }, { username: req.body.login }],
    },
  });

  if (!user) {
    res.status(400).json({ message: 'No user found!' });
    return;
  }

  // check if password is valid with checkPassword class method
  // console.log(dbUserData);

  const validPassword = user.checkPassword(req.body.password);

  // if password invalid, err
  if (!validPassword) {
    res.status(400).json({ message: 'Incorrect password!' });
    return;
  }

  // if password valid, save new session data
  req.session.save(() => {
    // declare session variables
    req.session.user_id = user.id;
    req.session.email = user.email;
    req.session.username = user.username;
    req.session.loggedIn = true;

    res.json({ user, message: 'You are now logged in!' });
  });
});

// POST /api/users/logout
router.post('/logout', withAuth, (req, res) => {
  // destroy session if logged in
  console.log(req.session);
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// DELETE /api/users/1
router.delete('/:id', withAuth, async (req, res) => {
  const id = req.params.id;
  const sessionId = res.session.user_id;

  // check if id in param matches session id so auth'd users can only delete themselves via this route
  const validDelete = id == sessionId;

  if (!validDelete)
    res
      .status(403)
      .json({ message: 'You do not have authorization to delete this user' });

  const deletedUser = await User.destroy({
    where: {
      id,
    },
  });

  if (!deletedUser) {
    res.status(404).json({ message: 'No user found with this id' });
    return;
  }
  res.json(deletedUser);
});

module.exports = router;
