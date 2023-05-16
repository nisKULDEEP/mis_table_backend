const express = require('express');

const app = express();

const middleware = require('../middleware/middleware');

const {
  userSignup,
  userSignin,
  userSignout,
} = require('../controllers/auth.controller');

app.post('/signup', userSignup);
app.get('/login', userSignin);
app.get('/signout', userSignout);

module.exports = app;
