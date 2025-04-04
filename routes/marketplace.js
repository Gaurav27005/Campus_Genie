const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Define MarketplaceItem Schema
const marketplaceItemSchema = new mongoose.Schema({
    category: String,
    title: String,
    price: Number,
    description: String,
    location: String,
    condition: String,
    contact: String,
    image: String,
    sellerName: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MarketplaceItem = mongoose.model('MarketplaceItem', marketplaceItemSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes without auth middleware
router.get('/items', async (req, res) => {
    try {
        const items = await MarketplaceItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/items', upload.single('image'), async (req, res) => {
    try {
        const item = new MarketplaceItem({
            category: req.body.category,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            location: req.body.location,
            condition: req.body.condition,
            contact: req.body.contact,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            sellerName: 'Anonymous'
        });
        
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;