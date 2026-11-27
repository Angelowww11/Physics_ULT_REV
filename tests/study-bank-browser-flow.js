(async()=>{
 const wait=()=>new Promise(r=>setTimeout(r,40)),bank=StudyCore.bank(PhysicsPractice,PhysicsConcepts),map=new Map(bank.map(q=>[q.id,q])),key='field-notes-learning-v2';
 const read=()=>JSON.parse(localStorage.getItem(key)),fail=message=>{throw Error(message);};
 const first=window.qaFirstModule||1,last=window.qaLastModule||10;
 window.qaAnsweredIds=window.qaAnsweredIds||[];
 for(let m=first;m<=last;m++){
  let sets=0;
  while(true){
   location.hash='practice/'+m;await wait();
   const mode=document.querySelector('#practice-mode');mode.value='new';mode.dispatchEvent(new Event('change',{bubbles:true}));
   if(document.querySelector('[data-start-practice]').disabled)break;
   const count=document.querySelector('#practice-count');count.value='60';count.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('[data-start-practice]').click();await wait();
   const s=read().practice;if(s.ids.length>60||new Set(s.ids).size!==s.ids.length)fail('Invalid set');
   for(let i=0;i<s.ids.length;i++){
    const q=map.get(s.ids[i]);if(q.module!==m)fail('Module mismatch');
    const button=document.querySelector(`[data-desk-answer="${q.answerIndex}"]`);if(!button)fail('Missing correct option '+q.id);button.click();
    if(document.querySelector('.katex-error'))fail('Math render error '+q.id);
    if(!read().reviews[q.id].correct)fail('Incorrect grading '+q.id);
    document.querySelector('[data-confidence="sure"]').click();window.qaAnsweredIds.push(q.id);document.querySelector('[data-next-practice]').click();
   }
   await wait();if(!document.querySelector('.desk-result-score'))fail('Missing result');
   sets++;if(sets>2)fail('New-only questions repeat');
  }
  if(window.qaAnsweredIds.filter(id=>map.get(id).module===m).length!==66)fail('Module coverage '+m);
 }
 const seen=window.qaAnsweredIds;
 if(new Set(seen).size!==seen.length)fail('A new-only question repeats');
 return {passed:true,modules:[first,last],answeredThisRun:seen.length,correct:Object.values(read().reviews).filter(r=>r.correct).length,confidenceSure:Object.values(read().reviews).filter(r=>r.confidence==='sure').length,completedSets:read().history.length,mathErrors:document.querySelectorAll('.katex-error').length};
})()
