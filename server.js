// configure express app with http server so we can use socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const { User, Message, Skill } = require('./models');
const seedAll = require('./seeds');

// set up session with sequelize
const { Sequelize, Op } = require('sequelize');
const session = require('express-session');
const { sequelize } = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// handlebars, routes, utilities
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const {
  servicedirectory,
} = require('googleapis/build/src/apis/servicedirectory');
const notificationCount = helpers.notificationCount;
const chatList = helpers.chatList;

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
const hbs = exphbs.create({ helpers });
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

  socket.on('request-chat-list', async (data) => {
    const userID = socket.request.session.user_id;
    const chatListRoom = userID + 'x';
    socket.join(chatListRoom);

    const listOfChats = await chatList(userID);

    io.to(chatListRoom).emit('populate-list', listOfChats);
  });

  socket.on('spark', async (data) => {
    const id = socket.request.session.user_id;
    const idToMatch = data.matchThisUser;

    const user = await User.update(
      {
        // use Sequelize to concat the current matched_users list with the new matched userID, adding also a ';' to the end of the string, important for splitting the string into an array later, since MySQL does not support Array datatypes
        matched_users: Sequelize.fn(
          'CONCAT',
          Sequelize.col('matched_users'),
          idToMatch,
          ';'
        ),
      },
      {
        where: {
          id,
        },
      }
    );

    // now check if our ID is in the other user's matched_users list...
    const { matched_users } = await User.findOne({
      where: { id: idToMatch },
      attributes: ['matched_users'],
      raw: true,
    });

    if (matched_users.indexOf(id) != -1) {
      // it's a match!

      // send a message to both users
      const msg = {};
      msg.body = 'We Matched!';
      msg.sender_id = id;
      msg.recipient_id = idToMatch;
      msg.read = false;
      msg.room = id < idToMatch ? `${id}x${idToMatch}` : `${idToMatch}x${id}`;
      msg.user = {};
      msg.user.username = 'devSpark';
      msg.createdAt = new Date();

      // ... then create the messages in the database
      try {
        await Message.create(msg);
      } catch (error) {
        console.log(error);
      }

      msg.sender_id = idToMatch;
      msg.recipient_id = id;

      try {
        await Message.create(msg);
      } catch (error) {
        console.log(error);
      }

      // send a notification to each user
      const myCount = await notificationCount(id);
      io.to(parseInt(id)).emit('update-notifications', myCount);

      const theirCount = await notificationCount(idToMatch);
      io.to(parseInt(idToMatch)).emit('update-notifications', theirCount);
    }
  });

  socket.on('despark', async (data) => {
    const id = socket.request.session.user_id;
    const idToUnmatch = data.unmatchThisUser;

    // get the user's current list of matches
    const { matched_users } = await User.findOne({
      where: { id },
      attributes: ['matched_users'],
      raw: true,
    });

    // split it into an array
    const matchedUsersArr = matched_users.split(';');
    // filter out the user to be unmatched
    const newMatchedUsersArr = matchedUsersArr.filter(
      (user) => user != idToUnmatch
    );

    // convert the array to a string with ';' between each id
    const newMatchedUsersStr =
      newMatchedUsersArr.flat().toString().replaceAll(',', ';') + ';';

    // now update the user
    await User.update({ matched_users: newMatchedUsersStr }, { where: { id } });

    // now delete any potential match messages that may have been sent out
    const room =
      id < idToUnmatch ? `${id}x${idToUnmatch}` : `${idToUnmatch}x${id}`;
    await Message.destroy({
      where: {
        [Op.and]: [{ room }, { body: 'We Matched! Jinx! Jinx again!' }],
      },
    });
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
        attributes: ['id', 'email', 'username'],
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

      // get recipient's blocked users
      const blockingUser = await User.findByPk(receiver);
      if (!blockingUser) return;

      // convert string of recipient's blocked user IDs to array of integers
      const blockedUsers = blockingUser.dataValues.blocked_users
        .split(';')
        .map((id) => parseInt(id));

      // check if senderID is in recipientID's list of blocked users
      if (blockedUsers.indexOf(parseInt(sender)) !== -1) {
        io.to(room).emit('newmsg', {
          user: {
            username: 'devSpark',
          },
          createdAt: new Date(),
          body: `We're sorry, but this user has blocked you. New messages can no longer be sent to this user. Please delete this conversation.`,
        });
        return;
      }

      // check if the recipient is both online AND in the same room as the sender, if so, flag the message as read (true), otherwise, unread (false)
      msg.read = users[receiver] && users[receiver] === room ? true : false;
      // add roomname
      msg.room = room;
      msg.user = {};
      msg.user.username = socket.request.session.username;
      msg.createdAt = new Date();

      // ... then create the message in the database
      try {
        await Message.create(msg);
      } catch (error) {
        console.log(error);
      }

      // ... then, emit the message to the clientside chatroom
      io.to(room).emit('newmsg', msg);

      // if user is online but not in room, update the user's chat list based on their unique chat list room (which would be '4x' if their userID is 4)
      if (users[receiver] !== room) {
        io.to(msg.recipient_id + 'x').emit('update-list', msg);
      }

      // ... then, update the receiver's notification socket to the latest unread message count, but only if they're online
      if (users[receiver] !== room) {
        const count = await notificationCount(receiver);
        io.to(parseInt(receiver)).emit('update-notifications', count);
      }
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
sequelize.sync({ force: false }).then(async () => {
  // check if there are skills in the database
  const dbAlreadySeeded = await Skill.findByPk(1);
  // if not, seed the database
  if (!dbAlreadySeeded) {
    await seedAll();
  }

  http.listen(process.env.PORT || 3001, () => {
    if (!process.env.PORT) {
      console.log('|-----------------------|');
      console.log('| http://localhost:3001 |');
      console.log('|-----------------------|');
    }
  });
});
