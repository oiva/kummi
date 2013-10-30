define([
  'backbone',
  'views/welcome/stopCollectionView',
  'views/infoTeaserView',
  'hbs!tmpl/welcome'
],

function(Backbone, StopCollectionView, InfoTeaserView, Template) {
  'use strict';

  return Backbone.Marionette.Layout.extend({
    template: Template,
    regions: {
      infoTeaser: '#welcome-info-teaser'
    },
    events: {
      'click #find-stop': 'findStop'
    },
    initialize: function() {
      console.log('init welcome view');
      Communicator.mediator.on('position:error', this.onPositionError, this);
      this.collection = this.options.appModel.get('stops');
    },
    onRender: function() {
      this.infoTeaser.show(new InfoTeaserView());
    },
    serializeData: function() {
      var context = {
        geoLocation: Modernizr.geolocation
      };
      return context;
    },
    findStop: function() {
      var code = this.$('#stop-id').val();
      appRouter.navigate('stop/'+code, {trigger: true});
      return false;
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