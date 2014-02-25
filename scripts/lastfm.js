var last_fm_client = {
  latest_track: function (callback) {
    var params = {
      method: 'user.getrecenttracks',
      format: 'json',
      limit: 1,
      user: 'bryanirace',
      api_key: '66cbc590ca91632eead9c128f94e73e6'
    };

    $.get('http://ws.audioscrobbler.com/2.0/', params).done(function (data) {
      var track = data.recenttracks.track[0];

      if (track['@attr'].nowplaying == 'true') {
        callback(true, track.artist['#text'], track.name);
      }
      else {
        callback(false);
      }
    });
  }
};
