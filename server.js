'use strict';

var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    streamers = require('./streamers'),
    users = require('./online_users'),
    streamer_list = {},
    start = true,
    broadcast_streamers = function (socket, connection) {
        streamers(function(err, data) {
            if (!start && (!data.new.twitch.length
                || !data.new.youtube.length
                || !data.new.hitbox.length)) {
                return false;
            }

            streamer_list = data;
            start = false;
            socket.emit('streamer:update', streamer_list);
        });
    },
    notify_online_users = function (socket) {
        io.sockets.emit('users:online', users.get_online());
    };


io.on('connection', function(socket) {
    socket.emit('streamer:update', streamer_list);

    socket.on('users:get_online', function () {
        notify_online_users();
    });

    socket.on('users:status', function (user) {
        users.update_online(socket.id, user);
        notify_online_users();
    });

    socket.on('disconnect', function () {
        users.remove_connection(socket.id);
        notify_online_users();
    });
});

setInterval(function() {
    broadcast_streamers(io);
}, 5000);

http.listen(9999, function(){
  console.log('started! port: 9999');
});


