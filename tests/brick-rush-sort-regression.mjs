import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(index, /value="bricks-desc"/);
assert.match(index, /value="bricks-asc"/);
assert.match(game, /<option value="bricks-desc">Bricks \(High\)<\/option>/, 'visible Brawler Browser must expose high-Brick sorting');
assert.match(game, /<option value="bricks-asc">Bricks \(Low\)<\/option>/, 'visible Brawler Browser must expose low-Brick sorting');
assert.match(game, /mode === 'bricks-desc'\) return \[-lifetimeBricks, label\]/);
assert.match(game, /mode === 'bricks-asc'\) return \[lifetimeBricks, label\]/);
assert.match(game, /awardBricksAcrossTeam\(playerTeam, placement, brickRushMultiplier\)/);
assert.match(game, /awardBricksForPlacement\(endProgress, placement, brickRushMultiplier\)/);

const start = game.indexOf('const DAILY_BRICK_RUSH_DURATION_MS');
const end = game.indexOf('    function applyBrickDelta', start);
assert.ok(start >= 0 && end > start, 'daily Brick Rush helpers should remain centralized');

const storage = new Map();
const context = {
    Date,
    JSON,
    Math,
    localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, String(value)),
    },
};
vm.createContext(context);
vm.runInContext(`${game.slice(start, end)}\nObject.assign(globalThis, { canStartDailyBrickRush, startDailyBrickRush, getDailyBrickRushTimeLeft, getDailyBrickRushMultiplier, applyPositiveBrickMultiplier });`, context);

const now = new Date(2026, 7, 10, 12, 0, 0).getTime();
assert.equal(context.canStartDailyBrickRush(now), true);
assert.equal(context.startDailyBrickRush(now), true);
assert.equal(context.startDailyBrickRush(now + 1000), false, 'rush can only start once per local day');
assert.equal(context.getDailyBrickRushTimeLeft(now), 5 * 60 * 1000);
assert.equal(context.getDailyBrickRushMultiplier(now + 1000, 1), 3);
assert.equal(context.getDailyBrickRushMultiplier(now + 1000, 2), 4);
assert.equal(context.getDailyBrickRushMultiplier(now + 5 * 60 * 1000 + 1, 9), 1);
assert.equal(context.applyPositiveBrickMultiplier(30, 3), 90);
assert.equal(context.applyPositiveBrickMultiplier(30, 4), 120);
assert.equal(context.applyPositiveBrickMultiplier(100, 4), 350, 'extra Brick Rush payout is capped at +250');
assert.equal(context.applyPositiveBrickMultiplier(200, 4), 450, 'the cap applies to bonus Bricks, not base Bricks');
assert.equal(context.applyPositiveBrickMultiplier(-5, 4), -5, 'Brick Rush must not multiply losses');
assert.equal(context.canStartDailyBrickRush(now + 24 * 60 * 60 * 1000), true, 'a new local day refreshes the rush');
assert.doesNotMatch(game, /BUG COMP|compensationPending|consumeBrickRushCompensation|brickRushCompensationBonus/, 'temporary compensation state and UI must be fully retired');

console.log('Brick Rush and Brick sorting regression checks passed.');
