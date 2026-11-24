from pathlib import Path
import pymupdf,json,shutil,re,hashlib
from PIL import Image
root=Path(__file__).resolve().parents[1];src=root.parent/'Module-ORG'
titles=['Fluids & buoyancy','Temperature, heat & thermodynamics','Charge & Coulomb force','Electric fields','Electric potential & energy','Capacitors & dielectrics','Current & DC circuits','Magnetic fields','Electromagnetic induction','Light & optics']
sources=[]
for f in sorted(src.glob('*.pdf'),key=lambda f:(int(re.search(r'Module (\d+)',f.name)[1]),'Dyn' in f.name,f.name)):
 n=int(re.search(r'Module (\d+)',f.name)[1]);variant='main' if 'Dyn' not in f.name else ('dyn-alt' if '(1)' in f.name else 'dyn');id=f'm{n}-{variant}'
 (root/'modules').mkdir(exist_ok=True);shutil.copy2(f,root/'modules'/f.name)
 folder=root/'slides'/id;folder.mkdir(parents=True,exist_ok=True);d=pymupdf.open(f);pages=[]
 for i,page in enumerate(d):
  dest=folder/f'{i+1:03}.webp'
  if not dest.exists():
   pix=page.get_pixmap(matrix=pymupdf.Matrix(1600/page.rect.width,1600/page.rect.width),alpha=False);im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);im.save(dest,'WEBP',quality=86)
  pages.append({'page':i+1,'text':page.get_text().replace('\x00',''),'image':f'slides/{id}/{i+1:03}.webp'})
 sources.append({'id':id,'module':n,'title':titles[n-1],'variant':variant,'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'pages':pages})
 print(id,len(pages),flush=True)
(root/'sources.js').write_text('window.PHYSICS_SOURCES='+json.dumps(sources,ensure_ascii=False)+';',encoding='utf-8')
print('Total pages',sum(len(s['pages']) for s in sources))
