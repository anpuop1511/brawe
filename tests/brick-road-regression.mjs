import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

// 1. Brick Road Milestones defined
assert.match(game, /BRICK_ROAD_MILESTONES\s*=\s*Object\.freeze\(\[/, 'BRICK_ROAD_MILESTONES exists');
assert.match(game, /bricks:\s*50[\s\S]*?bricks:\s*50000/, 'Milestones span 50 to 50,000 Bricks');

// 2. Progression helpers exist
assert.match(game, /function getTotalAccountBricks\(\)/, 'getTotalAccountBricks helper exists');
assert.match(game, /function getBrickRoadLeague\(/, 'getBrickRoadLeague helper exists');
assert.match(game, /function getUnclaimedBrickRoadMilestonesCount\(\)/, 'getUnclaimedBrickRoadMilestonesCount helper exists');
assert.match(game, /function claimBrickRoadMilestone\(/, 'claimBrickRoadMilestone helper exists');
assert.match(game, /function openBrickRoadModal\(\)/, 'openBrickRoadModal exists');

// 3. Home Screen Event Board Integration
assert.match(html, /id="homeModesSection"/, 'homeModesSection is in HTML');
assert.match(html, /id="homeLobbyView"[\s\S]*?id="homeModesSection"/, 'homeModesSection is directly inside homeLobbyView');
assert.match(game, /brickRoadBtn\.id = 'brickRoadBtn'/, 'brickRoadBtn added to progression dock');

console.log('Brick Road & Home Screen Event Board regression tests passed successfully!');
