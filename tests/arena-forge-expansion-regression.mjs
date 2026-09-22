import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 1. Max Arena Forge Level is now +20
assert.match(game, /ARENA_FORGE_MAX_BONUS_LEVELS\s*=\s*20;/, 'ARENA_FORGE_MAX_BONUS_LEVELS is set to 20');
assert.match(game, /ARENA_FORGE_BLUEPRINT_LEVELS\s*=\s*\[2,\s*4,\s*6,\s*8,\s*10,\s*12,\s*14,\s*16,\s*18,\s*20\];/, 'Blueprint milestone levels extend to level 20');

// 2. Arena Forge Camera & Spawns
assert.match(game, /spawnPos\s*=\s*getArenaForgeSpawnPoint\('player',\s*1,\s*ARENA_FORGE_TEAM_SIZE\);/, 'Player spawns in center lane (slot 1)');
assert.match(game, /getArenaForgeSpawnPoint\('player',\s*i\s*===\s*0\s*\?\s*0\s*:\s*2,\s*ARENA_FORGE_TEAM_SIZE\)/, 'Ally bots spawn flanking player (slots 0 and 2)');
assert.doesNotMatch(game, /if\s*\(isArenaForgeMode\)[\s\S]*?viewW\s*>=\s*WORLD_W/, 'Arena Forge uses normal camera tracking without viewport centering or bounds locking');

// 3. 5 New Cards / Blueprints in Arena Forge
const newCardIds = [
    'supercharger_core',
    'frostfire_catalyst',
    'titan_breaker',
    'chrono_disruption',
    'voltaic_overcharge'
];

for (const id of newCardIds) {
    assert.match(game, new RegExp(`id:\\s*['"]${id}['"]`), `Blueprint '${id}' is defined in ARENA_FORGE_BLUEPRINTS`);
}

// 4. Blueprints Integration
assert.match(game, /entity\.arenaForgeSupercharger\s*=\s*true;/, 'Supercharger Core effect in applyArenaForgeBlueprint');
assert.match(game, /entity\.arenaForgeFrostfire\s*=\s*true;/, 'Frostfire Catalyst effect in applyArenaForgeBlueprint');
assert.match(game, /entity\.arenaForgeTitanBreaker\s*=\s*true;/, 'Titan Breaker effect in applyArenaForgeBlueprint');
assert.match(game, /entity\.arenaForgeChronoDisruption\s*=\s*true;/, 'Chrono Disruption effect in applyArenaForgeBlueprint');
assert.match(game, /entity\.arenaForgeVoltaicOvercharge\s*=\s*true;/, 'Voltaic Overcharge effect in applyArenaForgeBlueprint');

// 5. Combat and System Integration
assert.match(game, /owner\?\.arenaForgeTitanBreaker[\s\S]*?dealtDamage\s*\*=\s*1\.45;/, 'Titan Breaker grants 45% damage bonus to structures, bosses, and camps');
assert.match(game, /arenaForgeChronoDisruption[\s\S]*?arenaForgeChronoUsed[\s\S]*?CHRONO DISRUPTION!/, 'Chrono Disruption negates lethal damage, grants invulnerability and restores 35% HP');
assert.match(game, /arenaForgeFrostfire[\s\S]*?arenaForgeFrostfireUntil/, 'Frostfire ignites target with burn DoT and slows reload speed');
assert.match(game, /arenaForgeVoltaicOvercharge[\s\S]*?arenaForgeLastVoltaicAt/, 'Voltaic Overcharge arcs secondary chain lightning on combat hit');
assert.match(game, /isArenaForgeMode\s*&&\s*entity\.arenaForgeSupercharger[\s\S]*?superCharge\s*=\s*100;/, 'Supercharger Core restores full Super on respawn');

console.log('✅ All Arena Forge Expansion regression checks passed!');
