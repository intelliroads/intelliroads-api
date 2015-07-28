'use strict';

// Load modules
var Hapi = require('hapi');
var mongoose = require('mongoose');

// Create a server instance
var server = new Hapi.Server({
  connections: {
    routes: { cors: true }
  }
});
var port = process.env.PORT || 3000;
server.connection({ port: port });

// Register plugins
server.register([
  {
    register: require('good'),
    options: {
      reporters: [
        {
          reporter: require('good-console'),
          events: { log: '*', response: '*' }
        }
      ]
    }
  },
  {
    register: require('lout')
  }
], function (err) {
  if (err) {
    throw err;
  }

  // Connect to mongoDB
  mongoose.connect('mongodb://intelliroads:intelliroads@ds031271.mongolab.com:31271/intelliroads');
  var db = mongoose.connection;
  db.on('error', function () {
    server.log('error', 'Connection error:');
  });
  db.once('open', function () {
    server.log('info', 'Connection with database succeeded');
  });

  // Attach the routes
  server.route(require('./routes'));

  // Start the server
  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
