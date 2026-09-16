import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

const checks = [
  ['DUELS_WIN_SCORE defined as 9', /const DUELS_WIN_SCORE\s*=\s*9;/],
  ['Duels registered in HOME_MODE_CARDS', /\['duels',\s*'⚔️',\s*'Duels \(First to 9\)'/],
  ['Duels in HOME_PERMANENT_MODE_IDS', /HOME_PERMANENT_MODE_IDS\s*=\s*\[[^\]]*'duels'/],
  ['Duels in HOME_EVENT_REWARDS', /duels:\s*\{\s*type:\s*'coins',\s*amount:\s*50/],
  ['Duels rules in HOME_MODE_RULES with First to 9 and 1-4 draft', /duels:\s*\[[\s\S]*?Draft 1 to 4 brawlers[\s\S]*?First to win 9 rounds[\s\S]*?Level 11 stats[\s\S]*?4 Tower Power[\s\S]*?Poison storm disabled/],
  ['Duels mode color and 1V1 tag in createModeCard', /duels:\s*'#a855f7'[\s\S]*?id === 'duels' \|\| id === 'impossible'[\s\S]*?tag\s*=\s*'1V1'/],
  ['updateShowdownModeUI handles duels with custom start button text', /if \(showdownMode === 'duels'\) \{[\s\S]*?startBtn\.textContent = '⚔️ Start Duels \(First to 9\)'/],
  ['launchShowdownMatch routes duels to openDuelsTeamSelectionModal', /if \(showdownMode === 'duels'\) \{\s*openDuelsTeamSelectionModal\(\);\s*return;\s*\}/],
  ['startBtn click event routes duels to openDuelsTeamSelectionModal', /else if \(showdownMode === 'duels'\) openDuelsTeamSelectionModal\(\);/],
  ['startDuelsMatch function initializes 1v1 duels match with matching bot roster', /function startDuelsMatch\(team\) \{[\s\S]*?playerTeam = team\.slice\(\);[\s\S]*?botTeam = \[\];[\s\S]*?isDuels = true;[\s\S]*?duelRoundIndex = 0;[\s\S]*?startDuelsRound\(\);/],
  ['openDuelsTeamSelectionModal allows drafting 1 to 4 brawlers with interactive slots', /function openDuelsTeamSelectionModal\(\) \{[\s\S]*?DUELS ROSTER DRAFT[\s\S]*?slotsContainer[\s\S]*?SELECTED ROSTER[\s\S]*?START DUEL/],
  ['startDuelsRound forces Level 11, star powers, gadgets, and 4 tower powers', /function startDuelsRound\(\) \{[\s\S]*?stormRadius = isDuels \? Infinity : 4000;[\s\S]*?duelPlayerLevel = isTowerDuelEvent \? 11 : \(isDuels \? 11 : getSelectedBrawlerLevel\(\)\);[\s\S]*?gadgetUnlocked: true, starPowerUnlocked: true, hyperchargeUnlocked: true[\s\S]*?duelBot\.slopSushiCards = deck\.slice\(0, 4\);/],
  ['Passive turbo Super & Hypercharge auto-charging in Duels update loop', /if \(isDuels\) \{[\s\S]*?superCharge = clamp\(superCharge \+ dt \* 18, 0, 100\);[\s\S]*?hyperChargeCharge = clamp\(hyperChargeCharge \+ dt \* 12, 0, 100\);/],
  ['Duels round transitions check DUELS_WIN_SCORE', /if \(botScore >= DUELS_WIN_SCORE\) gameOver = true;[\s\S]*?if \(playerScore >= DUELS_WIN_SCORE\) gameOver = true;/],
  ['Poison storm check excludes isDuels in update loop', /!isDuels && !gameOver/],
  ['Poison storm drawing excludes isDuels on canvas', /!isMarkedMayhemMode && !isTugZoneMode && !isDuels/],
  ['renderDuelsHUD renders glassmorphic HUD with 9 score pips and roster mini-bar', /function renderDuelsHUD\(ctx\) \{[\s\S]*?for \(let i = 0; i < DUELS_WIN_SCORE; i\+\+\) \{[\s\S]*?ROUND[\s\S]*?ROSTER/],
  ['Game over text confirms DUELS CHAMPION! (FIRST TO 9)', /won = playerScore >= DUELS_WIN_SCORE;[\s\S]*?matchText = won \? "🏆 DUELS CHAMPION! \(FIRST TO 9\) 🏆"/]
];

for (const [label, pattern] of checks) {
  assert.match(game, pattern, label);
}

console.log('Duels Mode Upgrade regression: ' + checks.length + '/' + checks.length + ' checks passed.');
