const express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  path = require('path'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  JWTStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  jwt = require('jsonwebtoken'),
  socketIOJwt = require('socketio-jwt');

const User = require('./models/user');
const router = require('./routes');

// Set up db connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat');
mongoose.Promise = Promise;

// Set up middlware
app.use(express.static(path.resolve(__dirname, 'client')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

// Strategy Configuration
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secret: process.env.SECRET || 'abdec96ef98215ab'
};

passport.use(
  new JWTStrategy(jwtOptions, async (payload, next) => {
    let user;
    try {
      user = await User.findById(payload.id);
    } catch (err) {
      console.log(err);
      next(err);
    }
    if (user) {
      return next(null, user);
    }
    return next(null, false);
  })
);

// Auth middleware
app.use(passport.initialize());

// Start the server
http.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening at port: ${process.env.PORT || 3000}`);
});
