const mongoose = require('mongoose');

const MarketplaceItemSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    condition: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sellerName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MarketplaceItem', MarketplaceItemSchema, 'marketplaceitems');