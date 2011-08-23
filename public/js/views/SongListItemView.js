var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('../backbone-modified');

module.exports = Backbone.View.extend({

    tagName: 'li',

    templateHtml: templates.songlistItem,

    // The DOM events specific to an item.
    events: {
        'click .check': 'toggleActivated',
        'dblclick div.song-content': 'edit',
        'click span.song-destroy': 'remove',
        'keypress .song-input': 'updateOnEnter'
    },

    // The SongView listens for changes to its model, re-rendering. Since
    // there's
    // a one-to-one correspondence between a **Song** and a **SongView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function () {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
        this.model.view = this;
    },

    // Reender the contents of the song item.
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this._enrich();
        return this;
    },

    _enrich: function () {
        this.input = this.$('.song-input');
        this.input.bind('blur', _.bind(this.close, this));
    },

    // Toggle the "published" state of the model.
    toggleActivated: function () {
        this.model.toggle();
    },

    // Switch this view into "editing" mode, displaying the input field.
    edit: function () {
        this.$el.addClass("editing");
        this.input.focus();
    },

    // Close the "editing" mode, saving changes to the song.
    close: function () {
        this.model.save({
            title: this.input.val()
        });
        this.$el.removeClass("editing");
    },

    // If you hit enter, we're through editing the item.
    updateOnEnter: function (e) {
        if (e.keyCode == 13) this.close();
    },

    // Remove this view from the DOM.
    remove: function () {
        this.model.destroy();
        this.$el.remove();
    },

    // Remove the item, destroy the model.
    clear: function () {
        this.model.clear();
    }
});
