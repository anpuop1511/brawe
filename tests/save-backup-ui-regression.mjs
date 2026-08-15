import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /function downloadBraweSaveBackup\(\)/);
assert.match(game, /function importBraweSaveBackup\(file\)/);
assert.match(game, /format: 'BRAWE_SAVE_BACKUP'/);
assert.match(game, /downloadSaveBtn\.textContent = 'DOWNLOAD SAVE'/);
assert.match(game, /importSaveBtn\.textContent = 'IMPORT SAVE'/);
assert.match(game, /progressionShortcutRow \|\| homeUtilityRow/);
assert.match(game, /progressionShortcutRow\) progressionShortcutRow\.appendChild\(roadBtn\)/);
assert.match(game, /importSaveInput\.accept = '\.json,application\/json'/);

console.log('Accessible save backup UI regression checks passed.');
