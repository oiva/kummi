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
      lon: null
    },
    setCoords: function(wgs_coords) {
      var coords = wgs_coords.split(',');
      this.set({lon: coords[0], lat: coords[1]});
      return this;
    }
  });  
});