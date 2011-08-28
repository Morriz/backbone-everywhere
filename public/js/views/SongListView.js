var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('../backbone-modified');

module.exports = Backbone.View.extend({

  el: '#songlist-view',

  templateHtml: templates.songlist,

  statsTemplateHtml: templates.songlistStats,

  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress .song-new': 'createOnEnter',
    'keyup .song-new': 'showTooltip',
    'click .song.clear a': 'clearCompleted'
  },

  // At initialization we bind to the relevant events on the SongList
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting songCollection that might be saved in *localStorage*.
  initialize: function () {
    // setup our stats template
    this.statsTemplate = this.renderEngine.compile(this.statsTemplateHtml);
    // render our top level node
    var thisHtml = this.template(this.templateHtml);
    this.$el.html(thisHtml);
    // now clear dummy songs
    this.$('.songlist').html('');
    // and dummy stats
    this.$('.songlist-stats').html('');
    // setup our input
    this.input = this.$('.song-new');
    // attach handlers
    this.collection.bind('add', this.addOne, this);
    this.collection.bind('reset', this.addAll, this);
    this.collection.bind('all', this.render, this);
//        this.collection.fetch();
    this.trigger('attach');
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function () {
    // only rerender the stats part
    var html = this.statsTemplate({
      total: this.collection.length,
      published: this.collection.published().length,
      remaining: this.collection.remaining().length
    });
    this.$('.songlist-stats').html(html);
  },

  // Add a single song item to the list by creating a view for it, and
  // appending its element to the <ul>.
  addOne: function (song, index) {
    // DIRRRTY: prevent too many items rendering
    if (this.collection.limit && index === this.collection.limit[1]) return;
    var SongListItemView = require('../views/index').SongListItem;
    var el = new SongListItemView({
      model: song
    }).render().el;
    this.$('.songlist').append(el);
  },

  // Add all items in the **SongList** collection at once.
  addAll: function () {
    // clear songCollection first
    this.$('.songlist').html('');
    this.collection.each(_.bind(this.addOne, this));
  },

  // Generate the attributes for a new Song item.
  newAttributes: function () {
    return {
      title: this.input.val(),
      order: this.collection.nextOrder(),
      published: false
    };
  },

  // If you hit return in the main input field, create new **Song** model,
  // persisting it to *localStorage*.
  createOnEnter: function (e) {
    if (e.keyCode != 13) return;
    this.collection.create(this.newAttributes(), {
      success: this.collection.fetch
    });
    this.input.val('');
  },

  // Destroy all published song models
  clearCompleted: function () {
    _.each(this.collection.published(), function (song) {
      song.destroy();
    });
    return false;
  },

  // Lazily show the tooltip that tells you to press enter to save
  // a new song item, after one second.
  showTooltip: function (e) {
    var tooltip = this.$('.ui-tooltip-top');
    var val = this.input.val();
    tooltip.fadeOut();
    if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
    if (val == '' || val == this.input.attr('placeholder')) return;
    var show = function () {
      tooltip.show().fadeIn();
    };
    this.tooltipTimeout = _.delay(show, 1000);
  }

});
