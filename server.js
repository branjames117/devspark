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

// when a user (new socket) connects to the server...
io.on('connection', (socket) => {
  // listen for a user attempting to open a notification socket based on the user's ID
  socket.on('open-notifications', async () => {
    const notificationRoom = socket.request.session.user_id;
    // ... if the room exists, meaning the user is logged in...
    if (notificationRoom) {
      // ... then join the room
      socket.join(notificationRoom);

      // ... then get the number of unread messages
      const unreadMessageCount = await Message.count({
        where: { recipient_id: socket.request.session.user_id, read: false },
      });

      // ... then emit that number to the user's unique notificationRoom
      io.to(notificationRoom).emit('update-notifications', unreadMessageCount);
    } else {
      // ... if the room does not exist, user hasn't logged in yet...
      return;
    }
  });

  // listen for a user joining a chat room with another user based on both user's IDs
  socket.on('joinroom', (data) => {
    // get IDs of both users from the client
    const [sender, receiver] = data.room.split('x');

    // verify there's no trickery going on
    if (socket.request.session.user_id != sender || sender == receiver) return;

    // format the room name based on which user ID is the lowest
    const room =
      sender < receiver ? `${sender}x${receiver}` : `${receiver}x${sender}`;

    // update list of "active" chat users with the list of rooms they currently have opened
    // useful for when a client has multiple tabs of chats opened
    users[sender] = {
      id: sender,
      room: {},
    };
    users[sender].room[room] = room;

    console.log(`${sender} has joined ${room}.`);

    // we know user1 exists because it comes from request session data
    // now check that user2 exists before proceeding
    User.findByPk(receiver).then((dbUserData) => {
      if (!dbUserData) return;

      // join the unique private room we're creating
      console.log(`ClientID ${sender} joined RoomID ${room}`);
      socket.join(room);

      // find all the messages belonging to that room
      Message.findAll({
        where: {
          room,
        },
        include: {
          model: User,
          attributes: ['id', 'email'],
        },
      }).then((data) => {
        // now find all messages where user is recipient in this room and update to read: true
        Message.update(
          { read: true },
          { where: { room, recipient_id: sender, read: false } }
        ).then(() => {
          // convert the messages into a plain array
          const history = [];
          data.forEach((message) => {
            history.push(message.get({ plain: true }));
          });

          // emit the chat history to the client
          io.to(room).emit('populateHistory', history);

          // start listening for messages in that chatroom
          socket.on('msg', function (data) {
            // check if sender matches the session ID, otherwise user might be trying to spoof
            if (socket.request.session.user_id != data.sender_id) return;

            // convert string of recipient's blocked user IDs to array of integers
            const blockedUsersIntArray = dbUserData.dataValues.blocked_users
              .split(';')
              .map((id) => parseInt(id));

            // check if senderID is in recipientID's list of blocked users
            if (blockedUsersIntArray.indexOf(sender) !== -1) return;

            // check if the recipient is both online AND in the same room as the sender, if so, flag the message as read (true), otherwise, unread (false)
            data.read =
              users[receiver] && users[receiver].room[room] ? true : false;
            // add datetime to message
            data.createdAt = new Date();
            // add roomname
            data.room = room;

            // ... then create the message in the database
            Message.create(data).then(async (dbData) => {
              // ... then, emit the message to the clientside chatroom
              io.to(room).emit('newmsg', data);

              // ... then, update the receiver's notification socket to the latest unread message count
              const notificationsCount = await Message.count({
                where: {
                  recipient_id: receiver,
                  read: false,
                },
              });

              io.to(parseInt(receiver)).emit(
                'update-notifications',
                notificationsCount
              );
            });
          });
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
sequelize.sync({ force: false }).then(() => {
  http.listen(PORT, () => {
    if (process.env.PORT) {
      console.log('Server is listening.');
    } else {
      console.log(`Server listening at http://localhost:${PORT}`);
    }
  });
});
