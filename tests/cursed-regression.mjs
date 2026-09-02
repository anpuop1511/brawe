import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const has = (pattern, message) => assert.match(source, pattern, message);

has(/'cursed'\s*:\s*\{[\s\S]*?name:\s*'Cursed'/, 'Cursed roster metadata is registered');
has(/brawlerId === 'cursed'[\s\S]*?6800[\s\S]*?1500[\s\S]*?speed:\s*260/, 'Cursed has scaled P11 stats');
has(/cursed:\s*'Exotic'/, 'Cursed is Exotic');
has(/cursed:\s*'Controller'/, 'Cursed role is Controller');
has(/cursed:7/, 'Cursed Super charges in seven successful hits');
has(/const requested = options\.mini \? 1 : 1 \+ \(Math\.random\(\) < \.5 \? 0 : 1\)/, 'Full Curse spends one or two ammo');
has(/else if \(Math\.random\(\) < \.5\) applyCursedCurse\(target, owner, \{mini:true\}\)/, 'Normal main has a 50% Mini Curse roll');
has(/cursedHyperCurse:hyper/, 'Hyper main guarantees full Curse');
has(/storm\.x = owner\.x; storm\.y = owner\.y/, 'Cursed Storm follows its owner');
has(/storm\.hitIds\[target\.id\][\s\S]*?storm\.hitIds\[target\.id\] = true/, 'Storm curses each victim only once');
has(/for \(let i = 0; i < 8; i\+\+\)/, 'Hyper Super launches eight darkness clouds');
has(/target\.ghoulDarknessUntil = Math\.max\([\s\S]*?now\+900/, 'Hyper clouds apply Darkness');
has(/cursedMarkedFateArmed=true/, 'Marked Fate is wired for bots');
has(/activateCursedMisfortuneSwap\(player\)/, 'Misfortune Swap is wired for players');
has(/selectedBrawler === 'cursed'[\s\S]*?cursedStormUntil[\s\S]*?activeSpeed \*= 1\.15/, 'Storm Chaser is wired for the player');
has(/t\.brawler === 'cursed'[\s\S]*?cursedStormUntil[\s\S]*?activeBotSpeed \*= 1\.15/, 'Storm Chaser is wired for bots');
has(/combatBrawler === 'cursed'[\s\S]*?castCursedStorm\(player/, 'Player Super routing is wired');
has(/botCombatBrawler === 'cursed'[\s\S]*?castCursedStorm\(bot/, 'Bot Super routing is wired');
has(/if \(b\.isCursedBolt\)[\s\S]*?b\.hitboxMod[\s\S]*?progress \* 1\.72/, 'Growing Hex expands during flight');
has(/selectedBrawler === 'cursed'[\s\S]*?CURSED_BOLT_RANGE/, 'Custom main aim telegraph is present');
has(/ownerBrawler === 'cursed' && b\.isCursedBolt/, 'Custom projectile rendering is present');
has(/cursedStorms\.length = 0/, 'Storms are cleared between rounds');
has(/cursedHyperClouds\.length = 0/, 'Hyper clouds are cleared between rounds');

console.log('Cursed regression checks passed.');
