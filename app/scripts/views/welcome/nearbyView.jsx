/** @jsx React.DOM */

'use strict';
require('react.backbone');

var StopItemView = require('./stopItemView');

var NearbyView = React.createBackboneClass({
  render: function() {
    return(
      <div className="col-xs-12 col-sm-6 col-md-8">
        <h3>Lähistön pysäkit</h3>
        {this.getModel().length === 0 ?
        <p id="loading-stops">Ladataan...</p>
        :
        <ul id="stops">
          {this.getModel().map(function(stop) {
            return <StopItemView model={stop} />;
          })}
        </ul>
        }
      </div>
    )
  }
});

module.exports = NearbyView;