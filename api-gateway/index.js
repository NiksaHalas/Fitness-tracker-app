// api-gateway/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

app.use(cors());
app.use(express.json()); 

// Rute za autentifikaciju idu ka User servisu
app.use('/api/auth', proxy(process.env.USER_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
        return `/api/auth${req.url}`; 
    }
}));

// Rute za vežbe idu ka Exercise servisu
app.use('/api/exercises', proxy(process.env.EXERCISE_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
        return `/api/exercises${req.url}`; 
    }
}));

// Rute za unose performansi idu ka Performance Entry servisu
app.use('/api/entries', proxy(process.env.PERFORMANCE_ENTRY_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
        return `/api/entries${req.url}`; 
    }
}));

// Rute za praćenje progresa idu ka Progress servisu
app.use('/api/progress', proxy(process.env.PROGRESS_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
        return `/api/progress${req.url}`; 
    }
}));

app.get('/', (req, res) => {
    res.send('API Gateway is running!');
});

// Ovde pokrećemo gateway na definisanom portu.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});