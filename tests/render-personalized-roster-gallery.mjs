import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(process.env.BRAWE_PLAYWRIGHT || 'C:/Users/test/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'tests', 'personalized-roster-gallery.png');
const browser = await playwright.chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 2240 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><style>
    *{box-sizing:border-box}body{margin:0;padding:28px;background:#050b16;color:#eef8ff;font-family:system-ui,sans-serif}
    h1{margin:0 0 6px;font-size:32px}p{margin:0 0 22px;color:#85a8c9}.grid{display:grid;grid-template-columns:repeat(9,1fr);gap:12px}
    article{min-width:0;padding:10px;border:1px solid #28415f;border-radius:14px;background:linear-gradient(155deg,#13253c,#07101f);box-shadow:0 8px 20px #0006}
    .art{height:116px;border-radius:10px;background:radial-gradient(circle at 50% 36%,#224768,#07101d 72%);overflow:hidden}
    svg{width:100%;height:100%;filter:drop-shadow(0 6px 5px #0009)}b{display:block;margin-top:7px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase}
  </style><h1>BRAWE — PERSONALIZED 2.5D ROSTER</h1><p>Every card below uses its fighter's own geometry registry.</p><main class="grid"></main>`);
  await page.addScriptTag({ path: path.join(root, 'modules', 'visuals', 'roster-2p5d.js') });
  await page.evaluate(() => {
    const grid = document.querySelector('.grid');
    for (const id of Object.keys(BraweRosterVisuals.looks)) {
      const card = document.createElement('article');
      card.innerHTML = `<div class="art">${BraweRosterVisuals.portrait(id)}</div><b>${id.replaceAll('_',' ')}</b>`;
      grid.appendChild(card);
    }
  });
  await page.screenshot({ path: output, fullPage: true });
  console.log(output);
} finally { await browser.close(); }
