'use strict';

var path = require('path'),

    extend = function (obj, source) {
        var prop;

        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
               obj[prop] = source[prop];
            }
        }

        return obj;
    },

    config = {
        APP_NAME : 'anyTV Node Boilerplate',

        PORT : 3000,

        CORS : ['*'],

        UPLOAD_DIR : path.normalize(__dirname + '/../uploads/'),
        VIEWS_DIR  : path.normalize(__dirname + '/../views'),
        LOGS_DIR  : path.normalize(__dirname + '/../logs/'),


        DB : {
            host : 'localhost',
            user : 'root',
            password : '',
            database : 'test'
        }

    };


// set development as our default environment
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

module.exports = extend(config, require(__dirname + '/env/' + process.env.NODE_ENV));
