'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://heroku_rj6vcl4v:b21kd3crp2ukls4evg3pmfpcf8@ds161255.mlab.com:61255/heroku_rj6vcl4v'
  },
  redisAPI: {
    host: process.env.REDIS_HOST || "",
    port: process.env.REDIS_PORT || "",
    secret: process.env.REDIS_SECRET || ""
  },
  postgres: {
    uri: process.env.POSTGRES_URI || '',
    ssl: process.env.POSTGRES_SSL || true
  }
};
