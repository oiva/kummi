require('backbone');

var ReportsCollection = require('../collections/reports');
var UsersCollection = require('../collections/users');


var StopModel = Backbone.Model.extend({
  defaults: {
    x: 0,
    y: 0,
    dist: null,
    code: null,
    name_fi: null,
    name_sv: null,
    city_fi: null,
    city_sv: null,
    coords: null,
    code_short: null,
    address_fi: null,
    address_sv: null,
    reports: null,
    users: null
  },
  url: function() {
    if (typeof this.get('code') !== undefined && this.get('code') !== null) {
      return 'api/stop/'+this.get('code');
    }
    if (typeof this.get('code_short') !== undefined && this.get('code_short') !== null) {
      return 'api/stop/'+this.get('code_short');
    }
    return null;
  },
  initialize: function() {
    var reports = new ReportsCollection({code: this.get('code')});
    var users = new UsersCollection({code: this.get('code')});
    this.set({reports: reports, users: users});

    this.listenTo(this, 'change:code', _.bind(this.onCodeChange, this));
  },
  onCodeChange: function(model, code) {
    console.log('stop code changed to '+code);
    var reports = new ReportsCollection({code: code});
    var users = new UsersCollection({code: code});
    this.set({reports: reports, users: users});
  },
  reportOK: function() {
    console.log('stop '+this.get('code')+' is OK');
  },
  getReports: function() {
    console.log('stop: get reports');
    if (this.get('code') !== null) {
      this.get('reports').fetch();
    }
  },
  getUsers: function() {
    console.log('stop: get users');
    if (this.get('code') !== null) {
      this.get('users').fetch();
    }
  },
});

module.exports = StopModel;