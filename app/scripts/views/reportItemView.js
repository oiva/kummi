define([
  'backbone',
  'hbs!tmpl/reportItem'
],

function(Backbone, Template) {
  'use strict';
  
  return Backbone.Marionette.ItemView.extend({
    template: Template,
    tagName: 'li',
    initialize: function() {
      console.log('report item view init');
    }
  });
});