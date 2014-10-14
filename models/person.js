var mongoose = require('mongoose');

var personSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});
var personModel = mongoose.model('person', personSchema);

module.exports = personModel;
