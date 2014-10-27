'use strict';
module.exports = function (app) {
  var auth = {};
  auth.passport = require('passport');
  var session = require('express-session');

  app.use(session({ secret: 'simon', resave: true, saveUninitialized: true}));
  app.use(auth.passport.initialize());
  app.use(auth.passport.session());

  var ConcurStrategy = require('passport-concur').Strategy;

  auth.passport.use(new ConcurStrategy({
      consumerKey: 'rGkpUM6Mqa7AmuOtHwBdsn',
      clientID: 'rGkpUM6Mqa7AmuOtHwBdsn',
      clientSecret: 'FR4blk4ojuwyaFUMkL2xLDarzfY5I9lJ',
      callbackURL: 'http://localhost:5000/api/auth/callback',
    },
    function(accessToken, refreshToken, instanceURL, expirationDate, done) {
      console.log('in access token');
      console.log(accessToken);
      //User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      //  return done(err, user);
      //});
      return done(null, {username: 'test', id: '12345'});
    }
  ));



  //var LocalStrategy = require('passport-local').Strategy;

//  auth.passport.use(new LocalStrategy(
//    function (username, password, done) {
//      console.log('Incoming authentication request');
//      return done(null, {username: 'test', id: '12345'});
////    User.findOne({ username: username }, function(err, user) {
////      if (err) { return done(err); }
////      if (!user) {
////        return done(null, false, { message: 'Incorrect username.' });
////      }
////      if (!user.validPassword(password)) {
////        return done(null, false, { message: 'Incorrect password.' });
////      }
////      return done(null, user);
////    });
//    }));

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