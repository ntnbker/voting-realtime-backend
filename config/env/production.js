'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.IP ||
        '0.0.0.0',
  port: process.env.PORT ||
        8080,
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://intern:1nt3rn!@ds041432.mongolab.com:41432/zenquiz-intern'
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
