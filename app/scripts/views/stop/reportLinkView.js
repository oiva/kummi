'use strict';
var Marionette = require('backbone.marionette');

var Template = require('../../../templates/stop/reportLink.hbs');

var ReportLinkView = Marionette.ItemView.extend({
  template: Template,
  events: {
    'click #report-ok': 'reportOK',
    'click #report-problem': 'reportProblem'
  },
  initialize: function() {
    this.listenTo(this.model, 'change:code', this._onChangeStop);
  },
  reportOK: function() {
    if (this.model === null) {
      return false;
    }
    this.model.reportOK();
    return false;
  },
  reportProblem: function() {
    if (this.model === null || this.model.get('code') === null) {
      return false;
    }
    window.appRouter.navigate('report/'+this.model.get('code'), {trigger: true});
    return false;
  },
  _onChangeStop: function(model, code) {
    this.$('#report-problem').attr('disabled', code === null);
    this.$('#report-ok').attr('disabled', code === null);
  }
});

module.exports = ReportLinkView;