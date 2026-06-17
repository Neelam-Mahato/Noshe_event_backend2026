const mysql = require('mysql2'); 

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'noshe_event2026',
  port: process.env.DB_PORT || 4000, // 1. Added the TiDB port variable
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true // 2. Forces the required secure SSL connection
  }
  
});

module.exports = pool.promise();
