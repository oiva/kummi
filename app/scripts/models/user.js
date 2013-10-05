define([
  'backbone'
],

function(Backbone) {
  'use strict';
  
  return Backbone.Model.extend({
    url: '/api/user',
    defaults: {
      email: null,
      code: null
    }
  });
});