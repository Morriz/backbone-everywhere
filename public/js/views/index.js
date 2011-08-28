if (typeof module === 'undefined') {
  module = {};
}
module.exports = {
  SongList: require('./SongListView'),
  SongListItem: require('./SongListItemView'),
  Song: require('./SongView'),
  TrackList: require('./TrackListView'),
  TrackListItem: require('./TrackListItemView'),
  Track: require('./TrackView')
}
