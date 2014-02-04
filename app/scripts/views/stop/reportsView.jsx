/** @jsx React.DOM */

'use strict';

require('react.backbone');

var ReportItemView = require('./reportItemView');
var ReportsEmptyView = require('./reportsEmptyView');

module.exports = React.createBackboneClass({
  render: function() {
    if (typeof this.getModel() === 'undefined' || this.getModel().length === 0) {
      return <ReportsEmptyView />;
    } else {
      return (
        <div className="col-xs-12 col-sm-12">
          <h3>Raportoidut ongelmat</h3>
          <div id="stop-reports">
            <ul>
              {this.getModel().map(function(report) {
                return <ReportItemView model={report} />;
              })}
            </ul>
          </div>
        </div>
      );
    }
  }
});