// models/Onsale.js
const mongoose = require('mongoose');

const onsaleSchema = new mongoose.Schema({
    name: String,
    price: Number,
    sale: {
        type: Boolean,
        default: false,
    },
    title: String,
    salePrice: Number,
    totalStock: Number,
    category: String,
    brand: String,
    image: String,
    description: String,
}, { timestamps: true });

module.exports = mongoose.model('Onsale', onsaleSchema);