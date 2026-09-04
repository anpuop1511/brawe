import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
assert.doesNotMatch(game, /\bif \(hyperchargeUnlocked\b/, 'undefined standalone Hyper unlock variable is gone');
assert.match(game, /activeRankedModifier === 'hyper_overdrive'[\s\S]*?getSelectedProgress\(\)\.hyperchargeUnlocked/, 'Hyper Overdrive uses effective selected-brawler progression');
assert.match(game, /getSelectedProgress[\s\S]*?getEffectiveBrawlerProgress\(selectedBrawler\)/, 'weekly trials and mode grants remain included');
assert.match(game, /b\.hyperchargeUnlocked && !b\.isHypercharged/, 'bots retain their entity-specific unlock check');
console.log('Hyper Overdrive unlock regression: 4/4 checks passed.');
