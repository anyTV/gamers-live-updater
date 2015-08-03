'use strict';

var _ = require('lodash'),
    connections = {},
    visitors = {},
    members = {},

    add_member = function (user) {
        members[user.sid] = {
            sid: user.sid,
            ip: user.ip,
            user_id: user.id,
            name: [user.first_name, user.last_name].join(' '),
            avatar: user.avatar,
            href: '/youtubers/' + user.id
        };
    },

    add_visitor = function (visitor) {
        visitors[visitor.sid] = {
            sid: visitor.sid,
            ip: visitor.ip
        };
    },

    get_online = function () {
        return {
            members: _.values(members),
            visitors: _.values(visitors)
        };
    },

    store_connection = function (socket_id, user) {
        connections[socket_id] = user.sid;
    },

    update_online = function (socket_id, user) {
        if (!user.sid) {
            return;
        }

        if (user.id) {
            add_member(user); 
        }
        else {
            add_visitor(user);
        }

        store_connection(socket_id, user);
    },

    remove_connection = function (socket_id) {
        var sid = connections[socket_id];

        delete visitors[sid];
        delete members[sid];
        delete connections[socket_id];
    };

// members = [{
//     user_id: 'c2967b9c-d708-42a8-a375-93c44085986f',
//     name: 'Ryan Navarroza',
//     avatar: 'http://cdn2.gamers.tm/user_avatars/c2967b9c-d708-42a8-a375-93c44085986f.jpg',
//     href: 'http://dev.gamers.tm:8080/youtubers/c2967b9c-d708-42a8-a375-93c44085986f'
// }, {
//     user_id: '2fdb3578-3335-4a62-b88d-8ee523693578',
//     name: 'Jonathan Cepeda',
//     avatar: 'http://cdn2.gamers.tm/user_avatars/2fdb3578-3335-4a62-b88d-8ee523693578.jpg',
//     href: 'http://dev.gamers.tm:8080/youtubers/2fdb3578-3335-4a62-b88d-8ee523693578'
// }];
// visitors = [{}, {}];

module.exports = {
    update_online: update_online,
    remove_connection: remove_connection,
    get_online: get_online
};
