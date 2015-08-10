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
    notify_socket = function (socket, online_users) {
        socket.emit('users:online', online_users);
    };

io.on('connection', function(socket) {
    socket.emit('streamer:update', streamer_list);

    socket.on('users:get_online', function () {
        notify_socket(socket, users.get_online());
    });

    socket.on('users:status', function (user) {
        users.update_status(socket.id, user);
    });

    socket.on('disconnect', function () {
        users.remove_connection(socket.id);
    });
});

//intialize users module
users.init(function (online_users) {
    notify_socket(io.sockets, online_users); 
});

setInterval(function() {
    broadcast_streamers(io);
}, 5000);

http.listen(9999, function(){
  console.log('started! port: 9999');
});


