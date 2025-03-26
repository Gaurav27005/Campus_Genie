const express = require('express');
const router = express.Router();
const LostFoundItem = require('../models/LostFoundItem');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await LostFoundItem.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add new item
router.post('/', async (req, res) => {
  try {
    const newItem = new LostFoundItem(req.body);
    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;