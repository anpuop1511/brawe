import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 1. Angel -30% Healing Balance
assert.match(
  game,
  /healAmt:hyper\?\(isBot\?455:630\):\(isBot\?735:1015\)/,
  'Angel Guiding Light projectile spawns with -30% healing values (Player: 1015/630, Bot: 735/455)'
);

assert.match(
  game,
  /doHeal\(target,\s*projectile\.healAmt\s*\|\|\s*1015\)/,
  'applyAngelAllyHit uses 1015 default healAmt fallback for -30% baseline'
);

// 2. Angel Lift Flight Initiation
assert.match(
  game,
  /target\.angelLiftCooldownUntil\s*=\s*now\s*\+\s*3500;[\s\S]{0,120}target\.angelLiftDuration\s*=\s*900;[\s\S]{0,120}target\.angelLiftUntil\s*=\s*now\s*\+\s*900;[\s\S]{0,120}target\.isFlying\s*=\s*true;[\s\S]{0,120}target\.angelLiftOwnerId\s*=\s*owner\.id;[\s\S]{0,120}target\.z\s*=\s*10;/,
  'applyAngelAllyHit initiates 900ms lift duration with flight flag and elevation seed'
);

// 3. Angel Lift Arc Elevation & Landing Reset
assert.match(
  game,
  /if\s*\(entity\.angelLiftUntil\)\s*\{[\s\S]{0,200}if\s*\(now\s*<\s*entity\.angelLiftUntil\)\s*\{[\s\S]{0,350}entity\.isFlying\s*=\s*true;[\s\S]{0,120}entity\.z\s*=\s*Math\.sin\(liftProg\s*\*\s*Math\.PI\)\s*\*\s*58;[\s\S]{0,250}\}\s*else\s*\{[\s\S]{0,120}entity\.angelLiftUntil\s*=\s*0;[\s\S]{0,80}entity\.isFlying\s*=\s*false;[\s\S]{0,80}entity\.z\s*=\s*0;/,
  'updateAngelDemonStates elevates lifted entities with a smooth sine arc up to 58px and cleanly lands on expiration'
);

// 4. checkHit Lift Untargetability / Dodging
assert.match(
  game,
  /if\s*\(target\s*&&\s*\(target\.angelLiftUntil\s*\|\|\s*0\)\s*>\s*performance\.now\(\)\s*&&\s*\(!b\s*\|\|\s*\(!b\.super\s*&&\s*!b\.pierceWalls\)\)\)\s*\{[\s\S]{0,160}return\s*false;/,
  'checkHit protects lifted airborne allies from non-super/non-wall-piercing incoming projectiles'
);

// 5. Emergency Landing (G2) resets z elevation and flight
assert.match(
  game,
  /e\.angelLiftUntil>now\)\)\{ally\.angelLiftUntil=0;ally\.isFlying=false;ally\.z=0;doHeal\(ally,1600\);/,
  'Angel G2 gadget lands lifted allies immediately resetting z and isFlying'
);

console.log('Angel balance & Lift mechanics regression tests passed successfully.');
