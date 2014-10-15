'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var personModel = require('./models/person');
app.use(bodyParser.json());

var router = express.Router();

router.use(function (req, res, next) {
  console.log('Incoming request from ' + req.path);
  next();
});

router.route('/health')
  .get(function (req, res) {
    res.send({status: 'hello world'});
  });

router.route('/people')
  .get(function (req, res) {
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
  })
  .post(function (req, res) {
    var person = new personModel(req.body);
    person.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.send({status: 'accepted'});
  });

app.use('/api', router);

module.exports = app;

