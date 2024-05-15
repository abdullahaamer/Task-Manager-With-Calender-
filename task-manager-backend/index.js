const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Connect to database and start server
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
