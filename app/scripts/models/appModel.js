define([
  'backbone',
  'collections/stops',
  'models/stop'
],

function(Backbone, Stops, Stop) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      stops: null,
      stop: null
    },
    initialize: function() {
      this.set({stops: new Stops(), stop: new Stop()});
    },
    updateLocation: function(lat, lon) {
      this.get('stops').lat = lat;
      this.get('stops').lon = lon;
      this._fetchStops();
    },
    loadStop: function(code) {
      console.log('appModel: load stop '+code);
      this.get('stop').set({code: code});
      this.get('stop').fetch();
    },
    _fetchStops: function() {
      console.log('appModel: fetch stops');
      this.get('stops').fetch({
        success: _.bind(this._onStops, this),
        error: _.bind(this._onStopsError, this),
        reset: true
      });
    },
    _onStops: function(collection, response, options) {
      console.log('appModel: stops fetched', collection);
      if (collection.code !== null && collection.length === 1) {
        console.log('appModel loaded specific stop');
        this.set({stop: collection.models[0]});
      }
    },
    _onStopsError: function(collection, response, options) {
      console.error('appModel: stops fetch failed');
    },
  });
});