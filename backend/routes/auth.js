const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const db = require('../config/db');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/me', verifyToken, authController.getMe);

// Update user profile
router.put('/update-profile', verifyToken, authController.updateMe);

// Change password
router.post('/change-password', verifyToken, authController.changePassword);

// Upload avatar
router.post('/upload-avatar', verifyToken, uploadAvatar, authController.uploadAvatar);

// Database status check
router.get('/db-status', async (req, res) => {
  try {
    // Test simple query
    const [testResult] = await db.query('SELECT 1 as test');
    
    // Check if users table exists
    const [tables] = await db.query(`
      SELECT TABLE_NAME FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [process.env.DB_NAME]);
    
    // Get user count
    let userCount = 0;
    if (tables.length > 0) {
      const [countResult] = await db.query('SELECT COUNT(*) as count FROM users');
      userCount = countResult[0].count;
    }
    
    // Get database name
    const [dbInfo] = await db.query('SELECT DATABASE() as db_name');
    
    res.status(200).json({
      status: 'success',
      message: 'Database connection successful',
      database: {
        name: dbInfo[0].db_name,
        users_table_exists: tables.length > 0,
        user_count: userCount,
        test_query: testResult[0]
      }
    });
  } catch (error) {
    console.error('Database status check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router; 