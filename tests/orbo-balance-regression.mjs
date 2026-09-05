import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameCode = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

test('Orbo base stats have +25% main attack damage (575)', () => {
  assert.match(gameCode, /brawlerId === 'orbo'[\s\S]*?dmg:Math\.round\(575\*scale\)/);
});

test('Orbo main attack fires with 575 damage and +30% hitbox size (1.56 / 2.34)', () => {
  assert.match(gameCode, /damage:isBot\?412:575/);
  assert.match(gameCode, /hitboxMod:dense\?2\.34:1\.56/);
});

test('Orbo Super and Hypercharge have +120% hitbox size (11.44)', () => {
  assert.match(gameCode, /hitboxMod:11\.44/);
});

test('Orbo rendering scales main attack to 9.1/13 and Super/HC to 64/70 radius', () => {
  assert.match(gameCode, /radius=b\.orboDense\?13:9/);
  assert.match(gameCode, /radius=hyper\?70:64/);
});
