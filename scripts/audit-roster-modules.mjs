globalThis.window = globalThis;
import { readFileSync } from 'node:fs';

const moduleFiles = [
  '../modules/core/registry.js',
  '../modules/brawlers/common/roster.js',
  '../modules/brawlers/common/outlit.js',
  '../modules/brawlers/rare/roster.js',
  '../modules/brawlers/super-rare/roster.js',
  '../modules/brawlers/epic/roster.js',
  '../modules/brawlers/mythic/roster.js',
  '../modules/brawlers/legendary/roster.js',
  '../modules/brawlers/exotic/roster.js'
];

for (const file of moduleFiles) await import(file);

const definitions = Object.values(globalThis.ArenaForgeModules.brawlers);
const ids = definitions.map((definition) => definition.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const missingMetadata = definitions
  .filter((definition) => !definition.name || !definition.rarity)
  .map((definition) => definition.id);
const expectedHookNames = [
  'attack', 'super', 'aim', 'render', 'botAI',
  'gadget', 'starPower', 'hypercharge', 'attachie', 'sushi'
];

const runtimeSource = readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const runtimeRosterMatch = runtimeSource.match(/const allBrawlers\s*=\s*\[([\s\S]*?)\];/);
if (!runtimeRosterMatch) {
  throw new Error('Could not find the live allBrawlers roster in game.js');
}
const runtimeIds = [...runtimeRosterMatch[1].matchAll(/['"]([a-z0-9_]+)['"]/g)].map((match) => match[1]);
const runtimeDuplicateIds = runtimeIds.filter((id, index) => runtimeIds.indexOf(id) !== index);
const runtimeAutoAddsModules = runtimeSource.includes('Object.keys(registeredBrawlerModules)')
  && runtimeSource.includes('allBrawlers.push(moduleId)');
const effectiveRuntimeIds = runtimeAutoAddsModules
  ? [...new Set([...runtimeIds, ...ids])]
  : runtimeIds;
const runtimeMissing = ids.filter((id) => !effectiveRuntimeIds.includes(id));
const moduleMissing = runtimeIds.filter((id) => !ids.includes(id));

function getTopLevelQuotedKeys(source, declaration) {
  const markerIndex = source.indexOf(declaration);
  if (markerIndex < 0) throw new Error(`Could not find ${declaration}`);
  const objectStart = source.indexOf('{', markerIndex + declaration.length);
  if (objectStart < 0) throw new Error(`Could not find object for ${declaration}`);
  const keys = [];
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = objectStart; index < source.length; index++) {
    const char = source[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === "'" || char === '"') {
      if (depth === 1) {
        const quoteChar = char;
        let value = '';
        let cursor = index + 1;
        let localEscape = false;
        for (; cursor < source.length; cursor++) {
          const next = source[cursor];
          if (localEscape) {
            value += next;
            localEscape = false;
          } else if (next === '\\') {
            localEscape = true;
          } else if (next === quoteChar) {
            break;
          } else {
            value += next;
          }
        }
        const remainder = source.slice(cursor + 1);
        const colonOffset = remainder.search(/\S/);
        if (colonOffset >= 0 && remainder[colonOffset] === ':') keys.push(value);
        index = cursor;
        continue;
      }
      quote = char;
      continue;
    }
    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  return keys;
}

const displayIds = runtimeSource.includes('for (const id of allBrawlers)')
  ? effectiveRuntimeIds
  : getTopLevelQuotedKeys(runtimeSource, 'const brawlerData =');
const displayMissing = runtimeIds.filter((id) => !displayIds.includes(id));

if (definitions.length !== 68) {
  throw new Error(`Expected 68 modular brawlers, received ${definitions.length}`);
}
if (duplicateIds.length) {
  throw new Error(`Duplicate modular brawlers: ${[...new Set(duplicateIds)].join(', ')}`);
}
if (missingMetadata.length) {
  throw new Error(`Missing modular metadata: ${missingMetadata.join(', ')}`);
}
if (runtimeMissing.length || moduleMissing.length) {
  throw new Error(
    `Roster mismatch. Runtime missing: ${runtimeMissing.join(', ') || 'none'}; `
    + `modules missing: ${moduleMissing.join(', ') || 'none'}`
  );
}
if (runtimeDuplicateIds.length) {
  throw new Error(`Duplicate live roster entries: ${[...new Set(runtimeDuplicateIds)].join(', ')}`);
}
if (displayMissing.length) {
  throw new Error(`Live roster entries missing brawlerData: ${displayMissing.join(', ')}`);
}

const registry = globalThis.ArenaForgeModules;
registry.hydrateBrawlerDefinitions({
  fuser: {
    attack: 'Audit Attack',
    super: 'Audit Super',
    desc: 'Audit hydration entry'
  }
}, ['fuser']);
if (registry.getBrawler('fuser')?.attack !== 'Audit Attack') {
  throw new Error('Brawler definition hydration failed');
}
registry.registerBrawlerHooks('fuser', {
  attack: ({ audit }) => audit === true
});
if (!registry.runBrawlerHook('fuser', 'attack', { audit: true })) {
  throw new Error('Brawler hook routing failed');
}
if (registry.runBrawlerHook('fuser', 'super', { audit: true })) {
  throw new Error('Missing brawler hooks must fall back to the classic runtime');
}
const migrationReport = registry.getMigrationReport(ids);
if (migrationReport.length !== 68) {
  throw new Error(`Expected 68 migration report entries, received ${migrationReport.length}`);
}
if (expectedHookNames.some((hookName) => !(hookName in migrationReport[0].hooks))) {
  throw new Error('Migration report is missing one or more gameplay hook columns');
}

const rarityCounts = definitions.reduce((counts, definition) => {
  counts[definition.rarity] = (counts[definition.rarity] || 0) + 1;
  return counts;
}, {});

console.log(JSON.stringify({
  status: 'PASS',
  rosterCount: definitions.length,
  runtimeRosterCount: effectiveRuntimeIds.length,
  displayRosterCount: effectiveRuntimeIds.filter((id) => displayIds.includes(id)).length,
  rarityCounts,
  hookContract: expectedHookNames,
  ids
}, null, 2));
