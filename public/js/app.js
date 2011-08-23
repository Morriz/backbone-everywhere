var routers = require('./routers/index'),
    Backbone = require('./backbone-modified');

// some global stuff
ONSERVER = typeof runOnClient === 'undefined' ? true : false;
ONCLIENT = ! ONSERVER;


var startApp = function (backBoneOptions) {

    backBoneOptions = backBoneOptions || {};

    // register routers
    for ( var i in routers) {
        new routers[i]();
    }

    // start listening for path changes
    backBoneOptions.pushState = true;
    Backbone.history.start(backBoneOptions);
}

module.exports = startApp;