'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');
var baucis = require('baucis');
var http = require('http');
var config = require('./config');
var xml2js = require('xml2js');
var Promise = require('bluebird');

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

app.get('/api/nearby', function(req, res){
  var lon = req.query.lon,
      lat = req.query.lat;

  var options = {
    host: 'api.reittiopas.fi',
    path: '/public-ytv/fi/api/?closest_stops=1&lon='+lon+'&lat='+lat+'&user='+config.user+'&pass='+config.pass+'&radius=250'
  };
  console.log(options.path);

  var req = http.get(options, function(resp) {
    var output = '';

    resp.on('data', function (chunk) {
      output += chunk;
    });

    resp.on('end', function() {
      console.log('API call successful');
      var parseOptions = {
        trim: true,
        normalizeTags: true,
        explicitRoot: false,
        mergeAttrs: true
      };
      var parser = new xml2js.Parser(parseOptions);
      console.log('parser created');
      
      parser.parseString(output, function(err, result) {
        console.log('XML parsed');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(JSON.stringify(result));
        res.end();
      });
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



