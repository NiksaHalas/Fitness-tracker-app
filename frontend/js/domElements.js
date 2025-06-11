// domElements.js

// Ovde sakupljamo sve reference na HTML elemente koje koristimo u aplikaciji.

// Elementi za registraciju korisnika
export const regUsernameEl = document.getElementById('regUsername');
export const regEmailEl = document.getElementById('regEmail');
export const regPasswordEl = document.getElementById('regPassword');
export const regMessageEl = document.getElementById('regMessage');
export const registerButton = document.getElementById('registerButton');

// Elementi za prijavu korisnika
export const loginEmailEl = document.getElementById('loginEmail');
export const loginPasswordEl = document.getElementById('loginPassword');
export const loginMessageEl = document.getElementById('loginMessage');
export const loginButton = document.getElementById('loginButton');

// Elementi za navigaciju između formi za autentifikaciju
export const authSection = document.getElementById('authSection');
export const authChoiceDiv = document.getElementById('authChoice');
export const registerFormContainer = document.getElementById('registerFormContainer');
export const loginFormContainer = document.getElementById('loginFormContainer');
export const showRegisterFormButton = document.getElementById('showRegisterFormButton');
export const showLoginFormButton = document.getElementById('showLoginFormButton');
export const backToAuthChoiceFromRegister = document.getElementById('backToAuthChoiceFromRegister');
export const backToAuthChoiceFromLogin = document.getElementById('backToAuthChoiceFromLogin');

// Elementi za prikaz informacija o prijavljenom korisniku
export const userInfoSection = document.getElementById('userInfoSection');
export const loggedInUsernameEl = document.getElementById('loggedInUsername');
export const loggedInUserIdEl = document.getElementById('loggedInUserId');
export const logoutButton = document.getElementById('logoutButton');

// Glavne sekcije aplikacije
export const workoutLogSection = document.getElementById('workoutLogSection');
export const progressSection = document.getElementById('progressSection');
export const addExerciseSection = document.getElementById('addExerciseSection');

// Elementi za logovanje treninga
export const exerciseSelect = document.getElementById('exerciseSelect');
export const progressExerciseSelect = document.getElementById('progressExerciseSelect');
export const recentWorkoutsList = document.getElementById('recentWorkoutsList');
export const logWorkoutMessageEl = document.getElementById('logWorkoutMessage');
export const logWorkoutButton = document.getElementById('logWorkoutButton');
export const workoutDateInput = document.getElementById('workoutDate');
export const durationInput = document.getElementById('duration');
export const distanceInput = document.getElementById('distance');
export const setsInput = document.getElementById('sets');
export const repsInput = document.getElementById('reps');
export const weightInput = document.getElementById('weight');
export const notesInput = document.getElementById('notes');


// Elementi za dodavanje novih vežbi
export const exNameEl = document.getElementById('exName');
export const exDescEl = document.getElementById('exDesc');
export const exCatEl = document.getElementById('exCat');
export const addExMessageEl = document.getElementById('addExMessage');
export const addExerciseButton = document.getElementById('addExerciseButton');

// Elementi za praćenje progresa
export const fetchProgressButton = document.getElementById('fetchProgressButton');
export const progressMessageEl = document.getElementById('progressMessage');
export const progressChartCanvas = document.getElementById('progressChart');


// Opšta poruka aplikacije
export const appMessageEl = document.getElementById('appMessage');

// Elementi za upravljanje postojećim vežbama (brisanje)
export const existingExercisesListEl = document.getElementById('existingExercisesList');
export const deleteExMessageEl = document.getElementById('deleteExMessage');