const hud = document.getElementById('hud');
const homeScreen = document.getElementById('homeScreen');
const legacyCanvas = document.getElementById('gameCanvas');
const appRoot = document.getElementById('app');

// The legacy canvas game is still the active runtime. Keeping this setup in
// its own entry point makes index.html responsible for markup only.
if (appRoot) appRoot.style.display = 'none';
if (legacyCanvas) legacyCanvas.style.display = 'block';
if (hud) hud.style.display = 'none';
if (homeScreen) homeScreen.style.display = '';

const gameScript = document.createElement('script');
gameScript.src = './game.js';
document.body.appendChild(gameScript);
