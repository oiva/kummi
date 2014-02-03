/** @jsx React.DOM */
'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div class="col-xs-12 col-sm-6 col-md-8">
        <h3>Mikä on pysäkkikummi?</h3>
        <p>Pysäkkikummi on palvelu, jonka avulla ihmiset voivat kertoa jos HSL:n pysäkeillä on jotain pielessä.</p>
        <a href="#" class="btn btn-default">Lue lisää &raquo;</a>
      </div>
    );
  }
});