define([
  'backbone'
],

function(Backbone) {
  return Backbone.Model.extend({
    defaults: {
      x: 0,
      y: 0,
      dist: null,
      code: null,
      name: null,
      city: null,
      coords: null,
      codeShort: null,
      address: null
    },
    reportOK: function() {
      console.log('stop '+this.get('code')+' is OK');
    }
  });
});