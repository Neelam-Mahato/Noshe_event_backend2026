const mysql = require('mysql2'); 

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'noshe_event2026',
  port: process.env.DB_PORT || 3306,
  ssl: {}
  
});

module.exports = pool.promise();