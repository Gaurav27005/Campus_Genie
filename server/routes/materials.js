const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

// @route   GET api/materials
// @desc    Get all study materials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadDate: -1 });
    res.json(materials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/materials/subject/:subject
// @desc    Get materials by subject
// @access  Public
router.get('/subject/:subject', async (req, res) => {
  try {
    const materials = await Material.find({ subject: req.params.subject }).sort({ uploadDate: -1 });
    res.json(materials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/materials
// @desc    Add new study material
// @access  Public (should be Private in production)
router.post('/', async (req, res) => {
  const { title, description, subject, materialType, fileUrl } = req.body;

  try {
    const newMaterial = new Material({
      title,
      description,
      subject,
      materialType, // 'notes', 'pyq', etc.
      fileUrl,
      uploadedBy: req.body.uploadedBy || 'Anonymous' // In a real app with auth, this would come from the token
    });

    const material = await newMaterial.save();
    res.json(material);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/materials/:id
// @desc    Get material by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    res.json(material);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Material not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/materials/:id
// @desc    Delete a study material
// @access  Public (should be Private in production)
router.delete('/:id', async (req, res) => {
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

module.exports = router;