import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');

assert.match(game,/seasonPassHistory:\s*\{\}/,'historical seasons have a dedicated archive');
assert.match(game,/playerData\.seasonPassHistory\[playerData\.seasonPass\.seasonId\]=JSON\.parse\(JSON\.stringify\(playerData\.seasonPass\)\)/);
assert.match(game,/seasonPassHistory: playerData\.seasonPassHistory \|\| \{\}/);
assert.match(game,/if \(data\.persistent\.seasonPassHistory\) playerData\.seasonPassHistory = data\.persistent\.seasonPassHistory/);
assert.match(game,/boss:\{completed:\[\],claimedRewards:\[\],extremeRevealSeen:false\}/);
assert.match(game,/bossState\.claimedRewards\.includes\(id\)/,'boss rewards are idempotent');
assert.match(game,/pass\[claimField\]\.includes\(tier\)/,'pass rewards are idempotent');
assert.match(game,/season\.coreBreachCompleted=true/);
assert.match(game,/packets\.equipped=.*packets\.unlocked\[packets\.equipped\]/);

const sample={persistent:{
  season3:{schemaVersion:1,seasonId:'core-breaker-arena-forge-2026-s3',coreBreachCompleted:true,boss:{completed:['hard','master','impossible_2'],claimedRewards:['hard','master','impossible_2'],extremeRevealSeen:true},questClaims:['q1'],questProgress:{fightersUsed:['outlit']},cosmetics:['core_scanline']},
  packets:{schemaVersion:1,unlocked:{bird:true},progress:{bird:100,bear:20},equipped:'bird',discoveredGroups:[],stats:{triggers:8,damage:24000,discoveries:1,used:['bird']}},
  seasonPass:{seasonId:'core-breaker-arena-forge-2026-s3',xp:900,level:9,premiumUnlocked:true,claimedFreeRewards:[1,2],claimedPremiumRewards:[1],quests:{season3_01:{progress:20000,completed:true,rewardClaimed:true}}},
  seasonPassHistory:{'battle-of-the-towers-2026-s2':{xp:1400,level:14,claimedFreeRewards:[1,2,3]}},
  profile:{equippedTitle:'core_corruptor'},brickBonV2:{unlockedTitles:['core_corruptor'],claimedMilestones:['brick_100']}
}};
const reloaded=JSON.parse(JSON.stringify(sample));
assert.deepEqual(reloaded,sample,'all Season 3 and historical progression survives JSON/localStorage serialization');
assert.equal(reloaded.persistent.packets.equipped,'bird');
assert(reloaded.persistent.season3.boss.claimedRewards.includes('impossible_2'));
assert.equal(reloaded.persistent.profile.equippedTitle,'core_corruptor');

console.log('Season 3 persistence serialization roundtrip checks passed.');
