import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../tactical-ui.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const bootstrap=fs.readFileSync(new URL('../bootstrap.js',import.meta.url),'utf8');

assert.match(game,/window\.matchMedia\?\.\('\(max-width: 920px\)'\)\.matches/,'narrow devices initialize touch controls even when coarse-pointer detection is unavailable');
assert.match(game,/const radius = Math\.max\(30, rect\.width \* \.36\)/,'virtual stick travel scales with rendered stick size');
assert.match(game,/knobEl\.style\.left = '50%'[\s\S]{0,100}knobEl\.style\.top = '50%'/,'virtual sticks reliably reset to center');
assert.match(game,/mobileInput\.attackActive = true[\s\S]{0,180}setTimeout\(\(\) => \{ mobileInput\.attackActive = false;/,'releasing the aim stick fires a finite attack pulse');
assert.match(game,/startAimingSuper\('mobile'\)[\s\S]{0,1200}const shouldCancel = superAimCancelState\.leftDeadZone && superAimCancelState\.cancel;[\s\S]{0,100}releaseSuper\(shouldCancel\)/,'mobile Super taps quick-cast while drag-back still cancels');
assert.match(game,/if \(combatBrawler === 'cursed'\) \{ castCursedStorm\(player,!!isHypercharged\); updateSuperButton\(\); return; \}/,'Cursed uses the shared player Super cast path');
assert.match(game,/function castCursedStorm\(owner, hyper\)[\s\S]{0,500}cursedStorms\.push\(\{ownerId:owner\.id,x:owner\.x,y:owner\.y/,'Cursed Storm creates its owner-following storm');
assert.match(game,/button\[aria-label="Aim Power Move"\]/,'Super cancel feedback targets the real mobile Super button');
for(const klass of ['mobile-action-btn--gadget','mobile-action-btn--signature','mobile-action-btn--super','mobile-action-btn--hyper']) assert.match(game,new RegExp(klass),`${klass} is wired`);
assert.match(game,/function syncMobileActionButtons\(\)[\s\S]{0,1800}--mobile-charge/,'mobile actions mirror live readiness and charge');
assert.match(game,/#mobileControlsRoot\{z-index:120/,'combat controls render above match HUD overlays');
assert.match(game,/#mobileAimStick::after\{content:'AIM \+ FIRE'/,'the attack stick has a clear role label');
assert.match(css,/Mobile V3 — thumb-first lobby/,'the final mobile override layer is installed');
assert.match(css,/#homeHeader\{position:sticky!important[\s\S]{0,420}grid-template-rows:54px 36px/,'mobile home uses a compact sticky header');
assert.match(css,/\.brawler-browser__controls\{order:3!important;position:sticky!important/,'mobile roster filters stay reachable while scrolling');
assert.match(css,/\.brawler-browser__grid\{order:4!important[\s\S]{0,180}repeat\(2,minmax\(0,1fr\)\)/,'mobile roster uses a stable two-column grid');
assert.match(css,/min-height:44px!important/,'utility touch targets retain accessible sizing');
assert.match(html,/20260903-schoolclassy1/,'mobile rebuild assets are cache-busted');
assert.match(bootstrap,/20260903-schoolclassy1/,'runtime game script is cache-busted');

console.log('BRAWE mobile V3 layout and control regression checks passed.');
