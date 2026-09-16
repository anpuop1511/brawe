import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/modules/progression/pass-tokens.js*', route => route.abort('failed'));
  await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
  await page.waitForFunction(() => !!window.__pureHTMLGame?.refreshHomeUI, {}, { timeout: 10000 });

  assert(await page.evaluate(() => !!window.BrawePassTokens), 'Pass Token fallback is installed after deployment 404');
  assert.equal(await page.locator('#runtimeRecoveryPanel').count(), 0, 'Optional module 404 is not shown as a fatal runtime error');
  assert.equal(await page.locator('#soulSummonerBtn').count(), 1, 'Soul Summoner button registers');
  await page.evaluate(() => document.querySelector('#soulSummonerBtn').click());
  await page.waitForFunction(() => document.body.innerText.includes('SOUL SUMMONER · STARR ROAD'));
  assert.equal(errors.length, 0, `No runtime errors expected: ${errors.join('; ')}`);
  console.log('PASS: GitHub Pages missing Pass Token asset falls back and Soul Summoner opens.');
} finally {
  await browser.close();
}
