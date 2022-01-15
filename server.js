// configure express app to be an http server using socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);

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
    saveUninitialized: true,
    store: new SequelizeStore({ db: sequelize }),
  })
);

// tell app to use handlebars for its view engine
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// tell app to use our custom routes
app.use(routes);

// boilerplate app middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('node_modules'));

// socket.io
// to do - separate this logic to a separate file
const io = require('socket.io')(http);

const users = [];

io.on('connection', function (socket) {
  console.log('A user connected');
  // listening to the setUsername custom event to come from client-side
  socket.on('setUsername', function (data) {
    // if the username is already in the array, emit back to the client the userExists event
    if (users.indexOf(data) > -1) {
      socket.emit(
        'userExists',
        data + ' username is taken! Try some other username.'
      );
    } else {
      // otherwise, push the user onto the array and emit back to the client the userSet event
      users.push(data);
      socket.emit('userSet', { username: data });
    }
  });
  socket.on('msg', function (data) {
    //Send message to everyone
    io.sockets.emit('newmsg', data);
  });
});

const PORT = process.env.PORT || 3001;

// sync sequelize with db before telling server to listen
// sequelize.sync({ force: false }).then(() => {
http.listen(PORT, () => {
  if (process.env.PORT) {
    console.log('Server is listening.');
  } else {
    console.log(`Server listening at http://localhost:${PORT}`);
  }
});
// });
