import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd(),browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
await page.route('**/*',async route=>{const url=new URL(route.request().url());if(url.hostname!=='brawe.test')return route.abort();const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep))return route.abort();try{let body=await fs.readFile(file);if(file.endsWith('game.js')){const source=body.toString(),index=source.lastIndexOf('})();');body=source.slice(0,index)+`window.__loomaSmoke={run(){selectedBrawler='looma';player.brawler='looma';player.x=1900;player.y=1900;player.hp=player.maxHp=6600;resetPlayerAmmoForBrawler('looma');lastShot=-1e9;fire(player,2200,1900,false,false);lastShot=-1e9;fire(player,2200,2150,false,false);castLoomaSuper(player,2250,1900,false);updateLoomaEffects(performance.now(),.016);return {needles:bullets.filter(b=>b.isLoomaNeedle).length,threads:loomaThreads.length,weaves:loomaWeaves.length,ammo};}};`+source.slice(index);}await route.fulfill({status:200,body,contentType:{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[path.extname(file)]||'application/octet-stream'});}catch{await route.fulfill({status:404,body:''});}});
try{
  await page.goto('http://brawe.test');await page.waitForFunction(()=>!!window.__loomaSmoke);
  await page.getByRole('button',{name:/Training$/}).click();
  const result=await page.evaluate(()=>window.__loomaSmoke.run());
  assert.deepEqual(result,{needles:2,threads:1,weaves:1,ammo:1});
  await page.waitForTimeout(250);assert.deepEqual(errors,[]);
  console.log('Looma live Training attack, thread, Super and render loop PASS');
}finally{await browser.close();}
