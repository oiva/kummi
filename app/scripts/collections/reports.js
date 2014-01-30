require('backbone');

var Report = require('../models/report');


var ReportsCollection = Backbone.Collection.extend({
  model: Report,
  initialize: function(options) {
    this.code = options.code;
  },
  url: function() {
    return 'api/report/'+this.code;
  }
});

module.exports = ReportsCollection;