import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST || 'junction.proxy.rlwy.net', // El host de Railway
  user: process.env.DB_USER || 'root', // Usuario de la base de datos
  password: process.env.DB_PASSWORD || 'vEDebKsTQxnXjqYsAYIsGrdvxQLclNAa', // Reemplaza <tu-password> por la contraseña
  database: process.env.DB_NAME || 'railway', // Nombre de la base de datos
  port: process.env.DB_PORT || 53728, // Puerto de la base de datos
});

export default db;
