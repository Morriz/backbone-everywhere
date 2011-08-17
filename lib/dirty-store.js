var _ = require('underscore')._;
var dirty = require('dirty');

// A simple Store module that uses node-dirty for
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *dirty*. Create it
// with a meaningful name, like the name you'd give a table.
var Store = function(name) {
  this.name = name;
  this.db = dirty(name);
};

_.extend(Store.prototype, {

  // Save the current state of the **Store** to *dirty*.
  save: function(model) {
      this.db.set(model.id, model);
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    model = model || {};
    if (!model.id) model.id = guid();
    model.attributes && (model.attributes.id = model.id);
//    this.save(model);
    return model;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    this.save(model);
    return model;
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
      var result;
      this.db.forEach(function(key, val){
          if (val.id == model.id) {
              result = val;
              return false;
          }
      });
      return result;
  },

  // Return the array of all models currently in storage.
  findAll: function() {
      var all = {};
      this.db.forEach(function(key, val){
          all[key] = val;
      });
      return _.values(all);
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    this.db.rm(model.id);
    return model;
  }
});

module.exports = Store;