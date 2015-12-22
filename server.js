// import packages
var express = require('express');
var fs = require('fs');
var path = require('path');
var http = require('http');

// initialize app
var app = express();

// set static folder
app.use(express.static(__dirname + '/static'));

// configure to serve raw html files
app.set('view engine', 'html');
app.engine('html', function (path, options, callback) {
    fs.readFile(path, 'utf-8', callback);
});

// main route serves index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/static/index.html'));
});

// helper route fetches source HTML given URL as parameter
app.get('/source', function (req, res) {
    res.send('there\'s such a difference, between us, and a million miles');
});

// catch any other routes as errors
app.use(function (err, req, res, next) { res.status(err.status || 500); });

// start listening for requests
app.listen(process.env.PORT || 5000);
