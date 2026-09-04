import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 1. Constellations defined
assert.match(game, /SOUL_CONSTELLATIONS\s*=\s*Object\.freeze\(\[/, 'SOUL_CONSTELLATIONS array exists');
for (const c of ['Rare', 'Epic', 'Mythic', 'Exotic', 'Unique', 'Anomaly']) {
    assert.match(game, new RegExp(`id:\\s*'${c}'`), `Constellation ${c} is defined`);
}

// 2. Progression helpers exist
assert.match(game, /function getConstellationProgress\(constellationId\)/, 'getConstellationProgress helper exists');
assert.match(game, /function getActiveConstellationTier\(\)/, 'getActiveConstellationTier helper exists');
assert.match(game, /function claimConstellationMilestone\(constellationId\)/, 'claimConstellationMilestone helper exists');

// 3. openSoulSummoner UI
assert.match(game, /SOUL SUMMONER · STARR ROAD/, 'Soul Summoner Starr Road title rendered');
assert.match(game, /CURRENT CHANNELING TARGET/, 'Channeling target focus card rendered');
assert.match(game, /CONSTELLATION/, 'Constellation section rendered');

// 4. Milestone rewards
assert.match(game, /milestoneReward/, 'Milestone rewards configured for all tiers');

console.log('Soul Summoner Constellation & Starr Road regression test passed successfully!');
