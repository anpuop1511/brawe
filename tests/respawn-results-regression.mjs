import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

assert.match(game, /const OBJECTIVE_RESPAWN_SECONDS = 4/, 'objective modes use a finite respawn delay');
assert.match(game, /function restoreRespawningEntity[\s\S]{0,1800}entity\.hp = Math\.max\(1, Number\(entity\.maxHp\)[\s\S]{0,500}entity\.isDead = false[\s\S]{0,2500}ammo = maxAmmo/, 'shared respawn restoration repairs health, death state, and player ammo');
assert.match(game, /if \(isObjectiveMode\)[\s\S]{0,1800}restoreRespawningEntity\(player[\s\S]{0,1800}restoreRespawningEntity\(bot/, 'objective modes respawn both player and bots');
assert.match(game, /(?:const|let) cameraTargetX = Number\.isFinite\(player\.x\)/, 'dead or corrupted positions cannot poison the camera');
assert.match(game, /match-results-overlay/, 'battle completion creates the redesigned results overlay');
assert.match(game, /match-results-card/, 'battle completion creates the results card');
assert.match(game, /RETURN TO LOBBY/, 'results screen provides an explicit return action');
assert.match(game, /\/\/\s*player\s*if\s*\(player\.hp > 0\)[\s\S]*?drawEntityStatusChips[\s\S]*?\/\/\s*draw continuous beams/, 'player specific drawing block closes before world entities so dead state does not blank the screen');

console.log('Respawn recovery, death camera, and match results regression checks passed.');
