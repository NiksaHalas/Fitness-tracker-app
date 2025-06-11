// workouts.js

// Ovaj fajl se bavi logovanjem novih treninga i prikazivanjem liste nedavnih treninga.

import * as DOM from './domElements.js';
import { displayMessage } from './ui.js';
import { apiRequest } from './api.js';
import { currentUser } from './auth.js'; // Potreban nam je podatak o korisniku
import { exercises } from './exercises.js'; // Potrebna nam je lista vežbi

// Funkcija za logovanje novog treninga.
export async function logWorkout() {
    if (DOM.logWorkoutMessageEl) displayMessage(DOM.logWorkoutMessageEl, '', null);
    if (!currentUser) {
        displayMessage(DOM.logWorkoutMessageEl, 'You must be logged in to log a workout.', 'error');
        return;
    }

    const exerciseId = DOM.exerciseSelect.value;
    // Pronalazimo odabranu vežbu iz liste.
    const selectedExercise = exercises.find(ex => ex._id === exerciseId);

    if (!selectedExercise) {
        displayMessage(DOM.logWorkoutMessageEl, 'Please select an exercise.', 'error');
        return;
    }
    if (!DOM.workoutDateInput.value) {
        displayMessage(DOM.logWorkoutMessageEl, 'Please select a date for the workout.', 'error');
        return;
    }

    // Prikupljamo sve podatke sa forme.
    const workoutData = {
        userId: currentUser.id,
        exerciseId: selectedExercise._id,
        exerciseName: selectedExercise.name,
        date: DOM.workoutDateInput.value,
        durationMinutes: parseInt(DOM.durationInput.value) || null,
        distanceKm: parseFloat(DOM.distanceInput.value) || null,
        sets: parseInt(DOM.setsInput.value) || null,
        reps: parseInt(DOM.repsInput.value) || null,
        weightKg: parseFloat(DOM.weightInput.value) || null,
        notes: DOM.notesInput.value.trim() || null
    };

    Object.keys(workoutData).forEach(key => {
        if (workoutData[key] === null || workoutData[key] === undefined || (typeof workoutData[key] === 'number' && isNaN(workoutData[key]))) {
            delete workoutData[key];
        }
    });

    try {
        // Šaljemo zahtev za logovanje unosa performansi.
        await apiRequest('/entries', 'POST', workoutData, true);
        displayMessage(DOM.logWorkoutMessageEl, 'Workout logged successfully!', 'success');
        
        // Resetujemo polja forme nakon uspešnog logovanja.
        DOM.exerciseSelect.value = '';
        DOM.durationInput.value = '';
        DOM.distanceInput.value = '';
        DOM.setsInput.value = '';
        DOM.repsInput.value = '';
        DOM.weightInput.value = '';
        DOM.notesInput.value = '';
        
        // Osvežavamo listu nedavnih treninga.
        await fetchRecentWorkouts();
    } catch (error) {
        displayMessage(DOM.logWorkoutMessageEl, `Error logging workout: ${error.message}`, 'error');
    }
}

// Funkcija za dohvat i prikaz nedavnih treninga za prijavljenog korisnika.
export async function fetchRecentWorkouts() {
    if (!currentUser || !DOM.recentWorkoutsList) return; 
    
    try {
        // Šaljemo zahtev ka Performance Entry servisu.
        const entries = await apiRequest(`/entries/user/${currentUser.id}`, 'GET', null, true);
        DOM.recentWorkoutsList.innerHTML = ''; 

        if (entries.length === 0) {
            // Ako nema unosa, prikazujemo odgovarajuću poruku.
            const li = document.createElement('li');
            li.classList.add('no-workouts');
            li.textContent = 'No workouts logged yet. Get started!';
            DOM.recentWorkoutsList.appendChild(li);
            return;
        }

        // Prikazujemo samo poslednjih 10 treninga.
        entries.slice(0, 10).forEach(entry => {
            const li = document.createElement('li');
            const nameEl = document.createElement('strong');
            nameEl.textContent = entry.exerciseName;
            li.appendChild(nameEl);

            const dateEl = document.createElement('span');
            dateEl.className = 'workout-date';
            dateEl.textContent = `Date: ${new Date(entry.date).toLocaleDateString()}`;
            li.appendChild(dateEl);

            const detailsContainer = document.createElement('span');
            detailsContainer.className = 'workout-details';
            
            // Sakupljamo detalje treninga (trajanje, distance, setovi, reps, težina).
            let detailsParts = [];
            if (entry.durationMinutes) detailsParts.push(`Duration: ${entry.durationMinutes} min`);
            if (entry.distanceKm) detailsParts.push(`Distance: ${entry.distanceKm} km`);
            if (entry.sets) detailsParts.push(`Sets: ${entry.sets}`);
            if (entry.reps) detailsParts.push(`Reps: ${entry.reps}`);
            if (entry.weightKg) detailsParts.push(`Weight: ${entry.weightKg} kg`);

            if (detailsParts.length > 0) {
                 detailsContainer.innerHTML = detailsParts.map(part => `<span>${part}</span>`).join('');
                 li.appendChild(detailsContainer);
            }

            // Ako postoje beleške, i njih prikazujemo.
            if (entry.notes) {
                const notesEl = document.createElement('span');
                notesEl.className = 'workout-notes';
                notesEl.textContent = entry.notes;
                li.appendChild(notesEl);
            }
            DOM.recentWorkoutsList.appendChild(li);
        });
    } catch (error) {
        console.error("Failed to fetch recent workouts:", error);
        DOM.recentWorkoutsList.innerHTML = '';
        const li = document.createElement('li');
        li.classList.add('no-workouts');
        li.textContent = 'Error loading workouts.';
        DOM.recentWorkoutsList.appendChild(li);
        // Prikazujemo poruku o grešci.
        if (DOM.logWorkoutMessageEl) displayMessage(DOM.logWorkoutMessageEl, 'Could not load recent workouts.', 'error');
        else if (DOM.appMessageEl) displayMessage(DOM.appMessageEl, 'Could not load recent workouts.', 'error', true);
    }
}