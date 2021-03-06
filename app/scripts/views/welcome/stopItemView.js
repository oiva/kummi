/** @jsx React.DOM */

'use strict';

require('react.backbone');

module.exports = React.createBackboneClass({
  render: function() {
    var context = this.getModel().toJSON();
    var code = context.codeShort ? ' ('+context.codeShort+')' : '';

    return (
      React.DOM.li(null, 
        React.DOM.a( {href:'#stop/'+context.code}, context.name,code)
      )
    );
  }
});