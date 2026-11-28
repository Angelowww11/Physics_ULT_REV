(async()=>{
 const wait=()=>new Promise(resolve=>setTimeout(resolve,100));
 const check=(value,message)=>{if(!value)throw Error(message);};
 const state=()=>JSON.parse(localStorage.getItem('field-notes-learning-v2'));
 const bank=StudyCore.bank(PhysicsPractice,PhysicsConcepts,PhysicsChallenges),byId=new Map(bank.map(q=>[q.id,q]));
 const modules=[];
 for(let module=1;module<=10;module++){
  location.hash='practice/'+module;await wait();
  document.querySelector('#practice-mode').value='ordered';
  document.querySelector('#practice-mode').dispatchEvent(new Event('change',{bubbles:true}));
  document.querySelector('#practice-count').value='3';
  document.querySelector('[data-start-practice]').click();await wait();
  const ids=[...state().practice.ids];check(ids.length===3,'Three numerical families');
  for(let index=0;index<3;index++){
   const q=byId.get(ids[index]);check(q.id===`m${module}q${index+1}`,'Original question identity');
   check(!document.querySelector('.physics-answer-explanation'),'No early feedback');
   const choice=index===2?q.answerIndex:(q.answerIndex+index+1)%4;
   document.querySelector(`[data-desk-answer="${choice}"]`).click();
   const feedback=document.querySelector('.physics-answer-explanation');
   check(feedback.querySelectorAll('[data-feedback-option]').length===3,'All wrong choices explained '+q.id);
   check(!!feedback.querySelector('.physics-answer-mistake')===(choice!==q.answerIndex),'Selected mistake '+q.id);
   check(feedback.querySelectorAll('.desk-solution-steps>li').length===q.steps.length,'All solution steps '+q.id);
   check(!document.querySelector('.katex-error'),'Rendered mathematics '+q.id);
   check(!/Check the (factors|substitution) and units/.test(feedback.innerText),'Specific reasoning '+q.id);
   check(document.documentElement.scrollWidth<=innerWidth,'No page overflow '+q.id);
   document.querySelector('[data-next-practice]').click();await wait();
  }
  check(document.querySelectorAll('.desk-result-item').length===3,'Complete result');
  check(state().practice.result.correct===1,'One correct answer');
  const item=document.querySelector('.desk-result-item');item.open=true;
  check(item.querySelectorAll('.desk-solution-steps>li').length===byId.get(ids[0]).steps.length,'Full result solution');
  modules.push({module,numericalFamilies:3,correct:state().practice.result.correct});
 }
 return {passed:true,modules,questions:30,answerViews:60};
})()
