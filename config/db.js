const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aromas_de_cafe',
  password: 'Admin',
  port: 5432,
});

module.exports = pool;
