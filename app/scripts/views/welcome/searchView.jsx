/** @jsx React.DOM */

'use strict';
var React = require('react');

var SearchView = React.createClass({
  render: function() {
    return (
      <div className="col-xs-12 col-sm-6 col-md-8">
        <h3>Etsi pysäkki</h3>
        <label htmlFor="stop-id">Anna pysäkin koodi</label>

        <input type="text" name="stop-id" id="stop-id" placeholder="1251" onChange={this.handleChange} />
        
        <button className="btn btn-primary" id="find-stop" onClick={this.findStop}>Hae</button>
      </div>
    );
  },
  getInitialState: function() {
    return {code: ''};
  },
  handleChange: function(event) {
    this.setState({code: event.target.value});
  },
  findStop: function() {
    if (this.state.code === '') {
      return false;
    }
    appRouter.navigate('stop/'+this.state.code, {trigger: true});
    return false;
  }
});

module.exports = SearchView;