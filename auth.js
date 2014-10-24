'use strict';
module.exports = function (app) {
  var auth = {};
  auth.passport = require('passport');
  var session = require('express-session');

  app.use(session({ secret: 'simon', resave: true, saveUninitialized: true}));
  app.use(auth.passport.initialize());
  app.use(auth.passport.session());

  var LocalStrategy = require('passport-local').Strategy;

  auth.passport.use(new LocalStrategy(
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

  auth.passport.serializeUser(function (user, done) {
    console.log('serializing user');
    console.log(user);
    done(null, user.id);
  });

  auth.passport.deserializeUser(function (id, done) {
    console.log('deserializing user');
    done(null, {username: 'test', id: '12345'});
  });


  auth.ensureAuthenticated = function(req, res, next) {
    console.log("auth? " + req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login?redir='+req.originalUrl);
  };

  return auth;
};