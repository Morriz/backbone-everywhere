var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('../backbone-modified');
var TrackListView = require('./TrackListView');

module.exports = Backbone.View.extend({

    el: '#song-view',

    templateHtml: templates.song,

    subViews: {},

    // The DOM events specific to an item.
    events: {
        'dblclick div.content': 'edit',
        'click span.destroy': 'clear'
        //'keypress .input': 'updateOnEnter'
    },

    // The SongView listens for changes to its model, re-rendering. Since
    // there's a one-to-one correspondence between a **Song** and a **SongView**
    // in this
    // app, we set a direct reference on the model for convenience.
    initialize: function () {
      this.initModel();
      this.$el.html(this.template(this.model.toJSON()));
      this._enrich();
      this.initTracksView();
      this.trigger('attach');
    },

    initModel: function (model) {
      if (model === this.model) return this;
      this.model = model || this.model;
      this.model.bind('change', this.render, this);
      this.model.view = this;
      this.render();
    },

    initTracksView: function () {
      this.subViews.trackList = new TrackListView({
        el: '.tracklist-subview',
        collection: this.model.get('tracks')
      });
    },

    // Re-render the contents of the song item.
    render: function () {
      _.each(this.model.toJSON(), _.bind(function(val, prop) {
        var isBool = _.isBoolean(val);
        if (!isBool && val && typeof val === 'object') return;
        if (isBool) {
          val = val ? 'yes' : 'no';
        }
        this.$('span.'+prop).html(val);
        this.$('input.'+prop).val(val);
      }, this));
      return this;
    },

    _enrich: function () {
      this.input = this.$('.song-input');
      this.input.bind('blur', _.bind(this.close, this));
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
      this.$el.remove();
    },

    // clear the model.
    clear: function () {
      this.model.clear();
    }

});
