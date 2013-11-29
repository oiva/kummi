define([
	'backbone',
	'communicator',
	'controller',
	'router'
],

function( Backbone, Communicator, AppController, AppRouter) {
  'use strict';

	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({
		'header': '#header',
		'main': '#main'
	});

	/* Add initializers here */
	App.addInitializer( function () {
		window.Communicator = Communicator;
		Communicator.mediator.trigger("APP:START");

		var appController = new AppController({app: this});
		var appRouter = new AppRouter({controller: appController});
		window.appRouter = appRouter;
	});

	App.on('initialize:after', function() {
    console.log('app initialized');
    Backbone.history.start();
  });

	return App;
});
