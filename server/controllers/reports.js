var Report = require('../models/report.js');

exports.post = function(data) {
  console.log('save data');
  console.log(data);
  delete(data.api_key);
  var report = new Report(data).save(function(err, doc) {
    console.log('error',err);
    console.log('doc', doc);
  });
}

exports.list = function(req, res) {
  Report.find({code: req.params.code}, function(err, reports) {
    res.send(reports);
  });
}

exports.show = function(req, res) {
  Report.findOne({code: req.params.code}, function(error, report) {
    res.send(report);
  });
}