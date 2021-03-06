/** @jsx React.DOM */

'use strict';
require('react.backbone');

var NearbyView = require('./welcome/nearbyView');
var SearchView = require('./welcome/searchView');
var InfoTeaserView = require('./infoTeaserView');

var WelcomeView = React.createBackboneClass({
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.div( {className:"row", id:"welcome-info-teaser"}, 
          InfoTeaserView(null )
        ),
        this.state.geoLocation?
        React.DOM.div( {className:"row", id:"welcome-nearby"}, 
          NearbyView( {model:this.getModel().get('stops')} )
        )
        : '',
        React.DOM.div( {className:"row", id:"welcome-search"}, 
          SearchView(null )
        )
      )
    );
  },

  getInitialState: function() {
    return {geoLocation: true};
  },
  onPositionError: function() {
    console.log('welcome view: position error');
    this.setState({geoLocation: false});
  },
  componentWillMount: function() {
    Communicator.mediator.on('position:error', this.onPositionError, this);
  }
});

module.exports = WelcomeView;