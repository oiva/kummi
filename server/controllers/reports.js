var Open311 = require('open311');
var Q = require('q');
var config = require('../config');
var Stop = require('../models/stop');
var Report = require('../models/report');

var saveReport = function(data) {
  var deferred = Q.defer();
  var report = new Report(data).save(function(err, doc) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(doc);
    }
  });
  return deferred.promise;
};

var submitRequest = function(data) {
  var open311, options = {
    endpoint: config.open311.endpoint,
    apiKey: config.open311.api_key
  }, deferred = Q.defer();

  open311 = new Open311(options);
  open311.submitRequest(data, function(err, response) {
    console.log('err', err);
    console.log('response', response);

    if (err !== null) {
      if (response.indexOf(';') !== -1) {
        response = response.substring(response.indexOf(';') + 2);
      }
      deferred.reject(response);
    } else {
      deferred.resolve(response[0]);
    }
  });
  
  return deferred.promise;
};

exports.post = function(req, res){
  var data = {
    'service_code' : req.body.service_code,
    'lat': req.body.lat,
    'long': req.body.lon,
    'description': req.body.description,
    'email': req.body.email,
    'first_name': req.body.first_name,
    'last_name': req.body.last_name
  };

  Q.all([submitRequest(data), saveReport(data)])
   .then(function(results) {

    // add service request id to data
    results[1].service_request_id = results[0].service_request_id;

    // todo: add user who created this

    // reference the stop this report relates to
    Stop.findOrCreate({code: req.body.code}, function(err, stop) {
      results[1].stop = stop._id;
      results[1].save(function(err, doc) {
        res.write(JSON.stringify(doc));
        res.end();
      });
    });

  }, function(err) {
    console.log('promise failed');
    res.status(500);
    res.write('{"error": "'+err+'"}');
    re.end();
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