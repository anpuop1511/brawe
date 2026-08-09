import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const exotic = fs.readFileSync(new URL('../modules/brawlers/exotic/roster.js', import.meta.url), 'utf8');

assert.match(exotic, /'jacktrade'/, 'JackTrade is registered in the Exotic roster');
assert.match(game, /'jacktrade':\s*\{[\s\S]*?name:'JackTrade'[\s\S]*?attack:'Double or Nothing'[\s\S]*?super:'Trade of Fate'/, 'JackTrade has complete roster and UI metadata');
assert.match(game, /Math\.round\(7200 \* scale\)[\s\S]*?Math\.round\(900 \* scale\)[\s\S]*?speed: 260/, 'JackTrade has the requested Power 11 stats');
assert.match(game, /brawler === 'jacktrade'\) base = 1650/, 'JackTrade reloads in 1.65 seconds');

assert.match(game, /const stage = hyper \? 4 : getJackTradeStage\(owner\)/, 'ALL IN locks main attacks to four cards');
assert.match(game, /stage === 1 \? \[0\] : stage === 2 \? \[-\.032,\.032\] : \[-\.067,-\.022,\.022,\.067\]/, 'Double or Nothing uses distinct one, two, and four-card layouts');
assert.match(game, /if \(!volley \|\| volley\.hit\) return;[\s\S]*?volley\.hit = true/, 'Multiple cards in one volley only advance progression once');
assert.match(game, /volley\.stage === 1\) setJackTradeStage\(owner,2\)[\s\S]*?volley\.stage === 2\) setJackTradeStage\(owner,4\)/, 'Successful attacks advance one to two to four cards');
assert.match(game, /owner\.jackTradeSafeBetArmed[\s\S]*?else setJackTradeStage\(owner,1\)/, 'A complete miss resets progression unless Safe Bet consumes itself');
assert.match(game, /if\(!owner\|\|owner\.hp<=0\|\|volley\.hit\|\|volley\.hyper\)continue/, 'Hyper misses preserve the normal attack stage');
assert.match(game, /NEXT: \$\{stage\} CARD/, 'The HUD clearly displays the next volley size');

for (const outcome of ['regeneration','demolition','rush','toxic','slow','healing']) {
  assert.ok(game.includes(`'${outcome}'`), `Trade of Fate includes ${outcome}`);
}
assert.match(game, /const pool=\[\.\.\.JACKTRADE_SUPER_OUTCOMES\][\s\S]*?pool\.splice\(index,1\)/, 'Jackpot rolls two different outcomes without replacement');
assert.match(game, /jackTradeRegenRemaining[\s\S]*?\+6000[\s\S]*?jackTradeRegenUntil=now\+10000/, 'Regeneration restores 6000 HP over ten seconds');
assert.match(game, /damageJackTradeWalls\([\s\S]*?jackTradePushVX[\s\S]*?jackTradePushUntil/, 'Demolition destroys walls and applies smooth knockback');
assert.match(game, /jackTradeRushUntil[\s\S]*?now\+5000/, 'Rush Order lasts five seconds');
assert.match(game, /base \/= 3/, 'Rush Order reloads 200 percent faster');
assert.match(game, /'toxicCone'[\s\S]*?duration:2000[\s\S]*?damagePerSecond:1000/, 'Toxic Spray deals its requested two-second damage');
assert.match(game, /zone\.startRadius\*\(1\+\.5\*progress\)/, 'Slow Trade grows by 50 percent over its lifetime');
assert.match(game, /ally\.id===owner\.id\?4000:3000/, 'Healing Pot heals JackTrade and teammates for the requested amounts');

assert.match(game, /if\(hyper\)[\s\S]*?jackTradeRushUntil[\s\S]*?jackTradeRegenRemaining[\s\S]*?throwJackTradeEffect\(owner,'allin'/, 'ALL IN replaces the random roll with the combined sequence');
assert.match(game, /'toxicRing'[\s\S]*?duration:2000[\s\S]*?damagePerSecond:800/, 'ALL IN creates the 360-degree Hyper poison burst');
assert.match(game, /'slow'[\s\S]*?duration:7000[\s\S]*?healPerSecond:300/, 'ALL IN creates the growing slow field and healing aura');
assert.match(game, /'hyperPuddle'[\s\S]*?radius:42[\s\S]*?JACKTRADE_HYPER_PUDDLE_MS/, 'Each Hyper card creates a small two-second endpoint puddle');

assert.match(game, /jackTradeJackpotArmed=true/, 'Jackpot can be armed by the player or AI');
assert.match(game, /jackTradeSafeBetArmed=true/, 'Safe Bet can be armed by the player or AI');
assert.match(game, /jackTradeHotStreak \|\| 0\) === 2[\s\S]*?1\.15[\s\S]*?1\.10/, 'Hot Streak buffs every third successful Stage 3 attack');
assert.match(game, /getEntityStarChoice\(owner\)==='long'\)owner\.jackTradeLuckyUntil=now\+2500/, 'Lucky Break activates after a normal random Super');
assert.match(game, /jackTradeLuckyUntil[\s\S]*?hcSpd \*= 1\.12/, 'Lucky Break applies its movement-speed bonus');

assert.match(game, /bot\.brawler === 'jacktrade'[\s\S]*?getJackTradeStage\(bot\)===4/, 'JackTrade AI understands its attack progression');
assert.match(game, /botCombatBrawler === 'jacktrade'[\s\S]*?castJackTradeSuper/, 'JackTrade bots can cast Trade of Fate and ALL IN');
assert.match(game, /jackTradeVolleys\.length = 0[\s\S]*?jackTradeThrownEffects\.length = 0[\s\S]*?jackTradeZones\.length = 0/, 'JackTrade temporary entities clean up between rounds');
assert.match(game, /if\(b\.isJackTradeCard\)[\s\S]*?fillText\(\(b\.jackTradeCardIndex%2\)\?'♦':'♠'/, 'JackTrade cards have bespoke gambling visuals');

assert.doesNotMatch(game, /getBrawlerLevel\s*\(/, 'No removed getBrawlerLevel helper is referenced');

console.log('JackTrade regression suite passed.');
