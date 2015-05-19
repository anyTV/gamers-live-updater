'use strict';

var config = require('./config'),
    request = require('superagent'),
    _ = require('lodash'),
    async = require('async'),
    prefix = require('superagent-prefix')(config.URL.API),
    streamers_old = {},
    streamers_new = {},
    request_streamers = function (url, callback) {
        request
            .get(url)
            .use(prefix)
            .end(function(err, res) {
                callback(err, res.body);
            });
    },
    get_twitch_streamers = function (callback) {
        request_streamers('/streamers/twitch', callback);
    },
    get_youtube_streamers = function (callback) {
        request_streamers('/streamers/youtube', callback);
    },
    get_hitbox_streamers = function (callback) {
        request_streamers('/streamers/hitbox', callback);
    },
    get_streamers = function (callback) {
        async.parallel({
                'youtube': get_youtube_streamers,
                'twitch': get_twitch_streamers,
                'hitbox': get_hitbox_streamers
            }, function (err, streamers) {
                callback(err, streamers);
            });
    },
    get_stream_id = function (stream, source) {
        var id;

        switch (source) {
            case 'youtube':
                id =  stream.youtube_stream.id;
                break;
            case 'twitch':
                id = stream.twitch.channel.name;
                break;
            case 'hitbox':
                id = stream.hitbox.channel.user_name;
                break;
        }

        return id;
    },
    check_streams = function (callback, err, streamers) {
        _.each(streamers, function(list, source) {
            streamers_new[source] = _.filter(list, function (stream) {
                return (typeof streamers_old[source] === 'undefined')
                    ? true
                    : !~streamers_old[source].indexOf(get_stream_id(stream, source));
            });

            streamers_old[source] = _.map(list, function (stream) {
                return get_stream_id(stream, source);
            });

        });

        callback(err, {
            new: streamers_new,
            all: streamers
        });
    };

module.exports = function (callback) {
    get_streamers(check_streams.bind(undefined, callback));
};
