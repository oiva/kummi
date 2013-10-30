define([
  'backbone',
  'hbs!tmpl/stop/askAdoption'
], function(Backbone, Template) {
  'use strict';

  return Backbone.Marionette.ItemView.extend({
    template: Template,
    events: {
      'click #adopt-stop': 'adoptStop'
    },
    initialize: function() {
      this.listenTo(this.model, 'change:code', this.render);
    },
    adoptStop: function() {
      console.log('adopt stop');
    },
    serializeData: function() {
      var context = this.model.toJSON();
      context.showButton = context.code !== null;
      console.log(context);
      return context;
    }
  });
});