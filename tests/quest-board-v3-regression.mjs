import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');

assert.match(game,/DAILY_WEEKLY_QUEST_SCHEMA_VERSION = 3/,'Quest Board schema advances to v3');
assert.match(game,/const MEGA_QUESTS = \[\]/,'Mega Quests are retired without deleting the save bucket');
assert.doesNotMatch(game,/makeTab\('mega'/,'The retired Mega tab is no longer shown');
assert.match(game,/const AWAKENATOR_JOURNEY_QUESTS = \[[\s\S]*?brawlerUnlock:'awakenator'/,'Awake Awakenator ends with the free fighter unlock');
assert.match(game,/const COIN_ASCENT_QUESTS = \[/,'The 20-stage Coin Ascent exists');
assert.equal((game.match(/id:'coin_ascent_\d\d'/g)||[]).length,20,'Coin Ascent contains exactly 20 stages');
assert.equal((game.match(/id:'coin_ascent_\d\d'[\s\S]{0,180}?rewards:\{coins:500\}/g)||[]).length,20,'Every Coin Ascent stage awards 500 Coins for 10,000 total');
assert.match(game,/mergeQuestBucket\(playerData\.questBoard\.awakenatorJourney, AWAKENATOR_JOURNEY_QUESTS\)/,'Awakenator quest state migrates without resetting saves');
assert.match(game,/mergeQuestBucket\(playerData\.questBoard\.coinAscent, COIN_ASCENT_QUESTS\)/,'Coin Ascent state migrates without resetting saves');
assert.match(game,/for \(const bucketName of \['awakenatorJourney','coinAscent'\]\)/,'The two active permanent journeys receive central quest progress');
assert.doesNotMatch(game,/makeTab\('snapper'/,'Snapper Journey is retired from the active Quest Board');
assert.doesNotMatch(game,/SNAPPER_JOURNEY_QUESTS/,'Snapper Journey definitions are fully retired while old save fields remain harmless');
assert.match(game,/specialAbilityQuestEvent: playerData\.specialAbilityQuestEvent/,'The seven-day Unleash Potential deadline persists in save data');

console.log('Quest Board v3 regression checks passed.');
