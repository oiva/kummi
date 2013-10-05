define([
  'backbone'
],

function (Backbone) {
  var router = Backbone.Marionette.AppRouter.extend({
    initialize: function() {
      console.log('router init');
    },
    appRoutes: {
      '': 'welcome',
      'stop/:code': 'stop',
      'report/:code': 'report'
    }
  });
  return router;
});