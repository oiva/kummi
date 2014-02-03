/** @jsx React.DOM */

'use strict';
require('react.backbone');

var ReportLinkView = React.createBackboneClass({
  render: function() {
    var disabled = (this.getModel().get('code') === null) ? 'disabled' : '';
    return (
      <div className="col-xs-12 col-sm-12">
        <h2>Mitä pysäkille kuuluu?</h2>
        <button type="button" className="btn btn-success" id="report-ok" disabled={disabled} onClick={this.reportOK}>
          Pysäkillä on kaikki OK
        </button>
        <button type="button" className="btn btn-danger" id="report-problem" disabled={disabled} onClick={this.reportProblem}>
          Pysäkillä on ongelma!
        </button>
      </div>
    );
  },
  reportOK: function() {
    if (this.getModel() === null) {
      return false;
    }
    this.getModel().reportOK();
    return false;
  },
  reportProblem: function() {
    if (this.getModel() === null || this.getModel().get('code') === null) {
      return false;
    }
    window.appRouter.navigate('report/'+this.getModel().get('code'), {trigger: true});
    return false;
  }
});

module.exports = ReportLinkView;