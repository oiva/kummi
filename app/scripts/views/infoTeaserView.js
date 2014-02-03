'use strict';
var Marionette = require('backbone.marionette');
var Template = require('../../templates/infoTeaser.hbs');

module.exports = Marionette.ItemView.extend({
  template: Template
});