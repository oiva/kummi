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
      if (typeof this.lat !== undefined 
       && typeof this.lon !== undefined
       && this.lat !== null
       && this.lon !== null) {
        return 'api/stop/'+this.lat+'/'+this.lon;
      } else if (typeof this.code !== undefined && this.code !== null) {
        return 'api/stop/'+this.code;
      }
      return null;
    },
    parse: function(response) {
      return _.first(response, 5);
    }
  });
});