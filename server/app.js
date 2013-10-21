'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');
var baucis = require('baucis');
var http = require('http');
var mongoose = require('mongoose');

var config = require('./config');
var stopsApi = require('./controllers/stops.js');
var reportsApi = require('./controllers/reports.js');
var usersApi = require('./controllers/users.js');

// init express
var app = express();
app.use(express.bodyParser());

//mongoose.connect('mongodb://'+config.db_user+':'+config.db_passwd+'@localhost/'+config.db_name);
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

// public API
app.get('/api/stop/:code', stopsApi.show);
app.get('/api/stop/:lat/:lon', stopsApi.list);

app.post('/api/report', reportsApi.post);
app.get('/api/report/:code', reportsApi.list);

app.post('/api/user', usersApi.post);
app.get('/api/user/:code', usersApi.list);

// route index.html
app.get('/', function(req, res){
  res.sendfile( path.join( __dirname, '../app/index.html' ) );
});

// start server
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express App started!');
});