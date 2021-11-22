'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AccountSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
});

module.exports = mongoose.model('Account', AccountSchema);