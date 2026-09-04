import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 1. Verify buildArenaForgeMap implementation
assert.match(game, /function buildArenaForgeMap\(\)/, 'buildArenaForgeMap is implemented');
assert.match(game, /Modern 3-Lane Sub-Zero Tactical Forge Layout/, 'Arena Forge map header present');

// 2. Verify Destructible Sub-Zero Crystalline Ice Walls
assert.match(game, /wallType:\s*'forge_lane'/, 'Forge lane wall types used');
assert.match(game, /hp:\s*collapse \? 6500 : 9000/, 'Collapse walls configured with 6500 HP');
assert.match(game, /tile\.arenaForgeCollapseWall\s*=\s*true/, 'Collapse walls marked correctly');

// 3. Verify Tactical Bastions & Central Soul Forge Crucible
assert.match(game, /Central Soul Forge Crucible/, 'Central Crucible zone configured');
assert.match(game, /WORLD_H \* 0\.5 - 45/, 'Center lane cover barricades configured');

// 4. Verify Jump Pads (Assault and Rotation Jump Pads)
assert.match(game, /addPadPair\(WORLD_W \* 0\.5,\s*WORLD_H - 680/, 'Center lane assault jump pads');
assert.match(game, /addPadPair\(360,\s*WORLD_H - 800/, 'Flank rotation jump pads');

console.log('✅ All Arena Forge Map Redesign regression tests passed!');
