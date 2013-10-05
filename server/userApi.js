var User = require('./models/user.js');

exports.post = function(data) {
  var report = new User(data).save(function(err, doc) {
    console.log('error',err);
    console.log('doc', doc);
  });
}

exports.list = function(req, res) {
  User.find({code: req.params.code}, function(err, users) {
    res.send(users);
  });
}

exports.show = function(req, res) {
  User.findOne({code: req.params.code}, function(error, report) {
    res.send(report);
  });
}