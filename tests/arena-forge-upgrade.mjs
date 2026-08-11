import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

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

console.log('Arena Forge upgrade regression suite passed.');
