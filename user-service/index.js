require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware:
app.use(cors()); 
app.use(express.json()); 

// Povezujemo se na MongoDB bazu podataka. Adresa baze se čita iz .env fajla.
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('User Service: MongoDB Connected'))
    .catch(err => console.error('User Service: MongoDB connection error:', err));

// Rute za autentifikaciju korisnika.
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => { 
    res.send('User Service is running!');
});

// Pokrećemo server na portu definisanom u `.env` fajlu ili na default portu 3001.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});