define([
  'backbone',
  'models/appModel',
  'views/welcomeView',
  'views/stopView',
  'views/reportView'
],

function(Backbone, AppModel, WelcomeView, StopView, ReportView) {
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

    stop: function(code) {
      var stopView = new StopView({code: code, appModel: this.appModel});
      this.app.main.show(stopView);

      // load full stop details
      if (this.appModel.get('stop').get('code') != code
         && this.appModel.get('stop').get('code_short') != code) {
        this.appModel.loadStop(code);
      }

      // check if stop exists in collection
      var matchingStops = this.appModel.get('stops').where({code: code});
      var matchingShortCode = this.appModel.get('stops').where({code_short: code});

      if (matchingStops.length > 0) {
        this.appModel.set({stop: matchingStops[0]});
        return;
      }
      if (matchingShortCode.length > 0) {
        this.appModel.set({stop: matchingShortCode[0]});
        return;
      }
    },

    report: function(code) {
      var reportView = new ReportView({code: code, model: this.appModel.get('stop')});
      this.app.main.show(reportView);

      if (this.appModel.get('stop').get('code') != code
         && this.appModel.get('stop').get('code_short') != code) {
        this.appModel.loadStop(code);
      }
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

    _onPositionError: function(error, msg) {
      Communicator.mediator.trigger('position:error', error.code);
      console.log('position error: '+error.code);
      console.log(msg);
    }
  });
  return controller;
});