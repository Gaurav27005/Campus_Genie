const mongoose = require('mongoose');

const MarketplaceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  seller: {
    type: String,
    default: 'Anonymous'
  },
  postedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MarketplaceItem', MarketplaceItemSchema);