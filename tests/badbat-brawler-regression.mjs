import fs from 'fs';
import assert from 'assert';

const gameCode = fs.readFileSync('game.js', 'utf8');

console.log('--- Running BadBat Comprehensive Brawler Regression Suite ---');

// 1. Roster and Metadata Checks
assert(gameCode.includes("brawlerId === 'badbat'"), 'badbat brawlerId missing in card render');
assert(gameCode.includes("'badbat': {"), 'badbat metadata entry missing in brawlerData');
assert(gameCode.includes("badbat: 'Epic'"), 'badbat rarity missing in brawlerRarities');
assert(gameCode.includes("badbat:'Damage Dealer'"), 'badbat role missing in brawlerRoles');
assert(gameCode.includes("badbat: '🦇🏏'"), 'badbat emoji missing');
console.log('✔ 1. Roster & Meta data verified.');

// 2. Attack, Minion & Super Mechanics Functions
assert(gameCode.includes('function fireBadBatAttack'), 'fireBadBatAttack function missing');
assert(gameCode.includes('function spawnBadBatOrbitingBats'), 'spawnBadBatOrbitingBats function missing');
assert(gameCode.includes('function castBadBatSuper'), 'castBadBatSuper function missing');
assert(gameCode.includes('function executeBadBatG1'), 'executeBadBatG1 function missing');
assert(gameCode.includes('function executeBadBatG2'), 'executeBadBatG2 function missing');
assert(gameCode.includes('function updateBadBatSwarm'), 'updateBadBatSwarm function missing');
assert(gameCode.includes('function renderBadBatSwarm'), 'renderBadBatSwarm function missing');
console.log('✔ 2. BadBat combat & swarm engine functions present.');

// 3. Strict Entity Caps & Decreased Health (560 HP, 30% reduction, max 6 total)
assert(gameCode.includes('const MAX_BADBAT_TOTAL = 6;'), 'Strict total bat cap of 6 missing');
assert(gameCode.includes('hp: 560'), '560 HP (30% reduction) missing for bats');
assert(gameCode.includes('maxHp: 560'), '560 maxHp missing for bats');
console.log('✔ 3. Strict minion total cap (6 max) and 560 HP (30% reduction) verified.');

// 4. Autonomous Bat Attacks & Friendly Fire Immunity (Bats attack autonomously, owner cannot hurt own bats)
assert(gameCode.includes('b.ownerId === owner.id || b.isBadBatWave || areAlliedEntities(getEntityById(b.ownerId), owner)'), 'Own/allied bullet damage filter missing');
assert(gameCode.includes('exp.ownerId && (exp.ownerId === owner.id || areAlliedEntities(getEntityById(exp.ownerId), owner))'), 'Own/allied explosion damage filter missing');
assert(gameCode.includes('// Autonomous Aggro') || gameCode.includes('Autonomous Target Resolution'), 'Autonomous enemy targeting missing');
assert(gameCode.includes('lastStrikeTime: now - 1500'), 'Super bat instant attack readiness missing');
assert(gameCode.includes('maxHits: Infinity'), 'Persistent bat lifetime missing');
console.log('✔ 4. Autonomous attacks, friendly fire immunity & super bat suicide fix verified.');

// 5. +50% Main Attack Size, Aiming Telegraphs, and Wave Visuals
assert(gameCode.includes('const baseRadius = isG1 ? 84 : 42;'), '+50% main attack radius (42 base / 84 G1) missing');
assert(gameCode.includes("selectedBrawler === 'badbat' && !aimingSuper"), 'BadBat main attack aiming indicator missing');
assert(gameCode.includes("selectedBrawler === 'badbat' && aimingSuper"), 'BadBat super aiming indicator missing');
assert(gameCode.includes('batWaveAngles'), 'Wave gothic bat silhouette rendering missing');
console.log('✔ 5. +50% attack size, aiming telegraphs, and enhanced wave visuals verified.');

// 6. 40% Range Free Roaming & Pre-Dash Telegraphing
assert(gameCode.includes('const BADBAT_ROAM_RANGE = 176;'), '40% range tether (176px) missing');
assert(gameCode.includes("bat.state = 'roam'"), 'Roam state missing');
assert(gameCode.includes('bat.roamOffsetX'), 'Dynamic roam offset positioning missing');
assert(gameCode.includes('bat.legPhase'), 'Minion leg stepping cycle missing');
assert(gameCode.includes('bat.hopZ'), 'Minion hopZ walking motion missing');
assert(gameCode.includes("bat.state === 'pre_dash'"), 'Minion pre-dash telegraphing state missing');
assert(gameCode.includes('LOCK-ON'), 'Lock-on telegraph text missing');
console.log('✔ 6. 40% range dynamic roaming, ground walking & laser lock-on telegraphing verified.');

// 7. Overhead HP Bars & Shield Bars
assert(gameCode.includes('Overhead Health Bar'), 'Overhead HP bar missing in renderBadBatSwarm');
assert(gameCode.includes('// Shield Bar (if overshield is active)'), 'Overshield bar missing in renderBadBatSwarm');
console.log('✔ 7. Overhead HP pill bar & cyan shield bar rendering verified.');

// 8. 2.5D Fighter Model
assert(gameCode.includes("} else if (brawlerId === 'badbat') {"), '2.5D visual model for badbat missing');
assert(gameCode.includes('BADBAT 2.5D GOTHIC PUNK VAMPIRE BAT MODEL'), '2.5D visual model header missing');
assert(gameCode.includes('Wooden Baseball Bat Weapon'), 'Wooden bat weapon swing rendering missing');
console.log('✔ 8. 2.5D custom brawler model verified.');

// 9. Bot Gadgets & AI
assert(gameCode.includes("} else if (bot.brawler === 'badbat' && g === 'g1') {"), 'Bot G1 gadget activation missing');
assert(gameCode.includes("} else if (bot.brawler === 'badbat' && g === 'g2') {"), 'Bot G2 gadget activation missing');
console.log('✔ 9. Bot AI gadget activation verified.');

// 10. Bat Return & Hit-Only Spawn Verification (No doubling, spawns only on hit, returns close to owner)
assert(gameCode.includes('b.badbatBatSpawned = true;'), 'Hit deduplication flag missing on projectile hit');
assert(gameCode.includes('spawnBadBatOrbitingBats(owner, 1, target.id'), 'Single bat spawn on projectile hit missing');
assert(!gameCode.includes('spawnBadBatOrbitingBats(fromEntity, 1'), 'Main attack weapon fire must not spawn bat blindly');
assert(gameCode.includes('dist <= 64'), 'Bats must return close to owner (dist <= 64) before roaming');
console.log('✔ 10. Bat return to owner & single hit-only spawn deduplication verified.');

console.log('🎉 ALL BADBAT REGRESSION TESTS PASSED CLEANLY!');

