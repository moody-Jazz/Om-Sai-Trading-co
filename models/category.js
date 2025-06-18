const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryID: String,
  name: String,
  description: String,
  image: String, // store image filename or URL
});


module.exports = mongoose.model('Category', categorySchema);
