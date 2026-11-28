(async()=>{
 const wait=()=>new Promise(r=>setTimeout(r,80)),check=(x,label)=>{if(!x)throw Error(label);};
 const rows=[];
 for(let module=1;module<=10;module++){
  location.hash='study/'+module;await wait();
  const until=Date.now()+10000;
  while(!document.querySelector(`#reading-host #module-${module}`)&&Date.now()<until)await wait();
  const chapter=document.querySelector(`#reading-host #module-${module}`);check(chapter,'Module '+module+' loads');
  check(chapter.querySelectorAll('.worked-application').length===60,'Sixty reading examples in '+module);
  check(!document.querySelector('#practice-panel,[data-desk-answer],.desk-choices'),'No embedded quiz in '+module);
  check(!/Why the other answers do not work|Which statement|Situational problems:/.test(chapter.innerText),'No quiz presentation in '+module);
  check(chapter.querySelectorAll('.solution.example').length>0,'Source examples retained in '+module);
  check(chapter.querySelectorAll('.source-figure').length>0,'Figures retained in '+module);
  await document.fonts.ready;await wait();
  const target=chapter.querySelector('.worked-application h3');target.scrollIntoView({behavior:'instant'});await wait();
  check(target.getBoundingClientRect().top>=document.querySelector('.desk-module-controls').getBoundingClientRect().bottom,'Application anchor visible in '+module);
  check(document.documentElement.scrollWidth<=innerWidth,'No page overflow in '+module);
  rows.push({module,applications:60,equations:chapter.querySelectorAll('.katex').length});
 }
 return {passed:true,width:innerWidth,modules:rows};
})()
