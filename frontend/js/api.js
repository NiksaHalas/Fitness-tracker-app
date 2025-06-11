// api.js

// Ovaj fajl sadrži funkciju za slanje svih HTTP zahteva ka našem API Gateway-u.

import { API_GATEWAY_URL } from './config.js';

// Funkcija za slanje API zahteva.
export async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    
    // Ako je potrebna autentifikacija, dodajemo token iz lokalnog skladišta u zaglavlje.
    if (requiresAuth && localStorage.getItem('token')) {
        headers['x-auth-token'] = localStorage.getItem('token');
    }

    const config = { method, headers };
    // Ako postoji telo zahteva, pretvaramo ga u JSON string.
    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        // Šaljemo zahtev.
        const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, config);
        const data = await response.json(); 

        // Ako odgovor nije uspešan, bacamo grešku.
        if (!response.ok) {
            console.error('API Error:', data);
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        // Vraćamo podatke ako je sve prošlo kako treba.
        return data;
    } catch (error) {
        // Logujemo i ponovo bacamo grešku ako nešto krene naopako (npr. problem sa mrežom).
        console.error('Fetch error:', error);
        throw error;
    }
}