var Backbone = require('../backbone-modified');

module.exports = Backbone.Model.extend({

  type: 'songs',

  indexProps: ['title', 'published'],

  extKeys: ['authorId', 'groupId', 'songId'],

  // Default attributes for the song.
  defaults: {
    title: 'empty title...',
    published: false,
    authorId: null,
    groupId: 1
  },

  relations: [
    {
      type: '',// Backbone.HasMany,
      key: 'tracks',
      relatedModel: 'TrackModel',
      collectionType: 'TrackCollection'
    },
    {
      type: '',// Backbone.HasMany,
      key: 'authors',
      relatedModel: 'UserModel',
      collectionType: 'UserCollection'
    }
  ],

  initialize: function () {
    // too bad bb events won't accepts an array of event names:
    this.bind('remove', this._removeView, this);
    this.bind('destroy', this._removeView, this);
  },

  // Toggle the 'published' state of this song item.
  toggle: function () {
    this.save({
      published: !this.get('published')
    });
  },

  _removeView: function () {
    if (this.view) this.view.remove();
  }
});
