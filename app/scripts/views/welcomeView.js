define([
  'backbone',
  'views/welcome/stopCollectionView',
  'views/welcome/searchView',
  'views/infoTeaserView',
  'hbs!tmpl/welcome'
],

function(Backbone, StopCollectionView, SearchView, InfoTeaserView, Template) {
  'use strict';

  return Backbone.Marionette.Layout.extend({
    template: Template,
    regions: {
      infoTeaser: '#welcome-info-teaser',
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
    },
    serializeData: function() {
      var context = {
        geoLocation: Modernizr.geolocation
      };
      return context;
    },
    onPositionError: function(errorCode) {
      console.log('welcome view: position error');
      this.$('#position').hide();
    },
    onCompositeCollectionRendered: function() {
      this.$('#loading-stops').hide();
    }
  });
});