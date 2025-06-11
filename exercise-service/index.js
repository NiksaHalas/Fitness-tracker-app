// exercise-service/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const exerciseRoutes = require('./routes/exercises');

const app = express();

app.use(cors());
app.use(express.json());

// Povezivanje na MongoDB bazu podataka. Koristimo MONGO_URI iz .env fajla.
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Exercise Service: MongoDB Connected'))
    .catch(err => console.error('Exercise Service: MongoDB connection error:', err));

// Sve rute definisane u `exercises.js` će biti dostupne pod `/api/exercises`.
app.use('/api/exercises', exerciseRoutes);

app.get('/', (req, res) => {
    res.send('Exercise Service is running!');
});

// Pokretanje servisa na definisanom portu.
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Exercise Service running on port ${PORT}`);
});