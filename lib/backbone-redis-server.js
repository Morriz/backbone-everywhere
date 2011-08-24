var _ = require('underscore');
var Sync = require('backbone-redis');

// Error and debug settings
var showError = false,
  showDebug = false;

// Simple error helper messages
function errorMessage(err, packet) {
  if (!showError) return;
  console.error('Error!', err);
  console.trace();
  return this;
};

// ###debugMessage
// Simple debug helper messages
function debugMessage(msg, packet) {
  if (!showDebug) return;
  packet.options || (packet.options = {});
  console.log('Debug: Method: ' + packet.options.method + 'Msg: ', msg);
  return this;
}

var myRedis = {

  read: function (packet, options) {
    var model = packet.model,
      options = options || packet.options,
      type = model.type;

    // Check to see if a specific model was requested based on 'id',
    // otherwise search the collection with the given parameters
    if (model.id) {
      redisClient.get(model.id, function (err, doc) {
        if (err) {
          errorMessage(err, packet);
          options.error(err);
          return;
        }
        if (!doc) {
          debugMessage('get', packet);
        }
        options.success(JSON.parse(doc));
      });
      return;
    }
    redisClient.smembers(type, function (err, list) {
      if (err) {
        errorMessage(err, packet);
        options.error(err);
        return;
      }
      if (list.length == 0) {
        options.success([]);
        return debugMessage('smembers', packet);
      }

      redisClient.mget(list, function (err, result) {
        if (err) {
          errorMessage(err, packet);
          options.error(err);
          return;
        }
        if (!result) {
          errorMessage('no collection items found for list: ' + JSON.stringify(list));
          return debugMessage('mget', packet);
        }

        // Send client the model data
        var collection = _.map(result, function (record) {
          return JSON.parse(record);
        });
        options.success(collection);
      });
    });
  },
  
  create: function(packet, options) {
    return Sync.create(null, packet, options);
  },
  
  update: function(packet, options) {
    return Sync.update(null, packet, options);
    
  },
  
  delete: function(packet, options) {
    return Sync.delete(null, packet, options);
  },
  
}
module.exports = myRedis;