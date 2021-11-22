'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TopTokenSchema = new Schema({
  updated_at: {
    type: String
  },
  data: {
    type: Object
  }
});

module.exports = mongoose.model('TopTokens', TopTokenSchema);