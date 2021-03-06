'use strict';

// Load modules
var Boom = require('boom');
var Joi = require('joi');
var Sensor = require('../models/sensor');

/**
 * GET /sensors
 * Get sensors
 *
 */
exports.index = {
  handler: function (request, reply) {
    Sensor.find(function (err, docs) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      reply(docs);
    });
  },
  description: 'Get the list of sensors'
};

/**
 * POST /sensors
 * Create a new sensor
 *
 */
exports.create = {
  handler: function (request, reply) {
    var sensor = new Sensor();
    sensor.roadId = request.payload.roadId;
    sensor.kilometer = request.payload.kilometer;
    sensor.save(function (err, doc) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      reply(doc).created('/sensors/' + doc.id);
    });
  },
  validate: {
    payload: {
      roadId: Joi.string().required(),
      kilometer: Joi.number().required()
    }
  },
  description: 'Create a new sensor'
};
