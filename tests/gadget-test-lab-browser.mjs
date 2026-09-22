import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',async route=>{
 const u=new URL(route.request().url());if(u.hostname!=='brawe.test')return route.abort();
 const f=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));
 if(!f.startsWith(root+path.sep))return route.abort();
 try{let body=await fs.readFile(f);
 if(f.endsWith('game.js')){const s=body.toString(),i=s.lastIndexOf('})();');body=s.slice(0,i)+`window.__gadgetLab={report:getTrainingGadgetReport,check(){const now=performance.now();gadgetCooldownUntil=now+30000;gadgetCooldownBySlot.g1=now+30000;selectedGadget='g1';const bypass=getPlayerGadgetCooldownUntil('g1',now)===0;const saved=isTraining;isTraining=false;gadgetCooldownUntil=now+30000;gadgetCooldownBySlot.g1=now+30000;const normal=getPlayerGadgetCooldownUntil('g1',now)>now;isTraining=saved;return {bypass,normal};},speed(){startTrainingSpeedTest();trainingSpeedTest.distance=600;trainingSpeedTest.startAt=performance.now()-2000;stopTrainingSpeedTest(true);return {baseline:trainingSpeedTest.baseline,last:trainingSpeedTest.lastResult,active:trainingSpeedTest.active};}};`+s.slice(i);}
 await route.fulfill({status:200,body,contentType:{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[path.extname(f)]||'application/octet-stream'});
 }catch{await route.fulfill({status:404,body:''});}
});
try{
 await page.goto('http://brawe.test');await page.waitForFunction(()=>!!window.__gadgetLab);
 await page.getByRole('button',{name:/Training$/}).click();
 await page.locator('#training-gadget-lab').waitFor();
 await page.locator('#tgFighter').selectOption('looma');
 assert.match(await page.locator('#tgExpected').innerText(),/Snip Snap/);
 await page.locator('#tgFighter').selectOption('outlit');
 await page.locator('[data-test-gadget="g2"]').click();
 assert.match(await page.locator('#tgExpected').innerText(),/Healing Pod/);
 await page.locator('#tgNotes').fill('Pod spawned: manual test note');
 await page.locator('[data-verdict="PASS"]').click();
 assert.match(await page.locator('#tgStatus').innerText(),/PASS/);
 const checks=await page.evaluate(()=>__gadgetLab.check());assert.deepEqual(checks,{bypass:true,normal:true});
 assert.equal(await page.locator('#tgSpeedStart').count(),1);assert.equal(await page.locator('#tgSpeedBaseline').count(),1);
 const speed=await page.evaluate(()=>__gadgetLab.speed());assert.equal(speed.active,false);assert.ok(speed.baseline>295&&speed.baseline<305);assert.equal(speed.baseline,speed.last);
 const report=await page.evaluate(()=>__gadgetLab.report());assert.match(report,/Pod spawned: manual test note/);assert.match(report,/UNTESTED/);
 await page.evaluate(()=>localStorage.removeItem('brawe_gadget_test_results_v1'));
 await fs.writeFile('GADGET-CHECKLIST.md',await page.evaluate(()=>__gadgetLab.report()));
 assert.deepEqual(errors,[]);console.log('Gadget lab: switching, descriptions, speed baseline, verdict storage, export and Training-only cooldown bypass PASS');
}finally{await browser.close();}
