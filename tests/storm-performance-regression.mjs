import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

assert.match(source, /STORM_BASE_MAX_HP_DAMAGE_PCT\s*=\s*0\.08/,
  'storm must start from max-HP percentage damage');
assert.match(source, /STORM_MAX_HP_DAMAGE_PCT_CAP\s*=\s*0\.20/,
  'storm max-HP ramp must remain capped');
assert.match(source, /\(e\.maxHp \|\| 1\) \* stormDamagePct/,
  'storm damage must derive from the affected entity max HP');
assert.doesNotMatch(source, /const stormDmg = \(1000 \+ \(e\.stormTicks \* 250\)\)/,
  'legacy flat storm damage must not return');

assert.match(source, /const isWorldVisualVisible =/,
  'rendering must cull off-screen world visuals');
assert.match(source, /const decorativeFxStride = visualPressure \? 4 : 1/,
  'heavy scenes must reduce decorative particle work to one quarter');
assert.match(source, /heavyScene \? 30 : 45/,
  'low-power heavy scenes must use the stable frame pacing target');
assert.match(source, /lightweightExplosionSpawnsThisFrame > lightweightLimit/,
  'visual-only explosion burst spam must be capped before rendering');
assert.match(source, /const simplifyExplosionFx = explosions\.length > \(LOW_POWER_DEVICE \? 28 : 80\)/,
  'crowded explosion scenes must switch to the lightweight renderer');
assert.match(source, /preserveWarningDetail/,
  'explosion optimization must preserve warning and telegraph readability');
assert.match(source, /const gridStartX = Math\.max\(0, Math\.floor\(\(camX - 100\)/,
  'large maps must draw only their visible grid section');
assert.match(source, /const botTargetScanDue =/,
  'expensive bot target scans must be staggered');
assert.match(source, /if \(botTargetScanDue\) \{\s*for\(const o of aliveBots\)/,
  'bot-versus-bot target scoring must not run every frame');

console.log('Storm percentage damage and performance regression checks passed.');
