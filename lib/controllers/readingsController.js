'use strict';

// Load modules
var Boom = require('boom');
var Joi = require('joi');
var Reading = require('../models/reading');

/**
 * GET /readings
 * Get readings
 *
 */
exports.index = {
  handler: function (request, reply) {
    Reading.find(function (err, docs) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      reply(docs);
    });
  },
  description: 'Get the list of readings'
};

/**
 * POST /readings
 * Create a new reading
 *
 */
exports.create = {
  handler: function (request, reply) {
    var reading = new Reading();
    reading.sensorId = request.payload.sensorId;
    reading.speed = request.payload.speed;
    reading.period = request.payload.period;
    if (request.payload.time) {
      reading.time = request.payload.time;
    }
    reading.save(function (err, doc) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      reply(doc).created('/readings/' + doc.id);
    });
  },
  validate: {
    payload: {
      sensorId: Joi.string().required(),
      speed: Joi.number().required(),
      period: Joi.number().required(),
      time: Joi.date()
    }
  },
  description: 'Create a new reading'
};
