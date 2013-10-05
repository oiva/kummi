define([
  'backbone',
  'views/stopItemView',
  'hbs!tmpl/welcome'
],

function(Backbone, StopItemView, Template) {
  'use strict';

  return Backbone.Marionette.CompositeView.extend({
    template: Template,
    itemView: StopItemView,
    itemViewContainer: '#stops',
    events: {
      'click #find-stop': 'findStop'
    },
    initialize: function() {
      console.log('init welcome view');
      Communicator.mediator.on('position:error', this.onPositionError, this);
      this.collection = this.options.appModel.get('stops');
      console.log('this.collection', this.collection);
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