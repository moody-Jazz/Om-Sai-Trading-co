const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const nodemailer = require('nodemailer');



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


// GET all products/specific products by id
router.get('/products', async (req, res) => {
  try {
    const { categoryID, productID } = req.query;

    const filter = {};
    if (categoryID) filter.categoryID = categoryID;
    if (productID) filter.productID = productID;
    const products = await Product.find(filter, 'productID name image _id categoryID description priceRange');

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

// GET all categories
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

router.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.TO_EMAIL,
    subject: `Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, error: "Failed to send message." });
  }
});

router.post("/order", async (req, res) => {
  const { name, phone, cart } = req.body;

  if (!name || !phone || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  const orderHTML = cart.map(item => `
    <li>
        <strong>${item.name}</strong> (ID: ${item.productID}) — Quantity: ${item.quantity}
    </li>`).join("");

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: "New Order from Website",
    html: `
      <h2>Customer Details</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <h3>Cart Items</h3>
      <ul>${orderHTML}</ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

module.exports = router;