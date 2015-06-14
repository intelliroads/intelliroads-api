'use strict';

// Load modules
var mongoose = require('mongoose');
var Road = require('./models/road');
var Sensor = require('./models/sensor');
var Spot = require('./models/spot');

// Connect to mongoDB
mongoose.connect('mongodb://localhost/intelliroads');

Road.find(function (err, roads) {
  roads.forEach(function (road) {
    Spot.find({ 'roads.id': road.id }, function (err, spots) {
      var spotsKilometers = [];
      spots.forEach(function (spot) {
        spot.roads.forEach(function (spotRoad) {
          if (spotRoad.id === road.id) {
            spotsKilometers.push(spotRoad.kilometer);
          }
        });
      });
      // var minKm = Math.min.apply(null, spotsKilometers);
      var maxKm = Math.max.apply(null, spotsKilometers);
      console.log(maxKm);
      // for (var i = minKm; i <= maxKm; i++) {
      //   if (spotsKilometers.indexOf(i) === -1) {
      //     var sensor = new Sensor();
      //     sensor.roadId = road.id;
      //     sensor.kilometer = i;
      //     sensor.save(function (err) {
      //       if (err) {
      //         throw err;
      //       }
      //     });
      //   }
      // }
    });
  });
});
