import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const must=(pattern,label)=>assert.match(game,pattern,label);

must(/const CHAOS_CROWN_FLOORS = 10/,'ten floors');
must(/const CHAOS_CROWN_RULES = Object\.freeze\(\[/,'rules exist');
for(const name of ['Mystery Door','Lootquake','Closing Time','Super Alarm','Loaded Dice','Hyper Hour','Glass Tempest','Royal Rumble','Reality Break','Chaos Crown'])must(new RegExp(`name:'${name}'`),name);
must(/chaosRun = \{active:false,variant:'chaos'/,'safe save default');
must(/createTowerTroubleRoster\(pool,CHAOS_CROWN_FLOORS\)/,'random unique roster');
must(/function prepareChaosCrownRun\(\)/,'start flow');
must(/function openChaosCrownBoard\(run\)/,'floor board');
must(/showdownMode === 'chaos_crown'\) prepareChaosCrownRun\(\)/,'start route');
must(/towerTroubleVariant === 'chaos'/,'runtime route');
must(/if\(challenge\.startSuper\)bot\.superCharge=100/,'Super Alarm applies to bots');
must(/if\(challenge\.startHyper\)bot\.hyperChargeCharge=100/,'Hyper Hour applies to bots');
must(/if\(rule\.startSuper\)\{superCharge=100/,'Super Alarm applies to player');
must(/if\(rule\.startHyper\)\{hyperChargeCharge=100/,'Hyper Hour applies to player');
must(/run\.losses>=3/,'three-strike failure');
must(/unlockedTitles\.includes\('chaos_climber'\)/,'title reward');
must(/CHAOS CROWN CONQUERED!/,'victory result');
must(/\['chaos_crown', '🎲', 'Chaos Crown'/,'event card');

const rules=[...game.matchAll(/\{name:'(?:Mystery Door|Lootquake|Closing Time|Super Alarm|Loaded Dice|Hyper Hour|Glass Tempest|Royal Rumble|Reality Break|Chaos Crown)'/g)];
assert.equal(rules.length,10,'exactly ten named Chaos Crown stages');
console.log('Chaos Crown regression checks passed.');
