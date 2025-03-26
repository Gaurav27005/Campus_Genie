const express = require('express');
const router = express.Router();
const LostFoundItem = require('../models/LostFoundItem');
const MarketplaceItem = require('../models/MarketplaceItem');
const Material = require('../models/Material');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // In a real app, you would verify the admin token
  // For now, we'll just check a header for simplicity
  const adminToken = req.header('x-admin-token');
  
  if (!adminToken) {
    return res.status(401).json({ msg: 'No admin token, authorization denied' });
  }
  
  // In a real app, you would verify the token
  // For now, we'll just check if it's the expected value
  if (adminToken !== 'admin-jwt-token-would-be-here') {
    return res.status(401).json({ msg: 'Admin token is not valid' });
  }
  
  next();
};

// @route   GET api/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const lostItemsCount = await LostFoundItem.countDocuments();
    const marketplaceItemsCount = await MarketplaceItem.countDocuments();
    const materialsCount = await Material.countDocuments();
    
    res.json({
      users: userCount,
      lostItems: lostItemsCount,
      marketplaceItems: marketplaceItemsCount,
      materials: materialsCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Lost and Found Admin Routes
// @route   GET api/admin/lostfound
// @desc    Get all lost and found items
// @access  Admin
router.get('/lostfound', isAdmin, async (req, res) => {
  try {
    const items = await LostFoundItem.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/lostfound/:id
// @desc    Update a lost and found item
// @access  Admin
router.put('/lostfound/:id', isAdmin, async (req, res) => {
  try {
    let item = await LostFoundItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    item = await LostFoundItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/lostfound/:id
// @desc    Delete a lost and found item
// @access  Admin
router.delete('/lostfound/:id', isAdmin, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    
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

// Marketplace Admin Routes
// @route   GET api/admin/marketplace
// @desc    Get all marketplace items
// @access  Admin
router.get('/marketplace', isAdmin, async (req, res) => {
  try {
    const items = await MarketplaceItem.find().sort({ postedDate: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/marketplace/:id
// @desc    Update a marketplace item
// @access  Admin
router.put('/marketplace/:id', isAdmin, async (req, res) => {
  try {
    let item = await MarketplaceItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    item = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/marketplace/:id
// @desc    Delete a marketplace item
// @access  Admin
router.delete('/marketplace/:id', isAdmin, async (req, res) => {
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

// Materials Admin Routes
// @route   GET api/admin/materials
// @desc    Get all materials
// @access  Admin
router.get('/materials', isAdmin, async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadDate: -1 });
    res.json(materials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/materials/:id
// @desc    Update a material
// @access  Admin
router.put('/materials/:id', isAdmin, async (req, res) => {
  try {
    let material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    material = await Material.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(material);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Material not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/materials/:id
// @desc    Delete a material
// @access  Admin
router.delete('/materials/:id', isAdmin, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    await material.remove();
    
    res.json({ msg: 'Material removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Material not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Users Admin Routes
// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/users/:id
// @desc    Update a user
// @access  Admin
router.put('/users/:id', isAdmin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Don't allow password updates through this route
    if (req.body.password) {
      delete req.body.password;
    }
    
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    await user.remove();
    
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;