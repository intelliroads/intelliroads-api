'use strict';

// Load modules
var Boom = require('boom');
var Joi = require('joi');
var Road = require('../models/road');
var Spot = require('../models/spot');

/**
 * GET /roads
 * Get roads
 *
 */
exports.index = {
  handler: function (request, reply) {
    Road.find(function (err, docs) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      reply(docs);
    });
  }
};

/**
 * POST /roads
 * Create a new road
 *
 */
exports.create = {
  handler: function (request, reply) {
    var road = new Road();
    road._id = request.payload._id;
    road.name = request.payload.name;
    road.save(function (err, doc) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      reply(doc).created('/roads/' + doc.id);
    });
  },
  validate: {
    payload: {
      _id: Joi.string().required(),
      name: Joi.string().default('')
    }
  }
};
