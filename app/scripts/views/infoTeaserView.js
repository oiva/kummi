/** @jsx React.DOM */
'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      React.DOM.div( {className:"col-xs-12 col-sm-6 col-md-8"}, 
        React.DOM.h3(null, "Mikä on pysäkkikummi?"),
        React.DOM.p(null, "Pysäkkikummi on palvelu, jonka avulla ihmiset voivat kertoa jos HSL:n pysäkeillä on jotain pielessä."),
        React.DOM.a( {href:"#", className:"btn btn-default"}, "Lue lisää »")
      )
    );
  }
});