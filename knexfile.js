/* eslint-env node */

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: 'moka_dev',
      user: 'root',
      password: '',
      sessionDb: 'moka_session',
    },
    seeds: {
      directory: './src/server/seeds',
    },
  },

  test: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: 'moka_test',
      user: 'root',
      password: '',
      sessionDb: 'moka_test_session',
    },
    seeds: {
      directory: './src/server/seeds',
    },
  },

  circleci: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: 'circle_test',
      user: 'root',
      password: '',
      sessionDb: 'circle_test',
    },
    seeds: {
      directory: './src/server/seeds',
    },
  },

  staging: {
    client: 'mysql',
    connection: {
      host: process.env.STAGING_SQL_HOST_NAME,
      database: process.env.STAGING_SQL_DB,
      user: process.env.STAGING_SQL_USER_NAME,
      password: process.env.STAGING_SQL_PW,
      sessionDb: process.env.STAGING_SESSION_DB,
    },
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.SQL_HOST_NAME,
      database: process.env.SQL_DB,
      user: process.env.SQL_USER_NAME,
      password: process.env.SQL_PW,
      sessionDb: process.env.SESSION_DB,
    },
  },
};
