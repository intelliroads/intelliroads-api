'use strict';

// Load modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the schema
var sensorSchema = new Schema({
  _id: { type: String, required: true },
  road: { type: String, required: true },
  kilometer: { type: Number, required: true }
});

module.exports = mongoose.model('Sensor', sensorSchema);