var Backbone = require('../backbone-modified');
var SongCollection = require('./SongCollection');

module.exports = Backbone.Model.extend({

    type: 'songs',
    
    collection: new SongCollection,
    
    storage: 'SongModel',
    
    // Default attributes for the song.
    defaults: {
        title: "empty title...",
        published: false
    },

    initialize: function () {
        // Ensure that each song created has a title
        if (!this.get("title")) {
            this.set({
                "title": this.defaults.title
            });
        }
        // too bad bb events won't accepts an array of event names:
        this.bind('remove', this._removeView, this);
        this.bind('destroy', this._removeView, this);
    },

    // Toggle the `published` state of this song item.
    toggle: function () {
        this.save({
            published: !this.get("published")
        });
    },
    
    _removeView: function () {
        if (this.view) this.view.remove();
    }
});
