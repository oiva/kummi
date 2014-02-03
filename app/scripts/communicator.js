'use strict';
var Marionette = require('backbone.marionette');
var Backbone = require('backbone');

var Communicator = Marionette.Controller.extend({
	initialize: function() {

		// create a pub sub
		this.mediator = new Backbone.Wreqr.EventAggregator();

		//create a req/res
		this.reqres = new Backbone.Wreqr.RequestResponse();

		// create commands
		this.command = new Backbone.Wreqr.Commands();
	}
});

module.exports = Communicator;