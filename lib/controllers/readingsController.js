'use strict';

// Load modules
var util = require('util');
var Boom = require('boom');
var Joi = require('joi');
var mqtt = require('mqtt');
var client  = mqtt.connect({ servers: [{ host: 'localhost', port: 1883 }]});
var Reading = require('../models/reading');
var Sensor = require('../models/sensor');

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
    Sensor.findById(request.payload.sensorId, function (err, sensor) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      if (!sensor) {
        return reply(Boom.notFound());
      }

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

        // MQTT publish
        var topic = util.format('/sensors/%s/%d', sensor.roadId, sensor.kilometer);
        client.publish(topic, reading.speed);

        reply(doc).created('/readings/' + doc.id);
      });
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
