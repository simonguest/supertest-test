'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({ secret: 'simon', resave:true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  console.log('Incoming request from ' + req.path);
  next();
});


var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('Incoming authentication request');
    return done(null, {username: 'test', id: '12345'});
//    User.findOne({ username: username }, function(err, user) {
//      if (err) { return done(err); }
//      if (!user) {
//        return done(null, false, { message: 'Incorrect username.' });
//      }
//      if (!user.validPassword(password)) {
//        return done(null, false, { message: 'Incorrect password.' });
//      }
//      return done(null, user);
//    });
  }));

passport.serializeUser(function (user, done) {
  console.log('serializing user');
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log('deserializing user');
  done(null, {username: 'test', id: '12345'});
});

var apiRouter = require('./routes/api');
app.use('/api', apiRouter);

require('./routes/login')(app, passport, __dirname);


function ensureAuthenticated(req, res, next) {
  console.log("auth? " + req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.use('/', ensureAuthenticated, function (req, res) {
  res.sendFile(__dirname + '/client/home.html');
});


module.exports = app;

