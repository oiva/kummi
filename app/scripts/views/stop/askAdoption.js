'use strict';
var Marionette = require('backbone.marionette');

var Template = require('../../../templates/stop/askAdoption.hbs');

var AskAdoptionView = Marionette.ItemView.extend({
  template: Template,
  events: {
    'click #adopt-stop': 'adoptStop'
  },
  initialize: function() {
    this.listenTo(this.model, 'change:code', this.render);
  },
  adoptStop: function() {
    appRouter.navigate('adopt/'+this.model.get('code'), {trigger: true});
    return false;
  },
  serializeData: function() {
    var context = this.model.toJSON();
    context.showButton = context.code !== null;
    console.log(context);
    return context;
  }
});

module.exports = AskAdoptionView;