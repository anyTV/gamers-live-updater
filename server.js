var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    streamers = require('./streamers'),
    broadcast_streamers = function (socket) {
        streamers(function(err, data) {
            console.log(data);
            socket.emit('update', data);
        });
    };

io.on('connection', function(socket) {
    broadcast_streamers(socket);
});

setInterval(function() {
    broadcast_streamers(io);
}, 5000);

http.listen(9999, function(){
  console.log('started! port: 9999');
});


