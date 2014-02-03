'use strict';
var Marionette = require('backbone.marionette');

var AppModel = require('./models/appModel');
var AdoptView = require('./views/adopt/adoptView');
var WelcomeView = require('./views/welcomeView');
var StopView = require('./views/stopView');
var ReportView = require('./views/reportView');

var Controller = Marionette.Controller.extend({
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
    var options = {
      appModel: this.appModel
    };

    if (code.length <= 6) {
      options.code_short = code;
      this._stopWithShortCode(code);
    } else {
      options.code = code;
      this._stopWithLongCode(code);
    }

    var stopView = new StopView(options);
    this.app.main.show(stopView);
  },

  report: function(code) {
    var reportView = new ReportView({code: code, model: this.appModel.get('stop')});
    this.app.main.show(reportView);

    if (this.appModel.get('stop').get('code') !== code &&
      this.appModel.get('stop').get('code_short') !== code) {
      this.appModel.loadStop({code: code});
    }
  },

  adopt: function(code) {
    var adoptView = new AdoptView({code: code, model: this.appModel.get('stop')});
    this.app.main.show(adoptView);

    if (this.appModel.get('stop').get('code') !== code &&
      this.appModel.get('stop').get('code_short') !== code) {
      this.appModel.loadStop({code: code});
    }
  },

  _stopWithLongCode: function(code) {
    if (this.appModel.get('stop').get('code') !== code) {
      this.appModel.loadStop({code: code});
    }

    // check if stop exists in collection
    var matchingStops = this.appModel.get('stops').where({code: code});
    if (matchingStops.length > 0) {
      this.appModel.set({stop: matchingStops[0]});
      return;
    }
  },

  _stopWithShortCode: function(code_short) {
    if (this.appModel.get('stop').get('code_short') !== code_short) {
      this.appModel.loadStop({code_short: code_short});
    }
    var matchingShortCode = this.appModel.get('stops').where({code_short: code_short});
    if (matchingShortCode.length > 0) {
      this.appModel.set({stop: matchingShortCode[0]});
      return;
    }
  },

  _updatePosition: function() {
    var geolocationEnabled = 'geolocation' in navigator;
    if (!geolocationEnabled) {
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

module.exports = Controller;