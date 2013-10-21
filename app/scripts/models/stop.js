define([
  'backbone'
],

function(Backbone) {
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
      address_sv: null
    },
    reportOK: function() {
      console.log('stop '+this.get('code')+' is OK');
    }
  });
});