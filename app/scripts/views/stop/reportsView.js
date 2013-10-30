define([
  'backbone',
  'collections/reports',
  'views/stop/reportItemView',
  'views/stop/reportsEmptyView',
  'hbs!tmpl/stop/reports'
],

function(Backbone, Reports, ReportItemView, ReportsEmptyView, Template) {
  'use strict';

  return Backbone.Marionette.CompositeView.extend({
    template: Template,
    itemView: ReportItemView,
    itemViewContainer: 'ul',
    emptyView: ReportsEmptyView
  });
});