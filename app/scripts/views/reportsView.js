define([
  'backbone',
  'collections/reports',
  'views/reportItemView'
],

function(Backbone, Reports, ReportItemView) {
  'use strict';

  return Backbone.Marionette.CollectionView.extend({
    itemView: ReportItemView
  });
});