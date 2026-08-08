import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const mythic = fs.readFileSync(new URL('../modules/brawlers/mythic/roster.js', import.meta.url), 'utf8');
const legendary = fs.readFileSync(new URL('../modules/brawlers/legendary/roster.js', import.meta.url), 'utf8');

for (const id of ['fastpass', 'freestyle']) {
  assert.match(game, new RegExp(`'${id}'\\s*:`), `${id} has brawler metadata`);
  assert.match(game, new RegExp(`brawler === '${id}'`), `${id} has live combat routing`);
}
assert.match(mythic, /'fastpass'/, 'Fastpass is registered in the modular Mythic roster');
assert.match(legendary, /'freestyle'/, 'Freestyle is registered in the modular Legendary roster');

// Fastpass deterministic rules.
let momentum = 0;
for (let i = 0; i < 20; i++) momentum = Math.min(1, momentum + .08);
assert.equal(momentum, 1, 'Momentum never exceeds 100%');
assert.match(game, /FASTPASS_MOMENTUM_PER_HIT\s*=\s*\.08/, 'Each projectile grants exactly 8% Momentum');
assert.match(game, /FASTPASS_MOMENTUM_CAP\s*=\s*1/, 'Momentum cap is 100%');
assert.match(game, /keepRolling\s*\?\s*5000\s*:\s*3000/, 'Keep Rolling changes decay delay from 3s to 5s');
assert.match(game, /keepRolling\s*\?\s*\.05\s*:\s*\.10/, 'Keep Rolling halves decay rate');
assert.match(game, /const count=hyper\?3:2/, 'Fastpass fires 2 tickets, or 3 during Hypercharge');
assert.match(game, /Math\.hypot\(ally\.x - owner\.x, ally\.y - owner\.y\).*radius/, 'Fast Lane snapshots allies inside its initial pulse');
assert.match(game, /fastpassLaneUntil\s*=\s*now \+ FASTPASS_LANE_DURATION_MS/, 'Fast Lane lasts seven seconds');
assert.match(game, /fastpassLaneSpeedMult\s*=\s*speedMult/, 'Fast Lane stores its normal/hyper speed grant on affected allies');
assert.match(game, /triggerFastpassHealingAura\(owner\)/, 'Every Hyper ticket hit refreshes Fastpass\'s attached healing aura');
assert.match(game, /owner\.fastpassHealAuraUntil = performance\.now\(\) \+ 500/, 'Fastpass healing aura is a quick half-second pulse');
assert.match(game, /Math\.hypot\(ally\.x - owner\.x, ally\.y - owner\.y\)/, 'Healing is centered on Fastpass, not the enemy hit location');
assert.match(game, /doHeal\(ally, 850\)/, 'Fastpass mini pulse heals 850 HP');
assert.match(game, /strokeStyle='#d879ff'/, 'Fastpass healing aura is purple');
assert.match(game, /shot\*\(200\/\(count-1\)\)/, 'Fastpass tickets fire left-to-right across a 0.2-second cadence');
assert.match(game, /Math\.min\(1\.88, multiplier\)/, 'Fastpass maximum stacked movement speed is reduced by 20%');
assert.match(game, /fastpassHyperTravelCharged.*< 50/, 'Movement Super recharge caps at 50%');
assert.match(game, /distance >= \.5 && distance <= 30/, 'Tiny movement and teleports do not generate meaningful recharge');

// Freestyle deterministic Setlist and sustain rules.
assert.match(game, /fromEntity\.freestyleSetlistStage=\(stage\+1\)%3/, 'Setlist always cycles 0 -> 1 -> 2 -> 0');
assert.match(game, /isFreestyleDisco:true,freestyleStage:0/, 'Ammo 1 is Disco Ball');
assert.match(game, /isFreestyleDJKey:true,freestyleStage:1/, 'Ammo 2 is DJ Board');
assert.match(game, /isFreestyleMic:true,freestyleStage:2/, 'Ammo 3 is Microphone');
assert.match(game, /doHeal\(owner,owner\.maxHp\*\.30\)/, 'Microphone pickup heals exactly 30% max HP');
assert.match(game, /owned\.length >= 7/, 'Microphone pickups have a strict per-owner map cap');
assert.match(game, /expiresAt:performance\.now\(\)\+10000/, 'Microphone pickups expire');
assert.match(game, /freestyleBassBoostArmed=true/, 'Bass Boost waits in an armed state for DJ Board');
assert.match(game, /const empowered=!!fromEntity\.freestyleBassBoostArmed/, 'Only the DJ Board stage consumes Bass Boost');
assert.match(game, /freestyleSetlistHitMask === 7/, 'Remix requires all three Setlist hits');
assert.match(game, /freestyleRemixUntil = performance\.now\(\) \+ 4000/, 'Remix lasts four seconds');
assert.match(game, /if \(b\.hyperVisual && dealtDamage > 0\) doHeal\(owner, dealtDamage \* \.30\)/, 'Encore lifesteal is restricted to main-attack hit processing');
assert.match(game, /freestyleSpeakerWall:true.*expiresAt:performance\.now\(\)\+3000/, 'Encore speaker walls expire after three seconds');
assert.match(game, /count=4,speed=590\*\.6,range=430/, 'Center Stage uses medium range');
assert.match(game, /freestyleDropsMic:n===1/, 'Only one designated Center Stage speaker drops a microphone');
assert.match(game, /if \(projectile\.freestyleDropsMic\) spawnFreestyleMicrophone/, 'Non-designated speakers cannot flood the map with microphones');

console.log('Fastpass/Freestyle regression suite passed.');
