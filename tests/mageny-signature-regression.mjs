import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /mageny:\s*\{[\s\S]{0,220}type: 'signature'[\s\S]{0,220}Permanent Attraction/, 'Mageny has a registered Signature');
assert.match(game, /MAGENY_VORTEX_PROJECTILE_CAP = 24/, 'normal Super is capped at 24 trapped projectiles');
assert.match(game, /MAGENY_HYPER_VORTEX_PROJECTILE_CAP = 48/, 'Hyper Super is capped at 48 trapped projectiles');
assert.match(game, /const projectileCap = hyper \? MAGENY_HYPER_VORTEX_PROJECTILE_CAP : MAGENY_VORTEX_PROJECTILE_CAP/, 'each cast selects the correct shared cap');
assert.match(game, /getMagenyVortexCastTrappedCount\(z\.castId\)[\s\S]{0,220}castTrappedCount < \(z\.projectileCap/, 'all zones in a cast share the projectile cap');
assert.match(game, /MAGENY_SIGNATURE_HP_COST = 2000/, 'Signature costs exactly 2000 HP');
assert.match(game, /MAGENY_SIGNATURE_MAX_LIFETIME_MS = 14000/, 'Signature has a fourteen-second maximum lifetime');
assert.match(game, /MAGENY_SIGNATURE_COOLDOWN_MS = 18000/, 'Signature cooldown is 18 seconds');
assert.match(game, /zone\.signaturePersistent = true;[\s\S]{0,180}zone\.detonateAt = now \+ MAGENY_SIGNATURE_MAX_LIFETIME_MS/, 'Signature replaces the normal timer with its fourteen-second ceiling');
assert.match(game, /trappedNow >= cap && z\.signaturePersistent[\s\S]{0,180}now \+ 2000/, 'reaching cap triggers the two-second overload');
assert.match(game, /state\.mode === 'detonate'[\s\S]{0,180}scheduleMagenyVortexCastDetonation\(state\.castId, now, 'MANUAL'\)/, 'pressing Signature again manually detonates the sustained cast');
assert.match(game, /b\.magenyVortexReleasedCastId === z\.castId[\s\S]{0,100}continue/, 'sibling Hyper zones cannot recapture freshly released projectiles');
assert.match(game, /selectedBrawler === 'mageny'[\s\S]{0,160}getMagenySignatureState/, 'Mageny is wired to the Signature HUD');
assert.match(game, /hyper && !isPrimary \? 140 : 175/, 'Hyper secondary vortexes are twenty percent smaller');
assert.match(game, /hyper && !isPrimary \? 1100 : 1800/, 'Hyper secondary vortexes use reduced detonation damage');
assert.match(game, /magenyResidualDamageAtByCast/, 'overlapping SP2 floors from one cast cannot stack damage ticks');

console.log('Mageny Signature regression checks passed.');
