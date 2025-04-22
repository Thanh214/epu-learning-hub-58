const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const db = require('../config/db');

// Register user
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, password_confirm } = req.body;

    console.log('Registration attempt with data:', { 
      full_name, 
      email, 
      password_length: password ? password.length : 0,
      body: req.body 
    });

    // Validation
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== password_confirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    try {
      console.log('Attempting to insert new user into database with values:', {
        full_name,
        email,
        hashedPassword_length: hashedPassword.length,
        role: 'user'
      });
      
      // Direct database query to test connection
      const testQuery = await db.query('SELECT 1 as test');
      console.log('Database test query successful:', testQuery);
      
      const insertQuery = `INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)`;
      console.log('Insert query:', insertQuery);
      
      const [result] = await db.query(
        insertQuery,
        [full_name, email, hashedPassword, 'user']
      );
      
      console.log('User inserted successfully, Result:', result);
      console.log('Insert ID:', result.insertId);
      
      // Get the created user without password
      const [newUser] = await db.query(
        'SELECT id, full_name, email, role, status, created_at FROM users WHERE id = ?',
        [result.insertId]
      );

      console.log('Retrieved new user:', newUser);

      if (newUser.length === 0) {
        throw new Error('User was created but could not be retrieved');
      }

      // Create JWT token
      const token = jwt.sign(
        { id: newUser[0].id, role: newUser[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: newUser[0],
        token
      });
    } catch (insertError) {
      console.error('Error inserting user into database:', insertError);
      return res.status(500).json({ 
        message: 'Error creating user in database',
        error: insertError.message,
        stack: insertError.stack
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message,
      stack: error.stack
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Your account is not active' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password from user object
    delete user.password;

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, role, status, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while retrieving user data' });
  }
};

// Update user information
exports.updateMe = async (req, res) => {
  try {
    const { full_name, email } = req.body;
    
    // Validation
    if (!full_name && !email) {
      return res.status(400).json({ message: 'Please provide at least one field to update' });
    }
    
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }
    
    // Check if email already exists (if email is being updated)
    if (email) {
      const [existingUsers] = await db.query(
        'SELECT * FROM users WHERE email = ? AND id != ?', 
        [email, req.user.id]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    // Update user information
    const updateFields = [];
    const updateValues = [];
    
    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    // Add user ID to values array
    updateValues.push(req.user.id);
    
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;
    
    await db.query(updateQuery, updateValues);
    
    // Get updated user data
    const [updatedUser] = await db.query(
      'SELECT id, full_name, email, role, status, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser[0]
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: 'Server error while updating user data',
      error: error.message 
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    
    // Validation
    if (!current_password || !new_password) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' 
      });
    }
    
    if (new_password.length < 6) {
      return res.status(400).json({ 
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
      });
    }
    
    // Get user with password
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    const user = users[0];
    
    // Verify current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(new_password, salt);
    
    // Update password
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, req.user.id]
    );
    
    res.status(200).json({
      message: 'Mật khẩu đã được cập nhật thành công'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi đổi mật khẩu',
      error: error.message 
    });
  }
};

// Upload user avatar
exports.uploadAvatar = async (req, res) => {
  try {
    // Check if file was uploaded 
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Vui lòng chọn ảnh để tải lên' 
      });
    }

    // File info is in req.file (provided by multer middleware)
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Update user with avatar URL
    await db.query(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [avatarUrl, req.user.id]
    );
    
    // Get updated user data
    const [updatedUser] = await db.query(
      'SELECT id, full_name, email, role, status, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'Avatar uploaded successfully',
      user: updatedUser[0]
    });
    
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi tải lên ảnh đại diện',
      error: error.message 
    });
  }
}; 