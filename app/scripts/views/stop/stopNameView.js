require('backbone.marionette');

var Template = require('../../../templates/stop/stopName.hbs');

var StopNameView = Backbone.Marionette.ItemView.extend({
  template: Template,
  className: 'col-xs-12 col-sm-12',
  initialize: function() {
    console.log('stop name view: init', this.options);
    this.listenTo(this.model, 'change:name_fi', this.render);
  },
  serializeData: function(options) {
    this.options = options;
    var context = this.model.toJSON();
    if (context.name === undefined && context.name_fi !== null) {
      context.name = context.name_fi;
      context.address = context.address_fi;
      context.city = context.city_fi;
    }
    console.log('stop name view: render', context);
    return context;
  }
});

module.exports = StopNameView;