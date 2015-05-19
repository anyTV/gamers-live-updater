var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    streamers = require('./streamers'),
    broadcast_streamers = function (socket, connection) {
        streamers(function(err, data) {
            if (!connection && (!data.new.twitch.length
                || !data.new.youtube.length
                || !data.new.hitbox.length)) {
                return false;
            }

            socket.emit('update', data);
        });
    };

io.on('connection', function(socket) {
    broadcast_streamers(socket, true);
});

setInterval(function() {
    broadcast_streamers(io);
}, 5000);

http.listen(9999, function(){
  console.log('started! port: 9999');
});


