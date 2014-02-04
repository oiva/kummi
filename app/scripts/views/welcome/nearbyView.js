/** @jsx React.DOM */

'use strict';
require('react.backbone');

var StopItemView = require('./stopItemView');

var NearbyView = React.createBackboneClass({
  render: function() {
    return (
      React.DOM.div( {className:"col-xs-12 col-sm-6 col-md-8"}, 
        React.DOM.h3(null, "Lähistön pysäkit"),
        this.getModel().length === 0 ?
        React.DOM.p( {id:"loading-stops"}, "Ladataan...")
        :
        React.DOM.ul( {id:"stops"}, 
          this.getModel().map(function(stop) {
            return StopItemView( {model:stop} );
          })
        )
        
      )
    );
  }
});

module.exports = NearbyView;