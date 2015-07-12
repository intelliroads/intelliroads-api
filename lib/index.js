'use strict';

// Load modules
var Hapi = require('hapi');
var mongoose = require('mongoose');

// Create a server instance
var server = new Hapi.Server();
server.connection({ port: 3000 });

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
  mongoose.connect('mongodb://localhost/intelliroads');
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
