'use strict';
var Marionette = require('backbone.marionette');

var Template = require('../../../templates/welcome/search.hbs');


var SearchView = Marionette.ItemView.extend({
  template: Template,
  events: {
    'click #find-stop': 'findStop'
  },
  findStop: function() {
    var code = this.$('#stop-id').val();
    if (code === '') {
      return false;
    }
    appRouter.navigate('stop/'+code, {trigger: true});
    return false;
  }
});

module.exports = SearchView;