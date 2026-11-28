const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),katex=require('katex');
global.window={};
for(const file of ['practice-data','practice-math','practice-solutions','concept-data','challenge-data'])require('../'+file+'.js');
const C=require('../study-core.js'),legacy=C.bank(window.PhysicsPractice,window.PhysicsConcepts),Q=C.bank(window.PhysicsPractice,window.PhysicsConcepts,window.PhysicsChallenges),added=window.PhysicsChallenges;
const entry=fs.readFileSync('index.html','utf8');
const scripts=[...entry.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)].map(m=>({tag:m[0],file:m[1].split('?')[0]}));
const dependencies=['practice-data.js','practice-math.js','practice-solutions.js','challenge-data.js','concept-data.js','study-core.js','desk.js'];
for(const [i,file]of dependencies.entries()){const at=scripts.findIndex(s=>s.file===file);assert.ok(at>=0&&scripts[at].tag.includes(' defer'),file+' must load in order');if(i)assert.ok(at>scripts.findIndex(s=>s.file===dependencies[i-1]));}
assert.equal(Q.length,1260);assert.equal(new Set(Q.map(q=>q.id)).size,1260);
assert.equal(added.length,600);assert.equal(added.filter(q=>q.kind==='numerical').length,450);
for(const [id,hash]of Object.entries(JSON.parse(fs.readFileSync('audit/challenges-preserved.json','utf8')))){const q=added.find(q=>q.id===id);assert.ok(q,id);assert.equal(crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex'),hash,id);}
assert.equal(new Set(added.map(q=>q.prompt)).size,600);
let formulas=0;
const render=tex=>{katex.renderToString(tex,{throwOnError:true,strict:'error'});formulas++;};
for(const q of [...window.PhysicsPractice,...added]){
 assert.ok(q.steps.length>=4,q.id);
 for(const step of q.steps){assert.ok(step.title);if(step.tex)render(step.tex);if(step.text)for(const m of step.text.matchAll(/\$([^$]+)\$/g))render(m[1]);}
}
const index=JSON.parse(fs.readFileSync('study-index.json','utf8'));
for(const q of added){
 assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.equal(q.reasons.length,4);
 assert.ok(q.reasons.every(Boolean));if(q.solutionAnchor)assert.ok(fs.readFileSync(index[q.module-1].file,'utf8').includes('id="'+q.solutionAnchor+'"')); assert.equal(q.level,'challenge');
 assert.ok(index[q.module-1].sections.some(s=>s.anchor===q.anchor));assert.ok(index[q.module-1].sections.some(s=>s.anchor===q.referenceAnchor));
 for(const text of [q.prompt,...q.choices,...q.reasons])for(const m of text.matchAll(/\$([^$]+)\$/g))render(m[1]);
}
for(let m=1;m<=10;m++){
 assert.equal(Q.filter(q=>q.module===m).length,126);
 const ids=C.select(Q,{}, {module:m,mode:'challenge',count:60});assert.equal(ids.length,60);assert.ok(ids.every(id=>added.some(q=>q.id===id)));
 const html=fs.readFileSync(index[m-1].file,'utf8');assert.equal((html.match(/Situation \d+:/g)||[]).length,60);
}
assert.equal(C.select(Q,{}, {mode:'challenge',count:999}).length,60);
// Previously stored IDs and choice indices retain their complete identity.
for(const old of legacy){const now=Q.find(q=>q.id===old.id);assert.deepEqual(now,old);}
const values={};const disk={getItem:key=>values[key]||null,setItem:(key,value)=>values[key]=value};
const oldStore=new C.Store(disk,legacy);oldStore.answer('m1q1',0);oldStore.toggleSaved('m2c2');oldStore.start({module:1,count:3});oldStore.legacy.bookmarks=['m1-main:1'];oldStore.save();
const store=new C.Store(disk,Q);assert.equal(store.data.reviews.m1q1.correct,true);assert.deepEqual(store.data.saved,['m2c2']);assert.equal(store.data.practice.ids.length,3);assert.deepEqual(store.legacy.bookmarks,['m1-main:1']);
store.start({module:8,mode:'challenge',count:60});assert.equal(store.data.practice.ids.length,60);store.choose(0);assert.ok(store.data.reviews[store.data.practice.ids[0]]);
const restored=new C.Store({getItem:()=>null,setItem:()=>{}},Q);restored.import(store.export());assert.deepEqual(restored.data.practice,store.data.practice);
const exam=store.start({exam:true,count:60});for(let m=1;m<=10;m++)assert.equal(exam.ids.filter(id=>Q.find(q=>q.id===id).module===m).length,6);
for(const [file,hash]of Object.entries(JSON.parse(fs.readFileSync('audit/notes-preserved.json','utf8'))))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,file);
console.log(`PASS: 1260 questions, 600 challenges, ${formulas} strict-rendered formulas, complete working, source anchors, 60-question limit, old progress, backups, balanced exams, and 20 unchanged original note files.`);
