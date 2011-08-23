// make templates global because the views expect it 
templates = require('templates');

// disable server funcs
ifServerSendFullHtmlToClient = function(){};

// setup backbone redis
var Sync = require('./backbone.redis');
//var io = require('socket.io');
var socket = io.connect('http://singalong.dev');
Sync.config({
    io: socket
});

// and kick off
var app = require('./app');
$(document).ready(app);
