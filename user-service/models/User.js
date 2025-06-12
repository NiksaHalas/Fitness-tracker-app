const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definicija User šeme za bazu podataka. Created At polje se automatski postavlja na trenutni datum kada se korisnik kreira.
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Pre nego što sačuvamo korisnika, hašujemo mu lozinku.
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Metoda za poređenje unete lozinke sa hašovanom lozinkom u bazi. Koristi bcrypt za upoređivanje.
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);