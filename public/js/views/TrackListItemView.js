var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('../backbone-modified');

module.exports = Backbone.View.extend({

    tagName: 'li',

    templateHtml: templates.tracklistItem,

    // The DOM events specific to an item.
    events: {
        'click .track-check': 'toggleActivated',
        'dblclick div.track-content': 'edit',
        'click span.track-destroy': 'remove',
        'keypress .track-input': 'updateOnEnter'
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

    // Render the contents of the track item.
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this._enrich();
        return this;
    },

    _enrich: function () {
        this.input = this.$('.track-input');
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

    // Close the "editing" mode, saving changes to the track.
    close: function () {
        this.model.save({
            title: this.input.val(),
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
