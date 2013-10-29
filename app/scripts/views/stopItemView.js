define([
  'backbone',
  'hbs!tmpl/stopItem'
],

function(Backbone, Template) {
  'use strict';
  
  return Backbone.Marionette.ItemView.extend({
    template: Template,
    tagName: 'li'
  });
});