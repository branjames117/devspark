const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Sequelize, Op } = require('sequelize');
const { User, Message } = require('../../models');
const { randomBytes } = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// temporary GET /api/users
router.get('/', (req, res) => {
  User.findAll({
    attributes: {
      exclude: ['password'],
    },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users/block
router.post('/block', withAuth, (req, res) => {
  const id = req.session.user_id;
  const idToBlock = req.body.blockedID;

  User.update(
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
  ).then((dbUserData) => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.redirect('/chat');
  });
});

// POST /api/users/unblock
router.post('/unblock', withAuth, (req, res) => {
  const id = req.session.user_id;
  const idToUnblock = req.body.unblockedID;

  // need to get user's current block list
  User.findByPk(id).then((dbUserData) => {
    const blockedUsers = dbUserData.dataValues.blocked_users.split(';');

    // filter out the user to be unblocked
    const updatedBlockedUsers = blockedUsers.filter(
      (user) => user != idToUnblock
    );

    // convert the array to a string with ';' between each id
    const updatedBlockedStr =
      updatedBlockedUsers.flat().toString().replaceAll(',', ';') + ';';

    // now update the user
    User.update({ blocked_users: updatedBlockedStr }, { where: { id } }).then(
      (dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.redirect('/chat');
      }
    );
  });
});

// PUT /api/users/delete-conversation
router.post('/delete-conversation', withAuth, (req, res) => {
  const user1 = req.session.user_id;
  const user2 = req.body.deletedID;

  const room = user1 < user2 ? `${user1}x${user2}` : `${user2}x${user1}`;

  Message.destroy({ where: { room } }).then((dbMessageData) => {
    res.redirect('/chat');
  });
});

router.get('/profile', (req,res) => {
    const id = req.session.user_id;
    // User.findOne({
    //     where: { id } 
    // })
    // .then((dbUserData) => {
    //     if(!dbUserData) {
    //         res.json({ message: 'some err'})
    //         res.redirect('/login')
    //     }
    //     console.log(dbUserData);
    console.log('The house is on fire')
    res.render('profile')
});


router.post('/profile', (req,res) => {
    const id = req.session.user_id;
    User.findOne({
        where: { id } 
    })
    .then((dbUserData) => {
        if(!dbUserData) {
            res.json({ message: 'some err'})
            res.redirect('/login')
        }
        console.log(dbUserData.dataValues);
        User.update(
            {
                birthday: req.body.birthday,
                yearStartCoding: req.body.yearOfCode,
                github: req.body.github,
                bio: req.body.bio,
                city: req.body.city,
                state: req.body.state,
                education: req.body.education
            },
            {
                where: { id: req.session.user_id },
                
              }
            ).then((rowsUpdated) => {
              if (rowsUpdated) {
                  console.log('======');
                  console.log('success')
                res.redirect('/api/users');
              } else {
                console.log('Something went wrong.');
              }
            });
            

        

    })
})

// GET /api/users/forgot
router.get('/forgot', (req, res) => {
  // get user email
  res.render('forgot-password');
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
  User.update(
    {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 360000,
    },
    { where: { email: req.body.email } }
  ).then((userFound) => {
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
            <a href="http://localhost:3001/api/users/reset/${token}">Reset link</a>
            <p>If you did not request a password reset. Please ignore this email.</p>`,
      };

      const sendEmail = async (emailOptions) => {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
      };

      sendEmail(mailOptions).then(() => {
        res.status(200).json({ status: 'success', message: 'message sent' });
      });
    }
  });
});

router.get('/reset/:token', function (req, res) {
    User.findOne({
        where: {
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      }).then(function (user) {
      if (!user) {
        return res.redirect('/api/users/forgot');
      }

      res.render('reset', { token: req.params.token });
    }

    console.log('not expired');
    res.render('reset', { token: req.params.token });
  });
});

router.post('/reset/:token', (req, res) => {
  if (req.body.password !== req.body.confirm) {
    // res.flash('error', 'Password reset token is invalid or has expired');
    return res.redirect('back');
  } else {
    User.findOne({
        where: {
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      }).then((dbUserData) => {
        if (dbUserData) {
          User.update(
            {
              resetPasswordToken: null,
              resetPasswordExpires: null,
              password: req.body.password,
            },
            {
              where: { resetPasswordToken: req.params.token },
              individualHooks: true,
            }
          ).then((rowsUpdated) => {
            if (rowsUpdated) {
              res.render('login');
            } else {
              console.log('Something went wrong.');
            }
          });
        }
      }
    });
  }
});

// temporary GET /api/users/1
router.get('/:id', (req, res) => {
  const id = req.params.id;

  User.findOne({
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
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
  // verify that required fields were submitted
  if (!req.body.email || !req.body.password) {
    res.status(500).json({ message: 'Need username and password!' });
  }

  // req.body must be object with username and password
  User.create(req.body)
    .then((dbUserData) => {
      // save new user's session
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.email = dbUserData.email;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users/login
router.post('/login', (req, res) => {
  // find user based on username or password
  User.findOne({
    where: {
        [Op.or]: [{ email: req.body.email }, { username: req.body.username }],
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user found!' });
      return;
    }

    // check if password is valid with checkPassword class method
    // console.log(dbUserData);
    
    const validPassword = dbUserData.checkPassword(req.body.password);

    // if password invalid, err
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    // if password valid, save new session data
    req.session.save(() => {
      // declare session variables
      req.session.user_id = dbUserData.id;
      req.session.email = dbUserData.email;
      req.session.loggedIn = true;
      
      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

// POST /api/users/logout
router.post('/logout', withAuth, (req, res) => {
  // destroy session if logged in
  console.log(req.session)
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// PUT /api/users/1
router.put('/:id', withAuth, (req, res) => {
  const id = req.params.id;

  // update user data
  User.update(req.body, {
    individualHooks: true,
    where: {
      id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
  const id = req.params.id;
  const sessionId = res.session.user_id;

  // check if id in param matches session id so auth'd users can only delete themselves via this route
  const validDelete = id == sessionId;

  if (validDelete) {
    User.destroy({
      where: {
        id,
      },
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res
      .status(403)
      .json({ message: 'You do not have authorization to delete this user' });
  }
});






module.exports = router;
