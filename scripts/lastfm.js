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
      var track = data.recenttracks.track;

      if (_.isArray(track)) {
        track = track[0];
      }

      if (!_.isUndefined(track) && track.hasOwnProperty('@attr') && track['@attr'].nowplaying == 'true') {
        var image = _.find(track.image, function (image) {
          return image.size == 'medium';
        });

        var image_url = image ? image['#text'] : null;

        callback(true, track.artist['#text'], track.name, image_url);
      }
      else {
        callback(false);
      }
    });
  }
};
