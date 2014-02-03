'use strict';
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var communicator = require('./communicator');
var AppController = require('./controller');
var AppRouter = require('./router');

var App = new Marionette.Application();

/* Add application regions here */
App.addRegions({
	'header': '#header',
	'main': '#main'
});

/* Add initializers here */
App.addInitializer( function () {
	window.Communicator = new communicator();
	Communicator.mediator.trigger('APP:START');

	var appController = new AppController({app: this});
	var appRouter = new AppRouter({controller: appController});
	window.appRouter = appRouter;
});

App.on('initialize:after', function() {
	console.log('app initialized');
	Backbone.history.start();
});

module.exports = App;