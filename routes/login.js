'use strict';
module.exports = function (express, auth, dirname) {

  var router = express.Router();

  router.route('/login')
    .get(function (req, res) {
      var redir = (req.query['redir'] ? req.query['redir'] : '/home');
      res.render(dirname + '/client/login.ejs', { redir: redir});
    })
    .post(function (req, res, next) {
      console.log(req.query);
      auth.passport.authenticate('local', { successRedirect: req.query['redir'], failureRedirect: '/login'})(req, res);
    }
  );

  router.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/login');
    });

  return router;
};