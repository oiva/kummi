define([
  'backbone',
  'hbs!tmpl/adopt/adopt'
], function(Backbone, Template) {
  'use strict';

  return Backbone.Marionette.ItemView.extend({
    template: Template,
    id: 'adopt',
    ui: {
      'firstName': '#firstname',
      'lastName': '#lastname',
      'email': '#email'
    },
    events: {
      'submit #adopt-form': 'submitAdopt',
    },
    initialize: function(options) {
      console.log('init adopt view', options);
      this.options = options;      
    },
    serializeData: function() {
      var context = {};
      if (this.model === null) {
        return context;
      }

      context = this.model.toJSON();
      if ((context.name === null || typeof context.name === 'undefined') && context.name_fi !== null) {
        context.name = context.name_fi;
        context.address = context.address_fi;
        context.city = context.city_fi;
      }
      console.log('context', context);
      return context;
    },
    submitAdopt: function() {
      var data = {
        fistName: this.ui.fistName.val(),
        lastName: this.ui.lastName.val(),
        email: this.ui.email.val(),
        stop: this.options.code
      };
      console.log(data);
    }
  });
});