/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createBackboneClass({
  render: function() {
    return <li>{this.getModel().get('date')}: {this.getModel().get('description')}</li>;
  }
});