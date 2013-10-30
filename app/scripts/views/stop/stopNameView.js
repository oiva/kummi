define([
  'backbone',
  'hbs!tmpl/stop/stopName'
], function(Backbone, Template) {
  'use strict';

  return Backbone.Marionette.ItemView.extend({
    template: Template,
    initialize: function() {
      console.log('stop name view: init', this.options);
      this.listenTo(this.model, 'change:name_fi', this.render);
    },
    serializeData: function() {
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
});