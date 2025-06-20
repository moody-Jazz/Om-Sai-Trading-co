const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const adminRoute = require('./routes/adminRoute');
require('dotenv').config();
// ------------------- MIDDLEWARE -------------------

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "client" folder
app.use(express.static(path.join(__dirname, 'client')));

// ------------------- ROUTES -------------------

// API routes (e.g., /api/product, /api/categories, etc.)
app.use('/api', adminRoute);

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// ------------------- DATABASE CONNECTION -------------------
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
// ------------------- SERVER START -------------------

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
