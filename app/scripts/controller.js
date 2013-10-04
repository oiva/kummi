define([
  'backbone',
  'models/appModel',
  'views/welcomeView'
],

function(Backbone, AppModel, WelcomeView) {
  'use strict';

  var controller = Backbone.Marionette.Controller.extend({
    initialize: function() {
      console.log('controller init');
      this.app = this.options.app;
      this.appModel = new AppModel();
    },

    welcome: function() {
      var welcomeView = new WelcomeView({appModel: this.appModel});
      this.app.main.show(welcomeView);

      // update location
      // todo: get position
      var _this = this;
      setTimeout(function() {
        _this._updatePosition();
      }, 100);
    },

    stop: function(id) {
      console.log(id);
    },

    _updatePosition: function() {
      console.log('update position');
      if (!Modernizr.geolocation) {
        return;
      }

      navigator.geolocation.getCurrentPosition(
        _.bind(this._onPosition, this),
        _.bind(this._onPositionError, this)
      );
    },

    _onPosition: function(position) {
      console.log('onPosition', position);
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      this.appModel.updateLocation(lat, lon);
    },

    _onPositionError: function(error) {
      Communicator.mediator.trigger('position:error', error.code);
      console.log('position error: '+error.code);
    }
  });
  return controller;
});