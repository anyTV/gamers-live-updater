'use strict';

var _ = require('lodash'),
    connections = {},
    sessions = {},
    visitors = {},
    members = {},
    callback = function () {},

    init = function (cb) {
        callback = cb || callback;
        setInterval(update_online, 10000);
    },

    update_online = function () {
        var disconnected = _(sessions).omit(function (value) {
            return !!value;
        })
        .keys()
        .value();

        if (!disconnected.length) {
            return;
        }

        remove_disconnected(disconnected);
    },

    remove_disconnected = function (disconnected) {
        _.forEach(disconnected, function (sid) {
            remove_session(sid);
            remove_member(sid);
            remove_visitor(sid);
        });

        callback(get_online());
    },

    remove_session = function (sid) {
        if (_.has(sessions, sid)) {
            delete sessions[sid];
        }
    },

    remove_visitor = function (sid) {
        if (_.has(visitors, sid)) {
            delete visitors[sid];
        }
    },

    remove_member = function (sid) {
        if (_.has(members, sid)) {
            delete members[sid];
        }
    },

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

    update_status = function (socket_id, user) {
        var notify = false;

        if (!user.sid) {
            return;
        }

        //check if the user is a member
        if (user.id) {
            notify = !_.has(members, user.sid);
            add_member(user); 
        }
        else {
            notify = !_.has(visitors, user.sid);
            add_visitor(user);
        }

        sessions[user.sid] = true;
        connections[socket_id] = user.sid;

        //notify users if we this is new session
        if (notify) {
            callback(get_online());
        }
    },

    get_online = function () {
        return {
            members: _.values(members),
            visitors: _.values(visitors)
        };
    },
    
    remove_connection = function (socket_id) {
        var sid = connections[socket_id];
        sessions[sid] = false;

        delete connections[socket_id];
    };

module.exports = {
    init: init,
    update_status: update_status,
    update_online: update_online,
    remove_connection: remove_connection,
    get_online: get_online
};
