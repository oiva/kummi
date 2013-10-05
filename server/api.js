var Report = require('./models/report.js');

exports.post = function(req, res) {
  new Report({
    description: req.body.description,
    service_code: req.body.service_code,
    lat: req.body.lat,
    lon: req.body.lon,
    code: req.body.code
  }).save();
}

exports.list = function(req, res) {
  Report.find(function(err, reports) {
    res.send(reports);
  });
}

exports.show = function(req, res) {
  Report.findOne({code: req.params.code}, function(error, report) {
    res.send(report);
  });
}