/** @jsx React.DOM */

'use strict';

require('react.backbone');

var StopNameView = React.createBackboneClass({
  displayName: 'Stop Name View',
  changeOptions: 'change:name_fi',

  render: function() {
    var context = this.getModel().toJSON();
    context.stopName = context.name;
    if (context.stopName === undefined && context.name_fi !== null) {
      context.stopName = context.name_fi;
      context.address = context.address_fi;
      context.city = context.city_fi;
    } 
    if (context.stopName) {
      return (
        React.DOM.div( {className:"col-xs-12 col-sm-12"}, 
          React.DOM.h1(null, context.stopName),
          React.DOM.p( {class:"info"}, context.address,", ", context.city)
        )
      );
    } else {
      return (
        React.DOM.div(null, 
          React.DOM.p(null, "Ladataan pysäkin tietoja...")
        )
      );
    }
  }
});

module.exports = StopNameView;