import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 1. Verify rich blueprints exist in ARENA_FORGE_BLUEPRINTS
const expectedBlueprintIds = [
    'overclock',
    'titan_plates',
    'rocket_boots',
    'quick_loader',
    'siege_lens',
    'battery_pack',
    'hyper_dynamo',
    'vampiric_edge',
    'command_beacon',
    'core_detonator',
    'static_armor',
    'freeze_rounds',
    'flame_treads',
    'bounty_magnet',
    'minion_commander',
    'orbital_strike',
    'adrenaline_rush',
    'reactive_barrier',
    'heavy_artillery',
    'chain_reaction',
    'phase_stride',
    'executioner_lens',
    'nanite_injector'
];

for (const id of expectedBlueprintIds) {
    assert.match(game, new RegExp(`id:\\s*['"]${id}['"]`), `Blueprint '${id}' is defined in ARENA_FORGE_BLUEPRINTS`);
}

// 2. Verify Blueprint helpers and UI flow
assert.match(game, /function openArenaForgeBlueprintDraft\(/, 'openArenaForgeBlueprintDraft helper is present');
assert.match(game, /function applyArenaForgeBlueprint\(/, 'applyArenaForgeBlueprint helper is present');
assert.match(game, /function updateArenaForgeBlueprintCombatantEffects\(/, 'updateArenaForgeBlueprintCombatantEffects helper is present');
assert.match(game, /function handleArenaForgeCombatHit\(/, 'handleArenaForgeCombatHit helper is present');

// 3. Verify level threshold blueprint offerings
assert.match(game, /ARENA_FORGE_BLUEPRINT_LEVELS\s*=\s*\[2,\s*4,\s*6,\s*8,\s*10,\s*12\]/, 'Blueprint milestone levels are [2, 4, 6, 8, 10, 12]');
assert.match(game, /queueArenaForgeBlueprint\(entity,\s*entity\.arenaForgeBonusLevel\)/, 'Blueprint draft triggers on level up');

// 4. Verify HUD Blueprint display
assert.match(game, /Blueprints:\s*\${blueprints\.length/, 'HUD Blueprint status is rendered in Arena Forge HUD');

// 5. Verify Combat integration
assert.match(game, /arenaForgeExecutioner/, 'Executioner Visor damage modifier is integrated');
assert.match(game, /arenaForgePhaseStride/, 'Phase Drive triggers on Super cast');
assert.match(game, /arenaForgeFlamePuddles/, 'Napalm Munitions / Scorched Earth flames are active');
assert.match(game, /arenaForgeBountyMagnet/, 'Flux Magnet energy heal bonus is active');
assert.match(game, /arenaForgeBeaconUntil/, 'Warlord Aura damage and speed are active');

console.log('All Arena Forge Blueprints regression checks passed successfully!');
