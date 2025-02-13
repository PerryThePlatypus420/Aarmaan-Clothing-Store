const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/swooshDB');

// Check if connected to MongoDB
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));


// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/summerCollection', require('./routes/summerCollection'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use("/api/categories", require("./routes/categories"));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
