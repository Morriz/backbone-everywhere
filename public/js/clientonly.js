// make templates global because the views expect it 
templates = require('templates');

ONSERVER = false;
ONCLIENT = ! ONSERVER;

// disable server funcs
ifServerSendFullHtmlToClient = function(){};

// setup backbone redis
var Sync = require('./backbone.redis');
var socket = io.connect();
Sync.config({
    io: socket
});

// and kick off
var app = require('./app');
$(document).ready(app);
