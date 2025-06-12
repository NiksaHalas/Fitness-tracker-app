// Ovaj fajl se bavi svim što ima veze sa autentifikacijom korisnika:  registracijom, prijavom i odjavom.


import * as DOM from './domElements.js';
import { displayMessage, updateUI } from './ui.js';
import { apiRequest } from './api.js';
import { fetchExercises } from './exercises.js';
import { fetchRecentWorkouts } from './workouts.js';

// Globalna promenljiva za trenutno prijavljenog korisnika.
export let currentUser = null;
export let authViewMode = 'choice';

// Funkcija za registraciju novog korisnika.
export async function registerUser() {
    if (DOM.regMessageEl) displayMessage(DOM.regMessageEl, '', null);

    try {
        const userData = await apiRequest('/auth/register', 'POST', {
            username: DOM.regUsernameEl.value,
            email: DOM.regEmailEl.value,
            password: DOM.regPasswordEl.value
        });
        
        // Prikazujemo poruku o uspešnoj registraciji.
        displayMessage(DOM.appMessageEl, `Registered successfully as ${userData.username}! Please log in.`, 'success');
        
        // Resetujemo polja forme.
        DOM.regUsernameEl.value = '';
        DOM.regEmailEl.value = '';
        DOM.regPasswordEl.value = '';
        
        // Prebacujemo se na prikaz za prijavu.
        authViewMode = 'login';
        updateUI(currentUser, authViewMode);
        // Čistimo poruke za login, ako ih ima.
        if (DOM.loginMessageEl) displayMessage(DOM.loginMessageEl, '', null);

    } catch (error) {
        // Prikazujemo poruku o grešci ako registracija ne uspe.
        displayMessage(DOM.regMessageEl, error.message, 'error');
    }
}

// Funkcija za prijavu korisnika.
export async function loginUser() {
    // Čistimo prethodne poruke.
    if (DOM.loginMessageEl) displayMessage(DOM.loginMessageEl, '', null);
    if (DOM.appMessageEl) displayMessage(DOM.appMessageEl, '', null);

    try {
        // Šaljemo zahtev za prijavu na backend.
        const data = await apiRequest('/auth/login', 'POST', {
            email: DOM.loginEmailEl.value,
            password: DOM.loginPasswordEl.value
        });
        
        // Čuvamo token, ID korisnika i korisničko ime u lokalnom skladištu pregledača.
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        
        // Resetujemo polja forme.
        DOM.loginEmailEl.value = '';
        DOM.loginPasswordEl.value = '';
        
        // Učitavamo korisničke podatke i ažuriramo UI.
        await loadUserData();
    } catch (error) {
        // Prikazujemo poruku o grešci ako prijava ne uspe.
        displayMessage(DOM.loginMessageEl, error.message, 'error');
    }
}

// Funkcija za odjavu korisnika.
export function logoutUser() {
    // Brišemo sve podatke iz lokalnog skladišta.
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    currentUser = null;
    
    // Čistimo listu vežbi i treninga u UI.
    if(DOM.existingExercisesListEl) DOM.existingExercisesListEl.innerHTML = '<li class="no-exercises-message">Login to manage exercises.</li>';
    if(DOM.recentWorkoutsList) DOM.recentWorkoutsList.innerHTML = '';
    
    // Prebacujemo se nazad na izbor za autentifikaciju i ažuriramo UI.
    authViewMode = 'choice';
    updateUI(currentUser, authViewMode);
    displayMessage(DOM.appMessageEl, 'You have been logged out.', 'success');
}

// Funkcija za učitavanje podataka o korisniku pri pokretanju aplikacije.
// Poziva se da proveri da li je korisnik već prijavljen.
export async function loadUserData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && userId && username) {
        // Ako pronađemo podatke, postavljamo ih kao trenutnog korisnika.
        currentUser = { id: userId, username: username, token: token };
        updateUI(currentUser, authViewMode); // Ažuriramo UI za prijavljenog korisnika.
        await fetchExercises(); // Dohvatamo vežbe specifične za korisnika.
        await fetchRecentWorkouts(); // Dohvatamo nedavne treninge.
    } else {
        // Ako nema sačuvanih podataka, korisnik nije prijavljen.
        currentUser = null;
        authViewMode = 'choice';
        updateUI(currentUser, authViewMode);
        // Čistimo liste vežbi u UI.
        if(DOM.existingExercisesListEl) DOM.existingExercisesListEl.innerHTML = '<li class="no-exercises-message">Login to manage exercises.</li>';
    }
}

// Funkcije za prebacivanje između formi za autentifikaciju.
export function showRegisterForm() {
    authViewMode = 'register';
    updateUI(currentUser, authViewMode);
    displayMessage(DOM.regMessageEl, '', null);
    displayMessage(DOM.loginMessageEl, '', null);
    displayMessage(DOM.appMessageEl, '', null);
}

export function showLoginForm() {
    authViewMode = 'login';
    updateUI(currentUser, authViewMode);
    displayMessage(DOM.regMessageEl, '', null);
    displayMessage(DOM.loginMessageEl, '', null);
    // Poseban uslov: ne brišemo poruku o uspešnoj registraciji ako je prisutna.
    if (DOM.appMessageEl && !DOM.appMessageEl.textContent.includes('Registered successfully')) {
        displayMessage(DOM.appMessageEl, '', null);
    }
}

export function switchToAuthChoice() {
    authViewMode = 'choice';
    updateUI(currentUser, authViewMode);
    displayMessage(DOM.regMessageEl, '', null);
    displayMessage(DOM.loginMessageEl, '', null);
    // Opet, ne diramo poruku o uspešnoj registraciji.
    if (DOM.appMessageEl && DOM.appMessageEl.textContent.includes('Registered successfully')) {
        // ostavi poruku
    } else if (DOM.appMessageEl) {
        displayMessage(DOM.appMessageEl, '', null);
    }
}