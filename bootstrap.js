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

const RELEASE_TOKEN = '20260905-blinkeye-fix2';

function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${src}?v=${RELEASE_TOKEN}`;
    script.addEventListener('load', () => resolve(src));
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
    document.body.appendChild(script);
  });
}

async function startLegacyRuntime() {
  // These are classic scripts rather than ES modules so local file downloads
  // continue working on mobile browsers without a web server.
  const moduleFiles = [
    './modules/progression/pass-tokens.js',
    './modules/visuals/roster-2p5d.js',
    './modules/core/registry.js',
    './modules/brawlers/common/roster.js',
    './modules/brawlers/common/outlit.js',
    './modules/brawlers/rare/roster.js',
    './modules/brawlers/super-rare/roster.js',
    './modules/brawlers/epic/roster.js',
    './modules/brawlers/mythic/roster.js',
    './modules/brawlers/legendary/roster.js',
    './modules/brawlers/exotic/roster.js',
    './modules/brawlers/anomaly/roster.js'
  ];

  for (const file of moduleFiles) {
    await loadClassicScript(file);
    window.ArenaForgeModules?.loadedFiles.push(file);
  }

  await loadClassicScript('./game.js');
  if (homeScreen) homeScreen.style.display = '';
}

startLegacyRuntime().catch((error) => {
  if (homeScreen) homeScreen.style.display = '';
  homeScreen?.insertAdjacentHTML('afterbegin', `<div style="padding:10px;border:2px solid #ff6b81;border-radius:10px;background:#260d19;color:#ffe8ee;font-weight:900">${error.message}. Refresh this page once.</div>`);
});
