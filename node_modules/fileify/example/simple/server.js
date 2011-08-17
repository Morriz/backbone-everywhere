var express = require('express');
var app = express.createServer();

app.use(express.static(__dirname));
app.listen(8080);
console.log('Listening on 8080');

var browserify = require('browserify');
var bundle = browserify({
    require : { jquery : 'jquery-browserify' }
});
app.use(bundle);

var fileify = require('fileify');
bundle.use(fileify('files', __dirname + '/files'));
