/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    var context = this.getModel().toJSON();
    return (
      <li>
        <a href="#stop/{context.code}">{context.name} 
          {context.codeShort ? '({context.codeShort})' : '' }
        </a>
      </li>
    );
  }
});