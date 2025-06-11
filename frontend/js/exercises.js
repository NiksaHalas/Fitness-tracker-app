// exercises.js

// Ovaj fajl sadrži logiku za sve operacije vezane za vežbe: dohvatanje, dodavanje i brisanje.

import * as DOM from './domElements.js';
import { displayMessage } from './ui.js';
import { apiRequest } from './api.js';
import { currentUser } from './auth.js'; 

// Globalna promenljiva za sve vežbe.
export let exercises = [];

// Funkcija za dohvat svih vežbi sa servera.
// Ako korisnik nije prijavljen, ne radimo ništa.
export async function fetchExercises() {
    if (!currentUser) {
        // Ako korisnik nije ulogovan, prikaži poruku da mora da se uloguje da bi upravljao vežbama.
        if(DOM.existingExercisesListEl) DOM.existingExercisesListEl.innerHTML = '<li class="no-exercises-message">Login to manage exercises.</li>';
        return;
    }
    try {
        // Šaljemo zahtev ka Exercise servisu (preko API Gateway-a).
        exercises = await apiRequest('/exercises', 'GET', null, true);
        populateExerciseSelects(); 
        populateExistingExercisesList();
    } catch (error) {
        console.error('Failed to fetch exercises:', error);
        displayMessage(DOM.appMessageEl, `Could not load exercises: ${error.message}`, 'error', true);
        // Prikazujemo poruku o grešci u listi vežbi.
        if (DOM.existingExercisesListEl) { 
            DOM.existingExercisesListEl.innerHTML = '<li class="no-exercises-message error-message">Could not load exercises.</li>';
        }
    }
}

// Funkcija za popunjavanje padajućih lista sa vežbama.
// Koristi se na formama za logovanje treninga i za odabir vežbe za praćenje progresa.
export function populateExerciseSelects() {
    if (DOM.exerciseSelect) {
        DOM.exerciseSelect.innerHTML = '<option value="">-- Select Exercise --</option>';
    }
    if (DOM.progressExerciseSelect) {
        DOM.progressExerciseSelect.innerHTML = '<option value="">-- Select Exercise --</option>';
    }

    if (exercises && exercises.length > 0) {
        exercises.forEach(ex => {
            const option = document.createElement('option');
            option.value = ex._id;
            option.textContent = ex.name;
            // Dodajemo istu opciju u obe padajuće liste.
            if (DOM.exerciseSelect) {
                DOM.exerciseSelect.appendChild(option.cloneNode(true));
            }
            if (DOM.progressExerciseSelect) {
                DOM.progressExerciseSelect.appendChild(option);
            }
        });
    }
}

// Funkcija za popunjavanje liste postojećih vežbi (sekcija "Add Exercise").
// Omogućava korisniku da vidi i obriše dodate vežbe.
export function populateExistingExercisesList() {
    if (!DOM.existingExercisesListEl) return;
    DOM.existingExercisesListEl.innerHTML = '';

    if (exercises && exercises.length > 0) {
        exercises.forEach(ex => {
            const li = document.createElement('li');
            li.className = 'exercise-list-item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'exercise-name';
            nameSpan.textContent = ex.name + (ex.category ? ` (${ex.category})` : '');
            li.appendChild(nameSpan);

            // Dugme za brisanje vežbe.
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm';
            deleteBtn.textContent = 'Delete';
            deleteBtn.dataset.exerciseId = ex._id; 
            deleteBtn.addEventListener('click', async (event) => {
                const exerciseId = event.target.dataset.exerciseId;
                // Pitamo korisnika za potvrdu pre brisanja.
                if (confirm(`Are you sure you want to delete the exercise "${ex.name}"? This action cannot be undone.`)) {
                    await deleteExercise(exerciseId);
                }
            });
            li.appendChild(deleteBtn);
            DOM.existingExercisesListEl.appendChild(li);
        });
    } else {
        // Ako nema vežbi, prikazujemo poruku.
        const li = document.createElement('li');
        li.className = 'no-exercises-message';
        li.textContent = 'No exercises defined yet. Add one above!';
        DOM.existingExercisesListEl.appendChild(li);
    }
}

// Funkcija za dodavanje nove vežbe.
export async function addExerciseType() {
    if (DOM.addExMessageEl) displayMessage(DOM.addExMessageEl, '', null);
    if (DOM.deleteExMessageEl) displayMessage(DOM.deleteExMessageEl, '', null);
    
    const name = DOM.exNameEl.value;
    const description = DOM.exDescEl.value;
    const category = DOM.exCatEl.value;

    if (!name) {
        displayMessage(DOM.addExMessageEl, 'Exercise name is required.', 'error');
        return;
    }

    try {
        // Šaljemo zahtev za dodavanje vežbe.
        const newExercise = await apiRequest('/exercises', 'POST', { name, description, category }, true);
        displayMessage(DOM.addExMessageEl, `Exercise "${newExercise.name}" added successfully!`, 'success');
        
        // Resetujemo polja forme.
        DOM.exNameEl.value = '';
        DOM.exDescEl.value = '';
        DOM.exCatEl.value = '';
        
        // Osvežavamo listu vežbi.
        await fetchExercises();
    } catch (error) {
        displayMessage(DOM.addExMessageEl, `Error adding exercise: ${error.message}`, 'error');
    }
}

// Funkcija za brisanje vežbe.
export async function deleteExercise(exerciseId) {
    if (DOM.deleteExMessageEl) displayMessage(DOM.deleteExMessageEl, '', null);
    if (DOM.addExMessageEl) displayMessage(DOM.addExMessageEl, '', null);

    if (!exerciseId) {
        console.error('Delete function called without exercise ID');
        return;
    }

    try {
        // Šaljemo zahtev za brisanje vežbe.
        const result = await apiRequest(`/exercises/${exerciseId}`, 'DELETE', null, true);
        displayMessage(DOM.deleteExMessageEl, result.msg || 'Exercise deleted successfully!', 'success');
        
        // Osvežavamo listu vežbi.
        await fetchExercises();
    } catch (error) {
        displayMessage(DOM.deleteExMessageEl, `Error deleting exercise: ${error.message}`, 'error');
        console.error('Failed to delete exercise:', error);
    }
}