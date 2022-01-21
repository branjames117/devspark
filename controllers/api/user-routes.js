const router = require('express').Router();
const withAuth = require('../../utils/auth');

const { User, Message } = require('../../models');
const { Sequelize } = require('sequelize');

// temporary GET /api/users
router.get('/', (req, res) => {
  // get all users and return everything but their passwords
  User.findAll({ attributes: { exclude: ['password'] } })
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
    // const blockedUsers = dbUserData.dataValues.blocked_users.split(';');
    const blockedUsers = ['1', '2', '3', '4'];

    // filter out the user to be unblocked
    const updatedBlockedUsers = blockedUsers.filter((user) => user != 2);

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
        attributes: ['id', 'body', 'sender_id', 'recipient_id', 'created_at'],
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
  // find user based on username
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email!' });
      return;
    }

    // check if password is valid with checkPassword class method
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
