require('backbone.marionette');

var Template = require('../../../templates/stop/reportsEmpty.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    template: Template,
    tagName: 'li'
});