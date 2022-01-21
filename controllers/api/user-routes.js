const router = require('express').Router();
const withAuth = require('../../utils/auth');

const { User, Message } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
  // get all users and return everything but their passwords
  User.findAll({ attributes: { exclude: ['password'] } })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
  const id = req.params.id;

  // get user by id
  User.findOne({
    attributes: { exclude: ['password'] },
    where: { id },
    include: [
      // include user's posts,
      {
        model: Message,
        attributes: ['id', 'body', 'sender_id','github', 'recipient_id', 'created_at'],
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
  // create new user
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

  // check if id in param matches session id so auth'd users can't just delete whomever they want
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
