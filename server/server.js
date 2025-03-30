const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusgenie')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const lostFoundRoutes = require('./routes/lostFound');
const authRoutes = require('./routes/auth');
const materialsRoutes = require('./routes/materials');
const marketplaceRoutes = require('./routes/marketplace');
const adminRoutes = require('./routes/admin');

app.use('/api/lostandfound', lostFoundRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});