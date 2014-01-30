require('backbone.marionette');

var Template = require('../../../templates/stop/reportItem.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    template: Template,
    tagName: 'li'
});