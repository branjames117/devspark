// configure express app with http server so we can use socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { User, Message } = require('./models');

// set up session with sequelize
const session = require('express-session');
const { sequelize } = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// handlebars, session, sequelize, sequelize session, helpers and routes
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

// tell app to use session middleware
const sessionMiddleware = session({
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize }),
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

app.use(sessionMiddleware);

// tell app to use handlebars for its view engine
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// boilerplate app middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// cors handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
    return res.status(200).json({});
  }
  next();
});

// tell app to use our custom routes
app.use(routes);

// track who is online and in what room
const users = {};

// when a user (new socket) connects to the server
io.on('connection', (socket) => {
  // listen for joinroom requests, meaning a user is initiating a chat with another user
  socket.on('joinroom', (data) => {
    // get IDs of both users, format room name based on which userID is lowest, so that two users will always join the same private room when trying to contact one another
    const [user1, user2] = data.room.split('x');

    // check if user1 (senderId) matches the session ID, otherwise user might be trying to spoof another userID
    if (socket.request.session.user_id != user1) {
      console.log(
        `UserID ${socket.request.session.user_id} is pretending to be ${user1}!`
      );
      return;
    }

    // if user1 === user2 something went wrong
    if (user1 === user2) {
      console.log(`UserID ${user1} is trying to message his or herself.`);
      return;
    }

    const room = user1 < user2 ? `${user1}x${user2}` : `${user2}x${user1}`;

    users[socket.request.session.user_id] = {
      id: socket.request.session.user_id,
      room: {},
    };

    users[socket.request.session.user_id].room[room] = room;

    console.log('Users', users);

    console.log(`${socket.request.session.user_id} has joined ${room}.`);
    // we know user1 exists because it comes from request session data
    // now check that user2 exists before proceeding
    User.findByPk(user2).then((dbUserData) => {
      if (!dbUserData) {
        console.log(`UserID ${user2} does not exist`);
        return;
      }

      // join the unique private room we're creating
      console.log(`ClientID ${user1} joined RoomID ${room}`);
      socket.join(room);

      // find all the messages belonging to that room
      Message.findAll({
        where: {
          room,
        },
      }).then((data) => {
        // convert the messages into a plain array
        const history = [];
        data.forEach((message) => {
          history.push(message.get({ plain: true }));
        });

        // emit the history to the client
        io.to(room).emit('populateHistory', history);

        // start listening for messages
        socket.on('msg', function (data) {
          // add room name to data object
          // check if user1 (senderId) matches the session ID, otherwise user might be trying to spoof another userID
          if (socket.request.session.user_id != data.sender_id) {
            console.log(
              `UserID ${socket.request.session.user_id} is pretending to be ${data.sender_id}!`
            );
            return;
          }

          // convert string of recipient's blocked user IDs to array of integers, which is some tomfoolery we have to do since Sequelize/MySQL doesn't support array datatypes
          const blockedUsersIntArray = dbUserData.dataValues.blocked_users
            .split(';')
            .map((id) => parseInt(id));

          // check if senderID is in recipientID's list of blocked users
          if (
            blockedUsersIntArray.indexOf(socket.request.session.user_id) === -1
          ) {
            // user is not blocked, proceed with message
            data.room = room;

            // check if the recipient is both online AND in the same room as the sender, if so, flag the message as read (true), otherwise, unread (false)
            data.read = users[user2] && users[user2].room[room] ? true : false;
            console.log(data.read);
            data.createdAt = new Date();
            Message.create(data).then((dbData) => {
              io.to(room).emit('newmsg', data);
            });
          } else {
            // user is blocked, exit function
            return;
          }
        });
      });
    });
  });

  // on disconnect, remove the user from the online users object
  socket.on('disconnect', () => {
    console.log(`${socket.request.session.user_id} has disconnected`);
    delete users[socket.request.session.user_id];
    console.log(users);
  });
});

const PORT = process.env.PORT || 3001;

// sync sequelize with db before telling server to listen
sequelize.sync({ force: true }).then(() => {
  http.listen(PORT, () => {
    if (process.env.PORT) {
      console.log('Server is listening.');
    } else {
      console.log(`Server listening at http://localhost:${PORT}`);
    }
  });
});
