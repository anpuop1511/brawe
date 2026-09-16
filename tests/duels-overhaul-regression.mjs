import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

assert.match(game, /const DUELS_MAX_FIGHTERS = 4;/, 'Duels supports up to four fighters');
assert.match(game, /const DUELS_ACTIVE_TOWER_POWERS = 5;/, 'Duels activates five Tower Powers');
assert.match(game, /const DUELS_ROUND_OPTIONS = Object\.freeze\(\[7, 9, 15\]\);/, 'Duels offers first-to-7, first-to-9, and first-to-15 formats');
assert.match(game, /if \(isTowerDuelEvent\)[\s\S]*?return DUELS_ROUND_OPTIONS\.includes\(duelsTargetWins\) \? duelsTargetWins : 9;/, 'normal match length uses the chosen format while Tower Duels keeps its event scoring');
assert.match(game, /Choose 1–4 fighters/, 'draft explains the flexible squad size');
assert.match(game, /ALL TOWER POWERS UNLOCKED • RANDOMIZED EACH ROUND/, 'temporary unlock and random-round rules are visible');
assert.match(game, /launch\.disabled = drafted\.length === 0/, 'a squad of any size from one to four can launch');
assert.match(game, /\(duelRoundIndex \+ 1\) % 2 === 0/, 'every even-numbered round is an all-power round');
assert.match(game, /deck\.map\(card => card\.id\)/, 'all-power rounds activate the complete fighter deck');
assert.match(game, /rollDuelsTowerLoadout\(brawlerId, DUELS_ACTIVE_TOWER_POWERS\)/, 'other rounds receive five randomized powers');
assert.match(game, /getBotBrawlerPool\(\)\.filter\(id => id && id !== duelBotLastBrawler\)/, 'enemy fighter is randomly rerolled without immediate repeats');
assert.match(game, /getDuelsWinScore\(\)/, 'match scoring uses the centralized format helper');
assert.match(game, /ALL \$\{slopSushiActiveCards\.length\} TOWER POWERS/, 'match HUD identifies chaos rounds');
assert.match(game, /\$\{slopSushiActiveCards\.length\} RANDOM TOWER POWERS/, 'match HUD identifies random-power rounds');
assert.match(game, /const unlocked = isTraining \|\| isDuels \|\| !!prog\.gadgetUnlocked/, 'Duels temporarily unlocks player Gadgets');
assert.match(game, /!prog\.hyperchargeUnlocked && !isTraining && !isDuels/, 'Duels temporarily unlocks player Hypercharge');
assert.match(game, /const spUnlocked = isTraining \|\| isDuels \|\| !!prog\.starPowerUnlocked/, 'Duels temporarily unlocks player Star Powers');
assert.match(styles, /\.duels-draft-shell/, 'new responsive squad builder is styled');
assert.match(styles, /@media\(max-width:720px\)/, 'squad builder includes mobile layout');

console.log('Duels overhaul regression checks passed.');
