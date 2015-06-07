'use strict';

// Load modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the schemas
var roadSchema = new Schema({
  name: { type: String, required: true },
  kilometer: { type: Number, required: true }
}, { _id: false });

var spotSchema = new Schema({
  roads: [roadSchema],
  feeders: [String],
  feeding: [String],
  type: { type: String, enum: ['fork', 'trafficLight', 'toll'], required: true },
  redLight: {
    duration: Number,
    frequency: Number
  },
  toll: {
    serviceRate: Number,
    numberOfServers: Number
  }
});

module.exports = mongoose.model('Spot', spotSchema);
