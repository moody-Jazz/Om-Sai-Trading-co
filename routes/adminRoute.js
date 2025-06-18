const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');

// Add new category
router.post('/categories', async (req, res) => {
  try {
    const newCat = new Category(req.body);
    await newCat.save();
    res.json({ message: 'Category added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new product
router.post('/products', async (req, res) => {
  try {
    const newProd = new Product(req.body);
    await newProd.save();
    res.json({ message: 'Product added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET all products (just name & ID)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}, 'productID name image _id categoryID description');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product by ID
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all categories (just name & ID)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({}, 'categoryID name image description _id');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a category by ID
router.delete('/categories/:id', async (req, res) => {
  try {
    console.log('Deleting category ID:', req.params.id);
    
    const deleted = await Category.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      console.log('Nothing deleted — maybe ID is wrong or not found.');
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log('Deleted:', deleted);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a category by ID
router.put('/categories/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
