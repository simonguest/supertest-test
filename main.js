'use strict';
var mongoose = require('mongoose');
var app = require('./app');

mongoose.connect('mongodb://localhost:27017/persondb', {}, function (err) {
  if (err) {
    return console.log(err);
  }

  var server = app.listen(5000, function () {
    console.log('Listening on port %d', server.address().port);
  });
});