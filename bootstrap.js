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
// Keep this release token aligned with index.html. GitHub Pages and browsers
// may cache the large runtime, so a versioned URL ensures new game content is
// loaded immediately after a deployment.
gameScript.src = './game.js?v=20260713-2';
document.body.appendChild(gameScript);
