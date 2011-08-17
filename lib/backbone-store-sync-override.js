// Override `Backbone.sync` to use delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
var sync = function(method, model, options) {

  var resp;
  // we can find our store somewhere for sure
  var store = model.localStorage || model.collection.localStorage || model.collection.prototype.localStorage;
  if (! store instanceof Store) {
      // not instantiated yet
      store = new Store(store);
      // and set back on object
      (model.localStorage && (model.localStorage = store)) || 
      (model.collection.localStorage && (model.collection.localStorage = store)); 
  }

  switch (method) {
    case "read":    resp = model.id ? store.find(model) : store.findAll(); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};

module.exports = sync;
