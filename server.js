var express = require('express');
var fs = require('fs');
var app = require('express')();

// set static folder
// app.use(express.static(__dirname + '/client')); // tbd

// view engine
app.set('view engine', 'html');
app.engine('html', function (path, options, callback) {
    fs.readFile(path, 'utf-8', callback);
});

// routes
app.get('/', function (req, res) {
    res.send('hello from the other side');
})

app.use(function (err, req, res, next) { res.status(err.status || 500); });
app.listen(process.env.PORT || 5000);
