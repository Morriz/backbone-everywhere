if (typeof module === 'undefined') {
  module = {};
}
module.exports = {
  Song: require('./SongRouter'),
  Track: require('./TrackRouter')
}
