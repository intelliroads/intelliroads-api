'use strict';

// Load modules
var ReadingsController = require('./controllers/readingsController');
var SensorsController = require('./controllers/sensorsController');
var SpotsController = require('./controllers/spotsController');

/**
 * Contains the list of all routes, i.e. methods, paths and the config functions
 * that take care of the actions
 */
module.exports = [
  { method: 'GET', path: '/readings', config: ReadingsController.index },
  { method: 'POST', path: '/readings', config: ReadingsController.create },
  { method: 'GET', path: '/sensors', config: SensorsController.index },
  { method: 'POST', path: '/sensors', config: SensorsController.create },
  { method: 'GET', path: '/spots', config: SpotsController.index },
  { method: 'POST', path: '/spots', config: SpotsController.create }
];
