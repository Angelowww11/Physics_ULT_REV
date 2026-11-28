(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StudyCore=api;})(typeof window!=='undefined'?window:globalThis,()=>{
 'use strict';
 const DAY=86400000,LEGACY='field-notes-progress-v1',KEY='field-notes-learning-v2';
 const fmt=n=>Math.abs(n)>0&&(Math.abs(n)<.001||Math.abs(n)>=1e6)?n.toExponential(5):Number(n.toPrecision(6)).toString();
 const count=n=>Math.max(1,Math.min(60,Math.floor(Number(n)||10)));
 function bank(numeric,concepts,challenges=[]){
  const anchors={1:[1,2,5],2:[1,2,4],3:[1,2,2],4:[1,1,4],5:[2,3,1],6:[1,3,4],7:[1,1,6],8:[1,1,4],9:[1,2,7],10:[1,4,6]};
  const topics={1:['Density','Hydrostatic pressure','Buoyancy'],2:['Temperature scales','Thermal expansion','Heat transfer'],3:['Charge quantization','Coulomb force','Coulomb scaling'],4:['Point-charge field','Electric force','Field acceleration'],5:['Point-charge potential','Potential energy','Electrostatic work'],6:['Capacitor charge','Stored energy','Capacitor networks'],7:['Ohm law','Wire resistance','RC time constant'],8:['Wire force','Particle force','Straight-wire field'],9:['Magnetic flux','Induced emf','RL time constant'],10:['Wavelength','Refraction','Critical angle']};
  return [...numeric.map(q=>{const family=(Number(q.id.split('q')[1])-1)%3;return {...q,kind:'numerical',topic:topics[q.module][family],anchor:`m${q.module}-s${anchors[q.module][family]}`,choices:[1,1.25,.5,2].map(f=>fmt(q.answer*f)+' '+q.unit),answerIndex:0,reasons:['This matches the law and the stated values.','This is 1.25 times the calculated value. Check the substitution and units.','This is half the calculated value. Check the factors and units.','This is twice the calculated value. Check the factors and units.']};}),...concepts,...challenges];
 }
 function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function diverse(list){
  const groups=new Map();for(const q of list){const key=q.family||(q.kind==='numerical'?`m${q.module}f${(Number(q.id.split('q')[1])-1)%3}`:q.id);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(q);}
  const out=[];while([...groups.values()].some(a=>a.length))for(const a of groups.values())if(a.length)out.push(a.shift());return out;
 }
 function schedule(previous,correct,confidence,now=Date.now()){
  const sure=confidence==='sure',prior=previous?.streak||0,streak=correct&&sure?prior+1:0;
  const days=correct?(sure?[1,3,7,14,30][Math.min(streak-1,4)]:1):0;
  return {correct:!!correct,confidence:sure?'sure':confidence==='guessed'?'guessed':'unrated',streak,priorStreak:prior,answeredAt:now,dueAt:now+(correct?days*DAY:5*60000),intervalDays:days,attempts:(previous?.attempts||0)+1};
 }
 function select(bank,reviews,{module='all',mode='smart',count:n=10,saved=[],balanced=false}={},now=Date.now(),rng=Math.random){
  const ids=new Set(saved),scope=bank.filter(q=>module==='all'||q.module===Number(module));
  let pool=scope.filter(q=>mode==='challenge'?q.level==='challenge':mode==='new'?!reviews[q.id]:mode==='mistakes'?reviews[q.id]?.correct===false:mode==='saved'?ids.has(q.id):mode==='due'?reviews[q.id]?.dueAt<=now:mode==='uncertain'?reviews[q.id]?.correct===true&&reviews[q.id]?.confidence!=='sure':true);
  if(mode==='ordered')return pool.slice(0,count(n)).map(q=>q.id);
  pool=shuffle(pool,rng);
  if(mode==='smart'){
   const rank=q=>{const r=reviews[q.id];return r?.correct===false?0:r&&r.dueAt<=now?1:r&&r.confidence!=='sure'?2:!r?3:4;};
   pool.sort((a,b)=>rank(a)-rank(b)||(rank(a)<2?(reviews[a.id]?.dueAt||0)-(reviews[b.id]?.dueAt||0):0));
   pool=[0,1,2,3,4].flatMap(n=>diverse(pool.filter(q=>rank(q)===n)));
  }
  if(balanced&&module==='all'){
   const groups=shuffle(Array.from({length:10},(_,i)=>{const all=pool.filter(q=>q.module===i+1),concepts=all.filter(q=>q.kind==='concept'),numeric=diverse(all.filter(q=>q.kind==='numerical')),mixed=[];let conceptTurn=i%2===0;while(concepts.length||numeric.length){const preferred=conceptTurn?concepts:numeric,other=conceptTurn?numeric:concepts;mixed.push((preferred.length?preferred:other).shift());conceptTurn=!conceptTurn;}return mixed;}),rng),mixed=[];
   while(groups.some(g=>g.length))for(const g of groups)if(g.length)mixed.push(g.shift());
   pool=mixed;
  }
  return pool.slice(0,count(n)).map(q=>q.id);
 }
 function validSession(value,known,exam=false){
  if(!value||!Array.isArray(value.ids)||!value.ids.length||value.ids.length>60||new Set(value.ids).size!==value.ids.length||!value.ids.every(id=>known.has(id)))return null;
  if(exam&&(!Number.isFinite(value.deadline)||!Number.isFinite(value.startedAt)||value.deadline<value.startedAt))return null;
  const answers={};for(const id of value.ids){const v=value.answers?.[id];if(Number.isInteger(v)&&v>=0&&v<4)answers[id]=v;}
  const options={};for(const id of value.ids){const order=value.options?.[id];options[id]=Array.isArray(order)&&order.length===4&&new Set(order).size===4&&order.every(n=>Number.isInteger(n)&&n>=0&&n<4)?order:[0,1,2,3];}
  return {...value,index:Math.max(0,Math.min(value.ids.length-1,Math.floor(Number(value.index)||0))),answers,options,flags:Array.isArray(value.flags)?value.flags.filter(id=>value.ids.includes(id)):[],feedback:value.feedback&&typeof value.feedback==='object'?value.feedback:{}};
 }
 class Store{
  constructor(storage,bank,now=Date.now()){
   this.storage=storage;this.bank=bank;this.byId=new Map(bank.map(q=>[q.id,q]));this.known=new Set(this.byId.keys());this.storageError=false;
   this.legacy={records:{},marks:[],bookmarks:[],session:null,module:'1',count:10};
   this.data={reviews:{},lessons:{},saved:[],savedSections:[],activeModule:1,practice:null,exam:null,history:[]};
   try{const v=JSON.parse(storage.getItem(LEGACY)||'null');if(v&&typeof v==='object')this.legacy={...this.legacy,...v};}catch{this.storageError=true;}
   try{const v=JSON.parse(storage.getItem(KEY)||'null');if(v&&typeof v==='object')this.data={...this.data,...v};}catch{this.storageError=true;}
   this.clean(now);
  }
  clean(now){
   const records={};for(const [id,r]of Object.entries(this.legacy.records||{}))if(this.known.has(id)&&r&&typeof r.correct==='boolean')records[id]={...r,time:Number.isFinite(r.time)?r.time:now};
   this.legacy.records=records;
   for(const k of ['marks','bookmarks'])this.legacy[k]=Array.isArray(this.legacy[k])?this.legacy[k].filter(s=>typeof s==='string'):[];
   const reviews={};for(const [id,r]of Object.entries(this.data.reviews||{}))if(this.known.has(id)&&r&&typeof r.correct==='boolean'&&Number.isFinite(r.dueAt))reviews[id]={...r,streak:Math.max(0,Math.floor(Number(r.streak)||0)),attempts:Math.max(1,Math.floor(Number(r.attempts)||1))};
   for(const [id,r]of Object.entries(records))if(!reviews[id])reviews[id]={correct:r.correct,confidence:'unrated',streak:0,priorStreak:0,answeredAt:r.time,dueAt:r.correct?r.time+DAY:r.time,intervalDays:r.correct?1:0,attempts:1};
   this.data.reviews=reviews;
   this.data.saved=Array.isArray(this.data.saved)?[...new Set(this.data.saved.filter(id=>this.known.has(id)))]:[];
   this.data.savedSections=Array.isArray(this.data.savedSections)?this.data.savedSections.filter(s=>s&&Number.isInteger(s.module)&&s.module>=1&&s.module<=10&&new RegExp('^m'+s.module+'-s[0-9]+$').test(s.anchor)&&typeof s.title==='string').slice(0,300):[];
   const lessons={};for(const [m,l]of Object.entries(this.data.lessons||{}))if(Number.isInteger(Number(m))&&Number(m)>=1&&Number(m)<=10&&l&&typeof l==='object')lessons[m]={read:!!l.read,anchor:typeof l.anchor==='string'?l.anchor:'',updatedAt:Number(l.updatedAt)||now};this.data.lessons=lessons;
   this.data.activeModule=Math.max(1,Math.min(10,Math.floor(Number(this.data.activeModule)||1)));
   this.data.practice=validSession(this.data.practice,this.known);
   this.data.exam=validSession(this.data.exam,this.known,true);
   this.data.history=Array.isArray(this.data.history)?this.data.history.filter(x=>x&&Number.isFinite(x.time)&&['practice','exam'].includes(x.type)&&Number.isFinite(x.correct)&&Number.isFinite(x.total)).slice(-200):[];
  }
  save(){try{this.storage.setItem(KEY,JSON.stringify(this.data));this.storage.setItem(LEGACY,JSON.stringify(this.legacy));return true;}catch{this.storageError=true;return false;}}
  answer(id,choice,now=Date.now(),confidence=null){
   const q=this.byId.get(id);if(!q||!Number.isInteger(choice)||choice<0||choice>3)throw Error('Choose a valid answer.');
   const correct=choice===q.answerIndex;this.data.reviews[id]=schedule(this.data.reviews[id],correct,confidence,now);
   this.legacy.records[id]={correct,time:now};this.save();return correct;
  }
  confidence(id,value){
   const r=this.data.reviews[id];if(!r||!['sure','guessed'].includes(value))return;
   const next=schedule({streak:r.priorStreak||0,attempts:r.attempts-1},r.correct,value,r.answeredAt);this.data.reviews[id]=next;this.save();
  }
  toggleSaved(id){if(!this.known.has(id))return;const a=this.data.saved,i=a.indexOf(id);if(i<0)a.push(id);else a.splice(i,1);this.save();}
  toggleSection(module,anchor,title){const a=this.data.savedSections,i=a.findIndex(x=>x.module===module&&x.anchor===anchor);if(i<0)a.push({module,anchor,title});else a.splice(i,1);this.save();}
  start({module='all',mode='smart',count:n=10,exam=false,minutes=30,ids:requested}={},now=Date.now(),rng=Math.random){
   const ids=requested?[...new Set(requested.filter(id=>this.known.has(id)))].slice(0,60):select(this.bank,this.data.reviews,{module,mode:exam?'all':mode,count:n,saved:this.data.saved,balanced:exam},now,rng);if(!ids.length)return null;
   const s={ids,index:0,answers:{},feedback:{},flags:[],options:Object.fromEntries(ids.map(id=>[id,shuffle([0,1,2,3],rng)])),startedAt:now,module,mode,finished:false};
   if(exam)s.deadline=now+Math.max(1,Math.min(180,Number(minutes)||30))*60000;
   this.data[exam?'exam':'practice']=s;this.save();return s;
  }
  choose(choice,exam=false,now=Date.now()){
   const s=this.data[exam?'exam':'practice'];if(!s||s.finished)return false;
   if(exam&&now>=s.deadline){this.finish(true,now);return false;}
   const id=s.ids[s.index];if(!Number.isInteger(choice)||choice<0||choice>3)return false;
   if(!exam&&id in s.answers)return false;
   s.answers[id]=choice;
   if(!exam)s.feedback[id]={correct:this.answer(id,choice,now)};
   this.save();return true;
  }
  finish(exam=false,now=Date.now()){
   const s=this.data[exam?'exam':'practice'];if(!s)return null;if(s.finished)return s.result;
   if(exam)for(const id of s.ids){const choice=s.answers[id],correct=choice===this.byId.get(id).answerIndex;this.data.reviews[id]=schedule(this.data.reviews[id],correct,s.flags.includes(id)||choice===undefined?'guessed':null,now);this.legacy.records[id]={correct,time:now};}
   const correct=s.ids.filter(id=>s.answers[id]===this.byId.get(id).answerIndex).length;
   s.finished=true;s.result={correct,total:s.ids.length,time:now,type:exam?'exam':'practice',elapsed:now-s.startedAt};
   this.data.history.push(s.result);this.data.history=this.data.history.slice(-200);this.save();return s.result;
  }
  export(){return {app:'field-notes-study',version:2,progress:this.legacy,learning:this.data};}
  import(value,now=Date.now()){
   if(!value||![1,2].includes(value.version)||!['field-notes','field-notes-study'].includes(value.app)||!value.progress||typeof value.progress.records!=='object'||value.progress.records===null)throw Error('Choose a valid Field Notes backup.');
   if(value.version===2&&(!value.learning||typeof value.learning!=='object'))throw Error('The study backup is incomplete.');
   this.legacy={...this.legacy,...value.progress};this.data=value.version===2?{...this.data,...value.learning}:{...this.data,reviews:{},practice:null,exam:null};this.clean(now);this.save();
  }
 }
 return {DAY,LEGACY,KEY,fmt,count,bank,shuffle,schedule,select,Store};
});
