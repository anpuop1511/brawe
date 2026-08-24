import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../tactical-ui.css', import.meta.url), 'utf8');

for (const id of ['homeLobbyNav','homeMobileLobby','homeLobbyView','homeEventsView','homePersonalPanel','homeGreeting','homeSelectedEventCard','homeSelectedEventName','homeCareerSnapshot','homeFeaturedOffer']) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `missing home VNext element ${id}`);
}
assert.match(game,/function setHomeTab\(tab = 'home'\)/,'home uses a real tab controller');
assert.match(game,/setHomeTab\('events'\)/,'Events navigation opens the Events tab');
assert.match(game,/function refreshPersonalizedHome\(\)/,'personalized home data is refreshed centrally');
assert.match(game,/homeSelectedEventCard'\)\?\.addEventListener\('click',focusHomeEvents\)/,'selected event card opens the dedicated Events tab');
assert.match(game,/FORGE MARKET/,'shop has the new Forge Market identity');
assert.match(game,/renderDailyDealsTab/,'shop includes daily deals');
assert.match(game,/renderFighterDealTab/,'shop includes selected-fighter deals');
assert.match(game,/getShopClaimKey\('forge-supply'/,'daily supply persists by cycle');
assert.match(game,/getShopClaimKey\(`fighter-upgrade-\$\{selectedBrawler\}`/,'fighter upgrade deal persists per brawler and cycle');
assert.match(css,/#homeLobbyView\.is-active/,'lobby tab has dedicated layout');
assert.match(css,/\.brawe-shop-panel/,'Forge Market has dedicated responsive presentation');

console.log('Home VNext and Forge Market regression checks passed.');
