"""Recompute 400 new answers from independent balances and geometry.

Vector cases sum source vectors. Network cases reconstruct branch values.
Motion checks also test whether the supplied endpoints are reachable.
"""
import json,math,subprocess
from types import SimpleNamespace as NS
from itertools import combinations
from pathlib import Path
root=Path(__file__).resolve().parents[1]
questions=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./tools/challenge-source.cjs').questions.filter(q=>q.verification?.type==='expanded-scenario')))"],cwd=root,text=True,encoding='utf-8'))
sin=lambda a:math.sin(math.radians(a))
cos=lambda a:math.cos(math.radians(a))
atan=lambda y,x:math.degrees(math.atan2(y,x))
asin=lambda x:math.degrees(math.asin(x))
def field(point,sources,k):
    ex=ey=0
    for q,x,y in sources:
        dx,dy=point[0]-x,point[1]-y;r=math.hypot(dx,dy)
        ex+=k*q*dx/r**3;ey+=k*q*dy/r**3
    return ex,ey
def model(key,d):
    x=NS(**d)
    if key=='manometer':
        p=x.g*(x.rw*x.hw-x.ro*x.ho);return [p,p+x.patm,p*x.A,p/x.rw/x.g]
    if key=='interface-block':
        B=x.g*(x.r1*x.V*(1-x.f)+x.r2*x.V*x.f)
        return [B,x.m*x.g-B,(x.m-x.r1*x.V)/((x.r2-x.r1)*x.V),x.r2*x.V-x.m]
    if key=='raised-hydraulic':
        Ai=math.pi*(x.di/2)**2;Ao=math.pi*(d['do']/2)**2
        Fi=x.M*x.g*Ai/Ao+x.rho*x.g*x.z*Ai;vi=Ao*x.vo/Ai
        return [Fi/Ai,Fi,vi,Fi*vi]
    if key=='weighing-liquids':
        V=(x.W-x.Tw)/x.rw/x.g
        return [V,(x.W/x.g)/V,(x.W-x.Tx)/x.g/V,x.W-x.r3*x.g*V]
    if key=='raft-freeboard':
        displacement=(x.rb*x.V+x.load)/x.rw;above=x.V-displacement
        return [displacement/x.V,above/x.A,x.rw*above,x.rw*x.g*displacement]
    if key=='metal-calorimeter':
        capacities=[x.mm*x.cm,x.mw*x.cw,x.Cc];temperatures=[x.Tm,x.Tw,x.Tw]
        Tf=sum(a*b for a,b in zip(capacities,temperatures))/sum(capacities)
        assert x.Tw<Tf<x.Tm
        return [Tf,capacities[1]*(Tf-x.Tw),capacities[2]*(Tf-x.Tw),capacities[0]*(x.Tm-Tf)]
    if key=='steam-water':
        Tf=(x.ms*(x.L+x.cw*100)+x.mw*x.cw*x.Tw)/(x.cw*(x.ms+x.mw))
        assert x.Tw<Tf<100
        Q=x.mw*x.cw*(Tf-x.Tw);cool=x.ms*x.cw*(100-Tf)
        return [Tf,Q,cool,x.ms*x.L/Q]
    if key=='cold-ice':
        warm=x.mi*x.ci*abs(x.Ti);melt=x.mi*x.L
        Tf=(x.mw*x.cw*x.Tw-warm-melt)/(x.cw*(x.mw+x.mi))
        assert 0<Tf<x.Tw
        lost=x.mi*(x.ci*abs(x.Ti)+x.L+x.cw*Tf)
        return [Tf,(warm+melt)/(x.mw*x.cw),lost,melt/lost]
    if key=='composite-wall':
        rate=x.A*(x.Th-x.Tc)/(x.L1/x.k1+x.L2/x.k2)
        Tj=x.Tc+rate*x.L2/(x.k2*x.A)
        return [rate,Tj,rate*x.time,Tj-x.Tc]
    if key=='signed-cycle':
        a=x.Qa-x.Wa;b=x.Qb-x.Wb;c=-a-b;qc=c+x.Wc;net=x.Qa+x.Qb+qc
        assert qc<0 and x.Qb<0 and net>0
        return [qc,c,net,net/x.Qa]
    if key=='collinear-forces':
        Fx=x.q*field((0,0),[(x.qa,-x.a,0),(x.qb,x.b,0)],x.k)[0]
        modified=x.q*field((0,0),[(x.qa,-2*x.a,0),(x.qb,x.b,0)],x.k)[0]
        return [Fx,abs(Fx)/x.m,x.a*math.sqrt(x.qb/x.qa),modified]
    if key=='triangle-forces':
        top=(x.a/2,math.sqrt(x.a*x.a-(x.a/2)**2))
        Ex,Ey=field(top,[(x.Q,0,0),(x.Q,x.a,0)],x.k);Fy=-x.q*Ey
        assert abs(Ex)<1e-10
        return [Fy,abs(Fy)/x.m,x.k*x.Q*x.Q/x.a**2,Fy/4]
    if key=='sequential-contact':
        charges=[x.qa,x.qb,x.qc];charges[0]=charges[1]=sum(charges[:2])/2
        charges[1]=charges[2]=sum(charges[1:])/2
        assert math.isclose(sum(charges),x.qa+x.qb+x.qc,rel_tol=1e-12)
        return [charges[1],x.k*abs(charges[0]*charges[1])/x.d**2,x.k*charges[1]*charges[2]/x.d**2,abs(charges[2]-x.qc)/x.e]
    if key=='charged-pendulums':
        T=x.m*x.g/cos(x.theta);Fe=T*sin(x.theta);dist=2*x.L*sin(x.theta);q=math.sqrt(Fe*x.k**-1*dist**2)
        return [q,Fe,T,q/x.e]
    if key=='square-vector':
        Ex,Ey=field((0,0),[(x.Q,x.a,0),(-2*x.Q,0,x.a),(x.Q,x.a,x.a)],x.k)
        Fx,Fy=x.q*Ex,x.q*Ey
        return [Fx,Fy,math.hypot(Fx,Fy),atan(Fy,Fx)%360]
    if key=='field-components':
        Ex,Ey=field((0,0),[(x.Q,-x.a,0),(-2*x.Q,0,x.b)],x.k);mag=math.hypot(Ex,Ey)
        return [mag,atan(Ey,Ex)%360,x.qt*Ey,abs(x.qt)*mag/x.m]
    if key=='turning-electron':
        t=x.L/x.vx;acc=-x.e*x.E0/x.me;vy=x.vy0+acc*t
        assert 0<-x.vy0/acc<t
        return [(x.vy0+vy)*t/2,vy,atan(vy,x.vx),x.vy0*(-x.vy0/acc)/2]
    if key=='opposite-zero':
        sources=[(x.Q,0,0),(-x.ratio*x.Q,x.d,0)];zero=-x.d/(math.sqrt(x.ratio)-1)
        assert abs(field((zero,0),sources,x.k)[0])<1e-8
        mid=field((x.d/2,0),sources,x.k)[0]
        return [zero,mid,x.qt*mid,field((2*x.d,0),sources,x.k)[0]]
    if key=='ring-axis':
        # Sum equal ring elements in three dimensions instead of using the closed form.
        def axial(pos):
            count=360
            return sum(x.k*(x.Q/count)*pos/(pos*pos+(x.R*cos(a))**2+(x.R*sin(a))**2)**1.5 for a in range(count))
        xmax=x.R/math.sqrt(2);atpoint=axial(x.x);peak=axial(xmax)
        assert peak>axial(xmax*.99) and peak>axial(xmax*1.01)
        return [atpoint,x.qt*atpoint,xmax,peak]
    if key=='exact-dipole':
        sources=[(-x.q,-x.a,0),(x.q,x.a,0)]
        ax=field((x.x,0),sources,x.k)[0];eq=field((0,x.y),sources,x.k)[0]
        return [ax,eq,abs(ax/eq),x.qt*eq]
    if key=='two-source-potential':
        def potential(pos):return x.k*x.Q/abs(pos+x.a)-2*x.k*x.Q/abs(pos-x.a)
        V=potential(0);U=x.qt*V
        return [V,potential(x.a/2),U,math.sqrt(-2*U/x.m)]
    if key=='uniform-energy':
        dot=x.Ex*x.dx+x.Ey*x.dy;work=x.q*dot
        ax,ay=x.q*x.Ex/x.m,x.q*x.Ey/x.m
        assert x.v0*x.v0>=math.hypot(ax,ay)*math.hypot(x.dx,x.dy)-(ax*x.dx+ay*x.dy),'Unreachable endpoint'
        return [-dot,-work,work,math.sqrt((x.m*x.v0*x.v0/2+work)*2/x.m)]
    if key=='square-assembly':
        corners=[(0,0),(x.a,0),(x.a,x.a),(0,x.a)];charges=[x.q]*3+[-2*x.q]
        def pairenergy(count):
            return sum(x.k*charges[i]*charges[j]/math.dist(corners[i],corners[j]) for i,j in combinations(range(count),2))
        first=pairenergy(3);total=pairenergy(4)
        center=(x.a/2,x.a/2);vc=sum(x.k*q/math.dist(center,pos) for q,pos in zip(charges,corners))
        return [total,total-first,vc,first]
    if key=='retarding-electron':
        initial=x.me*x.vi*x.vi/2;final=initial-x.e*x.drop
        assert final>0
        return [initial/x.e,math.sqrt(2*final/x.me),final/x.e,initial/(x.e*x.E0)]
    if key=='potential-gradient':
        Ex,Ey=-x.A,-x.B;work=x.q*(Ex*x.dx+Ey*x.dy)
        ax,ay=x.q*Ex/x.m,x.q*Ey/x.m
        assert x.vi*x.vi>=math.hypot(ax,ay)*math.hypot(x.dx,x.dy)-(ax*x.dx+ay*x.dy),'Unreachable endpoint'
        return [Ex,atan(Ey,Ex),work,math.sqrt(x.vi*x.vi+2*work/x.m)]
    if key=='cap-mixed':
        Cp=x.C2+x.C3;Ceq=1/(1/x.C1+1/Cp);Q=Ceq*x.V;Vp=x.V-Q/x.C1
        return [Ceq,Q,Vp,.5*x.C3*Vp*Vp]
    if key=='area-dielectric':
        Cvac=x.eps*x.area*(1-x.f)/x.d;Cd=x.kappa*x.eps*x.area*x.f/x.d;C=Cvac+Cd
        return [C,C*x.V,.5*C*x.V*x.V,(C-x.eps*x.area/x.d)*x.V]
    if key=='isolated-geometry':
        ratio=x.kappa*x.af/x.df;Cf=x.Ci*ratio;charge=x.Ci*x.Vi;Vf=x.Vi/ratio;Uf=charge*Vf/2
        return [Cf,Vf,Uf,Uf-x.Ci*x.Vi*x.Vi/2]
    if key=='opposite-share':
        node=x.C1*x.V1-x.C2*x.V2;Vf=node/(x.C1+x.C2);Uf=node*Vf/2
        return [Vf,x.C1*Vf,Uf,(x.C1*x.V1*x.V1+x.C2*x.V2*x.V2)/2-Uf]
    if key=='stacked-dielectrics':
        E1=x.V/(x.f*x.d+x.k1/x.k2*(1-x.f)*x.d);D=x.k1*x.eps*E1;charge=D*x.area
        return [charge/x.V,D,E1,E1*x.f*x.d]
    if key=='loaded-divider':
        conductance=1/x.R2+1/x.RL;Req=x.R1+1/conductance;I=x.V/Req;VL=x.V-I*x.R1
        return [Req,VL,VL/x.RL,I*I*x.R1]
    if key=='heated-wire':
        R=x.R0+x.R0*x.alpha*(x.T-x.T0);I=x.emf/(R+x.rint);V=I*R
        return [R,I,V,V*I]
    if key=='rc-initial':
        remaining=math.exp(-x.t/(x.R*x.C));Vc=x.V0*remaining+x.Vs*(1-remaining);I=(x.Vs-Vc)/x.R
        return [Vc,I,x.C*Vc,x.C*Vc*Vc/2]
    if key=='opposing-loop':
        I=(x.E1-x.E2)/(x.R1+x.R2+x.rint)
        assert math.isclose(x.E1*I,I*I*(x.R1+x.R2+x.rint)+x.E2*I)
        return [I,I*x.R2,I*I*x.R1,x.E2*I]
    if key=='maximum-load':
        power=lambda R:(x.emf/(R+x.rint))**2*R
        assert power(x.rint)>power(.99*x.rint) and power(x.rint)>power(1.01*x.rint)
        I=x.emf/(2*x.rint)
        return [x.rint,power(x.rint),I,x.emf-I*x.rint]
    if key=='selector-radius':
        v=x.E0/x.B1;r=x.m*v/(x.q*x.B2)
        return [v,r,x.m*v*v/2,2*math.pi*r/v]
    if key=='levitated-wire':
        force=x.I*x.L*x.B*sin(x.theta)
        return [force,(force-x.m*x.g)/x.m,x.m*x.g/(x.L*x.B*sin(x.theta)),x.m*x.g/(x.I*x.L*sin(x.theta))]
    if key=='loop-energy':
        moment=x.N*x.I*x.a*x.b;scale=moment*x.B;U=-scale*cos(x.theta)
        return [moment,scale*sin(x.theta),U,-scale-U]
    if key=='opposite-wires':
        by=x.mu/(2*math.pi)*(x.I1/(x.x-0)+(-x.I2)/(x.x-x.d));zero=x.I1*x.d/(x.I1-x.I2)
        return [by,zero,x.I2*(x.mu*x.I1/(2*math.pi*x.d)),-x.I3*x.L*by]
    if key=='helix-inverse':
        frequency=x.q*x.B/(2*math.pi*x.m);vp=2*math.pi*x.radius*frequency;vpar=x.pitch*frequency
        return [vp,vpar,x.m*(vp*vp+vpar*vpar)/2,atan(vp,vpar)]
    if key=='rl-initial':
        rem=math.exp(-x.R*x.t/x.L);I=x.I0*rem+(x.Vs/x.R)*(1-rem);Vl=(x.Vs-x.R*x.I0)*rem
        return [I,Vl,x.L*I*I/2,x.R*I*I]
    if key=='rl-decay-energy':
        I=x.I0*math.exp(-x.R*x.t/x.L);U=x.L*I*I/2;initial=x.L*x.I0*x.I0/2
        return [I,U,initial-U,math.log(2)/(2*x.R/x.L)]
    if key=='mutual-ramp':
        current=x.a*x.t*x.t+x.b*x.t;rate=2*x.a*x.t+x.b;emf=-x.M*rate
        return [emf,abs(emf)/x.R,x.M*current/x.N,-x.M*current/x.t]
    if key=='rod-battery':
        emf=x.B*x.L*x.speed;I=(emf-x.emfB)/x.R;force=x.B*x.L*I
        assert math.isclose(force*x.speed,I*I*x.R+x.emfB*I,rel_tol=1e-12)
        return [I,force,force*x.speed,x.emfB*I]
    if key=='transformer-loss':
        Vs=x.Vp*x.Ns/x.Np;Is=Vs/x.R;Pout=Is*Is*x.R;Pin=Pout/x.eta
        return [Vs,Is,Pin-Pout,Pin/x.Vp]
    if key=='fiber-acceptance':
        critical=asin(x.nl/x.nc);internal=90-critical;NA=x.nc*sin(internal)
        assert NA<=x.na
        return [critical,asin(NA/x.na),NA,x.lambda_/x.nc]
    if key=='slab-offset':
        refr=asin(x.n1*sin(x.inc)/x.n2);path=x.d/cos(refr);shift=path*sin(x.inc-refr)
        return [refr,shift,path/(x.c/x.n2),x.lambda_/x.n2]
    if key=='two-color-photoelectric':
        phi=x.h*x.c/x.l1-x.e*x.V1;K2=x.h*x.c/x.l2-phi
        assert phi>0 and K2>0
        return [phi/x.e,x.h*x.c/phi,K2/x.e,math.sqrt(2*K2/x.me)]
    if key=='inverse-refraction':
        n2=x.n1*sin(x.inc)/sin(x.refr);speed=x.c/n2
        assert n2>x.n1
        return [n2,speed,speed/x.freq,asin(x.n1/n2)]
    if key=='photon-budget':
        energy=x.h*x.c/x.lambda_;N=x.P*x.time*x.abs/energy;kinetic=energy-x.phi*x.e
        assert kinetic>0
        return [energy,N,kinetic/x.e,x.e*d['yield']*N]
    raise AssertionError(key)

seen=set()
for q in questions:
    check=q['verification'];inputs=check['inputs'].copy()
    if 'lambda' in inputs:inputs['lambda_']=inputs.pop('lambda')
    values=model(check['family'],inputs);expected=values[check['target']]
    assert math.isclose(q['answer'],expected,rel_tol=1e-10,abs_tol=1e-25),(q['id'],q['answer'],expected)
    seen.add((q['module'],check['family']))
assert len(questions)==400 and len(seen)==50
print('PASS: 400 added numerical answers, 50 scenario families, vector sums, energy balances, phase limits, and reachable motion endpoints.')
