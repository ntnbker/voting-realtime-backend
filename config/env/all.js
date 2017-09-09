'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  socketio: {
    jwtSecret: process.env.SOCKETIO_JWT_SECRET || 'abc1234abcfdafad'
  },
  domains: {
    client: process.env.CLIENT_DOMAIN || ''
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID || "",
    secret: process.env.FACEBOOK_APP_SECRET || ""
  },
  google: {
    appId: process.env.GOOGLE_APP_ID || "",
    secret: process.env.GOOGLE_APP_SECRET || ""
  },
  serverMode: process.env.SERVER_MODE || 'web',
  locale: process.env.LOCALE || 'en_US',
};
