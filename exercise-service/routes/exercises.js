// exercise-service/routes/exercises.js
const express = require('express');
const Exercise = require('../models/Exercise');
const router = express.Router();

// Ruta za kreiranje nove vežbe.
// Proveravamo da li vežba sa tim imenom već postoji pre nego što je sačuvamo.
router.post('/', async (req, res) => {
    const { name, description, category } = req.body;
    try {
        let exercise = await Exercise.findOne({ name });
        if (exercise) {
            return res.status(400).json({ msg: 'Exercise already exists' });
        }
        exercise = new Exercise({ name, description, category });
        await exercise.save();
        res.status(201).json(exercise);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Ruta za dobijanje svih vežbi. Vraćamo sve vežbe iz baze podataka.
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.json(exercises);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Ruta za dobijanje jedne vežbe po ID-u. Ako ne postoji vežba sa tim ID-om, vraćamo 404 grešku.
router.get('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ msg: 'Exercise not found' });
        }
        res.json(exercise);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Exercise not found (invalid ID format)' });
        }
        res.status(500).send('Server error');
    }
});

// Ruta za brisanje vežbe po ID-u. Proveravamo da li vežba postoji pre nego što je obrišemo.
router.delete('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({ msg: 'Exercise not found' });
        }


        await exercise.deleteOne(); 

        res.json({ msg: 'Exercise removed successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Exercise not found (invalid ID format)' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;