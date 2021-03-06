/** @jsx React.DOM */

'use strict';
var React = require('react');

var SearchView = React.createClass({displayName: 'SearchView',
  render: function() {
    return (
      React.DOM.div( {className:"col-xs-12 col-sm-6 col-md-8"}, 
        React.DOM.h3(null, "Etsi pysäkki"),
        React.DOM.label( {htmlFor:"stop-id"}, "Anna pysäkin koodi"),

        React.DOM.input( {type:"text", name:"stop-id", id:"stop-id", placeholder:"1251", onChange:this.handleChange} ),
        
        React.DOM.button( {className:"btn btn-primary", id:"find-stop", onClick:this.findStop}, "Hae")
      )
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