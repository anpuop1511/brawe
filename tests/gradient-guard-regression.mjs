import assert from 'node:assert/strict';
import fs from 'node:fs';

const game = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(game, /function safeCreateLinearGradient\(x0, y0, x1, y1\)/);
assert.match(game, /raw\.some\(\(value\) => !Number\.isFinite\(Number\(value\)\)\)/);
assert.match(game, /nativeCreateLinearGradient\(repaired\[0\], repaired\[1\], repaired\[2\], repaired\[3\]\)/);
assert.match(game, /repaired\[0\] === repaired\[2\] && repaired\[1\] === repaired\[3\]/);

console.log('Canvas linear-gradient guard regression checks passed.');
