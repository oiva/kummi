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
      stop: null,
      coords: {}
    },
    initialize: function() {
      this.set({stops: new Stops(), stop: new Stop()});
    },
    updateLocation: function(lat, lon) {
      if (lat === this.get('coords').lat && lon === this.get('coords').lon) {
        return;
      }

      this.set({coords: {lat: lat, lon: lon}});
      this.get('stops').lat = lat;
      this.get('stops').lon = lon;
      this._fetchStops();
    },
    loadStop: function(options) {
      console.log('appModel: load stop ',options);
      this.get('stop').set(options);
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
    _onStops: function(collection) {
      console.log('appModel: stops fetched', collection);
      if (collection.code !== null && collection.length === 1) {
        console.log('appModel loaded specific stop');
        this.set({stop: collection.models[0]});
      }
    },
    _onStopsError: function() {
      console.error('appModel: stops fetch failed');
    },
  });
});