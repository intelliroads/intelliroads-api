'use strict';

// Load modules
var Boom = require('boom');
var Joi = require('joi');
var Road = require('../models/road');
var Sensor = require('../models/sensor');
var Reading = require('../models/reading');

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

/**
 * GET /roads/{id}/mean-time-speed
 * Get mean time speed between two spots (km) of the road
 *
 */
exports.meanTimeSpeed = {
  handler: function (request, reply) {
    var id = request.params.id;
    var fromKm = request.query.fromKm;
    var toKm = request.query.toKm;
    var fromTime = request.query.fromTime;
    var toTime = request.query.toTime;
    Sensor.find({ roadId: id, kilometer: { $gte: fromKm, $lte: toKm } }, { _id: 1 }, function (err, docs) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      var sensors = docs.map(function (elem) {
        return elem._id;
      });

      Reading.find({ sensorId: { $in: sensors }, time: { $gte: fromTime, $lte: toTime } }, function (err, docs) {
        if (err) {
          return reply(Boom.badImplementation(err));
        }

        if (docs.length) {
          var speeds = docs.map(function (elem) {
            return elem.speed;
          });

          var sum = speeds.reduce(function (a, b) {
            return a + b;
          }, 0);

          var meanTimeSpeed = sum / speeds.length;
          reply(meanTimeSpeed);
        } else {
          reply(0);
        }
      });
    });
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    query: {
      fromKm: Joi.number().min(0).required(),
      toKm: Joi.number().greater(Joi.ref('fromKm')).required(),
      fromTime: Joi.date().required(),
      toTime: Joi.date().min(Joi.ref('fromTime')).required()
    }
  }
};

/**
 * GET /roads/{id}/volume
 * Get volume in one spot (km) of the road
 *
 */
exports.volume = {
  handler: function (request, reply) {
    var id = request.params.id;
    var km = request.query.km;
    var fromTime = request.query.fromTime;
    var toTime = request.query.toTime;
    Sensor.find({ roadId: id, kilometer: { $lte: km } }, { _id: 1 }, { sort: { kilometer: -1 }, limit: 1 }, function (err, docs) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      if (!docs.length) {
        return reply(Boom.notFound());
      }

      var sensor = docs[0];
      Reading.find({ sensorId: sensor.id, time: { $gte: fromTime, $lte: toTime } }, function (err, docs) {
        if (err) {
          return reply(Boom.badImplementation(err));
        }

        reply(docs.length);
      });
    });
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    query: {
      km: Joi.number().min(0).required(),
      fromTime: Joi.date().required(),
      toTime: Joi.date().min(Joi.ref('fromTime')).required()
    }
  }
};
