import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.doesNotMatch(game, /RETIRED_TOWER_MODE_IDS = new Set\(\[[^\]]*['"]arena_forge['"]/, 'Arena Forge is not retired with legacy tower events');
assert.match(game, /HOME_PERMANENT_MODE_IDS = \[[^\]]*['"]arena_forge['"]/, 'Arena Forge remains on the permanent event board');
assert.match(game, /HOME_PERMANENT_MODE_IDS = \[[^\]]*['"]arena_forge_overclocked['"]/, 'Arena Forge: Overclocked is a permanent selectable mode');
assert.match(game, /function isBrickPowerGateExempt\(\)[\s\S]*?showdownMode === 'arena_forge'/, 'Arena Forge remains playable regardless of per-brawler Brick Power gating');
assert.match(game, /function getArenaForgeCombinedStructureHealth\(team\)[\s\S]*?hp,[\s\S]*?maxHp,[\s\S]*?pct:/, 'Arena Forge calculates combined Tower and Core integrity');
assert.match(game, /TOTAL BASE INTEGRITY[\s\S]*?ownIntegrity\.hp[\s\S]*?enemyIntegrity\.hp/, 'The in-match HUD displays both teams combined Base Integrity');
assert.match(game, /ARENA_FORGE_BREACH_WAVE_MS = 45000/, 'Breach waves use a readable 45-second cadence');
assert.match(game, /function spawnArenaForgeBreachWave[\s\S]*?weakest[\s\S]*?arenaForgeBreachMinion = true[\s\S]*?BOSS BREACH/, 'Breach waves target the weakest lane and periodically attack all lanes');
assert.match(game, /entity\.arenaForgeBreachMinion[\s\S]*?spawnArenaForgeEnergy\(entity\.x, entity\.y, 2\)/, 'Stopping a Breach unit awards bonus Energy');
assert.match(game, /entity\.isArenaForgeTower[\s\S]*?COUNTERWAVE DEPLOYED/, 'Destroying a tower creates a comeback counterwave');
assert.match(game, /ARENA_FORGE_ENEMY_MINION_MULT = 1\.08[\s\S]*?enemyPressure = team === 'enemy'/, 'Enemy minions receive only the intended modest difficulty bump');
assert.match(game, /ARENA_FORGE_ENEMY_TOWER_FIRE_MULT = 0\.92[\s\S]*?baseFireDelay \* \(\(t\.isArenaForgeTower \|\| t\.isArenaForgeCore\)/, 'Enemy defenses fire slightly faster');
assert.match(game, /coordinate on the weakest remaining tower[\s\S]*?ownStructures = getArenaForgeStructures\(team\)[\s\S]*?waveRally/, 'Forge bots coordinate attacks, defend every structure and rally with minions');
assert.match(game, /getArenaForgeCombinedStructureHealth\('player'\)\.pct[\s\S]*?getArenaForgeCombinedStructureHealth\('enemy'\)\.pct/, 'Overtime resolves using total remaining Base Integrity');
assert.match(game, /ARENA_FORGE_BEACON_CAPTURE_SECONDS = 6/, 'Neutral Forge Bots require a readable six-second capture');
assert.match(game, /function updateArenaForgeBeacon[\s\S]*?playerCount - enemyCount[\s\S]*?getArenaForgeBeaconCaptureSeconds/, 'Forge Bot captures use live player-count control');
for (const botKind of ['shield_bot', 'overclock_bot', 'siege_bot', 'bounce_bot', 'orbit_bot', 'fire_bot']) {
  assert.match(game, new RegExp(`kind: '${botKind}'`), `Arena Forge rotation includes ${botKind}`);
}
assert.match(game, /ARENA_FORGE_BEACON_START_SECONDS = 12[\s\S]*?ARENA_FORGE_BEACON_RESPAWN_MS = 26000/, 'Capture cadence exposes the full mixed bot rotation during one match');
assert.match(game, /bounce_bot[\s\S]*?shield_bot[\s\S]*?orbit_bot[\s\S]*?overclock_bot[\s\S]*?fire_bot[\s\S]*?siege_bot/, 'Hyper and support captures alternate instead of hiding Hyper bots behind the old opener');
assert.match(game, /ARENA_FORGE_ROCKETEER_TRIGGER_REMAINING = 150[\s\S]*?ARENA_FORGE_ROCKETEER_CAPTURE_SECONDS = 15/, 'Boss Rocketeer arrives with 2:30 remaining and needs a 15-second capture');
assert.match(game, /function spawnArenaForgeRocketeerBoss[\s\S]*?arenaForgeRocketeerBossSpawned \|\| arenaForgeBeacon\.active/, 'Boss Rocketeer waits for an active capture instead of deleting it');
assert.match(game, /function fireRocketeerFullHyperMain[\s\S]*?launchRocketeerMain\(owner, angle, true, 1\)[\s\S]*?noSplit: true/, 'Boss Rocketeer reward uses Rocketeer’s complete Hyper main attack');
assert.match(game, /function fireArenaForgeCapturedHyperAttacks[\s\S]*?powers\.has\('rocketeer'\)[\s\S]*?powers\.has\('bounce'\)[\s\S]*?powers\.has\('orbit'\)[\s\S]*?powers\.has\('fire'\)/, 'Every captured attack bot adds its own stackable Hyper attack rider');
assert.match(game, /startingCapturePowers = isArenaForgeOverclockedMode \? \['rocketeer', 'bounce', 'orbit', 'fire'\]/, 'Overclocked starts both teams with all four Hyper attack powers');
assert.match(game, /riderAngles = isArenaForgeOverclockedMode[\s\S]*?angle \+ Math\.PI \* \.5[\s\S]*?angle \+ Math\.PI[\s\S]*?angle \+ Math\.PI \* 1\.5/, 'Overclocked captured attacks fire in a four-way 360-degree formation');
assert.match(game, /arenaForgeCapturedAttackPowers\[team\]\.add\(attackPower\)/, 'Captured Hyper attacks accumulate instead of replacing each other');
assert.match(game, /function spawnArenaForgeRecruitedBot[\s\S]*?arenaForgeMinionKind = 'ranged'/, 'Captured bots also join the team as active ranged allies');
assert.match(game, /beaconObjective[\s\S]*?forcedObjectiveTarget = beaconObjective/, 'Arena Forge bots understand and contest capturable bots');
const forgeMapStart = game.indexOf('function buildArenaForgeMap()');
const forgeMapEnd = game.indexOf('function buildMarkedMayhemMap()', forgeMapStart);
assert.ok(forgeMapStart >= 0 && forgeMapEnd > forgeMapStart, 'Arena Forge map builder exists');
const forgeMap = game.slice(forgeMapStart, forgeMapEnd);
assert.doesNotMatch(forgeMap, /addArenaWallStrip|\bwall\(/, 'Arena Forge contains zero wall tiles');
assert.match(game, /arenaForgeBeacon\.label \|\| 'FORGE BOT'/, 'Capturable bots have a clear in-world visual label');

console.log('Arena Forge upgrade regression suite passed.');
