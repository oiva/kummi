'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');
var baucis = require('baucis');
var http = require('http');
var config = require('./config');
var Promise = require('bluebird');
var wgs84tokkj = require('./wgs84tokkj');
var Open311 = require('open311');
var mongoose = require('mongoose');
var api = require('./api.js');

// init express
var app = express();

mongoose.connect('mongodb://localhost/'+config.db_name);

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
  };
  console.log(options.path);

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
});

app.post('/api/report', function(req, res){
  var options = {
    endpoint     : 'https://pate.affecto.com/restWAR/open311/v1/'
  };

  var helsinki = new Open311(options);

  var data = {
    'api_key': config.api_key,
    'service_code' : req.query.service_code,
    'lat': req.query.lat,
    'long': req.query.lon,
    'description': req.query.description
  };
  console.log(data);

  api.post(req, res);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"service_request_id": 0}');
  res.end();
}); 

app.get('/api/report/:code', api.show);
app.get('/api/report', api.list);

// route index.html
app.get('/', function(req, res){
  res.sendfile( path.join( __dirname, '../app/index.html' ) );
});


// start server
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express App started!');
});



