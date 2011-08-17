var express = require('express');
var app = express.createServer();
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.listen(8080);
console.log('Listening on 8080');

app.get('/', function (req, res) {
    res.render('index.jade', { layout : false });
});

var browserify = require('browserify');
var bundle = browserify({
    entry : __dirname + '/js/main.js',
    base : __dirname + '/js',
    require : [ 'jade', 'deck', { jquery : 'jquery-browserify' } ]
});
app.use(bundle);

var fileify = require('fileify');
bundle.use(fileify('views', __dirname + '/views'));
