define([
  'backbone',
  'hbs!tmpl/welcome/search'
],

function(Backbone, Template) {
  'use strict';
  
  return Backbone.Marionette.ItemView.extend({
    template: Template,
    events: {
      'click #find-stop': 'findStop'
    },
    findStop: function() {
      var code = this.$('#stop-id').val();
      appRouter.navigate('stop/'+code, {trigger: true});
      return false;
    }
  });
});