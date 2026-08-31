import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const game = readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /const CAMERA_ZOOM = 0\.90;/, 'matches use the slight universal zoom-out');
assert.match(game, /const MAX_BOTS = 19;/, 'solo and corrupted showdown contain 20 total players');
assert.match(game, /isDuoShowdown\) enemyCount = 18;/, 'duo has 18 enemies plus the player team');
assert.match(game, /isTrioShowdownMode\) enemyCount = 16;/, 'quad mode has 16 enemies plus four friendly players');
assert.match(game, /const squadSize = isTrioShowdownMode \? 4 : 2;/, 'the legacy trio save key now groups squads into quads');
assert.match(game, /const MIRROR_TEAM_SIZE = 4;/, 'Mirror is now 4v4');
assert.match(game, /\['trio', '4️⃣', 'Quad Showdown', '5 teams of 4'\]/, 'the event card presents Quads');
assert.match(game, /solo: \['20-player free-for-all'/, 'solo rules show the new population');
assert.match(game, /duo: \['10 teams of two'/, 'duo rules show ten teams');
assert.match(game, /trio: \['5 teams of four'/, 'quad rules show five squads');
assert.match(game, /else if \(isObjectiveMode\) enemyCount = 3;/, 'Control Clash has three enemies');
assert.match(game, /isDuoShowdown \|\| isObjectiveMode \|\| isDamageFillerMode/, 'Control Clash creates two friendly bots');
assert.match(game, /else if \(isArenaForgeMode\) \{\s*WORLD_W = 2400;\s*WORLD_H = 3000;/, 'Arena Forge keeps its original map dimensions');
assert.match(game, /else if \(isDuoShowdown \|\| isTrioShowdownMode\) \{\s*WORLD_W = 3200;\s*WORLD_H = 3200;/, 'team Showdown uses the smaller map');
assert.match(game, /else \{\s*WORLD_W = 3000;\s*WORLD_H = 3000;/, 'solo and corrupted Showdown use the smaller map');

console.log('mode scale regression tests passed');
