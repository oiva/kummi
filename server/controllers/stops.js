var http = require('http');
var cache_manager = require('cache-manager');
var Q = require('q');

var cache = cache_manager.caching({store: 'memory', max: 1000, ttl: 86400/*seconds*/});

var config = require('../config');
var Stop = require('../models/stop');
var wgs84tokkj = require('../libs/wgs84tokkj');

exports.list = function(req, res) {
  var lon = req.params.lon,
      lat = req.params.lat;

  var position = wgs84tokkj.WGS84lalo_to_KKJxy(lat, lon);
  var pos = Math.round(position[1])+','+Math.round(position[0]);
  var cache_key = pos.replace(',', '');

  console.log('stops: request for stops in '+cache_key);

  // check if results is in cache already
  cache.get(cache_key, function(err, value) {
    if (!err && value) {
      console.log('found stops from cache ('+cache_key+')');
      writeOutput(res, JSON.parse(value));
    } else {
      getStopsFromAPI(pos)
        .then(function(output) {
          // store results in cache
          cache.set(cache_key, JSON.stringify(output), function(err) {
            if (err) {
              console.log(err);
            }
            writeOutput(res, output);
          });
        },
        function(err) {
          res.send('error: ' + err.message);
        });
    }
  });
}

var getStopsFromAPI = function(pos) {
  console.log('getStopsFromAPI: '+pos);
  var path = '/hsl/prod/?request=stops_area&center_coordinate='+pos;
  path += '&user='+config.reittiopas.user+'&pass='+config.reittiopas.pass+'&radius=250';

  var options = {
    host: config.reittiopas.host,
    path: path
  };

  var deferred = Q.defer();

  var req = http.get(options, function(resp) {
    var output = '';

    resp.on('data', function (chunk) {
      output += chunk;
    });

    resp.on('end', function() {
      console.log('API call successful');
      deferred.resolve(output);
    });
  });

  req.on('error', function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

var writeOutput = function(res, output) {
  console.log('writeOutput');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(output);
  res.end();
};

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