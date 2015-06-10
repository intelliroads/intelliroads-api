'use strict';

// Load modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the schema
var roadSchema = new Schema({
  _id: { type: String, required: true },
  name: String
});

module.exports = mongoose.model('Road', roadSchema);
