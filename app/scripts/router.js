require('backbone.marionette');
  
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

module.exports = router;