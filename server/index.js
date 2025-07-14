const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB with async/await
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};

// Execute the connection function
connectDB();

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/homepage-products', require('./routes/homepageProducts'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/settings", require("./routes/settings"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
