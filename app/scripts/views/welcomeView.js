define([
  'backbone',
  'views/welcome/nearbyView',
  'views/welcome/searchView',
  'views/infoTeaserView',
  'hbs!tmpl/welcome'
],

function(Backbone, NearbyView, SearchView, InfoTeaserView, Template) {
  'use strict';

  return Backbone.Marionette.Layout.extend({
    template: Template,
    regions: {
      infoTeaser: '#welcome-info-teaser',
      nearby: '#welcome-nearby',
      search: '#welcome-search'
    },
    initialize: function() {
      console.log('init welcome view');
      Communicator.mediator.on('position:error', this.onPositionError, this);
      this.collection = this.options.appModel.get('stops');
    },
    onRender: function() {
      this.infoTeaser.show(new InfoTeaserView());
      this.search.show(new SearchView());
      this.nearby.show(new NearbyView({collection: this.collection}));
    },
    serializeData: function() {
      var context = {
        geoLocation: Modernizr.geolocation
      };
      return context;
    },
    onPositionError: function(errorCode) {
      console.log('welcome view: position error');
      this.$('#welcome-nearby').hide();
    }
  });
});