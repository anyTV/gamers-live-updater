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
                if(err || !res.body) {
                    res = {
                        body: []
                    };
                }

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

    get_streamers_async = function (callback) {
        async.parallel({
                'youtube': get_youtube_streamers,
                'twitch': get_twitch_streamers,
                'hitbox': get_hitbox_streamers
            }, callback);
    },

    check_streams = function (callback, err, streamers) {
        if(err) {
            streamers = _.extend({youtube: [], twitch: [], hitbox: []}, streamers);
        }

        _.each(streamers, function(list, source) {
            streamers_new[source] = _.filter(list, function (stream) {
                return (typeof streamers_old[source] === 'undefined')
                    ? true
                    : !~streamers_old[source].indexOf(stream.id);
            });

            streamers_old[source] = _.map(list, function (stream) {
                return stream.id;
            });

        });

        callback(err, {
            new: streamers_new,
            all: streamers
        });
    };

module.exports = function (callback) {
    get_streamers_async(check_streams.bind(undefined, callback));
};
