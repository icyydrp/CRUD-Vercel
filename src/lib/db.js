import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST || 'junction.proxy.rlwy.net', 
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || 'vEDebKsTQxnXjqYsAYIsGrdvxQLclNAa', 
  database: process.env.DB_NAME || 'railway', 
  port: process.env.DB_PORT || 31400, 
});

export default db;
