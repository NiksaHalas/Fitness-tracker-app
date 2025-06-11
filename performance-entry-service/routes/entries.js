// performance-entry-service/routes/entries.js
const express = require('express');
const PerformanceEntry = require('../models/PerformanceEntry');
const router = express.Router();

// Ruta za logovanje novog unosa performansi.
router.post('/', async (req, res) => {
    const {
        userId,
        exerciseId,
        exerciseName, 
        date,
        durationMinutes,
        sets,
        reps,
        weightKg,
        distanceKm,
        notes
    } = req.body;

    if (!userId || !exerciseId || !exerciseName) {
        return res.status(400).json({ msg: 'UserId, ExerciseId, and ExerciseName are required.' });
    }
     // Kreiramo novi PerformanceEntry objekat i čuvamo ga u bazi.
    try {
        const newEntry = new PerformanceEntry({
            userId,
            exerciseId,
            exerciseName,
            date,
            durationMinutes,
            sets,
            reps,
            weightKg,
            distanceKm,
            notes
        });
        const entry = await newEntry.save();
        res.status(201).json(entry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Ruta za dobijanje svih unosa performansi za određenog korisnika.
router.get('/user/:userId', async (req, res) => {
    try {
        const entries = await PerformanceEntry.find({ userId: req.params.userId }).sort({ date: -1 });
        if (!entries) {
            return res.status(404).json({ msg: 'No entries found for this user' });
        }
        res.json(entries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Ruta za dobijanje specifičnog unosa performansi po njegovom ID-u.
router.get('/:entryId', async (req, res) => {
    try {
        const entry = await PerformanceEntry.findById(req.params.entryId);
        if (!entry) {
            return res.status(404).json({ msg: 'Entry not found' });
        }
        res.json(entry);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Entry not found (invalid ID format)' });
        }
        res.status(500).send('Server error');
    }
});

// Ruta za dobijanje unosa performansi za određenog korisnika i vežbu.
router.get('/user/:userId/exercise/:exerciseId', async (req, res) => {
    try {
        const entries = await PerformanceEntry.find({
            userId: req.params.userId,
            exerciseId: req.params.exerciseId
        }).sort({ date: 'asc' }); 
        res.json(entries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;