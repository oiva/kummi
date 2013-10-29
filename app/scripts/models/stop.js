define([
  'backbone',
  'collections/reports',
  'collections/users'
],

function(Backbone, ReportsCollection, UsersCollection) {
  'use strict';
  
  return Backbone.Model.extend({
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
      return null;
    },
    initialize: function() {
      var reports = new ReportsCollection({code: this.get('code')});
      var users = new UsersCollection({code: this.get('code')});

      this.set({reports: reports, users: users});
    },
    reportOK: function() {
      console.log('stop '+this.get('code')+' is OK');
    },
    getReports: function() {
      this.get('reports').fetch();
    },
    getUsers: function() {
      this.get('users').fetch();
    },
  });
});