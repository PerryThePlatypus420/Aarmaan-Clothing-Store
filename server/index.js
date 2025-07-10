const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Check if connected to MongoDB
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));


// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/homepage-products', require('./routes/homepageProducts'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/settings", require("./routes/settings"));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
