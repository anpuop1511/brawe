import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const rosterFiles = [
  'common', 'rare', 'super-rare', 'epic', 'mythic', 'legendary', 'exotic',
].map(rarity => fs.readFileSync(new URL(`../modules/brawlers/${rarity}/roster.js`, import.meta.url), 'utf8')).join('\n');

const chargeStart = game.indexOf('const SUPER_CHARGE_HITS_BY_BRAWLER =');
const chargeEnd = game.indexOf('let nextMainAttackActivationId', chargeStart);
assert.ok(chargeStart >= 0 && chargeEnd > chargeStart, 'Central Super charge table exists');
const chargeSandbox = {};
vm.createContext(chargeSandbox);
vm.runInContext(`${game.slice(chargeStart, chargeEnd)}\nthis.table=SUPER_CHARGE_HITS_BY_BRAWLER;`, chargeSandbox);
const chargeTable = chargeSandbox.table;

const rosterIds = new Set([...rosterFiles.matchAll(/'([a-z0-9_]+)'/g)].map(match => match[1]));
assert.equal(rosterIds.size, 71, 'The current modular roster contains 71 brawlers');
assert.equal(Object.keys(chargeTable).length, 71, 'Every current brawler has an explicit Super charge rule');
for (const id of rosterIds) assert.ok(chargeTable[id], `${id} has a Super charge hit count`);
assert.equal(chargeTable.dashaholic, 2, 'Dashaholic charges in two successful attacks');
assert.equal(chargeTable.minigunnin, 10, 'Minigunnin charges in ten successful attacks');
assert.equal(chargeTable.portalo, 7, 'Portalo uses the proposed seven-hit rule');
assert.equal(chargeTable.ghoul, 6, 'Ghoul uses the proposed six-hit rule');
assert.equal(chargeTable.jacktrade, 6, 'JackTrade uses the proposed six-hit rule');

assert.match(game, /beginMainAttackActivation\(fromEntity, brawler, now\)/, 'Normal attacks receive an activation id');
assert.match(game, /entry\.mainAttackActivationId = owner\.currentMainAttackActivationId/, 'Spawned projectiles inherit their attack activation');
assert.match(game, /chargedMainAttackActivations\.includes\(activationId\)/, 'Repeated hits from one attack are deduplicated');
assert.match(game, /owner\.isPet \|\| owner\.isSummon \|\| owner\.isBoss/, 'Summons and bosses do not receive normal player charge steps');
assert.match(game, /if\(!b\.super && !b\.isSuperDash && !target\.isPet\) grantMainAttackCharge\(owner, b\)/, 'Projectile hits use the shared charge helper');
assert.doesNotMatch(game, /rawDmg\s*\/\s*8000|damage\s*\/\s*8000|dealt\s*\/\s*8000/, 'The old damage-based 8000 Super formula is removed');

const rewardStart = game.indexOf('const TOWER_FLOOR_COIN_REWARDS =');
const rewardEnd = game.indexOf('const TOWER_FLOOR_BIOMES', rewardStart);
assert.ok(rewardStart >= 0 && rewardEnd > rewardStart, 'Tower reward helpers exist');
const rewardSandbox = { Math, TOWER_TROUBLE_FLOORS: 10 };
vm.createContext(rewardSandbox);
vm.runInContext(`${game.slice(rewardStart, rewardEnd)}\nthis.reward=getTowerTroubleFloorReward;this.mult=getTowerTroubleRewardMultiplier;`, rewardSandbox);
assert.equal(rewardSandbox.reward(1, 0), 100, 'Floor 1 awards 100 coins');
assert.equal(rewardSandbox.reward(5, 0), 100, 'Floor 5 awards 100 coins');
assert.equal(rewardSandbox.reward(6, 0), 200, 'Floor 6 awards 200 coins');
assert.equal(rewardSandbox.reward(10, 0), 200, 'Floor 10 awards 200 coins');
assert.equal(rewardSandbox.reward(6, 1), 100, 'One knockout halves a later 200-coin floor');
assert.equal(rewardSandbox.reward(6, 2), 50, 'Two knockouts quarter a later 200-coin floor');
assert.equal([1,2,3,4,5,6,7,8,9,10].reduce((sum, floor) => sum + rewardSandbox.reward(floor, 0), 0), 1500, 'A flawless run still totals 1500 floor coins');

assert.match(game, /towerGuestPick[\s\S]{0,220}!towerGuestPick && !isBrawlerUnlocked/, 'Tower Trouble can keep a locked guest brawler selected');
assert.match(game, /validPool=allBrawlers\.filter\(id=>!disabledBrawlers\.has\(id\)&&getActiveSlopSushiDeck\(id\)\.length>=8\)/, 'Tower roster rolls do not filter out locked brawlers');
assert.match(game, /if \(won\) \{[\s\S]{0,260}playerData\.coins = \(playerData\.coins \|\| 0\) \+ floorReward/, 'Floor coins are awarded only after a clear');
assert.match(game, /run\.losses=Math\.min\(3,[\s\S]{0,420}Rewards now \$\{Math\.round\(getTowerTroubleRewardMultiplier\(run\.losses\)\*100\)\}%/, 'Each knockout updates and displays the reduced reward multiplier');

console.log('Super charge + Tower Trouble regression suite passed.');
