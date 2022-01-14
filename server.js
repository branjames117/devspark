const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers');

// initialize app
const app = express();

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

const PORT = process.env.PORT || 3001;

// tell app to use handlebars for its view engine
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// boilerplate app middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// tell app to use our custom routes
app.use(routes);

// sync sequelize with db before telling server to listen
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    if (!process.env.PORT) {
      console.log(`Server listening at http://localhost:${PORT}.`);
    } else {
      console.log(`Server listening on port ${PORT}`);
    }
  });
});
