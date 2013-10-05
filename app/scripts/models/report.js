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
    setCoords: function(wgs_coords) {
      var coords = wgs_coords.split(',');
      if (coords.length !== 2) {
        console.warn('coords fail', wgs_coords, coords);
        return;
      }
      this.set({lon: coords[0], lat: coords[1]});
    }
  });
});