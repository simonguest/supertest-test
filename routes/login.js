'use strict';
module.exports = function (app, passport, dirname) {

  app.route('/login')
    .get(function (req, res) {
      res.sendFile(dirname + '/client/login.html');
    })
    .post(
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}));

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/login');
    });
};