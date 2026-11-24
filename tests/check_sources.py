"""Check preservation, page assets, local links, and worked numerical results."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import json, hashlib, math
import sympy as sp

root=Path(__file__).resolve().parents[1]
sources=json.loads((root/'sources.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))
assert len(sources)==18
assert sum(len(s['pages']) for s in sources)==492
for s in sources:
    original=root.parent/'Module-ORG'/s['file']
    copied=root/'modules'/s['file']
    assert hashlib.sha256(copied.read_bytes()).hexdigest()==s['sha256']
    assert copied.read_bytes()==original.read_bytes()
    assert [p['page'] for p in s['pages']]==list(range(1,len(s['pages'])+1))
    assert all((root/p['image']).is_file() for p in s['pages'])

class Links(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]; self.ids=set()
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        self.refs.extend(a[k] for k in ['src','href'] if k in a)

pages={}
for name in ['index.html','reviewer.html']:
    p=Links();p.feed((root/name).read_text(encoding='utf-8'));pages[name]=p
for name,p in pages.items():
    for ref in p.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc:continue
        path=unquote(u.path)
        if path:assert (root/path).exists(),(name,ref)
        if u.fragment and (path=='reviewer.html' or name=='reviewer.html' and not path):
            assert u.fragment in pages['reviewer.html'].ids,ref

def near(actual,expected,rel=1e-4):
    assert math.isclose(float(actual),float(expected),rel_tol=rel,abs_tol=1e-12),(actual,expected)

# Independent substitutions for the notebook's multi-stage and geometric examples.
near(1000*9.81*(2/8700),2.2551724)
near(200*(18e-5-3*.40e-5)*80,2.688)
near(75-79600/(.625*4186),44.574773)
near((.065*444*525+.635*4186*15)/(.065*444+.635*4186),20.477769)
near(sum([.1*2090*40,.1*335000,.1*4186*100,.1*2260000,.1*2110*10]),311830)
near((.2*4186*30-.05*335000)/(.25*4186),7.994267)
near(9e9*(2e-9/.07+6e-9/math.hypot(.06,.07)),842.855093)
near(9e9*(-12e-18/.2+8e-18/.1-6e-18/.1),-3.6e-7)
near(2*8.99e9*2e-9*.3/(.4*math.hypot(.3,.4)),53.94)
near(8.99e9*2e-9*math.log(.5/.3),9.184645,rel=1e-5)
near(8.99e9*2e-9*(1/.3-1/.5),23.973333)
near(-120*35e-6*math.log(.1),.0096708574)
near(5*1*1.2*math.sin(math.pi/4),4.242641)
near(4*math.pi*1e-7*20*2/(2*.05),.0005026548)
near(1.67e-27*1e6/(1.602e-19*.2),.05212235)
near(200*.180**2*.5/.8,4.05)
near(70*(1000/3.6)*5e-5,.9722222)
near(math.degrees(math.asin(1.3*math.sin(math.radians(20)))),26.3994248)
near(math.sqrt(1.48**2-1.46**2),.2424871)
near(math.degrees(math.asin(math.sqrt(1.48**2-1.46**2))),14.0337,rel=2e-4)

# Symbolic checks catch sign and integration errors in the derived formulas.
x,a,L,R,C,E,t,q=sp.symbols('x a L R C E t q',positive=True)
assert sp.simplify(sp.diff(x/(a**2*sp.sqrt(x*x+a*a)),x)-1/(x*x+a*a)**sp.Rational(3,2))==0
vc=E*(1-sp.exp(-t/(R*C)))
assert sp.simplify(R*C*sp.diff(vc,t)+vc-E)==0
current=E/R*(1-sp.exp(-R*t/L))
assert sp.simplify(L*sp.diff(current,t)+R*current-E)==0
i1,i2,i3=sp.symbols('i1 i2 i3')
sol=sp.solve([i3-i1-i2,30*i1+41*i3-45,-30*i1+21*i2-80],[i1,i2,i3])
assert sol[i1]==-sp.Rational(2335,2721)
assert sol[i2]==sp.Rational(7030,2721)
assert sol[i3]==sp.Rational(1565,907)
print('PASS: 18 identical PDFs, 492 slide images, local links, 20 numerical examples, symbolic rod/RC/RL/Kirchhoff checks.')
