'use strict';
var Backbone = require('backbone');

var Stop = require('../models/stop');


var StopsCollection = Backbone.Collection.extend({
  model: Stop,
  initialize: function() {},
  url: function() {
    if (typeof this.lat !== undefined &&
      typeof this.lon !== undefined &&
      this.lat !== null &&
      this.lon !== null) {
      return 'api/stop/'+this.lat+'/'+this.lon;
    }
    return null;
  },
  parse: function(response) {
    return _.first(response, 5);
  }
});

module.exports = StopsCollection;