const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productID: String,
  categoryID: String,
  name: String,
  priceRange: String,
  image: String, // store image filename or URL
  description: String,
});

module.exports = mongoose.model('Product', productSchema);
