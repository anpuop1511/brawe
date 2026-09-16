import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

assert.match(game, /dmg: Math\.round\(520 \* scale\)/, 'Oil Maker P11 crude damage should be 520');
assert.match(game, /const speed = 630;\s*const range = 560;/, 'Crude Spray should receive the requested +40% projectile-speed buff');
assert.match(game, /const shotAngles = isHyper \? \[ang - 0\.105, ang \+ 0\.105\]/, 'Hyper Crude Spray should fire two wider streams');
assert.match(game, /hyperVisual: !!isHyper/, 'Hyper crude projectiles should opt into the purple visual path');
assert.doesNotMatch(game, /oilMakerHcSpeedUntil\s*=\s*now \+ 1200/, 'Hyper main attack must not grant its old movement burst');
assert.match(game, /oilMakerBurnCooldowns/, 'Connected Oil Maker infernos should share a per-target burn limiter');
assert.match(game, /spawnAt: now \+ 900/g, 'Oil puddles should settle promptly after impact');

assert.match(game, /function updateSuperUseIndicator\(/, 'Multi-use Super UI should be centralized');
assert.match(game, /dataset\.superUsesLabel = `\$\{uses\}\/\$\{maxUses\} USES`/, 'Desktop Super UI should expose current and maximum uses');
assert.match(game, /superTouchBtn\.textContent = `★ \$\{charges\}\/\$\{maxCharges\}`/, 'Mobile Super UI should expose current and maximum uses');
assert.match(css, /#super\[data-super-uses-label\]::before/, 'Desktop multi-use count should have a visible badge');

console.log('Oil Maker and multi-use Super UI regression checks passed.');
