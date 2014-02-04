/** @jsx React.DOM */

'use strict';

require('react.backbone');

var ReportItemView = require('./reportItemView');
var ReportsEmptyView = require('./reportsEmptyView');

module.exports = React.createBackboneClass({
  render: function() {
    if (typeof this.getModel() === 'undefined' || this.getModel().length === 0) {
      return ReportsEmptyView(null );
    } else {
      return (
        React.DOM.div( {className:"col-xs-12 col-sm-12"}, 
          React.DOM.h3(null, "Raportoidut ongelmat"),
          React.DOM.div( {id:"stop-reports"}, 
            React.DOM.ul(null, 
              this.getModel().map(function(report) {
                return ReportItemView( {model:report} );
              })
            )
          )
        )
      );
    }
  }
});