require('backbone.marionette');

var StopItemView = require('./stopItemView');
var Template = require('../../../templates/welcome/nearby.hbs');

var NearbyView = Backbone.Marionette.CompositeView.extend({
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

module.exports = NearbyView;