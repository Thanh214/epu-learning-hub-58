const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Log database configuration (without password)
console.log('Database configuration:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('Test query result:', rows);
    
    connection.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    console.error('Error details:', {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    });
    return false;
  }
};

// Execute the test
testConnection();

module.exports = pool; 