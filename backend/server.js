const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes and database initialization
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const questionRoutes = require('./routes/questionRoutes');
const examRoutes = require('./routes/examRoutes');
const { initializeDatabase } = require('./utils/dbInit');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize the database
initializeDatabase()
  .then(() => {
    console.log('Database initialization completed');
  })
  .catch(err => {
    console.error('Database initialization failed:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);

// Debug route
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'API is working',
    env: {
      node_env: process.env.NODE_ENV,
      db_host: process.env.DB_HOST,
      db_name: process.env.DB_NAME,
      port: process.env.PORT
    }
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('EPU Learning Hub API is running');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 