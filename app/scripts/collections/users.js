'use strict';
var Backbone = require('backbone');

var User = require('../models/user');


var UsersCollection = Backbone.Collection.extend({
  model: User,
  initialize: function(options) {
    this.code = options.code;
  },
  url: function() {
    return 'api/user/'+this.code;
  }
});

module.exports = UsersCollection;