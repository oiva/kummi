define([
  'backbone'
],

function(Backbone) {
  'use strict';
  
  return Backbone.Model.extend({
    url: '/api/report',
    defaults: {
      description: null,
      service_code: null,
      lat: null,
      lon: null,
      code: null
    },
    setWgsCoords: function(wgs_coords) {
      var coords = wgs_coords.split(',');
      if (coords.length !== 2) {
        console.warn('coords fail', wgs_coords, coords);
        return;
      }
      this.set({lon: coords[0], lat: coords[1]});
    },
    setCoords: function(xy) {
      var coords = xy.split(',');
      if (coords.length !== 2) {
        console.warn('coords fail', xy, coords);
        return;
      }
      for (var i=0; i<2; i++) {
        var coord = (coords[i]+"").substring(0, 7);
        coord = parseInt(coord, 10);
        coords[i] = coord * 0.00001;
      }
      console.log('coords now '+coords);
      this.set({lon: coords[0], lat: coords[1]});
    }
  });
});