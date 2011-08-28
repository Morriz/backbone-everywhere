var _ = require('underscore');
var Backbone = require('backbone');

// Add `route()` method for handling normally linked paths into hash paths.
// Because IE7 provides an absolute URL for `attr('href')`, regex out the
// internal path and use it as the fragment. Return false for any paths that
// only contain a hash, IE7 would refresh otherwise.
// NOTE: This file is included explicitly in index.js to ensure it is loaded
// before all other views.
var view = Backbone.View;
view.prototype.events = {
  'click a.noscroll': 'routeClickNoScroll',
  'click a:not(.noscroll)': 'routeClick'
};

// Routes a click event without scrolling to top
// ---------------------------------------------
view.prototype.routeClickNoScroll = function(ev) {
  return this.routeClick(ev, true);
};

// Routes a click event
// --------------------
view.prototype.routeClick = function(ev, noscroll) {
  if (_.size(window.currentKeys)) {
    return true;
  }
  var href = this.normalizeHREF($(ev.currentTarget).get(0).getAttribute('href', 2));
  if (href) {
    return this.route(href, noscroll);
  }
  return true;
};

// Finds out what's been clicked. Hard, thanks to IE :|
// ----------------------------------------------------
view.prototype.normalizeHREF = function(href) {
  var docMode = document.documentMode;
  var oldIE = ($.browser.msie && (!docMode || docMode <= 7));

  if (oldIE) {
    var url = /^https?:\/\/([^/]+)(\/.*)$/.exec(href);

    if (!url || url < 3) {
      // This isn't a web address, bail.
      return false;
    }

    var href = url.pop(),
      domain = url.pop();

    if (window.location.host != domain) {
      return false;
    }

    if (href.indexOf('/#') === 0) {
      href = href.substr(1);
    }
  }
  return href;
};

// Routes a path
// -------------
view.prototype.route = function(path, noscroll) {
  if (path === '#' || path === '/#!') {
    return false;
  }
  var that = this;
  if (path.charAt(0) === '/') {
    // remove slash at front to still match our routers
    path = path.substr(1);
    var matched = _.any(Backbone.history.handlers, function(handler) {
      if (handler.route.test(path)) {
        Backbone.history.navigate(path);
        noscroll || that.scrollTop();
        handler.callback(path);
        return true;
      }
    });
    return !matched;
  }
  return true;
};

// Scroll top FF, IE, Chrome safe
// ------------------------------
view.prototype.scrollTop = function() {
  if ($('body').scrollTop()) {
    $('body').animate({scrollTop: 0});
    return;
  }
  if ($('html').scrollTop()) {
    $('html').animate({scrollTop: 0});
    return;
  }
};

module.exports = Backbone.View;