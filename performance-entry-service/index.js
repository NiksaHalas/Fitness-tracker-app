require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const entryRoutes = require('./routes/entries');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Performance Entry Service: MongoDB Connected'))
    .catch(err => console.error('Performance Entry Service: MongoDB connection error:', err));

app.use('/api/entries', entryRoutes);

app.get('/', (req, res) => {
    res.send('Performance Entry Service is running!');
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Performance Entry Service running on port ${PORT}`);
});