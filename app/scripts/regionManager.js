'use strict';

var Marionette = require('backbone.marionette');
var Communicator = require('./communicator');

var RegionManager = Marionette.Controller.extend({

	initialize: function() {
		console.log('Initialize a Region Manager');

		/* internal region manager */
		this._regionManager = new Marionette.RegionManager();

		/* event API */
		Communicator.reqres.setHandler('RM:addRegion', this.addRegion, this);
		Communicator.reqres.setHandler('RM:removeRegion', this.removeRegion, this);
		Communicator.reqres.setHandler('RM:getRegion', this.getRegion, this);
	},

	/* add region facade */
	addRegion: function( regionName, regionId ) {
		var region = this.getRegion( regionName );

		if( region ) {
			console.log('REGION ALREADY CREATED TO JUST RETURN REF');
			return region;
		}

		return this._regionManager.addRegion( regionName, regionId );
	},

	/* remove region facade */
	removeRegion: function( regionName ) {
		this._regionManager.removeRegion( regionName );
	},

	/* get region facade */
	getRegion: function( regionName ) {
		return this._regionManager.get( regionName );
	}
});

module.exports = RegionManager;