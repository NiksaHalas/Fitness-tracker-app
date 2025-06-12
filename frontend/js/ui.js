// Ovde su funkcije zadužene za vizuelni prikaz i interakciju sa korisnikom.

import * as DOM from './domElements.js';

// Funkcija za prikazivanje poruka korisniku (uspeh, greška, info).
export function displayMessage(element, text, type, persistent = false) {
    if (!element) {
        console.warn('displayMessage: Element not found for message:', text);
        return;
    }
    element.textContent = text;
    element.className = 'message'; 
    if (type) {
        element.classList.add(type); 
    }
    element.classList.add('show'); 

    // Ako poruka nije trajna, sakrivamo je posle određenog vremena.
    if (!persistent && type) {
        setTimeout(() => {
            element.classList.remove('show');
            element.textContent = '';
        }, 5000);
    } else if (!type && !text) { 
          element.classList.remove('show');
          element.textContent = '';
    }
}

// Funkcija za ažuriranje vidljivosti delova UI-ja na osnovu stanja prijave i pogleda.
// Na primer, prikazujemo formu za login ako korisnik nije prijavljen, a sakrivamo je ako jeste.
export function updateUI(currentUser, authViewMode) {
    const allSections = [DOM.authSection, DOM.authChoiceDiv, DOM.registerFormContainer, DOM.loginFormContainer,
                            DOM.userInfoSection, DOM.workoutLogSection, DOM.progressSection, DOM.addExerciseSection];
    
    // Proveravamo da li svi potrebni elementi postoje u DOM-u.
    allSections.forEach(section => {
        if (!section) {
            console.warn("A UI section is missing from the DOM and cannot be updated.");
        }
    });

    if (currentUser) {
        // Ako je korisnik prijavljen, sakrivamo forme za autentifikaciju i prikazujemo aplikaciju.
        if (DOM.authSection) DOM.authSection.classList.add('hidden');
        if (DOM.authChoiceDiv) DOM.authChoiceDiv.classList.add('hidden');
        if (DOM.registerFormContainer) DOM.registerFormContainer.classList.add('hidden');
        if (DOM.loginFormContainer) DOM.loginFormContainer.classList.add('hidden');

        if (DOM.userInfoSection) DOM.userInfoSection.classList.remove('hidden');
        if (DOM.workoutLogSection) DOM.workoutLogSection.classList.remove('hidden');
        if (DOM.progressSection) DOM.progressSection.classList.remove('hidden');
        if (DOM.addExerciseSection) DOM.addExerciseSection.classList.remove('hidden');

        // Ažuriramo informacije o prijavljenom korisniku.
        if (DOM.loggedInUsernameEl) DOM.loggedInUsernameEl.textContent = currentUser.username;
        if (DOM.loggedInUserIdEl) DOM.loggedInUserIdEl.textContent = currentUser.id;
    } else {
        // Ako korisnik nije prijavljen, prikazujemo sekciju za autentifikaciju, a sakrivamo ostatak aplikacije.
        if (DOM.authSection) DOM.authSection.classList.remove('hidden');
        if (DOM.userInfoSection) DOM.userInfoSection.classList.add('hidden');
        if (DOM.workoutLogSection) DOM.workoutLogSection.classList.add('hidden');
        if (DOM.progressSection) DOM.progressSection.classList.add('hidden');
        if (DOM.addExerciseSection) DOM.addExerciseSection.classList.add('hidden');

        // Prikazujemo odgovarajuću formu (izbor, registracija, prijava) u okviru autentifikacije.
        if (authViewMode === 'choice') {
            if (DOM.authChoiceDiv) DOM.authChoiceDiv.classList.remove('hidden');
            if (DOM.registerFormContainer) DOM.registerFormContainer.classList.add('hidden');
            if (DOM.loginFormContainer) DOM.loginFormContainer.classList.add('hidden');
        } else if (authViewMode === 'register') {
            if (DOM.authChoiceDiv) DOM.authChoiceDiv.classList.add('hidden');
            if (DOM.registerFormContainer) DOM.registerFormContainer.classList.remove('hidden');
            if (DOM.loginFormContainer) DOM.loginFormContainer.classList.add('hidden');
        } else if (authViewMode === 'login') {
            if (DOM.authChoiceDiv) DOM.authChoiceDiv.classList.add('hidden');
            if (DOM.registerFormContainer) DOM.registerFormContainer.classList.add('hidden');
            if (DOM.loginFormContainer) DOM.loginFormContainer.classList.remove('hidden');
        }
    }
}