if (typeof module === 'undefined') {
  module = {};
}
module.exports = {
  User: require('./UserModel'),
  UserCollection: require('./UserCollection'),
  Song: require('./SongModel'),
  SongCollection: require('./SongCollection'),
  Track: require('./TrackModel'),
  TrackCollection: require('./TrackCollection')
}
