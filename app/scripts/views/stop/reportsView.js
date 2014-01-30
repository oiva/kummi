require('backbone.marionette');

var Reports = require('../../collections/reports');
var ReportItemView = require('./reportItemView');
var ReportsEmptyView = require('./reportsEmptyView');
var Template = require('../../../templates/stop/reports.hbs');


module.exports = Backbone.Marionette.CompositeView.extend({
  template: Template,
  itemView: ReportItemView,
  itemViewContainer: 'ul',
  emptyView: ReportsEmptyView
});