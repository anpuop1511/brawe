import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const cardsSource=fs.readFileSync(new URL('../slopsushi-cards.js',import.meta.url),'utf8');
const gameSource=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const context={window:{}};
vm.runInNewContext(cardsSource,context);
const decks=context.window.SLOP_SUSHI_DECKS;
assert.ok(decks&&typeof decks==='object','Transformation decks load');
assert.equal(Object.keys(decks).length,66,'All 66 active brawlers have decks');
for(const [id,deck] of Object.entries(decks)){
  assert.equal(deck.length,8,`${id} has exactly 8 Transformations`);
  assert.equal(new Set(deck.map(card=>card.id)).size,8,`${id} card ids are unique`);
  for(const card of deck){
    assert.ok(card.name&&card.desc,`${card.id} has player-facing wording`);
    assert.ok(card.effects&&Object.keys(card.effects).length,`${card.id} has a live effect`);
  }
}
const duplicateNames=[];
const names=new Map();
for(const card of Object.values(decks).flat()){
  if(names.has(card.name))duplicateNames.push([names.get(card.name),card.id,card.name]);
  names.set(card.name,card.id);
}
assert.deepEqual(duplicateNames,[],'No two Transformations share a name');
for(const card of Object.values(decks).flat()){
  assert.doesNotMatch(card.name,/Clock \d|Satellites|Kit Rule Broken|Geometry|RULES OFF/,'Generated template card names are gone');
}

const duplicateEffectPackages=[];
const effectPackages=new Map();
for(const card of Object.values(decks).flat()){
  const signature=JSON.stringify(Object.fromEntries(Object.entries(card.effects).sort()));
  if(effectPackages.has(signature))duplicateEffectPackages.push([effectPackages.get(signature),card.id]);
  effectPackages.set(signature,card.id);
}
assert.deepEqual(duplicateEffectPackages,[],'No two Transformations share an identical effect package');

const dynamicallyResolvedEffects=new Set([
  'sushiAttackPierce','sushiAttackReturn','sushiAttackForks','sushiAttackRangePct',
  'sushiAttackSizePct','sushiAttackSpeedPct','sushiAttackBounceRangePct','sushiAttackHoming',
  'sushiAttackHomingRadius','sushiSuperPierce','sushiSuperReturn','sushiSuperForks',
  'sushiSuperRangePct','sushiSuperSizePct','sushiSuperSpeedPct','sushiSuperBounceRangePct',
  'sushiSuperHoming','sushiSuperHomingRadius'
]);
const unwiredEffects=[];
for(const [id,deck] of Object.entries(decks)){
  for(const card of deck){
    for(const key of Object.keys(card.effects)){
      if(!dynamicallyResolvedEffects.has(key)&&!gameSource.includes(key))unwiredEffects.push(`${id}:${card.name}:${key}`);
    }
  }
}
assert.deepEqual(unwiredEffects,[],'Every Transformation effect key is consumed by the live combat runtime');

const bouncy=decks.bouncin_balls;
assert.equal(bouncy[0].effects.bouncyBounceSizePct,.25,'Bouncin grows 25% each bank');
assert.equal(bouncy[0].effects.bouncyBounceGrowthCap,5,'Bouncin growth caps after five banks');
assert.equal(bouncy[1].effects.sushiSuperRangePct,1,'Bouncin Super gains 100% range');
assert.equal(bouncy[2].effects.bouncyBounceRangeGainPct,.30,'Bouncin gains travel on bounce');
assert.equal(bouncy[3].effects.bouncyAttackOrbitMs,4000,'Bouncin radial volley uses a four-second timer');
assert.equal(bouncy[3].effects.bouncyAttackOrbitBalls,3,'Bouncin radial volley fires three balls');

const skele=decks.skeleflying;
assert.equal(skele[0].effects.skeleMainExtraDrops,4,'Skeleflying main formation adds four parachutes');
assert.equal(skele[1].effects.skeleDropEcho,1,'Skeleflying landing encore is enabled');
assert.equal(skele[2].effects.skeleDropVacuum,260,'Skeleflying landing vacuum has a real pull radius');
assert.equal(skele[3].effects.skeleMainPassenger,1,'Skeleflying main drops guaranteed troopers');
assert.equal(skele[4].effects.skeleSuperExtraPortals,4,'Skeleflying Super adds four portals');
assert.equal(skele[5].effects.skelePortalTroopers,2,'Skeleflying portals carry exactly two troopers');
assert.equal(skele[6].effects.skeleTitanSwordPct,1,'Skeleflying Bone Titans deal double sword damage');
assert.equal(skele[7].effects.skeleSkyTakeover,1,'Skeleflying Exotic takeover is enabled');
for(const liveHook of [
  /parachuteCount=skyTakeover\?9/,
  /skeleDropEcho&&owner/,
  /p\.skeleDropVacuum>0/,
  /guaranteedTrooper:skeleEffect\('skeleMainPassenger'\)/,
  /portalCount=skyTakeover\?12/,
  /trooperCount:skyTakeover\?2:Math\.max\(1,Math\.round\(skeleEffect\('skelePortalTroopers'\)\|\|1\)\)/,
  /skeleTitanSwordMult:1\+skeleEffect\('skeleTitanSwordPct'\)/,
  /forceMoving:skyTakeover/
]) assert.match(gameSource,liveHook,`Skeleflying mechanic ${liveHook} is directly wired`);

for(const key of ['bouncyBounceSizePct','bouncyBounceRangeGainPct','bouncyAttackOrbitMs','bouncyFifthBounceBurst','towerAttackEchoCount','towerRadialEveryAttacks','towerTravelGrowthPct','towerSuperOrbitCount']){
  assert.ok(gameSource.includes(`'${key}'`),`${key} is wired into game.js`);
}
assert.match(gameSource,/unlockedCards\[pickedId\]\s*=\s*deck\.map\(card=>card\.id\)/,'A Tower Drop grants every card in its chosen deck');
assert.match(gameSource,/name:brawlerData\[pickedId\]\?\.name\|\|pickedId/,'Tower Drop reward names the brawler');
assert.match(gameSource,/shuffled\.slice\(0,Math\.min\(12,shuffled\.length\)\)/,'Tower Trouble rolls a 12-brawler crew');
assert.match(gameSource,/run\.floor=floor\+1/,'Clearing a Tower floor advances progression');
assert.match(gameSource,/run\.losses<3/,'A run survives its first two brawler knockouts');
assert.match(gameSource,/run\.eliminated\.push\(run\.brawler\)/,'A losing brawler is removed from the current run');
assert.match(gameSource,/tower-run-board__tower/,'The ten-floor visual tower is rendered');
assert.match(gameSource,/TOWER_FLOOR_CHALLENGES/,'Each floor has its own challenge rules');

console.log('Tower Transformation regression suite passed.');
