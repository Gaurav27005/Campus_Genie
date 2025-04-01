const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
// Use child_process instead
const { exec } = require('child_process');

// Load environment variables
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const lostFoundRoutes = require('./routes/lostFound');
const studyMaterialsRoutes = require('./routes/studyMaterials');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lostfound', lostFoundRoutes);
app.use('/api/materials', studyMaterialsRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/lostandfound', (req, res) => {
  res.sendFile(path.join(__dirname, 'lostandfound.html'));
});

app.get('/find-items', (req, res) => {
  res.sendFile(path.join(__dirname, 'find-items.html'));
});

app.get('/post-item', (req, res) => {
  res.sendFile(path.join(__dirname, 'post-item.html'));
});

app.get('/sm', (req, res) => {
  res.sendFile(path.join(__dirname, 'sm.html'));
});

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'map.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Add profile route
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

// Connect to MongoDB with more detailed error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Open browser using the appropriate command for Windows
    exec(`start http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error details:', err);
});