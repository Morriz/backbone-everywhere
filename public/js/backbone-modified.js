var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');//-rel
var renderEngine = require('ejs');

var oldFetch = Backbone.Collection.prototype.fetch;
var newFetch = function (options) {
  options = options || {};
  // keep collection sorting stuff
  var sort = options.sort || null;
  sort && sort.by && (this.orderBy = sort.by);
  sort && sort.dir && (this.orderDir = sort.dir);
  sort && sort.limit && (this.limit = sort.limit.split('-'));
  // and give again
  options.sort = {
    by: this.orderBy,
    dir: this.orderDir,
    limit: this.limit
  };
  // and call parent
  return oldFetch.apply(this, [options]);
}
Backbone.Collection.prototype.fetch = newFetch;

_.extend(Backbone.Collection.prototype, {

  dateCreated: null, // is always set on server
  dateModified: null, // same
  orderBy: 'dateModified',
  orderDir: 'desc',
  
  // items are sorted by our sortBy value
  comparator: function (item) {
    // since 'this' doesn't reference our own scope we have
    // to resort to the linked collection to get our orderBy
    var orderBy = item.collection.orderBy || item.collection.prototype.orderBy;
    var dir = (item.collection.orderDir || item.collection.prototype.orderDir).toLowerCase();
    var val = item.get(orderBy);
    if (_.isBoolean(val)) {
      return val ? (dir === 'asc' ? 1 : -1) : 0;
    }
    if (_.isNumber(val)) {
      return dir === 'asc' ? val : -val;
    }
    // strings
    if (dir === 'asc') return val; // sorting works fine for asc
    // reverse string sort
    return String.fromCharCode.apply(String,
      _.map(val.split(''), function (c) {
          return 0xffff - c.charCodeAt();
      })
    );
  },

  // Prepare a model to be added to this collection
  _prepareModel: function(model, options) {
    if (!(model instanceof Backbone.Model)) {
      var attrs = model;
      model = new this.model(attrs, {collection: this});
      if (model.validate && !model._performValidation(attrs, options)) model = false;
    } else if (!model.collection) {
      model.collection = this;
    }
    // adding functionality to map collection's extKey on model
    if (this.extKey) {
      model.set(this.extKey);
    }
    return model;
  },
});

// pull in the href listeners to enable handling of link clicking
Backbone.View = require('./backbone-urlhandler');

// extend Backbone.View
var BackboneViewPrototype = Backbone.View.prototype;
BackboneViewExtend = Backbone.View.extend;

// save own properties
var ownProps = [];
for(var prop in Backbone.View) {
  var val = Backbone.View[prop];
  if (Backbone.View.hasOwnProperty(prop) || _.isFunction(val)) {
    ownProps[prop] = val;
  }
}

// override the contructor to first call _initialize before
// the public initialize
// @TODO: fix this dirty constructor hijack somehow?
Backbone.View = function (options) {
  this.cid = _.uniqueId('view');
  this._configure(options || {});
  this._ensureElement();
  // add in our special events
  this.events = this.events || {};
  _.extend(this.events, Backbone.View.prototype.events);
  this.delegateEvents();
  this._initialize.apply(this, arguments);
  this.initialize.apply(this, arguments);
};
// give back the old prototype and own properties and funcs
Backbone.View.prototype = BackboneViewPrototype;
_.extend(Backbone.View, ownProps);

// extend with some goodies
_.extend(Backbone.View.prototype, {
  renderEngine: renderEngine,
  _initialize: function (options) {
    if (this.templateHtml && !_.isFunction(this.template)) {
      this.template = this.renderEngine.compile(this.templateHtml);
    }
  },
  
  show: function () {
    this.$el.css('display', 'block');
  },
  
  hide: function () {
    this.$el.css('display', 'none');
  },

  // override to always use document context
  _ensureElement: function () {
    if (!this.el) {
      var attrs = this.attributes || {};
      if (this.id) attrs.id = this.id;
      if (this.className) attrs['class'] = this.className;
      this.el = this.make(this.tagName, attrs);
    } else if (_.isString(this.el)) {
      this.el = $(this.el, document).get(0);
    }
    // keep jquery element as well
    this.$el = $(this.el, document);
  }
});

// layouts (top level views) instances arrays
Backbone.View.layouts = [];

// register layouts
Backbone.View.registerLayout = function (layout) {
  Backbone.View.layouts.push(layout);
};

// creates wrapper that holds view function
Backbone.View.getViewFunc = function (view) {
  return function () {
    Backbone.View.onlyShowLayout(view);
    if (ONSERVER) {
      sendFullHtmlToClient();
    }
  };
};

// func to toggle layout visibility
Backbone.View.onlyShowLayout = function (layoutToShow) {
  $('.layout', document).not('.fixed').css('display', 'none');
  layoutToShow.show();
};

module.exports = Backbone;
