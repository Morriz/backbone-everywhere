var sys = require('sys');
var myRedis = require('backbone-redis');

var utils = {
  createMyRedisPacket: function (type, conditions, callback) {
    var hasConditions = !_.isNumber(conditions);
    return {
      model: {
        id: !hasConditions ? conditions : null,
        type: type
      },
      options: {
        conditions: hasConditions ? conditions : null,
        success: callback
      }
    };
  }
};

var services = {
  users: {
    get: function (args, options, callback) {
      var packet = utils.createMyRedisPacket('users', args.id, callback);
      myRedis.read(packet);
    }
  },
  songs: {
    get: function (args, options, callback) {
      var packet = utils.createMyRedisPacket('songs', args.id, callback);
      myRedis.read(packet);
    }
  },
  sounds: {
    get: function (args, options, callback) {
      var packet = utils.createMyRedisPacket('tracks', args.id, callback);
      myRedis.read(packet);
    },
    getWithSong: function (args, options, callback) {
      var packet = utils.createMyRedisPacket('tracks', {
        songId: args.id
      }, callback);
      myRedis.read(packet);
    }
  }
};

module.exports = services;