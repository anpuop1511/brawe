import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url);
let playwright;
try { playwright=require('playwright'); }
catch { playwright=require(process.env.BRAWE_PLAYWRIGHT || 'C:/Users/test/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const browser=await playwright.chromium.launch({channel:'msedge',headless:true});
try {
 const context=await browser.newContext(); // Isolated: never reads or changes the player's save.
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname!=='brawe.test'){await route.abort();return;}
  const relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
  const file=path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)){await route.abort();return;}
  try {
   let body=await fs.readFile(file);
   if(file.endsWith('game.js')){
    const source=body.toString(), end=source.lastIndexOf('})();');
    body=source.slice(0,end)+'window.__questTest={openQuestBoard,openSeasonPass,playerData,questRewardText,seasonTrackRewardText,refreshDailyWeeklyQuests};\n'+source.slice(end);
   }
   const ext=path.extname(file),type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'}[ext]||'application/octet-stream';
   await route.fulfill({status:200,contentType:type,body});
  }catch{await route.fulfill({status:404,body:''});}
 });
 await page.goto('http://brawe.test/');
 await page.waitForFunction(()=>!!window.__questTest,{},{timeout:20000}).catch(()=>{throw new Error('Runtime boot failed: '+errors.join('; '));});
 for(const width of [1200,390]){
  await page.setViewportSize({width,height:800});
  for(const tab of ['core','gold','damage','special','season']){
   await page.evaluate(tab=>window.__questTest.openQuestBoard(tab),tab);
   assert.equal(await page.locator('#questBoardOverlay').count(),1,tab+' opens once');
   assert(await page.locator('#questBoardOverlay').innerText(),tab+' renders text');
   await page.getByRole('button',{name:'Close',exact:true}).click();
  }
 }
 const labels=await page.evaluate(()=>({one:__questTest.questRewardText({superTappers:1}),many:__questTest.questRewardText({hyperTappers:2}),empty:__questTest.questRewardText(null),track:__questTest.seasonTrackRewardText({type:'superTapper',amount:2})}));
 assert.equal(labels.one,'1 Super Tapper');assert.equal(labels.many,'2 Hyper Tappers');assert.equal(labels.track,'2 Super Tappers');
 await page.evaluate(()=>{__questTest.openQuestBoard();__questTest.openQuestBoard('season');});
 assert.equal(await page.locator('#questBoardOverlay').count(),1,'reopening does not stack quest dialogs');
 await page.getByRole('button',{name:'Close',exact:true}).click();
 if(process.env.BRAWE_TEST_GALLERY){
  for(const width of [1280,390]){
   await page.setViewportSize({width,height:900});
   await page.locator('#brawlerBtn').click();
   const gallery=page.locator('.fighter-gallery:not(.brawler-detail-view)');
   await gallery.waitFor();
   assert(await gallery.locator('.brawler-card').count()>0,'fighter cards render');
   const overflow=await gallery.evaluate(e=>e.scrollWidth-e.clientWidth);
   assert(overflow<=2,'gallery has no horizontal overflow at '+width);
   await gallery.locator('.brawler-browser__search').fill('Outlit');
   await page.waitForFunction(()=>document.querySelectorAll('.fighter-gallery .brawler-card').length===1);
   assert.equal(await gallery.locator('.brawler-card').count(),1,'search remains functional');
   await gallery.locator('.brawler-browser__search').fill('');
   await page.waitForFunction(()=>document.querySelectorAll('.fighter-gallery .brawler-card').length>1);
   await page.screenshot({path:path.join(root,'tests',`gallery-${width}.png`)});
   await gallery.locator('.brawler-browser__close').click();
  }
 }
 assert.deepEqual(errors,[],'No runtime errors during boot or quest-tab navigation');
 console.log('Quest browser regression passed: boot, all 5 tabs at desktop/mobile sizes, labels, and dialog replacement.');
} finally {await browser.close();}
