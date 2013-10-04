define([
  'backbone',
  'collections/stops'
],

function(Backbone, Stops) {
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
        success: this.onStops,
        error: this.onStopsError,
        reset: true
      });
    },
    onStops: function(collection, response, options) {
      console.log('stops fetched', collection);
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