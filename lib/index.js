'use strict';

// Load modules
var Hapi = require('hapi');
var mongoose = require('mongoose');

// Create a server instance
var server = new Hapi.Server();
server.connection({ port: 3000 });

// Attach the routes
server.route(require('./routes'));

// Connect to mongoDB
mongoose.connect('mongodb://localhost/intelliroads');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connection with database succeeded');
});

// Fire up the server
server.start(function () {
  console.log('Server running at:', server.info.uri);
});
