require('backbone');

var UserModel = Backbone.Model.extend({
    url: '/api/user',
    defaults: {
      email: null,
      code: null
    }
});

module.exports = UserModel;