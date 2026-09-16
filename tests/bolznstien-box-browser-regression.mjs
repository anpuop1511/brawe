import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();
const runtimeErrors = [];
page.on('pageerror', error => runtimeErrors.push(error.message));

const url = `file:///${process.cwd().replace(/\\/g, '/')}/index.html`;
await page.goto(url);
await page.waitForFunction(() => window.__pureHTMLGame?.applyHeaterBoxDamage);

const result = await page.evaluate(() => {
  const api = window.__pureHTMLGame;
  const trainingBox = { x: 100, y: 100, w: 50, h: 50, hp: 4000, maxHp: 4000, isBox: true };
  api.destructibleWalls.push(trainingBox);
  const recognized = api.isHeaterLockableBox(trainingBox);
  api.applyHeaterBoxDamage(api.player, trainingBox, 900);
  const hpAfter = trainingBox.hp;
  const index = api.destructibleWalls.indexOf(trainingBox);
  if (index >= 0) api.destructibleWalls.splice(index, 1);
  return { recognized, hpAfter };
});

assert.equal(result.recognized, true, 'Training isBox target must be damageable');
assert.equal(result.hpAfter, 3100, 'Bolznstien world-object damage must reduce Training box HP');
assert.deepEqual(runtimeErrors, [], `Unexpected runtime errors: ${runtimeErrors.join('; ')}`);

await browser.close();
console.log('PASS: Bolznstien damages a live Training isBox target (4000 -> 3100 HP).');
