define([
  'backbone',
  'models/user'
],

function(Backbone, User) {
  'use strict';

  return Backbone.Collection.extend({
    model: User,
    initialize: function(options) {
      this.code = options.code;
    },
    url: function() {
      return 'api/user/'+this.code;
    }
  });
});