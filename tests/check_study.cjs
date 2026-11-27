const assert=require('node:assert/strict'),fs=require('node:fs');
global.window={};require('../practice-data');require('../practice-math');require('../concept-data');
const C=require('../study-core'),Q=C.bank(window.PhysicsPractice,window.PhysicsConcepts),katex=require('../node_modules/katex');
const now=1800000000000,rng=()=>.37;
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),values};};
assert.equal(Q.length,660);assert.equal(new Set(Q.map(q=>q.id)).size,660);
const index=JSON.parse(fs.readFileSync('study-index.json','utf8'));
assert.equal(index.length,10);
let math=0;
for(let m=1;m<=10;m++)assert.equal(Q.filter(q=>q.module===m).length,66);
for(const q of Q){
 assert.equal(new Set(q.choices).size,4,q.id);assert.equal(q.reasons.length,4,q.id);
 assert.ok(Number.isInteger(q.answerIndex)&&q.answerIndex>=0&&q.answerIndex<4);
 assert.ok(index.find(m=>m.module===q.module).sections.some(s=>s.anchor===q.anchor),q.id+' anchor');
 for(const t of [q.prompt,q.explanation||'',...q.choices,...q.reasons])for(const m of t.matchAll(/\$([^$]+)\$/g)){katex.renderToString(m[1],{throwOnError:true,strict:'error'});math++;}
}
const disk=memory();disk.setItem(C.LEGACY,JSON.stringify({records:{m1q1:{correct:true,time:now-2*C.DAY},m2q2:{correct:false,time:now-C.DAY}},marks:['m1-main:3'],bookmarks:['m2-main:4'],session:{ids:['m1q2'],index:0,results:[],options:{}}}));
const s=new C.Store(disk,Q,now);
assert.equal(s.data.reviews.m1q1.correct,true);assert.equal(s.data.reviews.m2q2.correct,false);assert.deepEqual(s.legacy.bookmarks,['m2-main:4']);assert.equal(s.legacy.session.ids[0],'m1q2');
let ids=C.select(Q,s.data.reviews,{module:'all',mode:'smart',count:10},now,rng);assert.equal(ids[0],'m2q2');assert.equal(ids[1],'m1q1');
assert.deepEqual(C.select(Q,s.data.reviews,{mode:'mistakes',count:60},now,rng),['m2q2']);
assert.ok(!C.select(Q,s.data.reviews,{module:1,mode:'new',count:60},now,rng).includes('m1q1'));
assert.equal(C.select(Q,s.data.reviews,{count:1000},now,rng).length,60);assert.equal(new Set(ids).size,ids.length);
const broad=C.select(Q,{}, {module:1,count:9,mode:'smart'},now,rng).map(id=>Q.find(q=>q.id===id));
assert.equal(broad.filter(q=>q.kind==='concept').length,6);assert.equal(broad.filter(q=>q.kind==='numerical').length,3);
let review=C.schedule(null,false,'sure',now);assert.equal(review.dueAt,now+300000);assert.equal(review.streak,0);
review=C.schedule(null,true,'guessed',now);assert.equal(review.dueAt,now+C.DAY);assert.equal(review.streak,0);
for(const days of [1,3,7,14,30,30]){review=C.schedule(review,true,'sure',now);assert.equal(review.intervalDays,days);}
s.answer('m1c1',0,now);s.confidence('m1c1','sure');assert.equal(s.data.reviews.m1c1.attempts,1);assert.equal(s.data.reviews.m1c1.streak,1);s.confidence('m1c1','guessed');assert.equal(s.data.reviews.m1c1.attempts,1);assert.equal(s.data.reviews.m1c1.streak,0);
s.toggleSaved('m1c1');assert.deepEqual(C.select(Q,s.data.reviews,{mode:'saved',saved:s.data.saved,count:60},now,rng),['m1c1']);
s.toggleSection(1,'m1-s2','Pressure');assert.equal(s.data.savedSections.length,1);s.toggleSection(1,'m1-s2','Pressure');assert.equal(s.data.savedSections.length,0);
let session=s.start({module:1,count:3},now,rng);assert.equal(session.ids.length,3);assert.ok(session.ids.every(id=>id.startsWith('m1')));
const id=session.ids[0],correct=s.byId.get(id).answerIndex;s.choose(correct,false,now);assert.equal(s.data.reviews[id].correct,true);assert.equal(s.choose((correct+1)%4,false,now),false,'No double answer');
const reload=new C.Store(disk,Q,now);assert.equal(reload.data.practice.answers[id],correct,'Session persists');
let exam=s.start({exam:true,count:60,minutes:30},now,rng);assert.equal(exam.ids.length,60);for(let m=1;m<=10;m++)assert.equal(exam.ids.filter(id=>s.byId.get(id).module===m).length,6);
for(let m=1;m<=10;m++)assert.equal(exam.ids.filter(id=>s.byId.get(id).module===m&&s.byId.get(id).kind==='concept').length,3);
const first=exam.ids[0],previous=s.data.reviews[first]?.attempts||0;s.choose(s.byId.get(first).answerIndex,true,now+1000);assert.equal(s.data.reviews[first]?.attempts||0,previous,'Exam has no immediate feedback');
exam.flags.push(first);const result=s.finish(true,now+2000);assert.equal(result.correct,1);assert.equal(result.total,60);assert.equal(s.data.reviews[first].confidence,'guessed');
const attempts=s.data.reviews[first].attempts;s.finish(true,now+3000);assert.equal(s.data.reviews[first].attempts,attempts,'Grading is idempotent');
exam=s.start({exam:true,count:2,minutes:1},now,rng);assert.equal(s.choose(0,true,now+60001),false);assert.equal(s.data.exam.finished,true);assert.equal(s.data.exam.result.correct,0);
const backup=s.export(),target=new C.Store(memory(),Q,now);target.import(JSON.parse(JSON.stringify(backup)),now);assert.deepEqual(target.data.saved,s.data.saved);assert.equal(target.data.exam.finished,true);assert.deepEqual(target.legacy.bookmarks,s.legacy.bookmarks);
const before=JSON.stringify(target.export());assert.throws(()=>target.import({app:'bad',version:2,progress:{records:{}}}));assert.equal(JSON.stringify(target.export()),before);
target.import({app:'field-notes',version:1,progress:{records:{m3q1:{correct:true,time:now}},bookmarks:['m3-main:1']}},now);assert.equal(target.data.reviews.m3q1.correct,true);assert.deepEqual(target.legacy.bookmarks,['m3-main:1']);
const broken=new C.Store({getItem(){throw Error('disabled');},setItem(){throw Error('disabled');}},Q,now);assert.equal(broken.storageError,true);assert.equal(broken.save(),false);
let solutionCount=0,derivations=0,equations=0;
for(const m of index){const html=fs.readFileSync(m.file,'utf8');solutionCount+=(html.match(/class="solution example"/g)||[]).length;derivations+=(html.match(/class="solution derivation"/g)||[]).length;equations+=(html.match(/class="katex"/g)||[]).length;assert.ok(html.includes(`id="module-${m.module}"`));}
assert.equal(solutionCount,69);assert.equal(derivations,34);assert.equal(equations,1945);
console.log(`PASS: 660 questions, ${math} concept/prompt equations, source anchors, original lesson content, scheduling, smart selection, confidence, old progress, persistence, balanced exams, expiry, and backup restoration.`);
