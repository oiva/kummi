define([
  'backbone'
],

function (Backbone) {
  'use strict';
  
  var router = Backbone.Marionette.AppRouter.extend({
    initialize: function() {
      console.log('router init');
    },
    appRoutes: {
      '': 'welcome',
      'stop/:code': 'stop',
      'report/:code': 'report',
      'adopt/:code': 'adopt'
    }
  });
  return router;
});