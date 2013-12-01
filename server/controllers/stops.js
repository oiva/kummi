var http = require('http');

var config = require('../config');
var Stop = require('../models/stop');
var wgs84tokkj = require('../libs/wgs84tokkj');

exports.list = function(req, res) {
  var lon = req.params.lon,
      lat = req.params.lat;

  var position = wgs84tokkj.WGS84lalo_to_KKJxy(lat, lon);
  var pos = Math.round(position[1])+','+Math.round(position[0]);

  var options = {
    host: config.reittiopas.host,
    path: '/hsl/prod/?request=stops_area&center_coordinate='+pos+'&user='+config.reittiopas.user+'&pass='+config.reittiopas.pass+'&radius=250'
  };

  var req = http.get(options, function(resp) {
    var output = '';

    resp.on('data', function (chunk) {
      output += chunk;
    });

    resp.on('end', function() {
      console.log('API call successful');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(output);
      res.end();
    });
  });

  req.on('error', function(err) {
    res.send('error: ' + err.message);
  });
}

exports.show = function(req, res) {
  var code = req.params.code
    , options;

  if (code.length <= 6) {
    options = {code_short: code};
  } else {
    options = {code: code};
  }
  Stop.findOne(options, function(error, stop) {
    if (error) {
      console.log(error);
    }
    if (stop) {
      res.send(stop);
      res.end();
      return;
    }

    // fetch stop from reittiopas API
    var options = {
      host: config.reittiopas.host,
      path: '/hsl/prod/?request=stop&code='+code+'&user='+config.reittiopas.user+'&pass='+config.reittiopas.pass
    };
    console.log(options.host+options.path);

    var req = http.get(options, function(resp) {
      var output = '';
      resp.on('data', function (chunk) {
        output += chunk;
      });
      resp.on('end', function() {
        console.log('API call successful');
        var stops = JSON.parse(output);
        
        if (stops.length == 0) {
          res.send(stops);
          res.end();
          return;
        }

        // store stop locally
        var newStop = Stop(stops[0]).save(function (error, stop) {
          res.send(stop);
          res.end();
        });
      });
    });
  });
}