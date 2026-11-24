from pathlib import Path
from html import escape
from urllib.parse import quote
import json,re,subprocess
from markdown_it import MarkdownIt
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
VERSION='20261124-math6'
SOURCES=json.loads((ROOT/'sources.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))
BY_ID={s['id']:s for s in SOURCES}
AUDIT=json.loads((ROOT/'audit/source-map.json').read_text(encoding='utf-8'))
MD=MarkdownIt('commonmark',{'html':True}).enable('table')
ALL_TEX=[]
STATS={'chapters':10,'sections':0,'words':0,'derivation_blocks':0,'inline_equations':0,'worked_examples':0,'expanded_derivations':0,'figures':0}

def figure(source_id,page,caption):
    s=BY_ID[source_id]; assert 1<=page<=len(s['pages'])
    path=s['pages'][page-1]['image'];crop={
        ('m3-dyn',5):(.10,.005,.90,.305),
        ('m4-dyn',2):(.10,.595,.92,.955),
        ('m5-dyn',7):(.10,.255,.90,.650),
        ('m7-dyn',9):(.10,.215,.90,.600),
        ('m7-dyn',15):(.10,.055,.90,.430),
    }.get((source_id,page))
    if crop:
        dest=ROOT/'assets/figures'/f'{source_id}-{page:03}.webp';dest.parent.mkdir(exist_ok=True)
        if not dest.exists():
            import pymupdf
            with pymupdf.open(ROOT/'modules'/s['file']) as doc:
                p=doc[page-1];r=p.rect
                clip=pymupdf.Rect(r.x0+r.width*crop[0],r.y0+r.height*crop[1],r.x0+r.width*crop[2],r.y0+r.height*crop[3])
                pix=p.get_pixmap(matrix=pymupdf.Matrix(1600/clip.width,1600/clip.width),clip=clip,alpha=False)
                Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(dest,'WEBP',quality=92)
        path=dest.relative_to(ROOT).as_posix()
    with Image.open(ROOT/path) as im:w,h=im.size
    STATS['figures']+=1
    variant='Primary' if s['variant']=='main' else 'Alternate companion' if s['variant']=='dyn-alt' else 'Companion'
    return f'''<figure class="source-figure"><a href="{s['pages'][page-1]['image']}" target="_blank" rel="noopener" aria-label="Open original {escape(s['file'])}, page {page}, at full size"><img src="{path}" width="{w}" height="{h}" loading="lazy" alt="{escape(caption)}"></a><figcaption><span>{variant} · M{s['module']} · PDF p. {page}</span>{escape(caption)}<a href="index.html#slides/{source_id}/{page}">View the original page ↗</a></figcaption></figure>'''

def render_note(text,n):
    def math(m):
        display=m[1].startswith('$$');plain=m[1][2:-2] if display else m[1][1:-1]
        working=not display and len(plain)>100 and plain.count('=')>=2
        tex=plain
        if working:
            parts=plain.split('=')
            tex=r'\begin{aligned}'+parts[0]+'&='+r'\\&='.join(parts[1:])+r'\end{aligned}'
        elif display and len(plain)>120 and r'\begin' not in plain:
            # Break independent displayed relations into readable rows.
            parts=re.split(r'\\q(?:quad|uad)\s*',plain)
            if len(parts)>1:tex=r'\begin{gathered}'+r'\\'.join(parts)+r'\end{gathered}'
        ALL_TEX.append({'tex':tex,'display':display,'working':working,'label':plain})
        marker=f'MATHPLACEHOLDER{len(ALL_TEX)-1}END'
        return f'\n\n{marker}\n\n' if display else marker
    text=re.sub(r'(\$\$[\s\S]*?\$\$|\$[^\n$]+\$)',math,text)
    blocks=[]
    def block(m):
        kind,title,body=m.groups();idx=len(blocks)
        label='Worked solution' if kind=='example' else 'Derivation'
        STATS['worked_examples' if kind=='example' else 'expanded_derivations']+=1
        blocks.append(f'<section class="solution {kind}" id="m{n}-{kind}-{idx+1}"><div class="solution-label"><span>{label}</span><i aria-hidden="true">'+('↳' if kind=='example' else '∴')+f'</i></div><h4>{escape(title)}</h4>{MD.render(body.strip())}</section>')
        return f'\n\nBLOCKPLACEHOLDER{idx}\n\n'
    text=re.sub(r'^:::(example|derivation) ([^\n]+)\n(.*?)^:::[ \t]*$',block,text,flags=re.M|re.S)
    rendered=MD.render(text)
    for i,b in enumerate(blocks):rendered=rendered.replace(f'<p>BLOCKPLACEHOLDER{i}</p>',b)
    rendered=re.sub(r'<p>\{\{figure:([\w-]+):(\d+)\|([^}]+)\}\}</p>',lambda m:figure(m[1],int(m[2]),m[3]),rendered)
    counter=[0];headings=[]
    def heading(m):
        counter[0]+=1;id=f'm{n}-s{counter[0]}'
        label=re.sub(r'MATHPLACEHOLDER(\d+)END',lambda x:ALL_TEX[int(x[1])]['label'],m[1])
        label=re.sub(r'\\(?:mathrm|text)\{([^}]+)\}',r'\1',label)
        label=re.sub(r'\\[a-zA-Z]+|[{}_$]','',label)
        headings.append((id,re.sub('<[^>]+>','',label)))
        return f'<h3 id="{id}">{m[1]}</h3>'
    rendered=re.sub(r'<h3>(.*?)</h3>',heading,rendered)
    rendered=re.sub(r'<table>(.*?)</table>',f'<div class="table-scroll" tabindex="0" role="region" aria-label="Module {n} comparison table"><table>\\1</table></div>',rendered,flags=re.S)
    STATS['sections']+=counter[0]
    return rendered,headings

def build():
    chapters=[];toc=[];mobile=[]
    summaries={1:'Density, pressure, hydraulics, and floating bodies.',2:'Expansion, heat, phase changes, and energy balances.',3:'Charging, Coulomb forces, vectors, and source-label corrections.',4:'Field directions, superposition, motion, and continuous distributions.',5:'Work, signed potential energy, potential, and equipotential surfaces.',6:'Plate geometry, dielectrics, charge, energy, and complete networks.',7:'Current, material properties, DC networks, Kirchhoff rules, and RC transients.',8:'Magnetic forces, current-loop torque, wire fields, and Ampere law.',9:'Changing flux, Lenz law, induced fields, transformers, and RL circuits.',10:'Light, photons, reflection, Snell law, critical angles, and fibers.'}
    core_figures={1:(22,'Hydraulic displacement uses equal displaced fluid volumes.'),2:(39,'Read the five heating-curve regions. The graph starts at −30°C; its caption omits the minus sign.'),3:(23,'Superposition adds the forces acting on the same target charge.'),4:(16,'The dipole field runs from positive charge toward negative charge.'),5:(38,'Electric field lines and equipotential surfaces meet at right angles where the field is nonzero.'),6:(21,'Series capacitors share charge magnitude under the stated initially neutral-node condition.'),7:(75,'The source shows RC charging and its charge/current curves.'),8:(11,'The grip rule finds the field around a wire, rather than the force on a moving charge.'),9:(31,'Motional emf follows from the changing area swept by a sliding rod.'),10:(16,'Measure the incident and reflected angles from the surface normal.')}
    for n in range(1,11):
        s=next(s for s in SOURCES if s['module']==n and s['variant']=='main')
        core=(ROOT/'notes'/f'{n:02}.txt').read_text(encoding='utf-8')
        more=(ROOT/'notes'/f'{n:02}-worked.txt').read_text(encoding='utf-8')
        STATS['words']+=len((core+'\n'+more).split())
        page,caption=core_figures[n]
        text=core+f'\n\n{{{{figure:{s["id"]}:{page}|{caption}}}}}\n\n<p class="chapter-divider">Source problems · full working</p>\n\n'+more
        rendered,headings=render_note(text,n)
        rendered=re.sub(r'<h2>(.*?)</h2>',f'<header class="chapter-heading"><span class="eyebrow">Module {n:02} / Physics 2</span><h2>\\1</h2><p>{summaries[n]}</p></header>',rendered,count=1)
        outline='<details class="chapter-outline"><summary>Topics in this module</summary><div>'+''.join(f'<a href="#{id}">{escape(title)}</a>' for id,title in headings)+'</div></details>'
        rendered=rendered.replace('</header>','</header>'+outline,1)
        files=[f for f in AUDIT['files'] if f['module']==n]
        source_links=''.join(f'<li><a href="modules/{quote(f["file"])}" target="_blank" rel="noopener">{escape(f["file"])}</a><span>{f["page_count"]} pages</span></li>' for f in files)
        map_rows=''.join('<details><summary>'+escape(f['file'])+'</summary><ul>'+''.join(f'<li><a href="index.html#slides/{f["id"]}/{g["first"]}">pp. {g["first"]}–{g["last"]}</a> · {escape(g["topic"])}</li>' for g in f['groups'])+'</ul></details>' for f in files)
        evidence=f'<div class="source-links"><span class="eyebrow">Check the source</span><h4>Original files for module {n}</h4><ul class="original-list">{source_links}</ul><details class="source-audit"><summary>Source-page coverage</summary>{map_rows}</details></div>'
        chapters.append(f'<article class="chapter" id="module-{n}" data-chapter-title="{escape(s["title"])}">{rendered}{evidence}<a class="back" href="#contents">↑ Back to contents</a></article>')
        toc.append(f'<a data-chapter-link="module-{n}" href="#module-{n}"><span>{n:02}</span><b>{escape(s["title"])}</b></a>')
        mobile.append(f'<option value="module-{n}">{n:02}. {escape(s["title"])}</option>')
    body=''.join(chapters)
    response=subprocess.run(['node',str(ROOT/'tools/render_math.cjs')],input=json.dumps(ALL_TEX),capture_output=True,text=True,encoding='utf-8',cwd=ROOT)
    if response.returncode:raise RuntimeError(response.stderr)
    formulas=json.loads(response.stdout)
    assert len(formulas)==len(ALL_TEX)
    for i,html in enumerate(formulas):
        item=ALL_TEX[i];marker=f'MATHPLACEHOLDER{i}END'
        if item['display']:
            body=body.replace(f'<p>{marker}</p>',f'<div class="math">{html}</div>')
        else:
            kind='inline-math math-working' if item['working'] else 'inline-math'
            if item['working']:
                body=body.replace(marker+'.',marker)
            body=body.replace(marker,f'<span class="{kind}">{html}</span>')
    unresolved=re.findall(r'.{0,80}(?:MATHPLACEHOLDER|BLOCKPLACEHOLDER|\{\{figure).{0,140}',body)
    if unresolved:raise ValueError(unresolved[:8])
    STATS['derivation_blocks']=sum(t['display'] for t in ALL_TEX)
    STATS['inline_equations']=sum(not t['display'] for t in ALL_TEX)
    nav=''.join(toc)
    appendix='''<section class="chapter" id="source-notes"><span class="eyebrow">Reference desk</span><h2>Sources, constants, and corrections</h2><p>The 18 supplied PDFs are the course sources. The source-page maps include covers, references, and blank pages. The original files remain unchanged. Cropped reading-view figures link to complete source pages.</p><p>Use the constants stated in a question. Classroom defaults include g = 9.81 m/s², k = 8.99 × 10⁹ N·m²/C², ε₀ = 8.85 × 10⁻¹² F/m, and μ₀ ≈ 4π × 10⁻⁷ T·m/A. A source example can use 9.8, a rounded material value, or a different temperature condition.</p><p>Distinguish the mass-density, resistivity, and charge-density meanings of ρ. Distinguish capacitance from heat capacity when reading C. A matching letter alone does not identify the right physical law.</p><h3>What changes after this source check</h3><p>The expanded solutions restore omitted source problems and their intermediate steps. Corrections appear beside the relevant calculations, including the rectangle-force exponent, proton field value, six-band resistor, series voltage drop, 354 pF result, loop-traversal instruction, Lenz direction, copper table entry, and final refraction angle. Conflicting question labels remain visible in the originals and receive explicit interpretations.</p><h3>Supplementary checks and further reading</h3><p>These references check standard laws and labeled extensions. They do not replace the supplied course scope.</p><ul><li><a href="https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits">OpenStax · RC circuits</a></li><li><a href="https://openstax.org/books/university-physics-volume-2/pages/14-4-rl-circuits">OpenStax · RL circuits</a></li><li><a href="https://openstax.org/books/university-physics-volume-2/pages/13-4-induced-electric-fields">OpenStax · induced electric fields</a></li><li><a href="https://openstax.org/books/university-physics-volume-3/pages/6-2-photoelectric-effect">OpenStax · photoelectric effect</a></li><li><a href="https://ocw.mit.edu/courses/8-02t-electricity-and-magnetism-spring-2005/pages/lecture-notes/">MIT OpenCourseWare · electricity and magnetism notes</a></li></ul><p>Added extensions identify their assumptions. A finite reviewer does not contain every possible exam scenario. Use the problem's actual geometry, signs, and initial conditions.</p><p>Use your browser's Find to locate a term. Use Print to save the notes as a PDF. Every solution stays open for reading and printing.</p></section>'''
    reference_tex=[r'g=9.81\,\mathrm{m\,s^{-2}}',r'k=8.99\times10^9\,\mathrm{N\,m^2\,C^{-2}}',r'\varepsilon_0=8.85\times10^{-12}\,\mathrm{F\,m^{-1}}',r'\mu_0\approx4\pi\times10^{-7}\,\mathrm{T\,m\,A^{-1}}']
    reference_result=subprocess.run(['node',str(ROOT/'tools/render_math.cjs')],input=json.dumps([{'tex':t,'display':False} for t in reference_tex]),capture_output=True,text=True,encoding='utf-8',cwd=ROOT,check=True)
    reference_html=[f'<span class="inline-math">{t}</span>' for t in json.loads(reference_result.stdout)]
    constants='g = 9.81 m/s², k = 8.99 × 10⁹ N·m²/C², ε₀ = 8.85 × 10⁻¹² F/m, and μ₀ ≈ 4π × 10⁻⁷ T·m/A'
    assert constants in appendix
    appendix=appendix.replace(constants,', '.join(reference_html[:3])+', and '+reference_html[3])
    STATS['reference_equations']=len(reference_tex)
    html=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#f0f5fe"><meta name="description" content="Detailed Physics 2 notes with source-linked derivations, complete worked solutions, and original slides."><title>Physics Reviewer Notes · Field Notes</title><script src="appearance.js?v={VERSION}"></script><link rel="stylesheet" href="palette.css?v={VERSION}"><link rel="stylesheet" href="style.css?v={VERSION}"><link rel="stylesheet" href="notebook.css?v={VERSION}"><link rel="stylesheet" href="assets/katex/katex.min.css"><script src="notes-math.js?v={VERSION}" defer></script><script src="themes.js?v={VERSION}" defer></script></head>
<body class="notebook-page"><a class="skip-link" href="#main">Skip to notes</a><header class="site-header"><a class="wordmark" href="index.html"><span>∇</span> field notes<small>PHYSICS 2</small></a><nav aria-label="Website sections"><a href="index.html">Home</a><a class="active" aria-current="page" href="reviewer.html">Reviewer Notes</a><a href="index.html#practice">Practice</a><a href="index.html#slides">Originals</a></nav><button id="appearance-open" aria-label="Choose a theme">◐</button></header><div class="reading-progress" aria-hidden="true"><i id="reading-progress-fill"></i></div>
<div class="notes-layout"><aside class="toc"><span class="eyebrow">Your notebook</span><nav aria-label="Module contents">{nav}<a href="#source-notes"><span>↗</span><b>Sources &amp; corrections</b></a></nav><p class="toc-hint">Read the idea.<br>Follow the working.<br>Check the result.</p></aside>
<main id="main" tabindex="-1" class="reading"><header class="notes-intro" id="contents"><span class="eyebrow">Physics 2 / The complete reading notebook</span><h1>Physics, with<br>the <span class="marked">working shown.</span></h1><p class="lead">Laws, derivations, and solved problems from your ten modules.</p><p>Start with the given values. See why the equation applies. Work through each line, then check the units and direction.</p><div class="method-line" aria-label="Solution reading order"><span>Given</span><i>→</i><span>Model</span><i>→</i><span>Working</span><i>→</i><span>Check</span></div><div class="notebook-meta"><span>18 original files</span><span>492 source pages</span><span>Source corrections explained</span></div><label class="mobile-module-jump">Jump to a module<select id="module-jump"><option value="contents">Choose a module</option>{''.join(mobile)}<option value="source-notes">Sources &amp; corrections</option></select></label><p class="reading-note">All solutions stay open. Colored notes mark assumptions, corrections, and checks. Use the module index to read one topic at a time.</p></header>{body}{appendix}</main></div>
<footer><a href="index.html">← Back to Field Notes</a><span>Physics 2 · The idea, the working, the answer.</span></footer></body></html>'''
    mobile_bar=re.search(r'<label class="mobile-module-jump">.*?</label>',html,re.S)[0]
    html=html.replace(mobile_bar,'')
    mobile_bar=mobile_bar.replace('Jump to a module<select','<span>Module</span><select')
    html=html.replace('<main id="main"',f'<div class="mobile-readerbar">{mobile_bar}</div><main id="main"',1)
    html=html.replace('<a href="#source-notes"><span>','<a data-chapter-link="source-notes" href="#source-notes"><span>',1)
    (ROOT/'reviewer.html').write_text(html,encoding='utf-8')
    (ROOT/'note-stats.json').write_text(json.dumps(STATS),encoding='utf-8')
    print(STATS)

if __name__=='__main__':build()
