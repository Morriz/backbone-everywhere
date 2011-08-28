var Backbone = require('../backbone-modified');

module.exports = Backbone.Model.extend({

  type: 'tracks',

  indexProps: ['title', 'published'],

  extKeys: ['authorId', 'groupId', 'songId'],

  // Default attributes for the track.
  defaults: {
    title: "empty title...",
    author: 'john doe',
    source: '/sample.aac',
    published: false,
    authorId: 1,
    groupId: null
  },

  initialize: function () {
    // too bad bb events won't accepts an array of event names:
    this.bind('remove', this._removeView, this);
    this.bind('destroy', this._removeView, this);
  },

  // Toggle the `published` state of this track.
  toggle: function () {
    this.save({
      published: !this.get("published")
    });
  },

  _removeView: function () {
    if (this.view) this.view.remove();
  },
});
