const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterial');
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
    const uploadDir = path.join(__dirname, '../uploads/materials');
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
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip|rar/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only document files are allowed'));
  }
});

// Get all study materials
router.get('/', async (req, res) => {
  try {
    const { semester, subject } = req.query;
    let query = {};
    
    if (semester) {
      query.semester = semester;
    }
    
    if (subject) {
      query.subject = subject;
    }
    
    const materials = await StudyMaterial.find(query)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific study material
router.get('/:id', async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload a new study material
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    const { title, description, subject, semester } = req.body;
    
    const material = new StudyMaterial({
      title,
      description,
      subject,
      semester,
      fileUrl: `/uploads/materials/${req.file.filename}`,
      uploadedBy: req.user._id
    });
    
    await material.save();
    
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a study material
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, subject, semester } = req.body;
    
    const material = await StudyMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if user is the owner of the material
    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update fields
    material.title = title || material.title;
    material.description = description || material.description;
    material.subject = subject || material.subject;
    material.semester = semester || material.semester;
    
    if (req.file) {
      // Delete old file if exists
      if (material.fileUrl) {
        const oldFilePath = path.join(__dirname, '..', material.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      material.fileUrl = `/uploads/materials/${req.file.filename}`;
    }
    
    await material.save();
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a study material
router.delete('/:id', auth, async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if user is the owner of the material
    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete file if exists
    if (material.fileUrl) {
      const filePath = path.join(__dirname, '..', material.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await material.remove();
    
    res.json({ message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;