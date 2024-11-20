import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Cambia esto según tu configuración
  password: 'Capitan23', // Cambia según tu configuración
  database: 'productos_db',
});

export default db;
