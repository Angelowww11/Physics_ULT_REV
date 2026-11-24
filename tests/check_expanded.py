"""Independent numerical and symbolic checks for the expanded source solutions."""
from pathlib import Path
import json,math,re
import sympy as sp
root=Path(__file__).resolve().parents[1]
checks=[]
def near(name,value,expected,rel=1e-5):
    assert math.isclose(float(value),float(expected),rel_tol=rel,abs_tol=1e-14),(name,value,expected)
    checks.append(name)

near('companion air mass',1.29*4*6*2.5,77.4)
near('submarine absolute pressure',101300+1030*9.8*300,3129500)
near('closed water tube',101300+1000*9.81*(1-.4),107186)
near('hydraulic lift',100*(25/5)**2,2500)
near('tethered wood tension',(1000-700)*.1**3*9.81,2.943)
near('brass alternative buoyancy',1000*9.81*2/8600,2.28139535)
near('iceberg submerged fraction',917/1030,.89029126)
near('pipe expansion',55*1.1e-5*(155-5),.09075)
near('body fever energy',70*3400*(39-37),476000)
near('melting 2 kg',2*334000,668000)
near('cola ice mass',.25*4190*25/(2090*20+334000),.0696846727)
near('five phase energies',sum([.1*2090*40,.1*335000,.1*4186*100,.1*2260000,.1*2110*10]),311830)
near('two charge magnitude',8.99e9*25e-9*75e-9/.03**2,.0187291667)
near('collinear signed force',-8.99e9*5e-9*1e-9/.02**2+8.99e9*5e-9*3e-9/.04**2,-2.809375e-5)
rect=[(0,-9e9*8e-9*4e-9/.03**2),(-4/5*9e9*8e-9*8e-9/.05**2,3/5*9e9*8e-9*8e-9/.05**2),(-9e9*8e-9*12e-9/.04**2,0)]
fx=sum(f[0] for f in rect);fy=sum(f[1] for f in rect)
near('rectangle x',fx,-.00072432);near('rectangle y',fy,-.00018176)
near('rectangle magnitude',math.hypot(fx,fy),.000746777182)
near('rectangle direction',math.degrees(math.atan2(fy,fx))%360,194.086858)
near('symmetric drawing force',2*8.99e9*2e-6*4e-6*.4/(.4**2+.3**2)**1.5,.460288)
near('symmetric literal-text force',2*8.99e9*2e-6*40e-6*.4/(.4**2+30**2)**1.5,2.1304e-5,rel=1e-4)
near('inverse source charge',5*1.5**2/9e9,1.25e-9)
near('midpoint signed field',-9e9*5e-9/.75**2+9e9*3e-9/.75**2,-32)
near('electron deflection',.5*(-1.602e-19)*100/9.11e-31*(.02/2e6)**2,-.000879253568)
near('actual source proton work',1.60e-19*1e3*.2,3.2e-17)
near('actual source proton speed',math.sqrt(2*1.60e-19*1e3*.2/1.67e-27),195765.035)
near('pair potential energy',9e9*2e-6*(-3e-6)/.1,-.54)
near('small source potential',9e9*2.5e-11/1.75,.128571429)
near('dipole a potential',9e9*12e-9*(1/.06-1/.04),-900)
near('dipole b potential',9e9*12e-9*(1/.04-1/.14),1928.571429)
near('dipole c potential',9e9*12e-9*(1/.13-1/.13),0)
near('dielectric source correction',4*8.85e-12*.020/.002,354e-12)
near('source capacitor energy',.5*5.8e-6*400**2,.464)
c_right=1/(1/sp.Rational(12)+1/sp.Rational(6));c_upper=3+11+c_right;c_eq=1/(1/c_upper+1/sp.Rational(9))
assert c_right==4 and c_upper==18 and c_eq==6
v_up=sp.Rational(168,18);v9=sp.Rational(168,9);q_right=c_right*v_up
assert v_up+v9==28 and 3*v_up+11*v_up+q_right==168
assert q_right/12+q_right/6==v_up
near('five capacitor stored energy',.5*float(c_eq)*28**2,2352)
near('copper resistivity',1.68e-8*(1+.0039*50),2.0076e-8)
near('six band nominal',560*100,56000)
near('six band tolerance low',56000*.95,53200)
near('six band tolerance high',56000*1.05,58800)
near('primary bulb current',110/250,.44)
near('primary toaster resistance',220/.5,440)
near('primary milliamp voltage',1200*.03,36)
near('primary bulb power',.9**2*120,97.2)
near('heater energy',120**2/20*15*60,648000)
near('heater higher resistance power',120**2/30,480)
near('real battery current',12/(4+2),2)
assert 12*2==2**2*2+2**2*4
near('primary parallel resistance',1/(1/2+1/3+1/5),30/31)
near('primary parallel current',50/2+50/3+50/5,155/3)
near('companion series 8 ohm drop',9/(15+4+8)*8,8/3)
near('companion parallel resistance',1/(1/15+1/4+1/8),120/53)
near('companion parallel current',9/15+9/4+9/8,3.975)
near('companion mixed equivalent',1/(1/(10+1/(1/90+1/45))+1/25),200/13)
near('primary opposing source current',(6-12)/(8+10),-1/3)
i1,i2=sp.symbols('i1 i2');sol=sp.solve([7*i1+5*i2-16,5*i1+9*i2-6],[i1,i2])
assert sol=={i1:3,i2:-1}
assert 3**2*2+(-1)**2*1+2**2*5+(-1)**2*3==16*3-6
near('RC logarithmic time',-120*35e-6*math.log(.1),.00967085739)
near('wire magnetic force',5*1*1.2*math.sin(math.pi/4),4.24264069)
near('electron magnetic force',1.602e-19*8e6*.025*math.sin(math.pi/3),2.77474539e-14)
near('coil torque max',10*3*math.pi*.1**2*2,1.88495559)
near('coil plane angle',10*3*math.pi*.1**2*2*math.cos(math.pi/6),1.63241943)
near('parallel wire force',2e-7*8*8*2/.003,.0085333333)
near('long solenoid field',4*math.pi*1e-7*420/.12*2,.00879645943)
near('source induced coil emf',200*.18**2*.5/.8,4.05)
near('ideal transformer primary turns',30*120/9,400)
near('ideal transformer primary current',9*.4/120,.03)
near('sliding bar emf',.5*.2*3,.3)
near('sliding bar energy balance',(.5*.2*3/2)**2*2,.045)
near('airplane wing voltage',5e-5*70*1000/3.6,.972222222)
near('mutual inductance emf',.04*2/.01,8)
near('self inductance emf',.2*3/.05,12)
near('source RL fraction time',-.0875/.250*math.log(.37),.347988803)
near('wavelength minimum',3e8/7.9e14*1e9,379.746835)
near('photon eV',6.626e-34*3e8/500e-9/1.602e-19,2.48164794)
near('photoelectric threshold nm',6.626e-34*3e8/(2*1.602e-19)*1e9,620.411985)
near('air water angle',math.degrees(math.asin(math.sin(math.pi/4)/1.33)),32.1176313)
near('water glass internal angle',math.degrees(math.asin(1.3/1.5*math.sin(math.pi/9))),17.2425538)
near('water air exit angle',math.degrees(math.asin(1.3*math.sin(math.pi/9))),26.3994248)
near('glass air critical angle',math.degrees(math.asin(1/1.5)),41.8103149)
near('water air critical angle',math.degrees(math.asin(1/1.33)),48.7534666)

# Symbolic identities for added derivations and their domains.
x,a,k,q,R,C,E,L,t=sp.symbols('x a k q R C E L t',positive=True)
v=k*q*(1/sp.sqrt(x*x+a*a))
assert sp.simplify(-sp.diff(v,x)-k*q*x/(x*x+a*a)**sp.Rational(3,2))==0
assert sp.simplify(k*q*(1/(x-a)**2-1/(x+a)**2)-4*k*q*a*x/(x*x-a*a)**2)==0
assert sp.simplify(sp.diff(q*q/(2*C),q)-q/C)==0
assert sp.simplify(sp.diff(L*x*x/2,x)-L*x)==0
assert sp.simplify((-a/2)-(-a*a/(2*a)))==0
vc=E*(1-sp.exp(-t/(R*C)));ic=E/R*sp.exp(-t/(R*C))
assert sp.simplify(R*ic+vc-E)==0
il=E/R*(1-sp.exp(-R*t/L))
assert sp.simplify(L*sp.diff(il,t)+R*il-E)==0

report=json.loads((root/'audit/source-map.json').read_text(encoding='utf-8'))
assert len(report['files'])==18
assert sum(f['page_count'] for f in report['files'])==492
for f in report['files']:
    pages=[p for g in f['groups'] for p in range(g['first'],g['last']+1)]
    assert pages==list(range(1,f['page_count']+1)),f['id']
print(f'PASS: {len(checks)} expanded numerical checks; exact network, energy, and symbolic checks; all 492 source pages mapped without gaps.')
