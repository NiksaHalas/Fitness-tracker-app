// frontend/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Pomoćna funkcija koja pokreće servis.
function startService(servicePath) {
  return spawn('npm', ['start'], {
    cwd: path.join(__dirname, '..', servicePath),
    shell: true,
    stdio: 'inherit'
  });
}


app.whenReady().then(() => {
  // Pokreni servise SAMO ako nije disable-ovano preko env
  if (process.env.START_SERVICES !== 'false') {
    const services = [
      'api-gateway',
      'exercise-service',
      'performance-entry-service',
      'progress-service',
      'user-service'
    ];
    services.forEach(service => startService(service));
  }

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
