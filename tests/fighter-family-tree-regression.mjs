import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../fighter-gallery.css',import.meta.url),'utf8');
const familyBlock=game.match(/const fighterFamilies = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1]||'';
const memberIds=[...familyBlock.matchAll(/members:\[([^\]]+)\]/g)].flatMap(match=>[...match[1].matchAll(/'([^']+)'/g)].map(item=>item[1]));
const rosterBlock=game.match(/const allBrawlers = \[([\s\S]*?)\];/)?.[1]||'';
const rosterIds=[...rosterBlock.matchAll(/'([^']+)'/g)].map(match=>match[1]);

assert.equal(new Set(memberIds).size,87,'every family slot must contain a unique fighter');
assert.deepEqual([...memberIds].sort(),[...rosterIds].sort(),'family tree must include the complete roster exactly once');
assert.notDeepEqual(memberIds,rosterIds,'families must be based on lore and playstyle instead of release order');
assert.equal((familyBlock.match(/members:\[/g)||[]).length,22,'87 fighters should form 22 family branches');
assert.match(game,/function showFamilyTree\(\)/,'family tree screen is wired');
assert.match(game,/familyTreeBtn\.onclick=showFamilyTree/,'fighter screen exposes the family tree button');
assert.match(game,/family\.members\.filter\(fighterId=>!isBrawlerHidden\(fighterId\)/,'hidden fighters are removed before family branches render');
assert.match(game,/visibleFighterCount/,'family tree reports the active roster count instead of exposing hidden roster entries');
assert.match(css,/\.fighter-family-tree/,'family tree visuals are present');

console.log('Fighter family tree regression checks passed.');
