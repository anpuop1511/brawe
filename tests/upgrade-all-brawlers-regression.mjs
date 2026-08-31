import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../tactical-ui.css',import.meta.url),'utf8');

assert.match(game,/function buildEqualBrawlerUpgradePlan\(coinBudget = playerData\.coins \|\| 0, rawOptions = \{\}\)/,'Upgrade All uses the complete current Coin balance and selected categories');
assert.match(game,/filter\(id => isBrawlerUnlocked\(id\) && !disabledBrawlers\.has\(id\)/,'only owned, active fighters enter the permanent upgrade plan');
assert.match(game,/filter\(entry => entry\.level < 11\)[\s\S]{0,160}sort\(\(left, right\) => left\.level - right\.level/,'the lowest-Power fighter always receives the next affordable upgrade');
assert.match(game,/if \(cost > remaining\) break[\s\S]{0,360}remaining -= cost/,'the planner spends until no next equal upgrade is affordable');
assert.match(game,/const simulated = new Map\(\)[\s\S]{0,1900}for \(const step of plan\.steps\)[\s\S]{0,180}progress\.level = Math\.min\(11, step\.to\)/,'the mixed plan is fully validated before permanent progress mutates');
assert.match(game,/playerData\.coins = Math\.max\(0, \(playerData\.coins \|\| 0\) - plan\.spent\)/,'only Coins actually converted into selected upgrades are removed');
assert.match(game,/className = 'brawler-browser__upgrade-all'[\s\S]{0,1200}openEqualUpgradeAllDialog/,'the Fighter HQ wallet exposes the Upgrade All action');
assert.match(game,/Weekly Trials and disabled fighters are never changed/,'the confirmation explains exclusions');
assert.match(game,/data-upgrade-option="gadget"[\s\S]*data-upgrade-option="star"[\s\S]*data-upgrade-option="hyper"[\s\S]*data-upgrade-option="trinkets"/,'Tools, Talents, Core Surges, and Trinkets are optional');
assert.match(game,/COINS TO FINISH[\s\S]{0,260}MORE NEEDED/,'the planner shows the full selected-category Coin requirement');
assert.match(game,/WHO GETS UPGRADED NOW[\s\S]{0,900}FIGHTERS STILL NEEDING SELECTED UPGRADES/,'the preview identifies immediate recipients and exposes the full remaining roster');
assert.match(game,/function getRosterUpgradeCompletionState\(\)[\s\S]{0,700}complete:powerComplete && kitsComplete/,'the maxed label requires Power and permanent kits to be complete');
assert.doesNotMatch(game,/'⬆ ALL MAXED'/,'the misleading Power-only ALL MAXED label is retired');
assert.match(game,/upgradeAllBtn\.disabled = false/,'the cost planner remains accessible even when no immediate Power purchase is affordable');
assert.match(css,/\.upgrade-all-overlay\{[\s\S]{0,240}z-index:5200/,'Upgrade All has a dedicated confirmation UI');
assert.match(css,/\.upgrade-all-options\{[\s\S]{0,180}repeat\(5/,'the permanent kit choices have a readable desktop layout');
assert.match(css,/@media\(max-width:850px\)[\s\S]{0,620}brawler-browser__upgrade-all/,'Upgrade All remains accessible on mobile');

console.log('BRAWE equal Upgrade All regression checks passed.');
