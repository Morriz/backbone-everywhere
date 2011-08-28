var _ = require('underscore');
var views = require('../views/index');
var models = require('../models/index');
var Backbone = require('../backbone-modified');
var bv = Backbone.View;

module.exports = Backbone.Router.extend({
  routes: {
    ''                                        : 'songList',
    'songs'                                   : 'songList',
    'songs/by/:orderBy/dir/:dir/limit/:limit' : 'songList',
    'songs/by/:orderBy/dir/:dir'              : 'songList',
    'songs/by/:orderBy'                       : 'songList',
    'songs/:id'                               : 'song',
  },

  songList: function (orderBy, dir, limit) {
    if (this.songListView) {
      var hasSongCollection = true;
      var songCollection = this.songListView.collection;
    } else {
      var hasSongCollection = false;
      var songCollection = new models.SongCollection();
      songCollection.subscribe();
    }
    if (!this.songListView) {
      this.songListView = new views.SongList({
        collection: songCollection
      });
      bv.registerLayout(this.songListView);
    }
    // now do some lookups
    songCollection.fetch({
      sort: {
        by: orderBy,
        dir: dir || 'asc',
        limit: limit
      },
      success: bv.getViewFunc(this.songListView)
    });
  },

  song: function (id) {
    // did we come from our list view?
    if (this.songListView) {
      // get song model from list
      var song = this.songListView.collection.get(id);
    }
    if (!song) {
      var songLoaded = false;
      // create model with id
      var song = new models.Song({
        id: id
      });
    } else {
      var songLoaded = true;
    }
    // subscription stuff:
    // subscribe to new song's updates
    if (!this.songView || this.songView.model.id != id) {
      song.subscribe();
    }
    // unsubscribe from previous song
    if (this.songView && this.songView.model.id != id) {
      this.songView.model.unsubscribe();
    }
    if (!song.tracks) {
      // try to get the bootstrapped collection
      var tracks = this.songView ? this.songView.subViews.trackList.collection
        : new models.TrackCollection;
      tracks.subscribe();
      // set external key relation
      tracks.extKey = {
        songId: song.id
      };
      song.set({
        tracks: tracks
      });
    }
    // create view
    if (!this.songView) {
      this.songView = new views.Song({
        model: song
      });
      bv.registerLayout(this.songView);
    } else if (song !== this.songView.model) {
      this.songView.initModel(song);
    }
    var loadTracks = _.bind(function () {
      tracks.fetch({
        extKey: {
          songId: song.id
        },
        success: bv.getViewFunc(this.songView)
      });
    }, this);
    // show view
    if (songLoaded) {
      // load up song tracks
      loadTracks();
    } else {
      // get from server first
      song.fetch({
        success: _.bind(loadTracks, this)
      });
    }
  }
});
