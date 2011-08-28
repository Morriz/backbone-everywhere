var _ = require('underscore');
var views = require('../views/index');
var models = require('../models/index');
var Backbone = require('../backbone-modified');
var bv = Backbone.View;

module.exports = Backbone.Router.extend({
  routes: {
    'tracks'                                   : 'trackList',
    'tracks/by/:orderBy/dir/:dir/limit/:limit' : 'trackList',
    'tracks/by/:orderBy/dir/:dir'              : 'trackList',
    'tracks/by/:orderBy'                       : 'trackList',
    'tracks/:id'                               : 'track',
  },

  trackList: function (orderBy, dir, limit) {
    if (!this.trackListView) {
      var trackCollection = new models.TrackCollection;
      // subscribe to updates
      trackCollection.subscribe();
      this.trackListView = new views.TrackList({
        collection: trackCollection
      });
      bv.registerLayout(this.trackListView);
      trackCollection.fetch({
        sort: {
          by: orderBy,
          dir: dir || 'asc',
          limit: limit
        },
        success: bv.getViewFunc(this.trackListView)
      });
    } else {
      bv.getViewFunc(this.trackListView)();
    }
  },

  track: function (id) {
    // did we come from our list view?
    if (this.trackListView) {
      // get track model from list
      var track = this.trackListView.collection.get(id);
    }
    if (!track) {
      var trackLoaded = false;
      // create model with id
      var track = new models.Track({
        id: id
      });
    } else {
      var trackLoaded = true;
    }
    // subscription stuff:
    // subscribe to new track's updates
    if (!this.trackView || this.trackView.model.id != id) {
      track.subscribe();
    }
    // unsubscribe from previous track
    if (this.trackView && this.trackView.model.id != id) {
      this.trackView.model.unsubscribe();
    }
    // create view
    if (!this.trackView) {
      this.trackView = new views.Track({
        model: track
      });
      bv.registerLayout(this.trackView);
    } else if (track !== this.trackView.model) {
      this.trackView.initModel(track);
    }
    // show view
    if (trackLoaded) {
      // show view
      bv.getViewFunc(this.trackView)()
    } else {
      // get from server first
      track.fetch({
        success: _.bind(bv.getViewFunc(this.trackView), this)
      });
    }
  }
});
