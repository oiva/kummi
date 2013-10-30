define([
  'backbone',
  'views/welcome/stopItemView'
],

function(Backbone, StopItemView) {
  'use strict';

  return Backbone.Marionette.CollectionView.extend({
    itemView: StopItemView
  });
});