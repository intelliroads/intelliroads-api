'use strict';

// Load modules
var ReadingsController = require('./controllers/readingsController');
var RoadsController = require('./controllers/roadsController');
var SensorsController = require('./controllers/sensorsController');
var SpotsController = require('./controllers/spotsController');

/**
 * Contains the list of all routes, i.e. methods, paths and the config functions
 * that take care of the actions
 */
module.exports = [
  { method: 'GET', path: '/readings', config: ReadingsController.index },
  { method: 'POST', path: '/readings', config: ReadingsController.create },
  { method: 'GET', path: '/roads', config: RoadsController.index },
  { method: 'POST', path: '/roads', config: RoadsController.create },
  { method: 'GET', path: '/roads/{id}/mean-time-speed', config: RoadsController.meanTimeSpeed },
  { method: 'GET', path: '/roads/{id}/volume', config: RoadsController.volume },
  { method: 'GET', path: '/roads/{id}/mean-time-speed-dummy', config: RoadsController.meanTimeSpeedDummy },
  { method: 'GET', path: '/roads/{id}/volume-dummy', config: RoadsController.volumeDummy },
  { method: 'GET', path: '/sensors', config: SensorsController.index },
  { method: 'POST', path: '/sensors', config: SensorsController.create },
  { method: 'GET', path: '/spots', config: SpotsController.index },
  { method: 'POST', path: '/spots', config: SpotsController.create }
];
