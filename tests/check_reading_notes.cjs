const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {questions}=require('../tools/challenge-source.cjs');
const {readingPrompt}=require('../tools/reading-examples.cjs');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const original=JSON.parse(fs.readFileSync('audit/reading-preserved.json','utf8')).originalReading;
let steps=0,equations=0;
for(let module=1;module<=10;module++) {
 const file=`lessons/${String(module).padStart(2,'0')}.html`,html=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
 const prefix=html.split(/<h3 id="m\d+-s\d+">Worked applications:/)[0];
 assert(prefix.length<html.length,'Application section missing: '+file);
 assert.equal(hash(prefix),original[file],'Original derivations, examples, figures, or explanations changed: '+file);
 assert.equal((html.match(/class="worked-application"/g)||[]).length,60);
 assert(!/desk-choices|data-desk-answer|Why the other answers do not work|Situational problems:|Which statement|<strong>Answer:<\/strong>/.test(html),file);
 const notes=fs.readFileSync(`notes/${String(module).padStart(2,'0')}-situations.txt`,'utf8');
 assert(!notes.includes('?'),'Question wording remains in '+module);
 const examples=notes.split('<section class="worked-application">').slice(1);
 const qs=questions.filter(q=>q.module===module);
 assert.equal(examples.length,60);
 for(let i=0;i<qs.length;i++) {
  const q=qs[i],body=examples[i];
  assert(body.includes(readingPrompt(q)),q.id+': reading context omitted');
  assert(!readingPrompt(q).includes('?'),q.id+': quiz prompt remains');
  assert(body.includes(`**Result:** ${q.choices[q.answerIndex]}`),q.id+': result omitted');
  if(q.solutionAnchor)assert(html.includes(`id="${q.solutionAnchor}"`),q.id+': solution link changed');
  let end=0;
  for(const [j,step]of q.steps.entries()) {
   const label=`${j+1}. **${step.title}.**${step.text?' '+step.text:''}`;
   const at=body.indexOf(label,end);assert(at>=end,q.id+': step lost or reordered');end=at+label.length;
   if(step.tex){assert(body.includes('$$'+step.tex+'$$'),q.id+': equation omitted');equations++;}
   steps++;
  }
 }
}
for(const [file,digest]of Object.entries(JSON.parse(fs.readFileSync('audit/notes-preserved.json','utf8'))))assert.equal(hash(fs.readFileSync(file)),digest,file);
const desk=fs.readFileSync('desk.js','utf8');
assert(!/practice-panel|renderMargin|Quick check|data-panel/.test(desk),'Embedded quiz returns to Study');
assert(desk.includes('data-save-section')&&desk.includes('href="#practice/${m}"'),'Reading tools missing');
console.log(`PASS: all 10 original reading chapters, 20 original note files, 600 complete applications, ${steps} unchanged solution steps, ${equations} unchanged displayed equations, and separate practice.`);
