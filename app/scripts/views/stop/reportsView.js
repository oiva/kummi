define([
  'backbone',
  'collections/reports',
  'views/stop/reportItemView'
],

function(Backbone, Reports, ReportItemView) {
  'use strict';

  return Backbone.Marionette.CollectionView.extend({
    itemView: ReportItemView
  });
});