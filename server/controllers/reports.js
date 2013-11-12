var Open311 = require('open311');
var Q = require('q');
var config = require('../config');
var Report = require('../models/report');

var saveReport = function(data) {
  var deferred = Q.defer();
  var report = new Report(data).save(function(err, doc) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(doc);
    }
    console.log('error',err);
    console.log('doc', doc);
  });
  return deferred.promise;
};

exports.post = function(req, res){
  var options = {
    endpoint: config.open311.endpoint,
    apiKey: config.open311.api_key
  };
  var helsinki = new Open311(options);
  var data = {
    'service_code' : req.body.service_code,
    'lat': req.body.lat,
    'long': req.body.lon,
    'description': req.body.description,
    'email': req.body.email,
    'first_name': req.body.first_name,
    'last_name': req.body.last_name
  };
  console.log(data);

  helsinki.submitRequest(data, function(err, response) {
    console.log('err', err);
    console.log('response', response);

    if (err !== null) {
      if (response.indexOf(';') !== -1) {
        response = response.substring(response.indexOf(';'));
      }
      res.write('{"error": "'+response+'"}');
      res.end();
      return;
    }

    data.service_request_id = response.service_request_id;
    data.code = req.body.code;
    saveReport(data)
      .then(function(report) {
        res.write(report);
        res.end();
      });
  });
};

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