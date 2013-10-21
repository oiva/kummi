var User = require('../models/user');

exports.post = function(req, res) {
  var data = {
    email: req.body.email,
    code: req.body.code
  };

  var user = new User(data).save(function(err, user) {
    res.send(user);
  });
}

exports.list = function(req, res) {
  User.find({code: req.params.code}, function(err, users) {
    res.send(users);
  });
}

exports.show = function(req, res) {
  User.findOne({code: req.params.code}, function(error, user) {
    res.send(user);
  });
}