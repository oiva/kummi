/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      React.DOM.div( {className:"col-xs-12 col-sm-12"}, 
        React.DOM.p(null, "Tällä pysäkillä ei ole raportoituja ongelmia.")
      )
    );
  }
});