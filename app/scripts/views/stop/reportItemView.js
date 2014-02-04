/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createBackboneClass({
  render: function() {
    return React.DOM.li(null, this.getModel().get('date'),": ", this.getModel().get('description'));
  }
});