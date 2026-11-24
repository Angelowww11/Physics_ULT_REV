(async()=>{
 const wait=()=>new Promise(r=>setTimeout(r,30));
 const key='field-notes-progress-v1',fail=m=>{throw Error(m);};
 const fmt=n=>Math.abs(n)>0&&(Math.abs(n)<.001||Math.abs(n)>=1e6)?n.toExponential(5):Number(n.toPrecision(6)).toString();
 for(let m=1;m<=10;m++){
  location.hash='practice';await wait();
  for(const [id,val] of [['quiz-module',String(m)],['quiz-count','60']]){const el=document.getElementById(id);el.value=val;el.dispatchEvent(new Event('change',{bubbles:true}));}
  document.querySelector('[data-start]').click();await wait();
  let s=JSON.parse(localStorage.getItem(key)).session;
  if(s.ids.length!==60||new Set(s.ids).size!==60)fail('Session length or duplicates');
  for(let j=0;j<60;j++){
   s=JSON.parse(localStorage.getItem(key)).session;
   const q=PhysicsPractice.find(q=>q.id===s.ids[j]),correct=fmt(q.answer)+' '+q.unit;
   if(q.module!==m)fail('Wrong module');
   const buttons=[...document.querySelectorAll('[data-answer]')];
   if(buttons.length!==4)fail('Expected four choices');
   const b=buttons.find(b=>(b.dataset.choiceValue===correct)===(j!==0));
   if(!b)fail('Missing answer');b.click();
   if(!document.querySelector('.answer-explanation')||document.querySelectorAll('[data-answer]:disabled').length!==4)fail('Missing answer feedback');
   document.querySelector('[data-next]').click();
  }
  await wait();
  if(!document.querySelector('main').textContent.includes('59 correct out of 60'))fail('Score mismatch M'+m);
 }
 const state=JSON.parse(localStorage.getItem(key));
 if(Object.keys(state.records).length!==600||Object.values(state.records).filter(r=>r.correct).length!==590)fail('Progress mismatch');
 return {passed:true,answered:600,correct:590,modules:10,sessionMaximum:60};
})()
