// make templates global because the views expect it 
templates = require('templates');

// set some client stuff
runInClient = true;
ifServerSendFullHtmlToClient = function(){};

// setup backbone redis
var Sync = require('./backbone.redis');
//var io = require('socket.io');
var socket = io.connect();
Sync.config({
    io: socket
});

// and kick off
var app = require('./app');
$(document).ready(app);
