import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../tactical-ui.css',import.meta.url),'utf8');

assert.match(game,/GOLD_EVENT_DURATION_MS=7\*24\*60\*60\*1000/,'Gold Event lasts seven days');
assert.doesNotMatch(game,/GOLD_EVENT_DAILY_COIN_CAP/,'Gold Event has no daily Coin cap');
assert.match(game,/GOLD_EVENT_MATCH_COIN_CAP=25000/,'Gold Event exploit protection limits a single match payout');
assert.match(game,/GOLD_EVENT_DAMAGE_PER_COIN=100/,'Every 100 credited damage converts to one base Coin');
assert.match(game,/getGoldEventWinStreakMultiplier[\s\S]{0,160}Math\.min\(2/,'win-streak multiplier is capped at 2x');
assert.match(game,/isDailyBrickRushActive\(now\)\?getDailyBrickRushMultiplier/,'active Brick Rush multiplies Gold Event earnings');
assert.match(game,/rawCoins=Math\.floor\(\(damage\/GOLD_EVENT_DAMAGE_PER_COIN\)\*mult\.total\),coins=Math\.min\(GOLD_EVENT_MATCH_COIN_CAP,rawCoins\)/,'Gold Event applies only the disclosed per-match exploit safeguard');
assert.match(game,/event\.totalCoins\+=coins/,'lifetime Gold has no total cap');
assert.match(game,/function recordPacketEquippedDamage\(owner,amount,target=null\)[\s\S]{0,700}addGoldEventMatchDamage\(value\)/,'central player and owned-summon real damage enters Gold Event');
assert.match(game,/const goldEventReward = commitGoldEventMatch[\s\S]{0,180}playerData\.coins/,'Gold is granted once at match resolution');
assert.match(game,/makeTab\('gold', '🪙 Gold Event'\)/,'Gold Event appears in Quest HQ');
assert.match(game,/CURRENT WIN STREAK[\s\S]{0,100}\$\{currentStreak\}[\s\S]{0,140}\$\{mult\.streakMult\.toFixed\(2\)\}/,'Gold Event displays the exact live streak and its multiplier');
assert.match(game,/NO DAILY LIMIT/,'Gold Event clearly presents unlimited daily earning');
assert.match(game,/hpBeforeHit=Math\.max\(0,Number\(target\.hp\)\+value\)[\s\S]{0,80}Math\.min\(value,hpBeforeHit\)/,'Gold Event excludes lethal overkill damage');
assert.match(game,/title\.textContent = 'CORE CIRCUIT PASS'/,'the old pass is presented as the new Core Circuit Pass');
assert.match(game,/MISSION CONTROL MOVED/,'the rebuilt pass moves missions into Quest HQ');
assert.match(game,/questBox\.querySelector\('button'\)\.onclick=\(\)=>\{overlay\.remove\(\);openQuestBoard\('season'\)/,'Season Missions route through Quest HQ');
assert.match(css,/\.gold-event-view\{/,'Gold Event has a dedicated presentation');
assert.match(css,/\.gold-event-grid\{/,'Gold Event has a responsive multiplier grid');

console.log('Gold Event, Quest HQ v4, and Core Circuit Pass regression checks passed.');
