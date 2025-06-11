// performance-entry-service/models/PerformanceEntry.js
const mongoose = require('mongoose');

// Ovde definišemo kako izgleda naš "PerformanceEntry" objekat u bazi.
const PerformanceEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    exerciseId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    exerciseName: { type: String, required: true }, 
    date: { type: Date, default: Date.now },
    durationMinutes: { type: Number }, 
    sets: { type: Number },           
    reps: { type: Number },           
    weightKg: { type: Number },       
    distanceKm: { type: Number },     
    notes: { type: String }
});

// Izvozimo model za korišćenje u drugim delovima servisa.
module.exports = mongoose.model('PerformanceEntry', PerformanceEntrySchema);