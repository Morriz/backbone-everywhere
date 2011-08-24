/**
 * Server only override for Backbone.sync, enabling us to directly talk to redis
 * without a socket.
 */

var Backbone = require('backbone');
var myRedis = require('./backbone-redis-server');

var sync = function (method, model, options) {

  if (typeof redisClient == 'undefined') {
    throw new Error("redis client must be configured!");
  }
  
  options     || (options = {});
  options.channel = model.getChannel();
  options.type  = model.type;

  var data = {
    model: model,
    options: options
  };
  
  switch (method)
  {
    // only reading will need to be overwritten, as it's the only method
    // writing it's result to a socket
    case "read":
      return myRedis.read(data, options);
    // the rest we simply plug onto backbone-redis
    case "create":
      return myRedis.create(data, options.success);
    case "update":
      return myRedis.update(data, options.success);
    case "delete":
      return myRedis.delete(data, options.success);
  }
  var err = 'method: ' + method + ' does not exist!';
  console.log(err);
  options.error && options.error(err);
};

module.exports = sync;
