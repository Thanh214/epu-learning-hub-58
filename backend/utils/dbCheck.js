const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to check database connection
const checkDatabase = async () => {
  console.log('Starting database check...');
  
  try {
    // Create a connection
    console.log('Connecting to the MySQL server...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    console.log('Connected to MySQL server successfully!');
    
    // Check if database exists
    console.log(`Checking if database '${process.env.DB_NAME}' exists...`);
    const [dbs] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, 
      [process.env.DB_NAME]
    );
    
    if (dbs.length === 0) {
      console.log(`Database '${process.env.DB_NAME}' does not exist. Creating it...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Database '${process.env.DB_NAME}' created successfully!`);
    } else {
      console.log(`Database '${process.env.DB_NAME}' already exists.`);
    }
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // Check if users table exists
    console.log(`Checking if 'users' table exists...`);
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME]
    );
    
    if (tables.length === 0) {
      console.log(`Table 'users' does not exist.`);
    } else {
      console.log(`Table 'users' exists. Checking its structure...`);
      
      // List all columns in the users table
      const [columns] = await connection.query(
        `SHOW COLUMNS FROM users`
      );
      
      console.log('Columns in users table:');
      columns.forEach(column => {
        console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : ''} ${column.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
      });
      
      // Count users
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM users`);
      console.log(`Total users in the database: ${countResult[0].count}`);
      
      // List some users if they exist
      if (countResult[0].count > 0) {
        const [users] = await connection.query(`SELECT id, full_name, email, role, status FROM users LIMIT 5`);
        console.log('Sample users:');
        users.forEach(user => {
          console.log(`- ID: ${user.id}, Name: ${user.full_name}, Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
        });
      }
    }
    
    // Close the connection
    await connection.end();
    console.log('Database check completed.');
    
  } catch (error) {
    console.error('Database check error:', error);
  }
};

// Run the check
checkDatabase();

module.exports = { checkDatabase }; 