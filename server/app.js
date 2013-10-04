'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');
var baucis = require('baucis');
var http = require('http');
var config = require('./config');
//var xml2js = require('xml2js');
var Promise = require('bluebird');
var wgs84tokkj = require('./wgs84tokkj');

// init express
var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);

    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '../app/scripts/views');
});

// set logging
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

// mount static
app.use(express.static( path.join( __dirname, '../app') ));
app.use(express.static( path.join( __dirname, '../.tmp') ));

app.get('/api/stop', function(req, res){
  var code = req.query.code;

  var options = {
    host: 'api.reittiopas.fi',
    path: '/hsl/prod/?request=stop&code='+code+'&user='+config.user+'&pass='+config.pass
  };
  console.log(options.host+options.path);

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
});

app.get('/api/nearby', function(req, res){
  var lon = req.query.lon,
      lat = req.query.lat;

  var position = wgs84tokkj.WGS84lalo_to_KKJxy(
    lat,
    lon
  );
  var pos = Math.round(position[1])+','+Math.round(position[0]);

  var options = {
    host: 'api.reittiopas.fi',
    path: '/hsl/prod/?request=stops_area&center_coordinate='+pos+'&user='+config.user+'&pass='+config.pass+'&radius=250'
    //path: '/public-ytv/fi/api/?closest_stops=1&lon='+lon+'&lat='+lat+'&user='+config.user+'&pass='+config.pass+'&radius=250'
  };
  console.log(options.path);

  var req = http.get(options, function(resp) {
    var output = '';

    resp.on('data', function (chunk) {
      output += chunk;
    });

    resp.on('end', function() {
      console.log('API call successful');
      /*
      var parseOptions = {
        trim: true,
        normalizeTags: true,
        explicitRoot: false,
        mergeAttrs: true
      };
      var parser = new xml2js.Parser(parseOptions);
      console.log('parser created');
      console.log(output);
      */
      //parser.parseString(output, function(err, result) {
        //console.log('XML parsed');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        //res.write(JSON.stringify(result));
        res.write(output);
        res.end();
      //});
    });
  });

  req.on('error', function(err) {
    res.send('error: ' + err.message);
  });
});

app.get('/api/stop/:id', function(req, res){

}); 

// route index.html
app.get('/', function(req, res){
  res.sendfile( path.join( __dirname, '../app/index.html' ) );
});


// start server
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express App started!');
});



