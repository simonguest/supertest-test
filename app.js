'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var personModel = require('./models/person');
app.use(bodyParser.json());

app.get('/health', function (req, res) {
  res.send({status: 'hello world'});
});

app.post('/people', function(req, res){
  var person = new personModel(req.body);
  person.save(function(err){
    if (err){
      console.log(err);
    }
  });
  res.send({status:'accepted'});
});

app.get('/people', function (req, res) {
  console.log('Incoming Request');
  personModel.find({}).lean().exec(function (err, people) {
    if (err) {
      //TODO: handle error on get
      console.log(err);
      res.statusCode = 400;
      res.send(err);
    }
    res.set('Content-Type', 'application/json');
    res.send({people: people.length});
  });
});

module.exports = app;

