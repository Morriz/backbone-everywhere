var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('../backbone-modified');

module.exports = Backbone.View.extend({

  el: '#song-view',

  templateHtml: templates.song,

  // The DOM events specific to an item.
  events: {
    'dblclick div.song-content': 'edit',
    'click span.song-destroy': 'clear',
    'keypress .song-input': 'updateOnEnter'
  },

  // The SongView listens for changes to its model, re-rendering. Since
  // there's a one-to-one correspondence between a **Song** and a **SongView**
  // in this
  // app, we set a direct reference on the model for convenience.
  initialize: function () {
    this.initModel();
    this.trigger('attach');
  },

  initModel: function (model) {
    this.model = model || this.model;
    this.model.bind('change', this.render, this);
    this.model.view = this;
    this.render();
  },

  // Re-render the contents of the song item.
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    this._enrich();
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
