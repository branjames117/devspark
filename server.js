// configure express app with http server so we can use socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const { User, Message } = require('./models');

// set up session with sequelize
const session = require('express-session');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// handlebars, session, sequelize, sequelize session, helpers and routes
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

// tell app to use session middleware
app.use(
  session({
    secret: process.env.SECRET,
    cookie: {},
    resave: false,
    store: new SequelizeStore({ db: sequelize }),
  })
);

// tell app to use handlebars for its view engine
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// boilerplate app middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
const res = require('express/lib/response');
app.use(express.static(path.join(__dirname, 'public')));

// tell app to use our custom routes
app.use(routes);

// socket.io
// to do - separate this logic to a separate file
const io = require('socket.io')(http);

// when a user (new socket) connects to the server
io.on('connection', (socket) => {
  console.log(`SocketID ${socket.id} connected to server`);
  // listen for joinroom requests, meaning a user is initiating a chat with another user
  socket.on('joinroom', (data) => {
    // get IDs of both users, format room name based on which userID is lowest, so that two users will always join the same private room when trying to contact one another
    const [user1, user2] = data.room.split('x');

    // if user1 === user2 something went wrong
    if (user1 === user2) {
      console.log(`UserID ${user1} is trying to message his or herself.`);
      return;
    }

    const room = user1 < user2 ? `${user1}x${user2}` : `${user2}x${user1}`;

    // we know user1 exists because it comes from session data
    // now check that user2 exists before proceeding
    User.findByPk(user2).then((data) => {
      if (!data) {
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
          data.room = room;
          console.log(data);
          Message.create(data).then((dbData) => {
            io.to(room).emit('newmsg', data);
            console.log(data);
          });
        });
      });
    });

    // find out which user ID is the lowest, then generate a string like "lowerIDxhigherID" e.g. 5x16 or 100x556; this will be the unique "room name" socket.io will use for emitting messages to the two clients, and this data will also be stored in each message for faster querying
    // when user joins a preexisting room, all messages in that room will be marked as read
    // when a user receives a message from a user that has never messaged them before, the user will receive a notification (an invite) to join the unique room ("So and so messaged you")
    // when a user receives a new message, the notification will also be "So and so messaged you"
    // from the /chat route, the user will have access to all their existing chatrooms
    // socket.join(uniqueRoomNameBasedOnUserIDs);
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
