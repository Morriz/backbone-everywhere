var sys = require('sys');
var _ = require('underscore');
var myRedis = require('backbone-redis');

var utils = {
  createMyRedisPacket: function (type, id, extKey, callback) {
    // options can also be just an id int
    return {
      model: {
        id: id
      },
      options: {
        type: type,
        extKey: extKey,
        success: callback
      }
    };
  }
};

var services = {
  users: {
    get: function (args, options, callback) {
      var packet = utils.createMyRedisPacket('users', args[0], null, callback);
      myRedis.read(null, packet);
    }
  },
  songs: {
    get: function (args, options, callback) {
      var packet = utils.createMyRedisPacket('songs', args[0], null, callback);
      myRedis.read(null, packet);
    }
  },
  tracks: {
    get: function (args, options, callback) {
      var packet = utils.createMyRedisPacket('tracks', args[0], null, callback);
      myRedis.read(null, packet);
    },
    getWithSong: function (args, options, callback) {
      var packet = utils.createMyRedisPacket('tracks', null, {
        songId: args[0]
      }, callback);
      myRedis.read(null, packet);
    }
  }
};

module.exports = services;