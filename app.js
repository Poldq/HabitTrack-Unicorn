const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const users = require('./routes/users');
const habitPlan = require('./routes/habitPlan');
const habit = require('./routes/habit');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
require('./strategy/local-strategy');

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const app = express();

mongoose
  .connect('mongodb://localhost/habitTrackUnicorn')
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
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
    sameSite: 'none',
    secure: false
  },
})
)
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/user', users.router);
app.use('/api/habitPlan', habitPlan);
app.use('/api/habitPlan/habits', habit);


app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
 });

module.exports = app;
