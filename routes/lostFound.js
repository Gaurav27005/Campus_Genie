const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LostFoundItem = require('../models/LostFoundItem');
const router = express.Router();

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/lostfound');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all lost and found items
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    const items = await LostFoundItem.find(query)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name');
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific lost and found item
router.get('/:id', async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id)
      .populate('postedBy', 'name email');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new lost and found item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location, date, status, contactInfo } = req.body;
    
    const item = new LostFoundItem({
      title,
      description,
      category,
      location,
      date,
      status,
      contactInfo,
      postedBy: req.user._id
    });
    
    if (req.file) {
      item.imageUrl = `/uploads/lostfound/${req.file.filename}`;
    }
    
    await item.save();
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a lost and found item
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location, date, status, contactInfo } = req.body;
    
    const item = await LostFoundItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user is the owner of the item
    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update fields
    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.location = location || item.location;
    item.date = date || item.date;
    item.status = status || item.status;
    item.contactInfo = contactInfo || item.contactInfo;
    
    if (req.file) {
      // Delete old image if exists
      if (item.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', item.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      item.imageUrl = `/uploads/lostfound/${req.file.filename}`;
    }
    
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a lost and found item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user is the owner of the item
    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete image if exists
    if (item.imageUrl) {
      const imagePath = path.join(__dirname, '..', item.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await item.remove();
    
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;