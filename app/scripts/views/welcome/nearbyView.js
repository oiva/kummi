define([
  'backbone',
  'views/welcome/stopItemView',
  'hbs!tmpl/welcome/nearby'
],

function(Backbone, StopItemView, Template) {
  'use strict';

  return Backbone.Marionette.CompositeView.extend({
    itemView: StopItemView,
    template: Template,
    itemViewContainer: 'ul',
    initialize: function() {
      console.log('nearby init', this.collection);
    },
    onCompositeCollectionRendered: function() {
      console.log('on composite rendered', this.$('#loading-stops'));
      this.$('#loading-stops').toggle(this.collection.length === 0);
    }
  });
});