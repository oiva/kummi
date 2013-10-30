define([
  'backbone',
  'hbs!tmpl/stop/reportsEmpty'
],

function(Backbone, Template) {
  'use strict';
  
  return Backbone.Marionette.ItemView.extend({
    template: Template,
    tagName: 'li'
  });
});