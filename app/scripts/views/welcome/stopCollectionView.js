require('backbone.marionette');

var StopItemView = require('./stopItemView');

module.exports = Backbone.Marionette.CollectionView.extend({
    itemView: StopItemView
});