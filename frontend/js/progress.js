// progress.js

// Ovaj fajl se fokusira na logiku za prikazivanje grafikona progresa.

import * as DOM from './domElements.js';
import { displayMessage } from './ui.js';
import { apiRequest } from './api.js';
import { currentUser } from './auth.js'; 

// Promenljiva za instancu Chart.js grafikona.
let myChart = null;

// Funkcija za dohvat i prikaz podataka o progresu u grafikonu.
export async function fetchProgress() {
    if (DOM.progressMessageEl) displayMessage(DOM.progressMessageEl, '', null);
    if (!currentUser) {
        displayMessage(DOM.progressMessageEl, 'Please log in to see progress.', 'error');
        return;
    }
    
    const exerciseId = DOM.progressExerciseSelect.value;
    if (!exerciseId) {
        displayMessage(DOM.progressMessageEl, 'Please select an exercise to track.', 'error');
        return;
    }

    try {
        // Šaljemo zahtev ka Progress servisu da dobijemo podatke pripremljene za grafikon.
        const progressData = await apiRequest(`/progress/user/${currentUser.id}/exercise/${exerciseId}`, 'GET', null, true);
        
        // Dobijamo kontekst canvas elementa gde će se crtati grafikon.
        const ctx = DOM.progressChartCanvas.getContext('2d');
        
        // Ako već postoji grafikon, uništavamo ga da ne bi došlo do preklapanja.
        if (myChart) {
            myChart.destroy();
        }
        
        // Kreiramo novu Chart.js instancu sa podacima i opcijama dobijenim sa servera.
        myChart = new Chart(ctx, {
            type: 'line', 
            data: progressData.chartData, 
            options: progressData.chartOptions || { 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#5A6A78' }, grid: { color: '#E0E6ED' } },
                    x: { ticks: { color: '#5A6A78' }, grid: { color: '#E0E6ED' } }
                },
                plugins: { legend: { labels: { color: '#2C3A47' } } }
            }
        });
    } catch (error) {
        displayMessage(DOM.progressMessageEl, `Error fetching progress: ${error.message}`, 'error');
        console.error("Progress fetch error", error);
        // Ako dođe do greške, uništavamo grafikon ako postoji.
        if (myChart) {
            myChart.destroy(); 
            myChart = null;
        }
    }
}

// Funkcija za resetovanje grafikona kada se korisnik odjavi.
export function resetChart() {
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
}