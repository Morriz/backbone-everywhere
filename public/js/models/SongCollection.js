var Backbone = require('../backbone-modified');
var SongModel = require('./SongModel');

module.exports = Backbone.Collection.extend({

  type: 'songs',

  model: SongModel,

  orderBy: 'title',

  // Filter down the list of all song items that are published.
  published: function () {
    return this.filter(function (song) {
      return song.get('published');
    });
  },

  // Filter down the list to only song items that are still not published.
  remaining: function () {
    return this.without.apply(this, this.published());
  },

  // We keep the songs in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function () {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },
});
