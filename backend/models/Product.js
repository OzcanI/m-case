const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    featuredImage: { type: String, required: true }
}, {
    timestamps: true // Bu seçenek otomatik olarak createdAt ve updatedAt alanlarını ekler
});

// Varsayılan sıralama seçeneğini belirle
productSchema.query.byDefaultSort = function() {
    return this.sort({ createdAt: 'desc' });
};

module.exports = mongoose.model('Product', productSchema); 