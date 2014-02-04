'use strict';
var Marionette = require('backbone.marionette');

var StopItemView = require('./stopItemView');

module.exports = Marionette.CollectionView.extend({
  itemView: StopItemView
});