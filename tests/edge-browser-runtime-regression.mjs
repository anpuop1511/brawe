import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') {
    console.log('CONSOLE ERROR:', msg.text());
    errors.push(msg.text());
  }
});
page.on('pageerror', err => {
  console.log('PAGE ERROR STACK:\n', err.stack || err.message);
  errors.push(err.stack || err.message);
});

const url = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
console.log('Navigating to', url);
await page.goto(url);
await page.waitForTimeout(1000);

// Test selecting different brawlers
const brawlersToTest = ['magnatar', 'bolznstien', 'beam', 'warrior', 'drainbow', 'mageny', 'trampaheal'];

for (const b of brawlersToTest) {
  console.log(`Selecting brawler: ${b}...`);
  await page.evaluate((bId) => {
    const select = document.getElementById('brawlerSelect');
    if (select) {
      select.value = bId;
      select.dispatchEvent(new Event('change'));
    }
  }, b);
  await page.waitForTimeout(200);
}

// Test clicking home buttons, modal buttons, tabs
console.log('Testing Home UI tabs and buttons...');
await page.evaluate(() => {
  const btns = document.querySelectorAll('button');
  for (const btn of btns) {
    if (btn.id !== 'startBtn' && btn.id !== 'quitBtn') {
      try { btn.click(); } catch(e) { console.error('Click error on button:', btn.id, e); }
    }
  }
});
await page.waitForTimeout(1000);

// Test starting match as Bolznstien
console.log('Starting match as Bolznstien...');
await page.evaluate(() => {
  const select = document.getElementById('brawlerSelect');
  if (select) {
    select.value = 'bolznstien';
    select.dispatchEvent(new Event('change'));
  }
  const startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.click();
});
await page.waitForTimeout(1500);

// Fire attack, super, gadget
await page.mouse.down();
await page.waitForTimeout(300);
await page.mouse.up();
await page.keyboard.press('KeyE');
await page.keyboard.press('KeyQ');
await page.keyboard.press('KeyF'); // Hypercharge key
await page.waitForTimeout(1500);

// Quit and test Magnatar in match
console.log('Testing match as Magnatar...');
await page.evaluate(() => {
  const quitBtn = document.getElementById('quitBtn');
  if (quitBtn) quitBtn.click();
});
await page.waitForTimeout(1000);

await page.evaluate(() => {
  const select = document.getElementById('brawlerSelect');
  if (select) {
    select.value = 'magnatar';
    select.dispatchEvent(new Event('change'));
  }
  const startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.click();
});
await page.waitForTimeout(1500);

// Magnatar attack hold and release (spawns planetary orbs)
await page.mouse.move(500, 400);
await page.mouse.down();
await page.waitForTimeout(800);
await page.mouse.up();
await page.waitForTimeout(600);

// Aim Magnatar Super (renders upgraded 660px range, directional chevrons, auto-lock preview)
await page.keyboard.press('KeyE');
await page.waitForTimeout(400);
await page.mouse.click(550, 350);
await page.waitForTimeout(1500);

// Activate Hypercharge & Super in HC
await page.keyboard.press('KeyY');
await page.waitForTimeout(300);
await page.keyboard.press('KeyE');
await page.waitForTimeout(400);
await page.mouse.click(520, 330);
await page.waitForTimeout(1500);

// Quit and test Custom Mutator Clash
console.log('Quitting and testing Custom Clash...');
await page.evaluate(() => {
  const quitBtn = document.getElementById('quitBtn');
  if (quitBtn) quitBtn.click();
});
await page.waitForTimeout(1000);

// Test Custom Clash mode
await page.evaluate(() => {
  const modeSelect = document.getElementById('modeSelect') || document.getElementById('showdownModeSelect');
  if (modeSelect) {
    modeSelect.value = 'custom_clash';
    modeSelect.dispatchEvent(new Event('change'));
  }
  const startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.click();
});
await page.waitForTimeout(1000);

// If picker modal opened, click launch
await page.evaluate(() => {
  const launchBtn = document.getElementById('customMutatorLaunchBtn');
  if (launchBtn) launchBtn.click();
});
await page.waitForTimeout(2000);

await browser.close();

console.log('--- TEST RUN COMPLETE ---');
console.log('Total errors caught:', errors.length);
if (errors.length > 0) {
  process.exit(1);
}
