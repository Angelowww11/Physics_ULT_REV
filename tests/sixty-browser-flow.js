(async()=>{
 const wait=()=>new Promise(r=>setTimeout(r,100));
 const check=(ok,label)=>{if(!ok)throw Error(label);};
 const results=[];
 for(let module=1;module<=10;module++){
  location.hash='practice/'+module;await wait();
  const mode=document.querySelector('#practice-mode');mode.value='challenge';mode.dispatchEvent(new Event('change',{bubbles:true}));
  document.querySelector('#practice-count').value='60';document.querySelector('[data-start-practice]').click();await wait();
  const state=JSON.parse(localStorage.getItem('field-notes-learning-v2')).practice;
  check(state.ids.length===60&&new Set(state.ids).size===60,'Sixty unique challenges in module '+module);
  check(state.ids.every(id=>new RegExp('^m'+module+'h').test(id)),'Challenge-only module filter');
  document.querySelector('[data-desk-answer="1"]').click();
  check(document.querySelectorAll('.desk-solution-steps>li').length>=4,'Full solution');
  const why=document.querySelector('.physics-answer-explanation');
  check(why.querySelectorAll('[data-feedback-option]').length===3,'Explanation for every incorrect option');
  check(!!why.querySelector('.physics-answer-mistake'),'Specific explanation for the selected mistake');
  check(!document.querySelector('.katex-error'),'No equation errors');
  results.push({module,questions:state.ids.length,solutionSteps:document.querySelectorAll('.desk-solution-steps>li').length});
 }
 return {passed:true,modules:results};
})()
