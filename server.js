'use strict';
var config = require('config');
var express = require('express');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var bodyParser = require('body-parser');
var app = express();

//var mongoHost = config.get('mongoConfig.host');
//var mongoPort = config.get('mongoConfig.port');
//var mongoDb = config.get('mongoConfig.db');

mockgoose(mongoose);
mongoose.connect('mongodb://localhost:27017/testdb');

var personSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});
var personModel = mongoose.model('person', personSchema);

app.use(bodyParser.json());

app.get('/health', function (req, res) {
  res.send({status: 'hello world'});
});

app.post('/people', function(req, res){
  console.log(req.body);
  var person = new personModel(req.body);
  person.save(function(err, data){
    if (err) console.log(err);
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

