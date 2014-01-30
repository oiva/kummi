require('backbone.marionette');
var Template = require('../../templates/infoTeaser.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    template: Template
});