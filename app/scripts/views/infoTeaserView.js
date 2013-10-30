define([
  'backbone',
  'hbs!tmpl/infoTeaser'
], function(Backbone, Template) {
  'use strict';

  return Backbone.Marionette.ItemView.extend({
    template: Template
  });
});