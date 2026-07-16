const hud = document.getElementById('hud');
const homeScreen = document.getElementById('homeScreen');
const legacyCanvas = document.getElementById('gameCanvas');
const appRoot = document.getElementById('app');

window.addEventListener('error', (event) => {
  if (homeScreen) homeScreen.style.display = '';
  let panel = document.getElementById('runtimeRecoveryPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'runtimeRecoveryPanel';
    panel.style.cssText = 'position:fixed;left:18px;bottom:18px;z-index:9999;max-width:min(680px,calc(100vw - 36px));padding:14px 16px;border:2px solid #ff6b81;border-radius:12px;background:#170b18;color:#ffe8ee;font:700 13px/1.4 monospace;box-shadow:0 12px 36px #0009;';
    document.body.appendChild(panel);
  }
  panel.textContent = `Runtime error: ${event.message || 'Unknown error'}${event.filename ? ` • ${event.filename.split('/').pop()}:${event.lineno || '?'}` : ''}`;
});

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
gameScript.src = './game.js?v=20260715-fuserlanes1';
gameScript.addEventListener('load', () => { if (homeScreen) homeScreen.style.display = ''; });
gameScript.addEventListener('error', () => {
  if (homeScreen) homeScreen.style.display = '';
  homeScreen?.insertAdjacentHTML('afterbegin','<div style="padding:10px;border:2px solid #ff6b81;border-radius:10px;background:#260d19;color:#ffe8ee;font-weight:900">Game script failed to load. Refresh this page once.</div>');
});
document.body.appendChild(gameScript);
