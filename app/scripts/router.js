define([
  'backbone'
],

function (Backbone) {
  var router = Backbone.Marionette.AppRouter.extend({
    initialize: function() {
      console.log('router init');
    },
    appRoutes: {
      "": "welcome",
      "stop/:id": "stop"
    }
  });
  return router;
});