import fs from 'node:fs';
import assert from 'node:assert/strict';

const bootstrap = fs.readFileSync('bootstrap.js', 'utf8');

assert.match(
  bootstrap,
  /const isOpaqueExternalError = \/\^script error\\\.\?\$\/i\.test\(message\.trim\(\)\)/,
  'opaque browser and extension Script error events are recognized'
);
assert.match(
  bootstrap,
  /&& !event\?\.filename[\s\S]{0,100}&& !event\?\.error[\s\S]{0,100}&& !\(event\?\.lineno > 0\)/,
  'only errors without a source, Error object, or line number are filtered'
);
assert.match(
  bootstrap,
  /if \(isOpaqueExternalError\) return;[\s\S]{0,700}panel\.textContent/,
  'real game errors still reach the recovery panel'
);

console.log('Runtime error filter regression checks passed.');
