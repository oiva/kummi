define([
  'backbone',
  'hbs!tmpl/welcome/stopItem'
],

function(Backbone, Template) {
  'use strict';
  
  return Backbone.Marionette.ItemView.extend({
    template: Template,
    tagName: 'li'
  });
});