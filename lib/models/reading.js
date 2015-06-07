'use strict';

// Load modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the schema
var readingSchema = new Schema({
  sensorId: { type: String, required: true },
  time: { type: Date, default: Date.now, required: true },
  speed: { type: Number, required: true },
  period: { type: Number, required: true }
});

module.exports = mongoose.model('Reading', readingSchema);
