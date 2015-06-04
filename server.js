'use strict';

var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    streamers = require('./streamers'),
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
    };

io.on('connection', function(socket) {
    socket.emit('streamer:update', streamer_list);
});

setInterval(function() {
    broadcast_streamers(io);
}, 5000);

http.listen(9999, function(){
  console.log('started! port: 9999');
});


