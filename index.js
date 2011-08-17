ROOT = __dirname + '/public/js/';
LIB = __dirname + '/lib/';

// setup application
var express = require('express'), sys = require('sys'), fs = require('fs'), redis = require('redis'), io = require('socket.io'), Sync = require('backbone-redis'), app = module.exports = express
        .createServer();

// init browserify bundle
var browserify = require('browserify');
var browserifyBundle = browserify({
    root: ROOT,
    ignore: [
        '../../lib/backbone-store-sync-override', 'socket.io', 'templates'
    ],
    require: [
        'jquery', 'underscore', 'backbone', 'ejs', './public/js/app', './public/js/clientonly'
    ]
});

// setup fileify
// bundle all our templates, and rebundle automatically if one of them has
// changed
var fileify = require('fileify'), fileified = fileify.register('templates', __dirname + '/public/js/templates', {
    extension: '.ejs',
    removeExtension: true,
    watch: false//true TODO: not working yet because of osx's limited file watching capabilities
});

// Configuration
app.configure(function () {
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: 'bladi'
    }));
    app.use(express.static(__dirname + '/public'));
    browserifyBundle.use(fileified);
    app.use(browserifyBundle);
    // put the main router last
    app.use(app.router);
});
// specific to development
app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});
// specific to production
app.configure('production', function () {
    app.use(express.errorHandler());
    browserify.use(require('uglify'));
});

// Configure Redis client
var redisOptions = {
    maxReconnectionAttempts: 10,
    parser: 'javascript',
    return_buffer: false
};
redisClient = redis.createClient(6379, '127.0.0.1', redisOptions);
var pub = redis.createClient(6379, '127.0.0.1', redisOptions);
var sub = redis.createClient(6379, '127.0.0.1', redisOptions);
var conn = io.listen(app);
Sync.config({
    io: conn,
    database: redisClient,
    publish: pub,
    subscribe: sub
});

// start listening
if (!module.parent) {
    app.listen(80);
    console.log("Express server listening on port %d", app.address().port);
}

/**
 * Routing
 */

// rpc
// var rpc = require('jsonrpc2');
// var services = require('./services');
// var server = new rpc.Server();
// server.exposeModules(services, services);
// app.post('/rpc', function (req, res) {
// server.handlePOST(req, res);
// });
// backbone
templates = fileify.files;
var ejs = require('ejs');

// everything else maps onto backbone routers
window = document = navigator = null;
var $, app;
app.get('*', function (req, res) {

    // setup our modified Backbone
    var Backbone = require(ROOT + 'backbone-modified');
    // modify the Backbone sync method to use redis
    Backbone.sync = require(LIB + 'redis-store-sync.js');
    // setup our window object for jquery rendering
    if (!window) {
        var jsdom = require("jsdom"), markup = fs.readFileSync('./public/layout.html');
        // override Store
        // Store = require(LIB + 'dirty-store');
        // setup document
        document = jsdom.jsdom(markup, null, {
            FetchExternalResources: false
        });
        // and it's window
        window = document.createWindow();
        // set more stuff that needs to be found in the global scope
        navigator = window.navigator;
        // set all environment vars necessary
        window.location.pathname = req.url;
        window.location.search = '';
        window.location.hash = '';

        // load up our app
        app = require(ROOT + "app");

        // and run
        app({
            silent: true
        });
    }
    
    ifServerSendFullHtmlToClient = function() {
        if (typeof runInClient !== 'undefined'){
            return;
        }
        var html = document.innerHTML;
        res.end(html);
        return;
    }

    // load url fragment directly
    Backbone.history.loadUrl(req.url.substr(1));

});