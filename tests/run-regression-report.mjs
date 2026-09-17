import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const results=[];
const files=fs.readdirSync('tests').filter(x=>x.endsWith('-regression.mjs'));
for(const file of files){
 const run=spawnSync(process.execPath,['--import','data:text/javascript,import{inspect}from"node:util";inspect.defaultOptions.maxStringLength=160;inspect.defaultOptions.depth=2;','tests/'+file],{encoding:'utf8',timeout:45000,maxBuffer:300000});
 const output=(run.stdout||'')+'\n'+(run.stderr||'');
 results.push({file,passed:run.status===0,error:run.error?.message,output:output.slice(0,7000)});
 console.log(`${run.status===0?'PASS':'FAIL'} ${file}`);
}
fs.writeFileSync('.backups/regression-report.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length}));
