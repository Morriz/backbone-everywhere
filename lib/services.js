var sys = require('sys')
  , myRedis = require('./backbone-redis-server');

var utils = {
  createMyRedisPacket: function(type, id, callback) {
    return {
      model: {
        id: id,
        type: type
      },
      options: {
        success: callback
      }
    };
  }
};

var services = {
  users: {
    get: function(args, options, callback) {
      var packet = utils.createMyRedisPacket('users', args.id, callback);
      myRedis.read(packet);
    }
  },
  songs: {
    get: function(args, options, callback) {
      var packet = utils.createMyRedisPacket('songs', args.id, callback);
      myRedis.read(packet);
    }
  }
};

module.exports = services;