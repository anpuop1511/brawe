import fs from 'node:fs/promises';

const sourceUrl = new URL('./build_full_balance_suggestions_2026_09_11.mjs', import.meta.url);
const gameUrl = new URL('../game.js', import.meta.url);
const source = await fs.readFile(sourceUrl, 'utf8');
const game = await fs.readFile(gameUrl, 'utf8');

const rowsStart = source.indexOf('const rows = [');
const rowsEnd = source.indexOf('\n];', rowsStart);
if (rowsStart < 0 || rowsEnd < 0) throw new Error('Could not find balance recommendation rows.');
const rowsLiteral = source.slice(source.indexOf('[', rowsStart), rowsEnd + 2);
const rows = Function(`"use strict"; return (${rowsLiteral});`)();

const disabled = new Set(['Robber', 'Boomer', 'Daggershard', 'Cluster', 'Witch', 'Adlof', 'Swimmer', 'Blade Vane']);
const sectionFor = (area) => {
  const value = String(area || '').toLowerCase();
  if (/gadget/.test(value)) return 'Gadgets';
  if (/star power/.test(value)) return 'Star Powers';
  if (/hyper|all in/.test(value)) return 'Hypercharge';
  if (/super|zone|summon|deployable|princess|mortar|stored flame|permanent shield|second life/.test(value)) return 'Super & Summons';
  if (/signature|instinct|special/.test(value)) return 'Special Abilities';
  if (/main|attack|projectile|hit|damage|poison|darkness|freeze|whack|split|beam|blade|pie|spear|curse|scarf|bread|flame|mode parity|setlist|cadence|ramp entry|close reliability|target acquisition/.test(value)) return 'Main Attack';
  return 'Stats, Movement & Reliability';
};

const sectionOrder = ['Main Attack', 'Super & Summons', 'Gadgets', 'Star Powers', 'Hypercharge', 'Special Abilities', 'Stats, Movement & Reliability', 'Watchlist'];
const seen = new Set();
const changes = rows
  .filter((row) => {
    if (disabled.has(row[1])) return false;
    const key = String(row[1]).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .map(([type, brawler, role, area, current, numbers, why, priority, risk]) => ({
    brawler,
    type: type.toLowerCase(),
    section: type === 'HOLD' ? 'Watchlist' : sectionFor(area),
    area,
    current,
    numbers,
    why,
    priority,
    risk
  }))
  .sort((a, b) => sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section)
    || ({ nerf: 0, rework: 1, adjust: 2, buff: 3, hold: 4 }[a.type] ?? 5) - ({ nerf: 0, rework: 1, adjust: 2, buff: 3, hold: 4 }[b.type] ?? 5)
    || a.brawler.localeCompare(b.brawler));

const entry = {
  tag: 'V6 LIVE',
  title: 'Full Roster Balance Update',
  summary: 'The V6 active-roster balance pass is live. Main Attacks, Supers, Gadgets, Star Powers, Hypercharges and special mechanics are grouped below. Recommendations already met by stricter live values were preserved. Robber, Boomer, Daggershard, Cluster, Witch, Adlof, Swimmer and Blade Vane remain disabled and unchanged.',
  grouped: true,
  changes
};

const startMarker = '        /* BALANCE_V6_GENERATED_START */';
const endMarker = '        /* BALANCE_V6_GENERATED_END */';
const generated = `${startMarker}\n        ${JSON.stringify(entry, null, 8).replaceAll('\n', '\n        ')},\n${endMarker}`;
let next = game;
const existingStart = game.indexOf(startMarker);
const existingEnd = game.indexOf(endMarker);
if (existingStart >= 0 && existingEnd > existingStart) {
  next = `${game.slice(0, existingStart)}${generated}${game.slice(existingEnd + endMarker.length)}`;
} else {
  const marker = '    const balanceBlogEntries = [\n';
  if (!game.includes(marker)) throw new Error('Could not find balance blog insertion point.');
  next = game.replace(marker, `${marker}${generated}\n`);
}

await fs.writeFile(gameUrl, next, 'utf8');
console.log(JSON.stringify({ activeEntries: changes.length, disabledExcluded: [...disabled], sections: [...new Set(changes.map((change) => change.section))] }));
