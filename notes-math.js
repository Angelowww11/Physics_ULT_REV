// Equations already exist in the HTML. This script only adds reading navigation.
document.addEventListener('DOMContentLoaded',()=>{
 const chapters=[...document.querySelectorAll('main > .chapter')];
 const links=[...document.querySelectorAll('[data-chapter-link]')];
 const jump=document.querySelector('#module-jump');
 const bar=document.querySelector('#reading-progress-fill');
 let queued=false;
 function equationFocus(){
  const measured=[...document.querySelectorAll('.inline-math,.math>.katex-display')].map(el=>[el,el.scrollWidth>el.clientWidth+1]);
  measured.forEach(([el,overflow])=>{if(overflow){if(el.tabIndex!==0)el.tabIndex=0;}else if(el.hasAttribute('tabindex'))el.removeAttribute('tabindex');});
 }
 function update(){
  queued=false;
  const current=chapters.findLast(c=>c.getBoundingClientRect().top<innerHeight*.35);
  links.forEach(a=>{const on=a.dataset.chapterLink===current?.id;a.classList.toggle('is-current',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  if(jump&&document.activeElement!==jump)jump.value=current?.id||'contents';
  if(bar)bar.style.width=`${Math.min(100,Math.max(0,scrollY/(document.documentElement.scrollHeight-innerHeight)*100))}%`;
 }
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
 addEventListener('resize',()=>{update();equationFocus();});
 jump?.addEventListener('change',()=>{if(jump.value)location.hash=jump.value;});
 new MutationObserver(()=>{equationFocus();update();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-large-text']});
 document.fonts.ready.then(()=>{const target=document.getElementById(location.hash.slice(1));if(target)target.scrollIntoView({behavior:'instant'});update();equationFocus();});
 update();
});
