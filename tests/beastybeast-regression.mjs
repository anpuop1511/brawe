import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /beast:\s*\{[\s\S]{0,180}type: 'signature'[\s\S]{0,180}name: 'BeastyBeast'/, 'Beast owns the BeastyBeast Signature');
assert.match(game, /const beastScale = 0\.72 \+ \(level - 1\) \* 0\.028/, 'low-Power Beast damage uses the improved curve');
assert.match(game, /fighterId === 'beast'[\s\S]{0,520}ammo = 0[\s\S]{0,260}beastyBeastUntil = now \+ 5000/, 'activation consumes the full player ammo bar and lasts five seconds');
assert.match(game, /regularForm = !entity\.beastModeActive[\s\S]{0,320}fullAmmo[\s\S]{0,120}ready = entity\.hp > 0 && !active && regularForm && fullAmmo/, 'activation requires regular form and full ammo');
assert.match(game, /BEASTY_BEAST_CLAW_INTERVAL_MS = 120/, 'alternating claws are scheduled with updated interval');
assert.match(game, /beastyBeastNextClawAt \+= BEASTY_BEAST_CLAW_INTERVAL_MS/, 'BeastyBeast uses the centralized claw interval');
assert.match(game, /beastyBeastClawFlip = -side/, 'automatic claws alternate sides');
assert.match(game, /isBeastyBeastActive\(owner\)\) dealtDamage \*= 0\.60/, 'BeastyBeast deals forty percent less damage');
assert.match(game, /isBeastyBeastActive\(entity, now\)\) hpDamage = Math\.min\(hpDamage, Math\.max\(0, entity\.hp - 1\)\)/, 'BeastyBeast cannot be damaged below one HP');
assert.match(game, /selectedBrawler === 'beast' && isBeastyBeastActive\(player, now\)\) hcSpd \*= 1\.40/, 'BeastyBeast grants forty percent player movement speed');

console.log('BeastyBeast Signature regression checks passed.');
