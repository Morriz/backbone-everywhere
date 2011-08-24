var _ = require('underscore');
var views = require('../views/index');
var models = require('../models/index');
var Backbone = require('../backbone-modified');
var bv = Backbone.View;

module.exports = Backbone.Router.extend({
  routes: {
    '': 'songList',
    'songs': 'songList',
    'songs/:id': 'song'
  },

  songList: function () {
    if (!this.songListView) {
      var songCollection = new models.SongCollection;
      if (ONCLIENT) {
        // subscribe to updates
        songCollection.subscribe();
      }
      this.songListView = new views.SongList({
        collection: songCollection
      });
      songCollection.fetch({
        success: bv.getViewFunc(this.songListView)
      });
      bv.registerLayout(this.songListView);
    } else {
      bv.getViewFunc(this.songListView)();
    }
  },

  song: function (id) {
    // did we come from our list view?
    if (this.songListView) {
      var songLoaded = true;
      // get song model from list
      var song = this.songListView.collection.get(id);
    } else {
      var songLoaded = false;
      // create model with id
      var song = new models.Song({
        id: id
      });
    }
    // subscription stuff:
    if (ONCLIENT) {
      // subscribe to new song's updates
      if (!this.songView || this.songView.model.id != id) {
        song.subscribe();
      }
      // unsubscribe from previous song
      if (this.songView && this.songView.model.id != id) {
        this.songView.model.unsubscribe();
      }
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
    // show view
    if (songLoaded) {
      bv.getViewFunc(this.songView)();
    } else {
      // get from server first
      song.fetch({
        success: bv.getViewFunc(this.songView)
      });
    }
  }
});
