/** @jsx React.DOM */

'use strict';
require('react.backbone');

var NearbyView = require('./welcome/nearbyView');
var SearchView = require('./welcome/searchView');
var InfoTeaserView = require('./infoTeaserView');
var Template = require('../../templates/welcome.hbs');

var WelcomeView = React.createBackboneClass({
  render: function() {
    return (
      <div>
        <div className="row" id="welcome-info-teaser">
          <InfoTeaserView />
        </div>
        {this.state.geoLocation?
        <div className="row" id="welcome-nearby">
          <NearbyView model={this.getModel().get('stops')} />
        </div>
        : ''}
        <div className="row" id="welcome-search">
          <SearchView />
        </div>
      </div>
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