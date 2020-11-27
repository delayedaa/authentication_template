// Import modules
require('dotenv').config();
let express = require('express');
let layouts = require('express-ejs-layouts');
let session = require('express-session');
let morgan = require('morgan');
let passport = require('./config/pp-config');
let isLoggedIn = require('./middleware/is-logged-in');
let flash = require('connect-flash');

// Import API modules
let axios = require('axios');

// Environment variables
let SESSION_SECRET = process.env.SESSION_SECRET;

// Initialize app
let app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Set up session module
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize connect-flash
app.use(flash());

// Attach values to res.locals
// app.use((req, res, next) => {
//   res.locals.alerts = req.flash();
//   res.locals.currentUser = req.user;
//   next();
// });

// Home route: GET /
app.get('/', (req, res) => {
  res.render('index', { alerts: res.locals.alerts });
});

// Controllers
app.use('/auth', require('./controllers/auth'));
app.use('/trips', require('./controllers/trips'));

// Instruct app to listen for requests
let PORT = process.env.PORT || 3000;
let server = app.listen(PORT, () => {
  console.log(`The server is up and running on PORT ${PORT}.`);
});

module.exports = server;