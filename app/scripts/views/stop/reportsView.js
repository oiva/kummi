'use strict';
var Marionette = require('backbone.marionette');

var ReportItemView = require('./reportItemView');
var ReportsEmptyView = require('./reportsEmptyView');
var Template = require('../../../templates/stop/reports.hbs');


module.exports = Marionette.CompositeView.extend({
  template: Template,
  itemView: ReportItemView,
  itemViewContainer: 'ul',
  emptyView: ReportsEmptyView
});