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
        var speeds = docs.map(function (elem) {
          return elem.speed;
        });

        var sum = speeds.reduce(function (a, b) {
          return a + b;
        });

        var meanTimeSpeed = sum / speeds.length;
        reply(meanTimeSpeed);
      });
    });
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    query: {
      fromKm: Joi.number().required(),
      toKm: Joi.number().required(),
      fromTime: Joi.string().required(),
      toTime: Joi.string().required()
    }
  }
};

/**
 * GET /roads/{id}/mean-time-speed-dummy
 * Get mean time speed between two spots (km) of the road
 *
 */
exports.meanTimeSpeedDummy = {
  handler: function (request, reply) {
    var low = 0;
    var high = 110;
    var value = Math.random() * (high - low) + low;
    reply(value);
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    query: {
      fromKm: Joi.number().required(),
      toKm: Joi.number().required(),
      fromTime: Joi.string().required(),
      toTime: Joi.string().required()
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
    Sensor.findOne({ roadId: id, kilometer: km }, { _id: 1 }, function (err, doc) {
      if (err) {
        return reply(Boom.badImplementation(err));
      }

      if (!doc) {
        return reply(Boom.notFound());
      }

      Reading.find({ sensorId: doc.id, time: { $gte: fromTime, $lte: toTime } }, function (err, docs) {
        reply(docs.length);
      });
    });
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    query: {
      km: Joi.number().required(),
      fromTime: Joi.string().required(),
      toTime: Joi.string().required()
    }
  }
};

/**
 * GET /roads/{id}/volume-dummy
 * Get mean time speed between two spots (km) of the road
 *
 */
exports.volumeDummy = {
  handler: function (request, reply) {
    var low = 0;
    var high = 500;
    var value = Math.random() * (high - low) + low;
    reply(value);
  },
  validate: {
    params: {
      id: Joi.string().required()
    },
    query: {
      fromKm: Joi.number().required(),
      toKm: Joi.number().required(),
      fromTime: Joi.string().required(),
      toTime: Joi.string().required()
    }
  }
};

