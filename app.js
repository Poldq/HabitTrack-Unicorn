const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const users = require('./routes/users');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
require('./strategy/local-strategy');

const app = express();

mongoose
  .connect('mongodb://localhost/habitTrackUnicorn')
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60,
  },
})
)
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/user', users.router);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
 });

module.exports = app;
