var routers = require('./routers/index');
var Backbone = require('./backbone-modified');

var startApp = function (backBoneOptions) {

  backBoneOptions = backBoneOptions || {};

  // register routers
  for (var i in routers) {
    new routers[i]();
  }

  // start listening for path changes
  backBoneOptions.pushState = true;
  Backbone.history.start(backBoneOptions);
}

module.exports = startApp;