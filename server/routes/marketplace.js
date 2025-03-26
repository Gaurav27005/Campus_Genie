const express = require('express');
const router = express.Router();
const MarketplaceItem = require('../models/MarketplaceItem');

// @route   GET api/marketplace
// @desc    Get all marketplace items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await MarketplaceItem.find().sort({ postedDate: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/marketplace
// @desc    Add new marketplace item
// @access  Public (should be Private in production)
router.post('/', async (req, res) => {
  const { title, description, price, category, condition, contactInfo, imageUrl } = req.body;

  try {
    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      category,
      condition,
      contactInfo,
      imageUrl,
      seller: req.body.seller || 'Anonymous' // In a real app with auth, this would come from the token
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/marketplace/:id
// @desc    Get marketplace item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/marketplace/:id
// @desc    Delete a marketplace item
// @access  Public (should be Private in production)
router.delete('/:id', async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    await item.remove();
    
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;