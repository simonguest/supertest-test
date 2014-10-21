'use strict';
var express = require('express');
var app = express();
var auth = require('./auth')(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  console.log('Incoming request from ' + req.path);
  next();
});

var apiRouter = require('./routes/api')(express, auth);
app.use('/api', apiRouter);

var loginRouter = require('./routes/login')(express, auth, __dirname);
app.use('/', loginRouter);

app.use('/home', auth.ensureAuthenticated, function (req, res) {
  res.sendFile(__dirname + '/client/secured/home.html');
});

module.exports = app;

