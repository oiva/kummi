require('backbone.marionette');

var NearbyView = require('./welcome/nearbyView');
var SearchView = require('./welcome/searchView');
var InfoTeaserView = require('./infoTeaserView');
var Template = require('../../templates/welcome.hbs');


var WelcomeView = Backbone.Marionette.Layout.extend({
  template: Template,
  regions: {
    infoTeaser: '#welcome-info-teaser',
    nearby: '#welcome-nearby',
    search: '#welcome-search'
  },
  initialize: function(options) {
    this.options = options;
    console.log('init welcome view');
    Communicator.mediator.on('position:error', this.onPositionError, this);
    this.collection = this.options.appModel.get('stops');
  },
  onRender: function() {
    this.infoTeaser.show(new InfoTeaserView());
    this.search.show(new SearchView());
    this.nearby.show(
      new NearbyView({collection: this.collection})
    );
  },
  serializeData: function() {
    var context = {
      geoLocation: Modernizr.geolocation
    };
    return context;
  },
  onPositionError: function() {
    console.log('welcome view: position error');
    this.$('#welcome-nearby').hide();
  }
});

module.exports = WelcomeView;