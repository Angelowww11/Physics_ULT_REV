/* Shared answer teaching for the study desk, completed exams, and earlier website. */
((root,factory)=>{const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PhysicsAnswerFeedback=api;})(typeof window!=='undefined'?window:globalThis,()=>{
 'use strict';
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const correctSummaries={
  m1h9:'Equal displaced volumes give a travel ratio inverse to the piston-area ratio. The diameter ratio is 5, so the area ratio is 25. Divide the input travel of 0.25 m by 25 to get 0.010 m.',
  m7h6:'The internal resistance reduces the load voltage. The total resistance is 6 ohms, so the current is 2 A. The 5-ohm load receives 20 W; the internal resistance dissipates another 4 W.',
  m7h8:'Charging follows an exponential, not a linear rise. At 6 V, one third of the initial voltage difference remains. The time is the 0.200 s time constant multiplied by ln 3.',
  m7h9:'The parallel pair has 4 V across it after the series resistor takes its voltage drop. Use that branch voltage and the 3-ohm resistance to calculate the requested power.',
  m8h9:'Use the signed charge after evaluating the velocity–field cross product. The positive x component of that cross product becomes a negative force component because the charge is negative.',
  m9h8:'The external force balances the magnetic drag at constant speed. Its mechanical power equals the circuit’s electrical heating under the stated loss-free model.',
  m9h10:'The turns ratio gives 120 V across the secondary load and 0.50 A through it. Ideal power conservation then gives 60 W at the primary and a primary current of 2.50 A.'
 };
 const correctReason=q=>correctSummaries[q.id]||q.explanation||q.reasons[q.answerIndex];
 function render(q,answer,{math=escape,textMath=escape,choice=(q,i)=>textMath(q.choices[i]),heading='h3'}={}){
  const h=heading==='h2'?'h2':'h3',stepHeading=h==='h2'?'h3':'h4';
  const answered=Number.isInteger(answer)&&answer>=0&&answer<q.choices.length;
  const wrong=answered&&answer!==q.answerIndex;
  const others=q.choices.map((_,i)=>i).filter(i=>i!==q.answerIndex&&(!wrong||i!==answer));
  const explanation=correctReason(q);
  return `<div class="physics-answer-explanation"><p class="physics-correct-answer"><strong>Correct answer:</strong> ${choice(q,q.answerIndex)}</p><${h}>Why this is correct</${h}><p data-correct-explanation>${textMath(explanation)}</p>${wrong?`<div class="physics-answer-mistake" data-feedback-option="${answer}"><${h}>Why your answer is wrong</${h}><p><strong>Your choice:</strong> ${choice(q,answer)}</p><p>${textMath(q.reasons[answer])}</p></div>`:!answered?'<p class="physics-answer-unanswered">You did not answer this question. Use the worked solution to compare the choices.</p>':''}${q.steps?.length?`<${h}>Step-by-step solution</${h}><ol class="desk-solution-steps">${q.steps.map(step=>`<li><${stepHeading}>${escape(step.title)}</${stepHeading}>${step.text?`<p>${textMath(step.text)}</p>`:''}${step.tex?math(step.tex,true):''}</li>`).join('')}</ol>`:q.kind==='numerical'?`<${h}>Apply the law</${h}>${math(q.lawTex,true)}${math(q.workingTex,true)}`:''}<${h}>${wrong?'Why the remaining choices are wrong':'Why the other choices are wrong'}</${h}><ul class="physics-answer-alternatives">${others.map(i=>`<li data-feedback-option="${i}"><p><strong>${choice(q,i)}</strong></p><p>${textMath(q.reasons[i])}</p></li>`).join('')}</ul></div>`;
 }
 return {render,correctReason};
});
