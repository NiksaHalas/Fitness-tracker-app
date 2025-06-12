const mongoose = require('mongoose');

// Ovde definišemo kako izgleda naš "Exercise" objekat u bazi.
const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String } // Cardio, Strength, Flexibility
});

// Izvozimo model da bismo ga koristili u drugim delovima aplikacije.
module.exports = mongoose.model('Exercise', ExerciseSchema);