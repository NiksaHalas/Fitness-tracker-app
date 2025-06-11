// frontend/app.js

import * as DOM from './domElements.js';
import { displayMessage } from './ui.js';
import { updateUI } from './ui.js';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    loadUserData, 
    currentUser, 
    authViewMode, 
    showRegisterForm, 
    showLoginForm, 
    switchToAuthChoice 
} from './auth.js';
import { addExerciseType, fetchExercises } from './exercises.js';
import { logWorkout, fetchRecentWorkouts } from './workouts.js';
import { fetchProgress, resetChart } from './progress.js'; 

// Inicijalizacija aplikacije i registracija svih događaja.
document.addEventListener('DOMContentLoaded', () => {
    // Postavljamo današnji datum kao default vrednost za unos treninga.
    if (DOM.workoutDateInput && !DOM.workoutDateInput.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        DOM.workoutDateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Registracija Event Listenera za dugmad i forme.
    // Sada pozivamo funkcije iz odgovarajućih modula.
    if (DOM.registerButton) DOM.registerButton.addEventListener('click', registerUser);
    if (DOM.loginButton) DOM.loginButton.addEventListener('click', loginUser);
    
    // Za logout, pored brisanja podataka, treba resetovati i grafikon.
    if (DOM.logoutButton) DOM.logoutButton.addEventListener('click', () => {
        logoutUser();
        resetChart();
    });
    
    if (DOM.addExerciseButton) DOM.addExerciseButton.addEventListener('click', addExerciseType);
    if (DOM.logWorkoutButton) DOM.logWorkoutButton.addEventListener('click', logWorkout);
    if (DOM.fetchProgressButton) DOM.fetchProgressButton.addEventListener('click', fetchProgress);

    // Event listeneri za prebacivanje između autenfikacionih formi.
    if (DOM.showRegisterFormButton) DOM.showRegisterFormButton.addEventListener('click', showRegisterForm);
    if (DOM.showLoginFormButton) DOM.showLoginFormButton.addEventListener('click', showLoginForm);
    if (DOM.backToAuthChoiceFromRegister) DOM.backToAuthChoiceFromRegister.addEventListener('click', switchToAuthChoice);
    if (DOM.backToAuthChoiceFromLogin) DOM.backToAuthChoiceFromLogin.addEventListener('click', switchToAuthChoice);
    
    // Prvo što radimo kad se stranica učita je pokušaj učitavanja korisničkih podataka.
    loadUserData();
    updateUI(currentUser, authViewMode);
});