var Backbone = require('../backbone-modified');
var UserModel = require('./UserModel');

module.exports = Backbone.Collection.extend({

  type: 'users',

  model: UserModel,

  orderBy: 'lastName',

  // Filter down the list of all user items that are published.
  published: function () {
    return this.filter(function (user) {
      return user.get('published');
    });
  },

  // Filter down the list to only user items that are still not published.
  remaining: function () {
    return this.without.apply(this, this.published());
  },

  // We keep the users in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function () {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },
});
