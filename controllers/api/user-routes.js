const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Sequelize, Op } = require('sequelize');
const { User, Message, Skill, UserSkill } = require('../../models');
const { randomBytes } = require('crypto');
const { createTransporter } = require('../../config/connection');

// GET /api/users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['password'],
    },
    include: [
      {
        model: Skill,
        attributes: ['id', 'skill_name'],
      },
    ],
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
router.post('/profile', withAuth, async (req, res) => {
  const id = req.session.user_id;

  // update the user with the new info
  const updatedUser = await User.update(req.body, {
    where: { id },
  });

  // now go through the submitted skills and create an array out of them
  // i = 26 because we have 26 pre-seeded skills to go through
  const skills = [];
  for (let i = 1; i <= 26; i++) {
    if (req.body['skill' + i]) skills.push(i);
  }

  // if any skills were selected...
  if (skills.length) {
    // ... map each skill to a UserSkill instance...
    const userSkillIdArr = skills.map((skill_id) => {
      return {
        user_id: req.session.user_id,
        skill_id,
      };
    });
    // ... then destroy all previous UserSkills for the user
    await UserSkill.destroy({ where: { user_id: req.session.user_id } });
    // ... and create the new ones!
    await UserSkill.bulkCreate(userSkillIdArr);
  }

  if (updatedUser) {
    console.log('======');
    console.log('success');
    res.redirect(`/profile/${req.session.user_id}`);
  } else {
    console.log('Something went wrong.');
  }
});

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
      text: `You are receiving this email because you have requested the reset of your password for your devSpark account ${req.body.email}. Paste the following link into your browser to reset your password: https://devsparkio.herokuapp.com/reset/${token}. If you did not request a password reset, please ignore this email.`,
      html: `
            <p>You are receiving this email because you have requested the reset of your password for your <em>devSpark</em> account ${req.body.email}. Click on the following link or paste it into your browser to reset your password:</p>

            <p>Reset link: <a href="https://devsparkio.herokuapp.com/reset/${token}">https://devsparkio.herokuapp.com/reset/${token}</a></p>

            <p>If you did not request a password reset, please ignore this email.</p>`,
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
      {
        model: Skill,
        attributes: ['id', 'skill_name'],
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
// Create new account route
router.post('/', async (req, res) => {
  // verify that required fields were submitted
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res.status(500).json({
      message: 'Username, email, and password required to create an account!',
    });
  }

  let regex = /[^A-Za-z0-9]+/
  if (regex.test(req.body.username)) {
      console.log('Ya fucked up')
    
    return res.status(500).json({
      message: "Username has special characters... Can't do that!",
    });
    
  }
  // check if user already exists with either that email or that username
  const userExists = await User.findOne({
    where: {
      [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
    },
  });

  // if so, error out
  if (userExists) {
    return res
      .status(500)
      .json({ message: 'A user with that username or email already exists!' });
  } else {
    const newUser = await User.create(req.body);
    if (newUser) {
      // save new user's session
      req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.email = newUser.email;
        req.session.username = newUser.username;
        req.session.loggedIn = true;
        res.status(200).json({ message: 'Success!' });
      });
      return;
    }
  }
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

    res.status(200).json({ message: 'You are now logged in!' });
  });
});

// POST /api/users/logout
router.post('/logout', withAuth, (req, res) => {
  // destroy session if logged in
  if (req.session.loggedIn) {
    req.session.destroy(() => {});
    res.status(200).json({ message: 'You are now logged out!' });
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
