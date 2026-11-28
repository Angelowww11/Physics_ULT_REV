"""Independent checks use balances, inverse substitutions, and alternate formulations."""
import json,math,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
qs=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./tools/challenge-source.cjs').questions.filter(q=>q.verification)))"],cwd=root,text=True,encoding='utf-8'))
def close(a,b,label):
    assert math.isclose(a,b,rel_tol=1e-10,abs_tol=1e-22),(label,a,b)
for q in qs:
    d=q['verification'];a=q['answer'];t=d['type'];label=q['id']
    if t=='layer-force': close(a/d['area']/d['g'],sum(r*h for r,h in zip(d['rho'],d['depth'])),label)
    elif t=='loaded-float': close(a*d['rhoFluid']*d['volume'],d['rhoBody']*d['volume']+d['load'],label)
    elif t=='tether': close(a+d['mass']*d['g'],d['rho']*d['volume']*d['g'],label)
    elif t=='hydraulic-travel': close(a*d['diameterRatio']**2,d['inputTravel'],label)
    elif t=='apparent-density': close(d['rhoFluid']*d['weight']/a,d['weight']-d['tension'],label)
    elif t=='ice-mix':
        assert a>0;close(d['water']*d['c']*(d['initial']-a),d['ice']*d['L']+d['ice']*d['c']*a,label)
    elif t=='staged-heat': close(a/d['m'],d['ci']*(-d['Ti'])+d['L']+d['cw']*d['Tf'],label)
    elif t=='overflow': close(a+d['V']*(1+3*d['alpha']*d['dT']),d['V']*(1+d['beta']*d['dT']),label)
    elif t=='calorimeter': close(d['m1']*d['c']*(d['T1']-a),d['m2']*d['c']*(a-d['T2'])+d['C']*(a-d['TC']),label)
    elif t=='first-law': close(a+d['Wa']+d['Wb'],d['Qa']+d['Qb'],label)
    elif t=='perpendicular-coulomb': close(a*a,(d['k']*d['target']*d['qx']/d['rx']**2)**2+(d['k']*d['target']*d['qy']/d['ry']**2)**2,label)
    elif t=='contact-force': close(a*d['d']**2/d['k'],((d['q1']+d['q2'])/2)**2,label)
    elif t=='zero-like-charges': close(d['q1']/a**2,d['q2']/(d['d']-a)**2,label)
    elif t=='electron-transfer': close(a/d['e']+d['added'],d['removed'],label)
    elif t=='coulomb-acceleration': close(a*d['m']*d['d']**2,d['k']*abs(d['q1']*d['q2']),label)
    elif t=='symmetric-field':
        R=math.hypot(d['a'],d['b']);close(a,2*d['k']*d['q']/R**2*math.cos(math.atan2(d['a'],d['b'])),label)
    elif t=='field-deflection': close(2*a/(d['L']/d['v'])**2,d['q']*d['E']/d['m'],label)
    elif t=='electric-stop': close(d['q']*d['E']*a,d['m']*d['v']**2/2,label)
    elif t=='field-component': close(a/d['q'],d['Ey'],label)
    elif t=='axial-dipole': close(a,4*d['k']*d['q']*d['a']*d['x']/(d['x']**2-d['a']**2)**2,label)
    elif t=='voltage-speed': close(d['m']*a*a/2,d['q']*d['dV'],label)
    elif t=='signed-potential-energy': close(a/d['q'],sum(d['k']*x/r for x,r in zip(d['sources'],d['distances'])),label)
    elif t=='triangle-energy':
        charges=[d['q'],d['q'],-d['q']];close(a,sum(d['k']*charges[i]*charges[j]/d['a'] for i in range(3) for j in range(i+1,3)),label)
    elif t=='radial-work': close(a+d['k']*d['q']*d['Q']/d['rb'],d['k']*d['q']*d['Q']/d['ra'],label)
    elif t=='uniform-external-work': close(a,-d['q']*sum(x*y for x,y in zip(d['field'],d['displacement'])),label)
    elif t=='series-cap-energy':
        v1=math.sqrt(2*a/d['C1']);charge=d['C1']*v1;close(v1+charge/d['C2'],d['V'],label)
    elif t=='isolated-dielectric': close(a*2*d['kappa']*d['C'],(d['C']*d['V'])**2,label)
    elif t=='battery-dielectric-work': close(a/d['V'],d['C1']*d['V']-d['C0']*d['V'],label)
    elif t=='plate-isolation':
        Ci=d['kappa']*d['eps']*d['area']/d['d'];Cf=d['kappa']*d['eps']*d['area']/(2*d['d']);close(a,(Ci*d['V'])**2/(2*Cf),label)
    elif t=='charge-sharing': close((d['C1']+d['C2'])*a,d['C1']*d['V1']+d['C2']*d['V2'],label)
    elif t=='load-power':
        I=math.sqrt(a/d['R']);close(I*(d['R']+d['r']),d['emf'],label)
    elif t=='stretched-power': close(a*d['R']*d['lengthFactor']**2,d['V']**2,label)
    elif t=='rc-target': close(d['Vs']*(1-math.exp(-a/(d['R']*d['C']))),d['Vc'],label)
    elif t=='mixed-power':
        vp=math.sqrt(a*d['Rb']);I=vp/d['Ra']+vp/d['Rb'];close(I*d['Rs']+vp,d['V'],label)
    elif t=='two-source-node':
        V=d['E2']-a*d['r2'];close((d['E1']-V)/d['r1']+a,V/d['R'],label)
    elif t=='helix-radius': close(d['q']*d['B']*a/d['m'],d['v']*math.sin(math.radians(d['theta'])),label)
    elif t=='loop-torque-plane': close(a,d['N']*d['I']*d['a']*d['b']*d['B']*math.cos(math.radians(d['plane'])),label)
    elif t=='wire-zero': close(d['I1']/a,d['I2']/(d['d']-a),label)
    elif t=='magnetic-x': close(a/d['q'],d['vy']*d['Bz'],label)
    elif t=='opposing-solenoids': close(a/d['mu']+d['N2']*d['I2']/d['L2'],d['N1']*d['I1']/d['L1'],label)
    elif t=='flux-product': close(a,-d['N']*(d['Bdot']*d['A0']+d['Adot']*d['B0']+2*d['Bdot']*d['Adot']*d['t']),label)
    elif t=='rotating-emf': close(a/(d['N']*d['B']*d['A']*d['omega']),math.sin(math.radians(d['theta'])),label)
    elif t=='rod-power': close(a*d['R'],(d['B']*d['L']*d['v'])**2,label)
    elif t=='rl-target': close(1-math.exp(-d['R']*a/d['L']),d['fraction'],label)
    elif t=='transformer-current':
        Is=a*d['Np']/d['Ns'];close(d['Vp']*a,Is**2*d['R'],label)
    elif t=='medium-wavelength': close(a*d['n'],d['lambda0'],label)
    elif t=='surface-refraction': close(d['n2']*math.sin(math.radians(a)),d['n1']*math.cos(math.radians(d['surface'])),label)
    elif t=='parallel-exit':
        invariant=d['n1']*math.sin(math.radians(d['theta']));assert invariant<=min(d['n2'],d['n3']);close(d['n3']*math.sin(math.radians(a)),invariant,label)
    elif t=='stopping-potential': close((a+d['phiEV'])*d['e'],d['h']*d['c']/d['lambda'],label)
    elif t=='critical-from-speed': close((d['c']/d['v'])*math.sin(math.radians(a)),d['n2'],label)
    else: raise AssertionError(t)
assert len(qs)==50
print('PASS: all 50 new numerical answers satisfy independent physical balances or inverse checks.')
