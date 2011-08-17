var _ = require('underscore');
var views = require('../views/index');
var models = require('../models/index');
var Backbone = require('../backbone-modified');

module.exports = Backbone.Router.extend({
    routes: {
        '': 'songList',
        'songs': 'songList',
        'songs/:id': 'song'
    },

    songList: function () {
        if (!this.songListView) {
            var songCollection = new models.SongCollection;
            if (typeof runInClient !== 'undefined') {
                // subscribe to updates
                songCollection.subscribe();
            }
            this.songListView = new views.SongList({
                collection: songCollection
            });
            Backbone.View.registerLayout(this.songListView);
        }
        this.songListView.collection.fetch({
            success: _.bind(function(){
            	ifServerSendFullHtmlToClient();
            	Backbone.View.onlyShowLayout(this.songListView);
            }, this)
        });
        Backbone.View.onlyShowLayout(this.songListView);
    },

    song: function (id) {
        var song = new models.Song({
            id: id
        });
        if (typeof runInClient !== 'undefined') {
            // subscribe to updates
        	song.subscribe();
        }
        if (!this.songView) {
            this.songView = new views.Song({
                model: song
            });
            Backbone.View.registerLayout(this.songView);
        } else {
            // unsubscribe from previous model
            this.songView.model.unsubscribe();
            // and init with new
        	this.songView.initModel(song);
        }
        this.songView.model.fetch({
            success: _.bind(function(){
            	ifServerSendFullHtmlToClient();
            	Backbone.View.onlyShowLayout(this.songView);
            }, this)
        });
        Backbone.View.onlyShowLayout(this.songView);
    }
});
