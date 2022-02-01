const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Sequelize, Op } = require('sequelize');
const { User, Message, Skill, UserSkill } = require('../../models');
const { randomBytes } = require('crypto');
const { createTransporter } = require('../../config/connection');

// GET /api/users
router.get('/', withAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: [
          'password',
          'blocked_users',
          'matched_users',
          'reset_password_token',
          'reset_password_expires',
        ],
      },
      include: [
        {
          model: Skill,
          attributes: ['id', 'skill_name'],
        },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// POST /api/users/block
router.post('/block', withAuth, async (req, res) => {
  const id = req.session.user_id;
  const idToBlock = req.body.blockedID;

  try {
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

    // mark all messages in their shared chatroom as read to clear out notifications
    const room = id < idToBlock ? `${id}x${idToBlock}` : `${idToBlock}x${id}`;
    await Message.update({ read: true }, { where: { room, read: false } });

    res.redirect('/chat');
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

router.get('/messages', withAuth, async (req, res) => {
  const messages = await Message.findAll();
  res.json(messages);
});

// POST /api/users/unblock
router.post('/unblock', withAuth, async (req, res) => {
  const id = req.session.user_id;
  const idToUnblock = req.body.unblockedID;

  try {
    // need to get user's current block list
    const { blocked_users } = await User.findByPk(id, {
      attributes: ['blocked_users'],
      raw: true,
    });

    const blockedUsersArr = blocked_users.split(';');

    // filter out the user to be unblocked
    const updatedBlockedUsersArr = blockedUsersArr.filter(
      (user) => user != idToUnblock
    );

    // convert the array back to a string with ';' between each id
    const updatedBlockedUsersStr =
      updatedBlockedUsersArr.flat().toString().replaceAll(',', ';') + ';';

    // now update the user
    await User.update(
      { blocked_users: updatedBlockedUsersStr },
      { where: { id } }
    );

    res.redirect('/blocklist');
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// POST /api/users/delete-conversation
router.post('/delete-conversation', withAuth, async (req, res) => {
  const user1 = req.session.user_id;
  const user2 = req.body.deletedID;

  const room = user1 < user2 ? `${user1}x${user2}` : `${user2}x${user1}`;

  try {
    await Message.destroy({ where: { room } });

    res.redirect('/chat');
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// POST /api/users/profile
router.post('/profile', withAuth, async (req, res) => {
  const id = req.session.user_id;

  if (req.body.first_name && req.body.first_name.length > 20) {
    return res
      .status(500)
      .json({ message: 'First name cannot be longer than 20 characters.' });
  }

  if (req.body.last_name && req.body.last_name.length > 20) {
    return res
      .status(500)
      .json({ message: 'Last name cannot be longer than 20 characters.' });
  }

  if (req.body.city && req.body.city.length > 20) {
    return res
      .status(500)
      .json({ message: 'City name cannot be longer than 20 characters.' });
  }

  if (req.body.github && req.body.github.includes('github.com')) {
    return res.status(500).json({
      message: 'GitHub should be your username, not the URL to your profile.',
    });
  }

  if (req.body.github && req.body.github.length > 20) {
    return res.status(500).json({
      message: 'Github username cannot be longer than 20 characters.',
    });
  }

  if (req.body.portfolio && req.body.portfolio.length > 50) {
    return res
      .status(500)
      .json({ message: 'Portfolio URL cannot be longer than 50 characters.' });
  }

  if (req.body.bio && req.body.bio.length > 2000) {
    return res
      .status(500)
      .json({ message: 'Bio cannot be longer than 2,000 characters.' });
  }

  try {
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

    res.redirect(`/profile/${req.session.user_id}`);
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// POST /api/users/forgot
router.post('/forgot', async (req, res) => {
  // generate a token
  const token = randomBytes(20).toString('hex');

  try {
    // update the requested email address with the token
    const user = await User.update(
      {
        reset_password_token: token,
        reset_password_expires: Date.now() + 360000,
      },
      { where: { email: req.body.email } }
    );

    // then, if we found the user to update, send the email with the token
    if (user) {
      var mailOptions = {
        to: req.body.email,
        from: process.env.APP_EMAIL,
        subject: 'DevSpark Password Reset',
        text: `You are receiving this email because you have requested a password reset for your devSpark account ${req.body.email}. Paste the following link into your browser to reset your password: https://devsparkio.herokuapp.com/reset/${token}. If you did not request a password reset, please ignore this email.`,
        html: `
            <p>You are receiving this email because you have requested a password reset for your <em>devSpark</em> account ${req.body.email}. Click on the following link or paste it into your browser to reset your password:</p>

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
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// POST /api/users/reset/:token
router.post('/reset/:token', async (req, res) => {
  if (req.body.password !== req.body.confirm) return;

  try {
    await User.update(
      {
        reset_password_token: null,
        reset_password_expires: null,
        password: req.body.password,
      },
      {
        where: { reset_password_token: req.params.token },
        individualHooks: true,
      }
    );

    res.render('login');
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// GET /api/users/1
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({
      // display everything except the user's sensitive bits
      attributes: {
        exclude: [
          'password',
          'blocked_users',
          'matched_users',
          'reset_password_token',
          'reset_password_expires',
        ],
      },
      where: { id },
      include: [
        {
          model: Skill,
          attributes: ['id', 'skill_name'],
        },
      ],
    });

    res.status(200).json(
      user
        ? user
        : {
            message: 'No user found with this ID.',
          }
    );
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
});

// POST /api/users
// Create new account route
router.post('/', async (req, res) => {
  // verify that required fields were submitted
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res.status(500).json({
      message:
        'Username, email, and password are required to create an account!',
    });
  }

  let regex = /[^A-Za-z0-9]+/;
  if (regex.test(req.body.username)) {
    return res.status(500).json({
      message: 'Username must not contain any special characters!',
    });
  }

  if (req.body.username.length > 14) {
    return res.status(500).json({
      message: 'Username cannot be longer than 14 characters!',
    });
  }

  if (req.body.email.length > 40) {
    return res.status(500).json({
      message: 'Email address cannot be longer than 40 characters!',
    });
  }

  if (req.body.password.length > 40) {
    return res.status(500).json({
      message: 'Password cannot be longer than 40 characters!',
    });
  }

  try {
    // check if user already exists with either that email or that username
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    // if so, error out
    if (userExists) {
      return res.status(500).json({
        message: 'A user with that username or email already exists!',
      });
    } else {
      const newUser = await User.create(req.body);

      // save new user's session
      req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.email = newUser.email;
        req.session.username = newUser.username;
        req.session.loggedIn = true;
        res.status(200).json({ message: 'Success!' });
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

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
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
  } catch (error) {
    const errMsg = {
      message: 'Something went wrong with the database.',
      error,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
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
  const sessionId = req.session.user_id;

  // check if id in param matches session id so auth'd users can only delete themselves via this route
  const validDelete = id == sessionId;

  if (!validDelete)
    res
      .status(403)
      .json({ message: 'You do not have authorization to delete this user' });

  try {
    // destroy their messages
    await Message.destroy({
      where: {
        [Op.or]: [{ recipient_id: id }, { sender_id: id }],
      },
    });

    // destroy their skills
    await UserSkill.destroy({
      where: {
        user_id: id,
      },
    });

    // destroy the user
    await User.destroy({
      where: {
        id,
      },
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

module.exports = router;
