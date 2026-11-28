const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
global.window={};require('../practice-data.js');require('../practice-math.js');require('../sources.js');
const Q=window.PhysicsPractice,S=window.PHYSICS_SOURCES;
assert.equal(Q.length,600);assert.equal(new Set(Q.map(q=>q.id)).size,600);
const near=(a,b)=>assert.ok(Math.abs(a-b)<=Math.max(1e-22,Math.abs(b)*1e-12),`${a} != ${b}`);
const fmt=n=>Math.abs(n)>0&&(Math.abs(n)<.001||Math.abs(n)>=1e6)?n.toExponential(5):Number(n.toPrecision(6)).toString();
for(let m=1;m<=10;m++){
 const rows=Q.filter(q=>q.module===m);assert.equal(rows.length,60);
 for(let j=0;j<60;j++){
  const q=rows[j],i=Math.floor(j/3)+1,f=j%3;
  const expected={
   1:[(i+2)/(i*.001+.002),9810*(i/2),9810*(i*.001+.002)],
   2:[3*i*1.8+32,12e-6*(i+1)*20,i/10*4186*5],
   3:[i*1e10*1.602e-19,8.99e9*(i*1e-9)*(10e-9)/(.1*.1),i*.25],
   4:[8.99e9*i*1e-9/.25,i*1e-6*200,i*1e-6*100/.002],
   5:[8.99e9*i*1e-9/.25,i*1e-6*50,i*1e-6*(100-40)],
   6:[i*1e-6*12,i*1e-6*10**2/2,1/(1/i+1/(2*i))],
   7:[12/(i+2),2e-8*i/1e-6,1000*i*1e-6],
   8:[i*.2*.3,i*1e-6*1000*.1,2e-7*i/.1],
   9:[.2*i*.01,10*i*.02*.4/.2,i*.01/2],
   10:[3e8/((i+3)*1e14)*1e9,Math.asin(Math.sin(2*i*Math.PI/180)/1.5)*180/Math.PI,Math.asin(1/(1.2+i*.02))*180/Math.PI]
  }[m][f];
  near(q.answer,expected);assert.ok(Number.isFinite(q.answer)&&q.answer>0);
  assert.equal(new Set([q.answer,q.answer*1.25,q.answer*.5,q.answer*2].map(fmt)).size,4);
  const source=S.find(s=>s.module===m&&s.variant==='main');assert.ok(q.page>0&&q.page<=source.pages.length);
 }
}
const katex=require('../node_modules/katex');let blocks=0,inline=0;
for(const q of Q){
 for(const tex of [q.lawTex,q.workingTex]){
  assert.ok(tex,q.id+' missing formatted math');
  katex.renderToString(tex,{displayMode:true,throwOnError:true,strict:'error'});
 }
}
for(const file of fs.readdirSync(path.join(__dirname,'../notes')).filter(f=>/^\d{2}(-(worked|situations))?\.txt$/.test(f))){
 const note=fs.readFileSync(path.join(__dirname,'../notes',file),'utf8');
 for(const match of note.matchAll(/(\$\$[\s\S]*?\$\$|\$[^\n$]+\$)/g)){
  const display=match[1].startsWith('$$'),tex=display?match[1].slice(2,-2):match[1].slice(1,-1);
  katex.renderToString(tex,{displayMode:display,throwOnError:true,strict:'error'});
  if(display)blocks++;else inline++;
 }
}
const stats=JSON.parse(fs.readFileSync(path.join(__dirname,'../note-stats.json'),'utf8'));
assert.equal(blocks,stats.derivation_blocks);
assert.equal(inline,stats.inline_equations);
console.log(`PASS: 600 numerical answers, 600 IDs, distinct choices, source page ranges, 1200 practice equations, ${blocks} display and ${inline} inline equations.`);
