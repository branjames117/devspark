// configure express app with http server so we can use socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const { User, Message } = require('./models');

// set up session with sequelize
const session = require('express-session');
const { sequelize } = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// handlebars, routes, utilities
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const { notificationCount } = require('./utils/helpers');

// tell app and socket.io to use session middleware
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
// const hbs = exphbs.create({ helpers });
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// boilerplate app middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// ---------------------------- //
// BEGINNING OF SOCKET.IO LOGIC //
// ---------------------------- //

// track who is online and in what room for socket.io
const users = {};

// when a user (new socket) connects to the server...
io.on('connection', (socket) => {
  // listen for a user attempting to open a notification socket based on the user's ID
  socket.on('open-notifications', async () => {
    const notificationRoom = socket.request.session.user_id;
    // ... if the room does not exist, user is not logged in...
    if (!notificationRoom) return;

    // ... otherwise, join the room
    socket.join(notificationRoom);

    // ... then get the number of unread messages
    const count = await notificationCount(socket.request.session.user_id);

    // ... then emit that number to the user's unique notificationRoom
    io.to(notificationRoom).emit('update-notifications', count);
  });

  // listen for a user joining a chat room with another user based on both user's IDs
  socket.on('joinroom', async (data) => {
    // get IDs of both users from the client
    const [sender, receiver] = data.room.split('x');

    // verify there's no trickery going on
    if (socket.request.session.user_id != sender || sender == receiver) return;

    // format the room name based on which user ID is the lowest
    const room =
      sender < receiver ? `${sender}x${receiver}` : `${receiver}x${sender}`;

    // update list of "active" chat users with what room they're in
    users[sender] = room;

    // we know user1 exists because it comes from request session data
    // now check that user2 exists before proceeding
    const receivingUser = await User.findByPk(receiver);
    if (!receivingUser) return;

    // join the unique private room
    socket.join(room);

    // find all the messages belonging to that room
    const messages = await Message.findAll({
      where: {
        room,
      },
      include: {
        model: User,
        attributes: ['id', 'email'],
      },
    });

    // find all messages where user is recipient in this room and update to read: true
    await Message.update(
      { read: true },
      { where: { room, recipient_id: sender, read: false } }
    );

    // update the user's notification count
    const count = await notificationCount(sender);
    io.to(parseInt(sender)).emit('update-notifications', count);

    // convert the messages into a plain array
    const history = [];
    messages.forEach((message) => {
      history.push(message.get({ plain: true }));
    });

    // emit the chat history to the client
    io.to(room).emit('populateHistory', history);

    // start listening for messages in that chatroom
    socket.on('msg', async (msg) => {
      // check if sender matches the session ID, otherwise user might be trying to spoof
      if (socket.request.session.user_id != msg.sender_id) return;

      // convert string of recipient's blocked user IDs to array of integers
      const blockedUsers = receivingUser.dataValues.blocked_users
        .split(';')
        .map((id) => parseInt(id));

      // check if senderID is in recipientID's list of blocked users
      if (blockedUsers.indexOf(sender) !== -1) return;

      // check if the recipient is both online AND in the same room as the sender, if so, flag the message as read (true), otherwise, unread (false)
      msg.read = users[receiver] && users[receiver] === room ? true : false;
      // add datetime to message
      msg.createdAt = new Date();
      // add roomname
      msg.room = room;

      // ... then create the message in the database
      await Message.create(msg);

      // ... then, emit the message to the clientside chatroom
      io.to(room).emit('newmsg', msg);

      // ... then, update the receiver's notification socket to the latest unread message count
      const count = await notificationCount(receiver);
      io.to(parseInt(receiver)).emit('update-notifications', count);
    });
  });

  // on disconnect, remove the user from the online users object
  socket.on('disconnect', () => {
    delete users[socket.request.session.user_id];
  });
});

// ---------------------- //
// END OF SOCKET.IO LOGIC //
// ---------------------- //

// sync sequelize with db before telling server to listen
sequelize.sync({ force: false }).then(() => {
  http.listen(process.env.PORT || 3001, () => {
    if (!process.env.PORT) {
      console.log('|-----------------------|');
      console.log('| http://localhost:3001 |');
      console.log('|-----------------------|');
    }
  });
});
