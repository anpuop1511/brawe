import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../tactical-ui.css',import.meta.url),'utf8');

for(const id of ['homeCollectionNav','homeEventsNav','homeShopNav','homeMobileFighters','homeMobileEvents','homeMobileShop','homeMobileMore']){
  assert.match(html,new RegExp(`id="${id}"`),`${id} remains available in the redesigned shell`);
}
assert.match(html,/tactical-ui\.css\?v=20260902-mobile-v3-controls2/,'final tactical stylesheet loads after the legacy stylesheet');
assert.match(game,/data-fighter-test-coins[\s\S]{0,1800}testCoinClicks<10[\s\S]{0,200}playerData\.souls=\(playerData\.souls\|\|0\)\+1000000/,'Fighters wallet exposes the ten-click testing Soul grant');
assert.match(html,/id="homeProgressDock"[\s\S]{0,220}id="homeQuickActions"/,'progression shortcuts live in the clean progression dock');
assert.match(game,/shopBtn\.id = 'gemShopBtn'/,'the redesigned Shop navigation targets the real shop action');
assert.match(game,/homeCollectionNav'[\s\S]{0,180}openHomeFighters/,'desktop Fighters navigation opens the real roster');
assert.match(game,/homeMobileFighters'[\s\S]{0,180}openHomeFighters/,'mobile Fighters navigation opens the real roster');
assert.match(game,/class="brawler-browser__selected-kit"[\s\S]{0,1800}EDIT LOADOUT/,'the collection hero exposes the full live loadout');
assert.match(css,/\.brawler-browser:not\(\.brawler-detail-view\)\{[\s\S]{0,260}grid-template-columns:/,'desktop collection uses the new two-panel layout');
assert.match(css,/\.home-mobile-nav\{position:fixed/,'mobile navigation is present and fixed');
assert.match(css,/prefers-reduced-motion/,'the redesigned UI honors reduced-motion settings');
assert.match(game,/className = `brawler-card__special-triangle/,'every fighter card creates the universal Special triangle');
assert.match(game,/cardSpecialDef \? 'has-special' : 'no-special'/,'fighters without a Special receive the gray triangle state');
assert.match(game,/triangleSegments = \[[\s\S]{0,520}special-triangle__segment/,'Special ownership is rendered as three independent triangle pieces');
assert.match(css,/\.special-triangle__segment\.is-filled\{fill:var\(--special-color\)/,'owned Special pieces receive the ability color');
assert.doesNotMatch(game,/badge\.textContent=`\$\{cardSpecialDef\.icon\}/,'the old Special counter badge is retired from the ability row');

console.log('BRAWE tactical home and collection UI regression checks passed.');
