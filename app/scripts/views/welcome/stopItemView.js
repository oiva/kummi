require('backbone.marionette');

var Template = require('../../../templates/welcome/stopItem.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    template: Template,
    tagName: 'li'
});