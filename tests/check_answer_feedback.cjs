const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),katex=require('katex');
global.window={};
for(const f of ['practice-data','practice-math','practice-solutions','concept-data','challenge-data'])require('../'+f+'.js');
const originalSteps=new Map(window.PhysicsPractice.map(q=>[q.id,JSON.parse(JSON.stringify(q.steps))]));
require('../practice-feedback.js');
const C=require('../study-core.js'),{render,correctReason}=require('../answer-feedback.js');
const Q=C.bank(window.PhysicsPractice,window.PhysicsConcepts,window.PhysicsChallenges);
const base=JSON.parse(fs.readFileSync('audit/feedback-preserved.json','utf8'));
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=value=>{if(value===0)return '0';if(Math.abs(value)<.001||Math.abs(value)>=1e6){const [a,b]=value.toExponential(6).split('e');return `${Number(a)}\\times10^{${Number(b)}}`;}return String(Number(value.toPrecision(7)));};
let states=0,formulas=0,checkedCandidates=0;
const formula=tex=>{katex.renderToString(tex,{throwOnError:true,strict:'error'});formulas++;};
for(const q of Q){
 const {reasons,steps,explanation,...core}=q;
 assert.equal(hash(JSON.stringify(core)),base.questions[q.id],`Question or answer changed: ${q.id}`);
 assert.equal(reasons.length,4);assert(reasons.every(s=>s.trim().length>=15),q.id);
 for(const text of [correctReason(q),...reasons,...q.choices,...(steps||[]).map(s=>s.text||'')])for(const match of String(text).matchAll(/\$([^$]+)\$/g))formula(match[1]);
 for(const step of steps||[])if(step.tex)formula(step.tex);
 for(const chosen of [0,1,2,3,undefined,-1]){
  const html=render(q,chosen),wrong=Number.isInteger(chosen)&&chosen>=0&&chosen<4&&chosen!==q.answerIndex;
  assert.equal(html.includes('Why your answer is wrong'),wrong,q.id);
  assert.equal((html.match(/data-feedback-option=/g)||[]).length,3,q.id);
  for(let option=0;option<4;option++)if(option!==q.answerIndex)assert(html.includes(escape(reasons[option])),`${q.id} reason ${option}`);
  assert(html.includes(escape(correctReason(q))),q.id);
  assert.equal((html.match(/<li><h4>/g)||[]).length,steps?.length||0,q.id);
  if(wrong)assert(html.includes(`class="physics-answer-mistake" data-feedback-option="${chosen}"`));
  assert(!/<details/.test(html),'Do not hide teaching behind an extra control');
  const permutation=[2,0,3,1],shuffled={...q,choices:permutation.map(i=>q.choices[i]),reasons:permutation.map(i=>reasons[i]),answerIndex:permutation.indexOf(q.answerIndex)};
  const mapped=permutation.indexOf(chosen),shuffledHtml=render(shuffled,mapped<0?undefined:mapped);
  assert.equal(shuffledHtml.includes('Why your answer is wrong'),wrong,q.id);
  for(let option=0;option<4;option++)if(option!==q.answerIndex)assert(shuffledHtml.includes(escape(reasons[option])),q.id);
  states+=2;
 }
 if(originalSteps.has(q.id)){
  assert(q.steps.length>=7,q.id);
  let at=0;for(const step of q.steps)if(JSON.stringify(step)===JSON.stringify(originalSteps.get(q.id)[at]))at++;
  assert.equal(at,originalSteps.get(q.id).length,`Original working omitted: ${q.id}`);
  assert(!reasons.some(s=>/Check the (substitution|factors) and units/.test(s)),q.id);
  assert(new Set(reasons).size===4,q.id);
  const i=Math.floor((Number(q.id.split('q')[1])-1)/3)+1,f=(Number(q.id.split('q')[1])-1)%3;
  const target={1:[i+2,i/2,(i+2)/1000],2:[3*i,20,5],3:[i*1e10,i, i],4:[i,200,100],5:[i,50,60],6:[12,i,1/i+1/(2*i)],7:[12,2e-8,i],8:[.3,.1,i],9:[.2,.4,i/100],10:[3e8,1.5,1.2+.02*i]}[q.module][f];
  for(let option=0;option<4;option++){
   const v=parseFloat(q.choices[option]),rad=d=>d*Math.PI/180;
   if(q.module===10&&f===2&&v>=90){assert(option!==q.answerIndex);assert(reasons[option].includes('at least 90'));checkedCandidates++;continue;}
   const inverse={1:[v*((i+2)/1000),v/9810,v/9810],2:[(v-32)*5/9,v/(12e-6*(i+1)),v/(i/10*4186)],3:[v/1.602e-19,v*.01/(8.99e9*1e-8)*1e9,4*v],4:[v*.25/8.99e9*1e9,v/(i*1e-6),.002*v/(i*1e-6)],5:[v*.25/8.99e9*1e9,v/(i*1e-6),v/(i*1e-6)],6:[v/(i*1e-6),2*v/100*1e6,1/v],7:[v*(i+2),v*1e-6/i,v/1000*1e6],8:[v/(i*.2),v/(i*1e-6*1000),v/2e-6],9:[v/(i/100),v*.2/(i*10*.02),v*2],10:[(i+3)*1e14*v*1e-9,Math.sin(rad(2*i))/Math.sin(rad(v)),1/Math.sin(rad(v))]}[q.module][f];
   if(option===q.answerIndex)assert(Math.abs(inverse-target)<=Math.abs(target)*.00001,q.id);
   else{assert(Math.abs(inverse-target)>Math.abs(target)*.0001,q.id);assert(reasons[option].includes(n(inverse)),`${q.id}: missing back-substitution result ${n(inverse)}`);}
   checkedCandidates++;
  }
 }
}
assert.equal(Q.length,1260);assert.equal(Object.keys(base.questions).length,Q.length);assert.equal(checkedCandidates,2400);
// Reading-only exports change in this task; check their original content and every solution step separately.
require('./check_reading_notes.cjs');
const regenerated=file=>/^(?:reviewer\.html|note-stats\.json|study-index\.json|lessons\/\d+\.html|notes\/\d+-situations\.txt)$/.test(file);
const preservedFiles=Object.entries(base.files).filter(([file])=>!regenerated(file));
for(const [file,digest] of preservedFiles)assert.equal(hash(/\.(js|html|json|txt)$/.test(file)?fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'):fs.readFileSync(file)),digest,`Teaching file changed: ${file}`);
const attack='<img src=x onerror=alert(1)>',mock={choices:[attack,'a','b','c'],answerIndex:0,reasons:[attack,attack,attack,attack],explanation:attack,steps:[{title:attack,text:attack}]};
assert(!render(mock,1).includes(attack));
for(const file of ['index.html','classic.html']){
 const html=fs.readFileSync(file,'utf8'),scripts=[...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g)].map(m=>({tag:m[0],file:m[1].split('?')[0]}));
 for(const name of ['practice-solutions.js','practice-feedback.js','answer-feedback.js'])assert(scripts.find(s=>s.file===name)?.tag.includes(' defer'),file+': '+name);
 assert(scripts.findIndex(s=>s.file==='practice-solutions.js')<scripts.findIndex(s=>s.file==='practice-feedback.js'));
 assert(scripts.findIndex(s=>s.file==='answer-feedback.js')<scripts.findIndex(s=>s.file===(file==='index.html'?'desk.js':'app.js')));
 assert(html.includes('answer-feedback.css?v=20261128-feedback'));
}
console.log(`PASS: ${Q.length} complete answer views, ${states} shuffled feedback states, ${formulas} rendered equations, ${checkedCandidates} back-substitution checks, all original solution steps, and ${preservedFiles.length} unchanged teaching files plus checked reading exports.`);
