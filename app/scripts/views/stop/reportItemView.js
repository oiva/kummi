'use strict';
var Marionette = require('backbone.marionette');

var Template = require('../../../templates/stop/reportItem.hbs');

module.exports = Marionette.ItemView.extend({
  template: Template,
  tagName: 'li'
});