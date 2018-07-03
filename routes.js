const express = require('express');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const apiRouter = express.Router();
const webRouter = express.Router();
const secret = process.env.SECRET || 'abdec96ef98215ab';
const path = require('path');

// API
// Protected API Get Routes
apiRouter.get(
  '/profileInfo',
  passport.authenticate('jwt', { session: false }),
  (req, res) => res.json(req.user)
);

// Post methods
apiRouter.post('/register', (req, res) => {
  User.register(
    new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        return res.json({ error: true, message: err.message });
      }
      const payload = { id: user._id };
      const token = jwt.sign(payload, secret);
      return res.json({
        error: false,
        message: 'Account created successfully',
        token
      });
    }
  );
}); // register

apiRouter.post('/login', async (req, res) => {
  if (req.body.username && req.body.password) {
    let { username, password } = req.body;
    let user;

    try {
      user = await User.findByUsername(username);
    } catch (err) {
      console.log(err);
      return res.json({
        error: true,
        message: 'Some error occured, please try again'
      });
    }

    if (!user) {
      return res.json({
        error: true,
        message: 'Username or Password is incorrect '
      });
    }

    user.authenticate(password, (err1, user, err2) => {
      const err = err1 || err2;

      if (err) return res.json({ error: true, message: err.message });

      const payload = { id: user._id };
      const token = jwt.sign(payload, secret);

      return res.json({
        error: false,
        message: 'Logged in successfully!',
        token
      });
    });
  } else {
    return res.json({
      error: true,
      message: 'Username or password not supplied'
    });
  }
}); // login

// Webroutes
webRouter.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

module.exports = {
  apiRouter,
  webRouter
};
