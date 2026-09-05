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

test('Orbo Super features animated charging windup state and update loop', () => {
  assert.match(gameCode, /owner\.orboSuperWindup\s*=\s*\{/);
  assert.match(gameCode, /function updateOrboStates\(/);
  assert.match(gameCode, /updateOrboStates\(dt\)/);
});

test('Orbo Super has +30% hitbox size scaling (hitboxMod 14.87)', () => {
  assert.match(gameCode, /hitboxMod:\s*14\.87/);
});

test('Orbo Hypercharge Super has wider separated cone spread ([-0.38, 0, 0.38])', () => {
  assert.match(gameCode, /angles\s*=\s*hyper\s*\?\s*\[-0\.38,\s*0,\s*0\.38\]\s*:\s*\[0\]/);
  assert.match(gameCode, /const superAngles=isHypercharged\?\[-0\.38,0,0\.38\]:\[0\]/);
});

test('Orbo Super rendering draws elongated ellipse (longer length 96/110 vs narrower width 38/44)', () => {
  assert.match(gameCode, /const lengthRadius\s*=\s*hyper\s*\?\s*110\s*:\s*96/);
  assert.match(gameCode, /const widthRadius\s*=\s*hyper\s*\?\s*44\s*:\s*38/);
  assert.match(gameCode, /ctx\.ellipse\(0,\s*0,\s*lengthRadius,\s*widthRadius,\s*0,\s*0,\s*Math\.PI\s*\*\s*2\)/);
});

test('Orbo Super windup draws cosmic orbital collapsing rings and glowing core', () => {
  assert.match(gameCode, /entity\.orboSuperWindup/);
  assert.match(gameCode, /ctx\.ellipse\(entity\.x,\s*entity\.y,\s*currentR,\s*currentR\s*\*\s*0\.55,\s*spinAngle,\s*0,\s*Math\.PI\s*\*\s*2\)/);
});
