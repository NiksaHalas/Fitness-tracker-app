// progress-service/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const progressRoutes = require('./routes/progress');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
    res.send('Progress Service is running!');
});

// Pokretanje servisa na definisanom portu.
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Progress Service running on port ${PORT}`);
});