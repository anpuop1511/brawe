import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// 0. Ensure no rogue plural brawlersData references exist or undefined initPlayerAmmo
assert.doesNotMatch(game, /brawlersData/, 'brawlerData is referenced correctly (no plural brawlersData)');
assert.doesNotMatch(game, /initPlayerAmmo\(\)/, 'initPlayerAmmo() is not called (initPlayerHP handles ammo)');

// 1. Verify Training Cave state variables & helper functions
assert.match(game, /let trainingCaveDeckPanel = null;/, 'trainingCaveDeckPanel state is declared');
assert.match(game, /let trainingAllyAutoDrain = false;/, 'trainingAllyAutoDrain state is declared');
assert.match(game, /let trainingGridBotsActiveAI = false;/, 'trainingGridBotsActiveAI state is declared');
assert.match(game, /let trainingCaveCustomEnemyId = 'king';/, 'trainingCaveCustomEnemyId state is declared');

// 2. Verify on-screen arrow brawler switcher & picker modal
assert.match(game, /function switchTrainingBrawler\(brawlerId\)/, 'switchTrainingBrawler helper is declared');
assert.match(game, /function cycleTrainingBrawler\(delta\)/, 'cycleTrainingBrawler helper is declared');
assert.match(game, /function openTrainingBrawlerPickerModal\(\)/, 'openTrainingBrawlerPickerModal is declared');
assert.match(game, /tcPrevBrawlerBtn/, 'Previous brawler arrow button is present in UI');
assert.match(game, /tcNextBrawlerBtn/, 'Next brawler arrow button is present in UI');
assert.match(game, /tcCurrentBrawlerBtn/, 'Current brawler switcher button is present in UI');

// 3. Verify Healing & Allies Toolkit
assert.match(game, /function summonTrainingAlly\(/, 'summonTrainingAlly helper is declared');
assert.match(game, /function woundTrainingAllies\(/, 'woundTrainingAllies helper is declared');
assert.match(game, /function healTrainingAllies\(\)/, 'healTrainingAllies helper is declared');
assert.match(game, /function clearTrainingAllies\(\)/, 'clearTrainingAllies helper is declared');
assert.match(game, /tcSummonAllyBtn/, 'Summon ally button is present in UI');
assert.match(game, /tcWoundAllyBtn/, 'Wound ally button (25% HP) is present in UI');
assert.match(game, /tcDrainAllyBtn/, 'Ally auto-drain toggle is present in UI');
assert.match(game, /isTrainingAlly:\s*true,\s*isTeammate:\s*true,\s*team:\s*['"]player['"]/, 'Allies are properly allied to player');

// 4. Verify 15-Bot Practice Grid in Bottom Right
assert.match(game, /function spawnTraining15BotGrid\(\)/, 'spawnTraining15BotGrid helper is declared');
assert.match(game, /function resetTraining15BotGrid\(\)/, 'resetTraining15BotGrid helper is declared');
assert.match(game, /tcResetGridBtn/, 'Reset 15-bot grid button is present in UI');
assert.match(game, /tcToggleGridAiBtn/, 'Toggle 15-bot grid AI button is present in UI');
assert.match(game, /const startX = 2750;[\s\S]{0,50}const startY = 2250;/, '15-Bot grid is placed in bottom right corner');
assert.match(game, /for \(let r = 0; r < 3; r\+\+\) \{[\s\S]{0,50}for \(let c = 0; c < 5; c\+\+\)/, 'Grid generates 15 bots (5 columns x 3 rows)');

// 5. Verify Any Enemy Brawler Spawner
assert.match(game, /function spawnTrainingCustomEnemy\(/, 'spawnTrainingCustomEnemy helper is declared');
assert.match(game, /function clearTrainingCustomEnemies\(\)/, 'clearTrainingCustomEnemies helper is declared');
assert.match(game, /tcEnemySelect/, 'Enemy selector dropdown is present in UI');
assert.match(game, /tcSpawnEnemyAiBtn/, 'Spawn Enemy AI button is present in UI');
assert.match(game, /tcSpawnEnemyDummyBtn/, 'Spawn Enemy Dummy button is present in UI');

// 6. Verify Training Grounds visual layout & map overlay
assert.match(game, /WORLD_W = 3800;\s*WORLD_H = 3000;/, 'Training world dimensions are 3800x3000');
assert.match(game, /renderTrainingGroundsOverlay\(\);/, 'renderTrainingGroundsOverlay is invoked in render loop');
assert.match(game, /updateTrainingCaveMode\(dt,\s*now\);/, 'updateTrainingCaveMode is invoked in update loop');

// 7. Verify peaceful spawn logic
assert.match(game, /spawnTrainingCustomEnemy\('king',\s*false\);/, 'Initial King spawns in Dummy mode so player is not shot at upon spawning');
assert.match(game, /isGalleryBot\)\s*\{\s*t\.isDummy\s*=\s*true;/, 'Gallery bots stay peaceful dummies');

console.log('All Training Cave Overhaul regression checks passed successfully!');
