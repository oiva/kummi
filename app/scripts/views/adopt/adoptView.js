require('backbone.marionette');

var Template = require('../../../templates/adopt/adopt.hbs');

var AdoptView = Backbone.Marionette.ItemView.extend({
  template: Template,
  id: 'adopt',
  ui: {
    'firstName': '#firstname',
    'lastName': '#lastname',
    'email': '#email'
  },
  events: {
    'submit #adopt-form': 'submitAdopt',
    'keyup .form-control': 'onInputKeyup',
  },
  tempValues: {
    'firstname': '',
    'lastname': '',
    'email': ''
  },
  initialize: function(options) {
    console.log('init adopt view', options);
    this.options = options;
    this.listenTo(this.model, 'change:name_fi', this.render);
  },
  serializeData: function() {
    var context = {};
    if (this.model === null) {
      return context;
    }

    context = this.model.toJSON();
    if ((context.name === null || typeof context.name === 'undefined') && context.name_fi !== null) {
      context.name = context.name_fi;
      context.address = context.address_fi;
      context.city = context.city_fi;
    }

    context = _.extend(context, this.tempValues);
    return context;
  },
  submitAdopt: function() {
    var data = {
      fistName: this.ui.fistName.val(),
      lastName: this.ui.lastName.val(),
      email: this.ui.email.val(),
      stop: this.options.code
    };
    console.log(data);
    return false;
  },
  onInputKeyup: function(event) {
    var input = $(event.currentTarget);
    this.tempValues[input.attr('id')] = input.val();
    return;
  }
});

module.exports = AdoptView;