// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use express's built-in body parser

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// Mongoose schema and model

// Define a schema that accepts all data from the frontend
const itemSchema = new mongoose.Schema({
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // This will accept any data structure
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

// Create a model based on the schema
const Item = mongoose.model('Item', itemSchema);

// CRUD Routes

// Create
app.post('/items', async (req, res) => {
    const newItem = new Item({ data: req.body });
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Read
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Read
app.get('/items/:id', async (req, res) => {
    try {
        
        const items = await Item.findById(req.params.id);
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update
app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { data: req.body }, // Updating the 'data' field
            { new: true, runValidators: true } // return the updated doc
        );
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete
app.delete('/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Default route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'UnAutherized' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
