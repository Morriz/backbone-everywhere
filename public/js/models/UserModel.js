var Backbone = require('../backbone-modified');

module.exports = Backbone.Model.extend({

  type: 'users',

  // Default attributes for the user.
  defaults: {
    firstName: 'empty first name...',
    lastName: 'empty last name...',
    middleName: 'empty middle name...',
    published: false
  },

  initialize: function () {
    // too bad bb events won't accepts an array of event names:
    this.bind('remove', this._removeView, this);
    this.bind('destroy', this._removeView, this);
  },

  // Toggle the 'published' state of this user.
  toggle: function () {
    this.save({
      published: !this.get('published')
    });
  },

  _removeView: function () {
    if (this.view) this.view.remove();
  }
});
