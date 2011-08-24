var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var renderEngine = require('ejs');

// pull in the href listeners to enable handling of link clicking
Backbone.View = require('./backbone-urlhandler');


// extend Backbone.View
var BackboneViewPrototype = Backbone.View.prototype;
BackboneViewExtend = Backbone.View.extend;

// override the contructor to first call _initialize before the public
// initialize
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
// give back the old prototype and extend method
Backbone.View.prototype = BackboneViewPrototype;
Backbone.View.extend = BackboneViewExtend;

// extend with some goodies
Backbone.View = Backbone.View.extend({
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
    $('.layout', document).css('display', 'none');
    layoutToShow.show();
};

//if (typeof Store == 'undefined') Store = require('./backbone-localstorage').Store;
//Backbone.sync = require('./backbone-localstorage').sync;

//and set to use redis storage through client socket
require('./backbone.redis');
Backbone.sync = _.sync;

module.exports = Backbone;
