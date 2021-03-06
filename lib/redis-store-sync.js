/**
 * Server only override for Backbone.sync, enabling us to directly talk to redis
 * without a socket.
 */

var Sync = require('backbone-redis');
var Backbone = require('backbone');

Backbone.sync = function (method, model, options) {

  if (typeof redisClient == 'undefined') {
    throw new Error("redis client must be configured!");
  }

  options || (options = {});
  options.channel = model.getChannel();
  options.type = model.type;
  options.indexProps = model.indexProps || (model.model && model.model.prototype.indexProps ? model.model.prototype.indexProps : []);
  options.extKeys = model.extKeys || (model.model && model.model.prototype.extKeys ? model.model.prototype.extKeys : []);
  if (typeof model == Backbone.Collection && model.extKey) {
    options.extKey = model.extKey;
  }

  var data = {
    model: model,
    options: options
  };

  switch (method) {
    // only reading will need to be overwritten, as it's the only method
    // writing it's result to a socket
    case "read":
      return Sync.read(null, data);
    // the rest we simply plug onto backbone-redis
    case "create":
      return Sync.create(null, data);
    case "update":
      return Sync.update(null, data);
    case "delete":
      return Sync.delete(null, data);
  }
  var err = 'method: ' + method + ' does not exist!';
  console.log(err);
  options.error && options.error(err);
};

module.exports = Backbone.sync;
