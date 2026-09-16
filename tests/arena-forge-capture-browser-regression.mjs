import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(), browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage(), errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.hostname!=='brawe.test')return route.abort();
 const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
 if(!file.startsWith(root+path.sep))return route.abort();
 try{
  let body=await fs.readFile(file);
  if(file.endsWith('game.js')){
   let s=body.toString(),i=s.lastIndexOf('})();');
   body=s.slice(0,i)+`window.__forgeTest={run(mode){
    showdownMode=mode;isRankedMatch=false;launchShowdownMatch();
    const routing=isArenaForgeMode, noWalls=destructibleWalls.length===0, fighters=getArenaForgeCombatants(null,true).length;
    arenaForgeHelpPanel?.remove();arenaForgeHelpPanel=null;arenaForgePrepUntil=0;
    const startPowers=[...arenaForgeCapturedAttackPowers.player];
    arenaForgeTimer=12;updateArenaForgeBeacon(0);
    const spawned=!!arenaForgeBeacon;
    const contenders=getArenaForgeCombatants(null,true);
    for(const e of contenders){e.x=80;e.y=80;e.isFlying=false;}
    player.x=arenaForgeBeacon.x;player.y=arenaForgeBeacon.y;
    updateArenaForgeBeacon(3);const half=Math.abs(arenaForgeBeacon.progress-.5)<.0001;
    const enemy=contenders.find(e=>e.id!==player.id&&e.team!=='player');
    enemy.x=player.x;enemy.y=player.y;updateArenaForgeBeacon(1);
    const contested=arenaForgeBeacon.contested&&Math.abs(arenaForgeBeacon.progress-.5)<.0001;
    enemy.x=80;enemy.y=80;updateArenaForgeBeacon(3);
    const captured=!arenaForgeBeacon&&arenaForgeCapturedAttackPowers.player.has('bounce');
    arenaForgeTimer=50;updateArenaForgeBeacon(0);const boss=arenaForgeBeacon?.kind==='rocketeer'&&arenaForgeBeacon.seconds===15;
    arenaForgeCapturedAttackPowers.player=new Set(['rocketeer','bounce','orbit','fire']);
    bullets.length=0;player.forgeRiderReadyAt=0;
    fireArenaForgeCapturedHyperAttacks(player,0,performance.now());const count=bullets.length;
    fireArenaForgeCapturedHyperAttacks(player,0,performance.now());const capped=count===bullets.length;
    const rockets=bullets.filter(b=>b.isRocketeerMain).length;
    const finite=bullets.every(b=>[b.x,b.y,b.vx,b.vy,b.damage].every(Number.isFinite));
    for(let n=0;n<30;n++)update(1/60);
    return {routing,noWalls,fighters,startPowers,spawned,half,contested,captured,boss,count,capped,rockets,finite};
   }};`+s.slice(i);
  }
  await route.fulfill({status:200,body,contentType:{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[path.extname(file)]||'application/octet-stream'});
 }catch{await route.fulfill({status:404,body:''});}
});
try{
 for(const mode of ['arena_forge','arena_forge_overclocked']){
  await page.goto('http://brawe.test/');await page.waitForFunction(()=>!!window.__forgeTest);
  const r=await page.evaluate(m=>__forgeTest.run(m),mode);
  for(const key of ['routing','noWalls','spawned','half','contested','captured','boss','capped','finite'])assert.equal(r[key],true,mode+': '+key);
  assert.equal(r.fighters,6);assert.equal(r.rockets,mode.endsWith('overclocked')?12:3);
  assert.equal(r.startPowers.length,mode.endsWith('overclocked')?4:0);
  console.log(mode,JSON.stringify(r));
 }
 assert.deepEqual(errors,[]);console.log('Arena Forge browser regression passed');
}finally{await browser.close();}
