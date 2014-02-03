/** @jsx React.DOM */

'use strict';
var Marionette = require('backbone.marionette');
require('react.backbone');

var StopNameView = React.createBackboneClass({
  displayName: 'Stop Name View',
  className: 'col-xs-12 col-sm-12',
  changeOptions: 'change:name_fi',

  render: function() {
    var context = this.getModel().toJSON();
    context.stopName = context.name;
    if (context.stopName === undefined && context.name_fi !== null) {
      context.stopName = context.name_fi;
      context.address = context.address_fi;
      context.city = context.city_fi;
    }
    console.log('stop name view: render', context);
    
    if (context.stopName) {
      return (
        <div>
          <h1>{context.stopName}</h1>
          <p class="info">{context.address}, {context.city}</p>
        </div>
      );
    } else {
      return (
        <div>
          <p>Ladataan pysäkin tietoja...</p>
        </div>
      );
    }
  }
});

module.exports = StopNameView;