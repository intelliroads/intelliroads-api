'use strict';

// Load modules
var Boom = require('boom');
var Joi = require('joi');
var Spot = require('../models/spot');

/**
 * GET /spots
 * Get spots
 *
 */
exports.index = {
  handler: function (request, reply) {
    Spot.find(function (err, docs) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      reply(docs);
    });
  },
  description: 'Get the list of spots'
};

/**
 * POST /spots
 * Create a new spot
 *
 */
exports.create = {
  handler: function (request, reply) {
    var spot = new Spot();
    spot.roads = request.payload.roads;
    spot.location = request.payload.location;
    spot.type = request.payload.type;
    if (spot.type === 'trafficLight') {
      spot.redLight = request.payload.redLight;
    } else if (spot.type === 'toll') {
      spot.toll = request.payload.toll;
    }
    spot.save(function (err, doc) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      reply(doc).created('/spots/' + doc.id);
    });
  },
  validate: {
    payload: {
      roads: Joi.array().items(Joi.object().keys({
        id: Joi.string().required(),
        kilometer: Joi.number().required()
      })).required(),
      location: Joi.string().default(''),
      type: Joi.any().valid(['ordinary', 'fork', 'trafficLight', 'toll']).required(),
      redLight: Joi.alternatives().when('type', {
        is: 'trafficLight',
        then: Joi.object().keys({
          duration: Joi.number().required(),
          frequency: Joi.number().required()
        }).required()
      }),
      toll: Joi.alternatives().when('type', {
        is: 'toll',
        then: Joi.object().keys({
          serviceRate: Joi.number().required(),
          numberOfServers: Joi.number().required()
        }).required()
      })
    }
  },
  description: 'Create a new spot'
};
