'use strict';
module.exports = function (express, auth) {
  var personModel = require('../models/person');

  var router = express.Router();

  router.route('/health')
    .get(auth.ensureAuthenticated, function (req, res) {
      res.send({status: 'hello world'});
    });

  router.route('/people')
    .get(auth.ensureAuthenticated, function (req, res) {
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

  return router;
};