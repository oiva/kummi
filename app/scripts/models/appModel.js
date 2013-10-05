define([
  'backbone',
  'collections/stops'
],

function(Backbone, Stops) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      stops: null,
      stop: null
    },
    initialize: function() {
      this.set({stops: new Stops()});
    },
    updateLocation: function(lat, lon) {
      this.get('stops').lat = lat;
      this.get('stops').lon = lon;
      this.getStops();
    },
    getStops: function() {
      this.get('stops').fetch({
        success: _.bind(this.onStops, this),
        error: _.bind(this.onStopsError, this),
        reset: true
      });
    },
    onStops: function(collection, response, options) {
      console.log('stops fetched', collection);
      if (collection.code !== null && collection.length === 1) {
        console.log('loaded specific stop');
        this.set({stop: collection.models[0]});
      }
    },
    onStopsError: function(collection, response, options) {
      console.error('stops fetch failed');
    },
    loadStop: function(code) {
      console.log('load stop '+code);
      this.get('stops').lat = null;
      this.get('stops').long = null;
      this.get('stops').code = code;
      this.getStops();
    }
  });
});