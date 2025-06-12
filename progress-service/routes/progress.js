const express = require('express');
const axios = require('axios'); 
const router = express.Router();

// Ruta za dobijanje podataka o progresu za određenog korisnika i vežbu.
router.get('/user/:userId/exercise/:exerciseId', async (req, res) => {
    const { userId, exerciseId } = req.params;



    const performanceServiceBaseUrl = process.env.PERFORMANCE_ENTRY_SERVICE_URL;
    if (!performanceServiceBaseUrl) {
        console.error('CRITICAL ERROR: PERFORMANCE_ENTRY_SERVICE_URL is not defined in the environment variables.');
        return res.status(500).json({
            error: 'Configuration error.',
            message: 'The Performance Entry Service URL is not configured on the server.'
        });
    }

     // Konstruišemo URL za poziv Performance Entry servisa.
    const performanceEntryServiceUrl = `${performanceServiceBaseUrl}/api/entries/user/${userId}/exercise/${exerciseId}`;

    try {
        console.log(`Progress Service: Attempting to fetch data from: ${performanceEntryServiceUrl}`); 
 
        const response = await axios.get(performanceEntryServiceUrl, {
        });
        const entries = response.data;

        if (!entries || (Array.isArray(entries) && entries.length === 0)) {
            return res.status(404).json({
                message: 'No performance data found for this user and exercise.',
                details: `Query to ${performanceEntryServiceUrl} returned no entries.`
            });
        }

         // Osiguravamo se da su dobijeni podaci u formatu niza.
        if (!Array.isArray(entries)) {
            console.error(`Progress Service: Invalid data format received from Performance Entry Service. Expected array, got: ${typeof entries}`, entries);
            return res.status(500).json({
                error: 'Invalid data format from upstream service.',
                message: 'The performance entry service returned data in an unexpected format.'
            });
        }

        // Pripremamo podatke u formatu pogodnom za crtanje grafikona.
        const chartData = {
            labels: entries.map(entry => new Date(entry.date).toLocaleDateString()), 
            datasets: [
                {
                    label: `Weight (kg) for ${entries[0]?.exerciseName || 'Exercise'}`, 
                    data: entries.map(entry => entry.weightKg), 
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: `Reps for ${entries[0]?.exerciseName || 'Exercise'}`,
                    data: entries.map(entry => entry.reps), 
                    fill: false,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    yAxisID: 'yReps'
                }
            ]
        };

         // Definišemo opcije za prikaz grafikona, kao što su ose i njihovi naslovi.
        const chartOptions = {
            scales: {
                y: { 
                    beginAtZero: true,
                    title: { display: true, text: 'Weight (kg)' }
                },
                yReps: { 
                    position: 'right',
                    beginAtZero: true,
                    title: { display: true, text: 'Reps' },
                    grid: {
                        drawOnChartArea: false 
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false 
        };

       
        res.json({
            message: 'Progress data retrieved successfully.',
            chartData,
            chartOptions,
            rawEntries: entries 
        });

         // Obrađujemo greške koje se mogu desiti prilikom dohvatanja podataka.
    } catch (error) {
        console.error(`Progress Service: Error fetching progress data for user ${userId}, exercise ${exerciseId}. URL: ${performanceEntryServiceUrl}`);

        let status = 500;
        let errorResponse = {
            error: 'Server error while fetching progress data.',
            message: 'An unexpected error occurred.',
            details: error.message 
        };

        if (error.response) {
    
            console.error('Error Response from Performance Entry Service:', error.response.data);
            console.error('Error Status from Performance Entry Service:', error.response.status);
            console.error('Error Headers from Performance Entry Service:', error.response.headers);

            status = error.response.status || 500;
            errorResponse.error = `Upstream service error (status ${status}).`;
            if (typeof error.response.data === 'object' && error.response.data !== null) {
                errorResponse.message = error.response.data.message || error.response.data.error || 'Error from upstream service.';
                errorResponse.details = error.response.data;
            } else {
                errorResponse.message = `Error from upstream service: ${error.response.statusText}`;
                errorResponse.details = error.response.data; 
            }
            if (error.response.status === 404) {
                 errorResponse.error = 'Data not found via upstream service.';
                 errorResponse.message = 'No performance data found via the performance entry service.';
            }

        } else if (error.request) {
            console.error('No response received from Performance Entry Service:', error.request);
            errorResponse.error = 'Network error or no response from upstream service.';
            errorResponse.message = 'Could not connect to the Performance Entry Service.';
        } else {
            console.error('Error setting up request to Performance Entry Service:', error.message);
            errorResponse.error = 'Request setup error.';
            errorResponse.message = 'There was an issue preparing the request to the Performance Entry Service.';
        }

        res.status(status).json(errorResponse);
    }
});

// Izvozimo ruter.
module.exports = router;
