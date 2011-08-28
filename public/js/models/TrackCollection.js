var Backbone = require('../backbone-modified');
var TrackModel = require('./TrackModel');

module.exports = Backbone.Collection.extend({

  type: 'tracks',

  model: TrackModel,

  orderBy: 'title',

  // Filter down the list of all track items that are published.
  published: function () {
    return this.filter(function (track) {
      return track.get('published');
    });
  },

  // Filter down the list to only track items that are still not published.
  remaining: function () {
    return this.without.apply(this, this.published());
  },

  // We keep the tracks in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function () {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },
});
