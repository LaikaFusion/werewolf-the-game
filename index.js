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

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/chat");
mongoose.Promise = Promise;