const db = require('../config/db');

// Import function để tạo dữ liệu mẫu câu hỏi
const createQuestionSamples = require('./createQuestionSamples');

// Function to initialize database
const initializeDatabase = async () => {
  try {
    console.log('Checking database connection and tables...');
    
    // Check if users table exists, if not create it
    const [tables] = await db.query(`
      SELECT TABLE_NAME FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [process.env.DB_NAME]);
    
    if (tables.length === 0) {
      console.log('Users table does not exist. Creating it...');
      
      await db.query(`
        CREATE TABLE users (
          id int(11) NOT NULL AUTO_INCREMENT,
          full_name varchar(255) NOT NULL,
          email varchar(255) NOT NULL,
          password varchar(255) NOT NULL,
          role enum('admin','user') NOT NULL DEFAULT 'user',
          status enum('active','inactive','banned') NOT NULL DEFAULT 'active',
          created_at timestamp NOT NULL DEFAULT current_timestamp(),
          updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
          PRIMARY KEY (id),
          UNIQUE KEY email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);
      
      console.log('Users table created successfully');
    } else {
      console.log('Users table already exists');
    }
    
    console.log('Database initialization completed');
    
    // Tạo dữ liệu mẫu câu hỏi
    await createQuestionSamples();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = { initializeDatabase }; 