import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();
const errors = [];
let scenario = 'boot';
page.on('pageerror', error => { errors.push({ scenario, message: error.message }); console.log('ERROR', scenario, error.message); });
await page.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.hostname !== 'brawe.test') return route.abort();
  const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
  if (!file.startsWith(root + path.sep)) return route.abort();
  try {
    let body = await fs.readFile(file);
    if (file.endsWith('game.js')) {
      const source = body.toString(), end = source.lastIndexOf('})();');
      body = source.slice(0, end) + `window.__combatAudit={allBrawlers,disabledBrawlers,switchTrainingBrawler,fire(){fire(player,player.x+180,player.y,false,false);},fireSuper,launchShowdownMatch,activateHypercharge,update,
        charge(){superCharge=100;hyperChargeCharge=100;},
        boomCheck(){
          switchTrainingBrawler('boom_arang');
          const now=performance.now();player.boomArangInstinctReadyAt=now+9000;
          const waiting=ensureBoomArangInstinctState(player,now).ready;
          const ready=ensureBoomArangInstinctState(player,now+9000).ready;
          const x=player.x,y=player.y,n=bullets.length;
          const p={isBoomArang:true,ownerId:player.id,x:x+150,y,vx:680,vy:0,damage:1100,boomArangRide:true,boomArangHyperSplit:true};
          resolveBoomArangImpact(p,true);resolveBoomArangImpact(p,true);
          const children=bullets.slice(n),startUnchanged=player.x===x;
          updateBoomArangInstinctTravel(player.boomArangRideTravel.startAt+175);
          const halfway=player.x>x && player.x<x+150;
          updateBoomArangInstinctTravel(player.boomArangRideTravel.startAt+350);
          const ammoBeforeReturn=ammo;
          for(let i=0;i<40;i++)update(1/60);
          const splitsReturn=children.every(b=>b.returning);
          const noExtraAmmo=ammo===ammoBeforeReturn;
          const victim=bots.find(b=>b.isGalleryBot && b.brawler==='outlit');
          victim.shield=0;victim.hp=victim.maxHp;
          const before=victim.hp;
          checkHit(victim,{ownerId:player.id,ownerBrawler:'boom_arang',isBoomArang:true,x:victim.x,y:victim.y,vx:680,vy:0,damage:1100,pierce:true,hitIds:{}},-1);
          const damage=before-victim.hp;
          const beforeSide=victim.hp;checkHit(victim,children[0],-1);
          const sideDamage=beforeSide-victim.hp;
          const completed=!player.boomArangRideTravel;
          bullets.length=0;victim.hp=victim.maxHp;victim.x=player.x+150;victim.y=player.y;victim.baseX=victim.x;victim.baseY=victim.y;
          bots.splice(0,bots.length,victim);ammo=maxAmmo;lastShot=0;
          fire(player,victim.x,victim.y,false,false);
          const shot=bullets.find(b=>b.isBoomArang);
          for(let i=0;i<70;i++)update(1/60);
          return {waiting,ready,count:children.length,pierce:children.every(b=>b.pierce),startUnchanged,halfway,completed,damage,sideDamage,spawned:!!shot,liveDamage:victim.maxHp-victim.hp,splitsReturn,noExtraAmmo,splitRange:children[0].boomArangSideOutTime*680};
        },
        carmelaCheck(){
          switchTrainingBrawler('carmela_fudge');
          const target=bots.find(b=>b.isGalleryBot&&b.hp>100000)||bots.find(b=>b.hp>0);
          if(!target)throw new Error('No Carmela runtime target');
          ammo=Math.max(0,maxAmmo-1);player.carmelaFudgeForm='carmela';
          switchCarmelaFudgeForm(player,'g2');
          const g2Reloaded=ammo===maxAmmo&&player.carmelaFudgeForm==='fudge'&&player.carmelaSpeedUntil>performance.now();
          bullets.length=0;lastShot=0;
          fire(player,target.x,target.y,false,false);
          const fudgeShot=bullets.find(b=>b.ownerId===player.id&&b.isFudgeGlob);
          for(let n=0;n<4;n++)checkHit(target,{ownerBrawler:'carmela_fudge',ownerId:player.id,isFudgeGlob:true,damage:1,pierce:false,hitIds:{}},-1);
          const fudgeShell=target.inChocolateShell===true&&target.chocolateShellHp===3500;
          target.inChocolateShell=false;target.chocolateCoverage=0;target.stunnedUntil=0;
          switchCarmelaFudgeForm(player,'g1');
          bullets.length=0;lastShot=0;player.carmelaChargePct=.75;
          const oldX=target.x,oldY=target.y,oldDist=Math.hypot(oldX-player.x,oldY-player.y);
          fire(player,target.x,target.y,false,false);
          const hand=bullets.find(b=>b.ownerId===player.id&&b.isCarmelaHand);
          if(hand)checkHit(target,hand,-1);
          const handPulled=!!hand&&hand.pullType==='all'&&Math.hypot(target.x-player.x,target.y-player.y)<oldDist;
          castCarmelaSuper(player,true);
          const quadSuper=player.carmelaSuperHandsLeft===4&&player.carmelaSuperIsHyper===true;
          player.carmelaFudgeForm='fudge';bullets.length=0;
          castFudgeSuper(player,true,target.x,target.y);
          const fudgeSuper=bullets.find(b=>b.ownerId===player.id&&b.isFudgeSuperBoulder&&b.isHyper);
          return {g2Reloaded,fudgeFired:!!fudgeShot,fudgeShell,handFired:!!hand,handPulled,quadSuper,fudgeSuper:!!fudgeSuper};
        },
        gadget(g){selectedGadget=g;gadgetArmed=false;gadgetCooldownUntil=0;player.gadgetCooldownUntil=0;player.gadgetCooldowns={};gadgetBtn.click();},
        mode(m){showdownMode=m;isRankedMatch=false;}};\n` + source.slice(end);
    }
    return route.fulfill({ status: 200, contentType: { '.js':'text/javascript','.html':'text/html','.css':'text/css' }[path.extname(file)] || 'application/octet-stream', body });
  } catch { return route.fulfill({ status: 404, body: '' }); }
});
try {
  await page.goto('http://brawe.test/');
  await page.waitForFunction(() => !!window.__combatAudit);
  if (process.env.BRAWE_AUDIT_BOOM) {
    await page.getByRole('button', { name: /Training$/ }).click();
    const result=await page.evaluate(()=>__combatAudit.boomCheck());
    console.log('BOOM CHECK',JSON.stringify(result));
    if(result.waiting || !result.ready || result.count!==2 || !result.pierce || !result.startUnchanged || !result.halfway || !result.completed || !(result.damage>0) || !(result.sideDamage>0) || !(result.liveDamage>0) || !result.splitsReturn || !result.noExtraAmmo || Math.abs(result.splitRange-342.72)>.01)throw new Error('Boom-Arang mechanics failed');
  } else if (process.env.BRAWE_AUDIT_CARMELA) {
    await page.getByRole('button', { name: /Training$/ }).click();
    const result=await page.evaluate(()=>__combatAudit.carmelaCheck());
    console.log('CARMELA CHECK',JSON.stringify(result));
    if(Object.values(result).some(value=>value!==true))throw new Error('Carmela & Fudge mechanics failed');
  } else if (process.env.BRAWE_AUDIT_TRAINING) {
    await page.getByRole('button', { name: /Training$/ }).click();
    for (const id of ['tcNextBrawlerBtn','tcPrevBrawlerBtn','tcSummonAllyBtn','tcWoundAllyBtn','tcDrainAllyBtn','tcHealAllyBtn','tcClearAllyBtn','tcResetGridBtn','tcToggleGridAiBtn','tcSpawnEnemyAiBtn','tcSpawnEnemyDummyBtn','tcClearEnemyBtn','tcRefillSuperBtn','tcRefillHyperBtn','tcPlayerHealBtn','tcAddCubesBtn','tcTeleportSpawnBtn','tcCurrentBrawlerBtn']) {
      scenario = id;
      await page.locator('#' + id).click();
      await page.waitForTimeout(150);
    }
  } else if (process.env.BRAWE_AUDIT_EXPORTS) {
    const failures = await page.evaluate(() => {
      const failures = [];
      for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(window.__pureHTMLGame || {}))) {
        if (!descriptor.get) continue;
        try { descriptor.get.call(window.__pureHTMLGame); }
        catch (error) { failures.push({scenario:name, message:error.message}); }
      }
      return failures;
    });
    errors.push(...failures);
  } else if (process.env.BRAWE_AUDIT_MODES) {
    for (const mode of ['solo','duo','trio','arena_forge','arena_forge_overclocked','tug_zone','construction','objective','knock_donate','brick_vault','mirror','damage_filler','knockout_3v3','brawe_ball']) {
      scenario = mode;
      await page.reload();
      await page.waitForFunction(() => !!window.__combatAudit);
      try { await page.evaluate(m => { __combatAudit.mode(m); __combatAudit.launchShowdownMatch(); }, mode); }
      catch (error) { errors.push({scenario, message:error.message}); console.log('ERROR', scenario, error.message); }
      await page.waitForTimeout(500);
      console.log('CHECKED MODE', mode);
    }
  } else {
    await page.getByRole('button', { name: /Training$/ }).click();
    const roster = await page.evaluate(() => __combatAudit.allBrawlers.filter(id => !__combatAudit.disabledBrawlers.has(id)));
    for (const id of roster) {
      scenario = id;
      try {
        await page.evaluate(id => {
          __combatAudit.switchTrainingBrawler(id);
          __combatAudit.fire(0, false);
          __combatAudit.charge();
          __combatAudit.fireSuper(true);
          __combatAudit.gadget('g1');
          __combatAudit.gadget('g2');
          __combatAudit.charge();
          __combatAudit.activateHypercharge();
          __combatAudit.fire(0, false);
          __combatAudit.charge();
          __combatAudit.fireSuper(true);
        }, id);
      } catch (error) { errors.push({scenario, message:error.message}); console.log('ERROR', scenario, error.message); }
      await page.waitForTimeout(120);
      console.log('CHECKED FIGHTER', id);
    }
    await page.waitForTimeout(3000);
  }
  console.log('AUDIT ERRORS', JSON.stringify(errors));
  if (errors.length) process.exitCode = 1;
} finally { await browser.close(); }
