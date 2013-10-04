define([
  'backbone',
  'models/stop'
],

function(Backbone, Stop) {
  'use strict';

  return Backbone.Collection.extend({
    model: Stop,
    initialize: function() {},
    url: function() {
      if (typeof this.lat !== undefined && typeof this.lon !== undefined) {
        return 'api/nearby?lat='+this.lat+'&lon='+this.lon;
      }
      return null;
    },
    parse: function(response) {
      return _.first(response, 5);
    }
  });
});