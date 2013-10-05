define([
  'backbone',
  'models/report'
],

function(Backbone, Report) {
  'use strict';

  return Backbone.Collection.extend({
    model: Report,
    initialize: function(options) {
      this.code = options.code;
    },
    url: function() {
      return 'api/report/'+this.code;
    }
  });
});