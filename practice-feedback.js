/* Deeper working and back-substitution checks for the unchanged 600 numerical variants. */
(()=>{
 'use strict';
 const r=String.raw;
 const n=value=>{if(value===0)return '0';if(Math.abs(value)<.001||Math.abs(value)>=1e6){const [a,b]=value.toExponential(6).split('e');return `${Number(a)}\\times10^{${Number(b)}}`;}return String(Number(value.toPrecision(7)));};
 const units={'kg/m³':r`\mathrm{kg\,m^{-3}}`,'m/s²':r`\mathrm{m\,s^{-2}}`,'N/C':r`\mathrm{N\,C^{-1}}`,'μF':r`\mu\mathrm F`,'°':r`{}^\circ`,'°F':r`{}^\circ\mathrm F`,'Ω':r`\Omega`};
 const unit=q=>units[q.unit]||r`\mathrm{${q.unit}}`;
 const fmt=value=>Math.abs(value)>0&&(Math.abs(value)<.001||Math.abs(value)>=1e6)?value.toExponential(5):Number(value.toPrecision(6)).toString();
 const deg=d=>d*Math.PI/180;
 function make(q){
  const i=Math.floor((Number(q.id.split('q')[1])-1)/3)+1,f=(Number(q.id.split('q')[1])-1)%3;
  const m=i+2,V=(i+2)/1000,charge=i*1e-6,nano=i*1e-9;
  let arithmetic,conversion,rule,inverse;
  const check=(tex,stated)=>`Substituting this choice back into the law gives $${tex}$. The problem states ${stated}. This choice does not satisfy that given value.`;
  if(q.module===1){
   if(f===0){
    rule='Average density uses the object’s complete mass and volume.';
    arithmetic=r`\rho=\frac{${m}}{${n(V)}}=\frac{${m}}{${m}\times10^{-3}}=10^3\,\mathrm{kg\,m^{-3}}`;
    inverse=v=>check(r`m_{\rm implied}=\rho_{\rm choice}V=${n(v)}(${n(V)})\approx${n(v*V)}\,\mathrm{kg}`,r`$m=${m}\,\mathrm{kg}$`);
   }
   if(f===1){
    rule='Gauge pressure is the pressure increase below the fluid surface. Do not add atmospheric pressure to this requested difference.';
    arithmetic=r`\rho g=1000(9.81)=9810\,\mathrm{Pa\,m^{-1}},\quad\Delta P=9810(${i/2})=${n(q.answer)}\,\mathrm{Pa}`;
    inverse=v=>check(r`h_{\rm implied}=\frac{\Delta P_{\rm choice}}{\rho g}=\frac{${n(v)}}{9810}\approx${n(v/9810)}\,\mathrm m`,r`$h=${i/2}\,\mathrm m$`);
   }
   if(f===2){
    rule='Buoyancy equals the weight of displaced fluid. It need not equal the submerged object’s weight.';
    arithmetic=r`m_{\rm disp}=1000(${n(V)})=${m}\,\mathrm{kg},\quad F_B=${m}(9.81)=${n(q.answer)}\,\mathrm N`;
    inverse=v=>check(r`V_{\rm implied}=\frac{F_{\rm choice}}{\rho g}=\frac{${n(v)}}{9810}\approx${n(v/9810)}\,\mathrm{m^3}`,r`$V_{\rm disp}=${n(V)}\,\mathrm{m^3}$`);
   }
  }
  if(q.module===2){
   if(f===0){
    rule='Convert a temperature reading with both the scale factor and the 32-degree offset. The offset is absent only for temperature differences.';
    arithmetic=r`\frac95(${i*3})=${n(i*3*1.8)},\quad T_F=${n(i*3*1.8)}+32=${n(q.answer)}\,{}^\circ\mathrm F`;
    inverse=v=>check(r`T_{C,\rm implied}=\frac59(T_{F,\rm choice}-32)=\frac59(${n(v)}-32)\approx${n((v-32)*5/9)}\,{}^\circ\mathrm C`,r`$T_C=${i*3}\,{}^\circ\mathrm C$`);
   }
   if(f===1){
    rule='The requested quantity is the increase in length. Calculate the original length times the fractional thermal expansion.';
    arithmetic=r`\alpha\Delta T=(12\times10^{-6})(20)=2.4\times10^{-4},\quad\Delta L=${i+1}(2.4\times10^{-4})=${n(q.answer)}\,\mathrm m`;
    inverse=v=>check(r`\Delta T_{\rm implied}=\frac{\Delta L_{\rm choice}}{\alpha L_0}=\frac{${n(v)}}{(12\times10^{-6})(${i+1})}\approx${n(v/(12e-6*(i+1)))}\,\mathrm K`,r`$\Delta T=20\,\mathrm K$`);
   }
   if(f===2){
    rule='No phase change occurs. Use sensible heat, with the mass, specific heat, and actual temperature increase.';
    arithmetic=r`mc=${i/10}(4186)=${n(i/10*4186)}\,\mathrm{J\,K^{-1}},\quad Q=${n(i/10*4186)}(5)=${n(q.answer)}\,\mathrm J`;
    inverse=v=>check(r`\Delta T_{\rm implied}=\frac{Q_{\rm choice}}{mc}=\frac{${n(v)}}{(${i/10})(4186)}\approx${n(v/(i/10*4186))}\,\mathrm K`,r`$\Delta T=5\,\mathrm K$`);
   }
  }
  if(q.module===3){
   if(f===0){
    rule='Removing electrons removes negative charge. The initially neutral body therefore acquires a positive net charge.';
    arithmetic=r`Q=(${i})(1.602)\times10^{10-19}=${n(i*1.602)}\times10^{-9}\,\mathrm C`;
    inverse=v=>check(r`N_{\rm implied}=\frac{Q_{\rm choice}}e=\frac{${n(v)}}{1.602\times10^{-19}}\approx${n(v/1.602e-19)}`,r`$N=${i}\times10^{10}$ removed electrons`);
   }
   if(f===1){
    rule='The force magnitude uses both charge magnitudes and the square of their separation. Opposite charge signs make the interaction attractive.';
    conversion=r`|q_1|=${i}\,\mathrm{nC}=${i}\times10^{-9}\,\mathrm C,\quad |q_2|=10^{-8}\,\mathrm C`;
    arithmetic=r`\begin{aligned}r^2&=(0.10)^2=0.0100\,\mathrm{m^2}\\k|q_1q_2|&=${n(8.99e9*nano*1e-8)}\,\mathrm{N\,m^2}\\F&=\frac{${n(8.99e9*nano*1e-8)}}{0.0100}=${n(q.answer)}\,\mathrm N\end{aligned}`;
    inverse=v=>check(r`|q_1|_{\rm implied}=\frac{F_{\rm choice}r^2}{k|q_2|}\approx${n(v*.01/(8.99e9*1e-8)*1e9)}\,\mathrm{nC}`,r`$|q_1|=${i}\,\mathrm{nC}$`);
   }
   if(f===2){
    rule='Holding both charges fixed leaves an inverse-square dependence on distance. Doubling distance divides force by four.';
    arithmetic=r`\left(\frac{r_0}{2r_0}\right)^2=\frac14,\quad F_{\rm new}=\frac{${i}}4=${n(q.answer)}\,\mathrm N`;
    inverse=v=>check(r`F_{0,\rm implied}=4F_{\rm choice}=4(${n(v)})\approx${n(4*v)}\,\mathrm N`,r`$F_0=${i}\,\mathrm N$`);
   }
  }
  if(q.module===4){
   if(f===0){
    rule='Field magnitude depends on the source charge and inverse-square distance. A positive point source produces an outward field.';
    conversion=r`Q=${i}\,\mathrm{nC}=${i}\times10^{-9}\,\mathrm C`;
    arithmetic=r`r^2=0.25\,\mathrm{m^2},\quad kQ=${n(8.99*i)},\quad E=\frac{${n(8.99*i)}}{0.25}=${n(q.answer)}\,\mathrm{N\,C^{-1}}`;
    inverse=v=>check(r`Q_{\rm implied}=\frac{E_{\rm choice}r^2}{k}\approx${n(v*.25/8.99e9*1e9)}\,\mathrm{nC}`,r`$Q=${i}\,\mathrm{nC}$`);
   }
   if(f===1){
    rule='Force equals the test charge times the field. The positive charge makes the force point along the field.';
    conversion=r`q=${i}\,\mu\mathrm C=${i}\times10^{-6}\,\mathrm C`;
    arithmetic=r`F=(${i})(200)\times10^{-6}=${n(i*200)}\times10^{-6}=${n(q.answer)}\,\mathrm N`;
    inverse=v=>check(r`E_{\rm implied}=\frac{F_{\rm choice}}q=\frac{${n(v)}}{${i}\times10^{-6}}\approx${n(v/charge)}\,\mathrm{N\,C^{-1}}`,r`$E=200\,\mathrm{N\,C^{-1}}$`);
   }
   if(f===2){
    rule='First calculate the electric force. Then divide by mass, because the model excludes other forces.';
    conversion=r`q=${i}\times10^{-6}\,\mathrm C,\quad m=0.002\,\mathrm{kg}=2\times10^{-3}\,\mathrm{kg}`;
    arithmetic=r`F=qE=${n(charge*100)}\,\mathrm N,\quad a=\frac{${n(charge*100)}}{0.002}=${n(q.answer)}\,\mathrm{m\,s^{-2}}`;
    inverse=v=>check(r`E_{\rm implied}=\frac{ma_{\rm choice}}q=\frac{0.002(${n(v)})}{${i}\times10^{-6}}\approx${n(.002*v/charge)}\,\mathrm{N\,C^{-1}}`,r`$E=100\,\mathrm{N\,C^{-1}}$`);
   }
  }
  if(q.module===5){
   if(f===0){
    rule='Point-charge potential is proportional to charge and inverse distance. Do not use the inverse-square field formula.';
    conversion=r`Q=${i}\,\mathrm{nC}=${i}\times10^{-9}\,\mathrm C`;
    arithmetic=r`kQ=(8.99\times10^9)(${i}\times10^{-9})=${n(8.99*i)},\quad V=\frac{${n(8.99*i)}}{0.25}=${n(q.answer)}\,\mathrm V`;
    inverse=v=>check(r`Q_{\rm implied}=\frac{V_{\rm choice}r}k\approx${n(v*.25/8.99e9*1e9)}\,\mathrm{nC}`,r`$Q=${i}\,\mathrm{nC}$`);
   }
   if(f===1){
    rule='Potential energy is charge times the external potential. Volts alone are not the requested energy in joules.';
    conversion=r`q=${i}\,\mu\mathrm C=${i}\times10^{-6}\,\mathrm C`;
    arithmetic=r`U=(${i})(50)\times10^{-6}=${n(i*50)}\times10^{-6}=${n(q.answer)}\,\mathrm J`;
    inverse=v=>check(r`V_{\rm implied}=\frac{U_{\rm choice}}q=\frac{${n(v)}}{${i}\times10^{-6}}\approx${n(v/charge)}\,\mathrm V`,r`$V=50\,\mathrm V$`);
   }
   if(f===2){
    rule='Work done by the electric field is minus the potential-energy change. For this positive charge moving to lower potential, field work is positive.';
    conversion=r`q=${i}\,\mu\mathrm C=${i}\times10^{-6}\,\mathrm C`;
    arithmetic=r`\Delta V=40-100=-60\,\mathrm V,\quad\Delta U=${n(-60*charge)}\,\mathrm J,\quad W_{\rm field}=-\Delta U=${n(q.answer)}\,\mathrm J`;
    inverse=v=>check(r`(V_a-V_b)_{\rm implied}=\frac{W_{\rm choice}}q\approx${n(v/charge)}\,\mathrm V`,r`$V_a-V_b=100-40=60\,\mathrm V$`);
   }
  }
  if(q.module===6){
   if(f===0){
    rule='Use the magnitude of charge on one capacitor plate. The two plates carry opposite charges; do not add their absolute values.';
    conversion=r`C=${i}\,\mu\mathrm F=${i}\times10^{-6}\,\mathrm F`;
    arithmetic=r`Q=(${i})(12)\times10^{-6}=${n(i*12)}\times10^{-6}=${n(q.answer)}\,\mathrm C`;
    inverse=v=>check(r`V_{\rm implied}=\frac{Q_{\rm choice}}C=\frac{${n(v)}}{${i}\times10^{-6}}\approx${n(v/charge)}\,\mathrm V`,r`$V=12\,\mathrm V$`);
   }
   if(f===1){
    rule='Capacitor energy contains one half and voltage squared. Both factors are necessary when capacitance and voltage are given.';
    conversion=r`C=${i}\,\mu\mathrm F=${i}\times10^{-6}\,\mathrm F`;
    arithmetic=r`V^2=100\,\mathrm{V^2},\quad U=\tfrac12(${i}\times10^{-6})(100)=${n(q.answer)}\,\mathrm J`;
    inverse=v=>check(r`C_{\rm implied}=\frac{2U_{\rm choice}}{V^2}\approx${n(2*v/100*1e6)}\,\mu\mathrm F`,r`$C=${i}\,\mu\mathrm F$`);
   }
   if(f===2){
    rule='Series capacitors add reciprocally. The equivalent capacitance must be smaller than the smaller component.';
    arithmetic=r`C_1C_2=${2*i*i}\,(\mu\mathrm F)^2,\quad C_1+C_2=${3*i}\,\mu\mathrm F,\quad C_{\rm eq}=\frac{${2*i*i}}{${3*i}}\,\mu\mathrm F`;
    inverse=v=>check(r`\frac1{C_{\rm choice}}\approx${n(1/v)}\,(\mu\mathrm F)^{-1}`,r`$\frac1{C_1}+\frac1{C_2}=\frac1{${i}}+\frac1{${2*i}}\approx${n(1/i+1/(2*i))}\,(\mu\mathrm F)^{-1}$`);
   }
  }
  if(q.module===7){
   if(f===0){
    rule='For the stated ohmic resistor, current is voltage divided by resistance.';
    arithmetic=r`I=\frac{12}{${i+2}}=${n(q.answer)}\,\mathrm A,\quad I(${i+2}\,\Omega)=12\,\mathrm V`;
    inverse=v=>check(r`V_{\rm implied}=I_{\rm choice}R=${n(v)}(${i+2})\approx${n(v*(i+2))}\,\mathrm V`,r`$V=12\,\mathrm V$`);
   }
   if(f===1){
    rule='Wire resistance increases with length and decreases with cross-sectional area. Resistivity is a material property, not the resistance itself.';
    arithmetic=r`R=2(${i})10^{-8-(-6)}=2(${i})10^{-2}=${n(q.answer)}\,\Omega`;
    inverse=v=>check(r`\rho_{\rm implied}=\frac{R_{\rm choice}A}L=\frac{${n(v)}(10^{-6})}{${i}}\approx${n(v*1e-6/i)}\,\Omega\,\mathrm m`,r`$\rho=2\times10^{-8}\,\Omega\,\mathrm m$`);
   }
   if(f===2){
    rule='The RC time constant is resistance times capacitance. A decay half-life is a different quantity.';
    conversion=r`C=${i}\,\mu\mathrm F=${i}\times10^{-6}\,\mathrm F`;
    arithmetic=r`\tau=(10^3)(${i}\times10^{-6})=${i}\times10^{-3}=${n(q.answer)}\,\mathrm s`;
    inverse=v=>check(r`C_{\rm implied}=\frac{\tau_{\rm choice}}R=\frac{${n(v)}}{1000}\approx${n(v/1000*1e6)}\,\mu\mathrm F`,r`$C=${i}\,\mu\mathrm F$`);
   }
  }
  if(q.module===8){
   if(f===0){
    rule='The perpendicular wire segment has the maximum sine factor, one. Include the current, segment length, and field.';
    arithmetic=r`\sin90^\circ=1,\quad LB=0.20(0.30)=0.060,\quad F=${i}(0.060)=${n(q.answer)}\,\mathrm N`;
    inverse=v=>check(r`B_{\rm implied}=\frac{F_{\rm choice}}{IL}=\frac{${n(v)}}{(${i})(0.20)}\approx${n(v/(i*.2))}\,\mathrm T`,r`$B=0.30\,\mathrm T$`);
   }
   if(f===1){
    rule='Magnetic force magnitude is charge magnitude times speed times field times the sine of their angle. Here the angle is 90 degrees.';
    conversion=r`q=${i}\,\mu\mathrm C=${i}\times10^{-6}\,\mathrm C`;
    arithmetic=r`vB=1000(0.10)=100,\quad F=(${i}\times10^{-6})(100)=${n(q.answer)}\,\mathrm N`;
    inverse=v=>check(r`B_{\rm implied}=\frac{F_{\rm choice}}{|q|v}=\frac{${n(v)}}{(${i}\times10^{-6})(1000)}\approx${n(v/(charge*1000))}\,\mathrm T`,r`$B=0.10\,\mathrm T$`);
   }
   if(f===2){
    rule='The long-wire field varies inversely with distance. Retain the full circumference factor in the denominator.';
    arithmetic=r`B=\frac{4\pi\times10^{-7}(${i})}{2\pi(0.10)}=2\times10^{-6}(${i})=${n(q.answer)}\,\mathrm T`;
    inverse=v=>check(r`I_{\rm implied}=\frac{2\pi rB_{\rm choice}}{\mu_0}=\frac{B_{\rm choice}}{2\times10^{-6}}\approx${n(v/2e-6)}\,\mathrm A`,r`$I=${i}\,\mathrm A$`);
   }
  }
  if(q.module===9){
   if(f===0){
    rule='The flux angle is measured from the area normal. A field perpendicular to the plane is parallel to that normal.';
    arithmetic=r`\theta=0^\circ,\quad\cos\theta=1,\quad\Phi=0.20(${i/100})=${n(q.answer)}\,\mathrm{Wb}`;
    inverse=v=>check(r`B_{\rm implied}=\frac{\Phi_{\rm choice}}A=\frac{${n(v)}}{${i/100}}\approx${n(v/(i/100))}\,\mathrm T`,r`$B=0.20\,\mathrm T$`);
   }
   if(f===1){
    rule='Faraday’s law uses the change in flux per turn and the number of turns. The requested emf is a magnitude.';
    arithmetic=r`\Delta\Phi=A\Delta B=0.008\,\mathrm{Wb},\quad\frac{\Delta\Phi}{\Delta t}=0.040\,\mathrm V,\quad|\mathcal E|=${i*10}(0.040)=${n(q.answer)}\,\mathrm V`;
    inverse=v=>check(r`|\Delta B|_{\rm implied}=\frac{|\mathcal E|_{\rm choice}\Delta t}{NA}=\frac{${n(v)}(0.20)}{(${i*10})(0.020)}\approx${n(v*.2/(i*10*.02))}\,\mathrm T`,r`$|\Delta B|=0.40\,\mathrm T$`);
   }
   if(f===2){
    rule='The RL time constant is inductance divided by total series resistance. Do not use the RC product rule.';
    arithmetic=r`\tau=\frac{${i/100}}2=${n(q.answer)}\,\mathrm s,\quad\mathrm H/\Omega=\mathrm s`;
    inverse=v=>check(r`L_{\rm implied}=R\tau_{\rm choice}=2(${n(v)})\approx${n(2*v)}\,\mathrm H`,r`$L=${i/100}\,\mathrm H$`);
   }
  }
  if(q.module===10){
   if(f===0){
    rule='Calculate wavelength in metres from the vacuum wave speed. Then convert metres to the requested nanometres.';
    conversion=r`1\,\mathrm m=10^9\,\mathrm{nm}`;
    arithmetic=r`\lambda=\frac3{${i+3}}\times10^{-6}\,\mathrm m=\frac{3000}{${i+3}}\,\mathrm{nm}=${n(q.answer)}\,\mathrm{nm}`;
    inverse=v=>check(r`c_{\rm implied}=f\lambda_{\rm choice}=(${i+3}\times10^{14})(${n(v)}\times10^{-9})\approx${n((i+3)*1e14*v*1e-9)}\,\mathrm{m\,s^{-1}}`,r`$c=3.00\times10^8\,\mathrm{m\,s^{-1}}$`);
   }
   if(f===1){
    rule='Snell’s law uses angles from the normal. Entering higher-index glass bends the ray toward the normal; use degree mode.';
    arithmetic=r`\sin\theta_1=\sin${i*2}^\circ\approx${n(Math.sin(deg(i*2)))},\quad\sin\theta_2\approx${n(Math.sin(deg(i*2))/1.5)},\quad\theta_2\approx${n(q.answer)}^\circ`;
    inverse=v=>check(r`n_{2,\rm implied}=\frac{n_1\sin\theta_1}{\sin\theta_{2,\rm choice}}=\frac{\sin${i*2}^\circ}{\sin${n(v)}^\circ}\approx${n(Math.sin(deg(i*2))/Math.sin(deg(v)))}`,r`$n_2=1.50$`);
   }
   if(f===2){
    const index=1.2+i*.02;
    rule='At the critical angle, the refracted angle is 90 degrees. A critical angle exists here because light travels from higher to lower index.';
    arithmetic=r`\sin\theta_c=\frac1{${index.toFixed(2)}}\approx${n(1/index)},\quad\theta_c=\sin^{-1}(${n(1/index)})\approx${n(q.answer)}^\circ`;
    inverse=v=>v>=90?'This choice is at least 90 degrees from the normal. The critical angle for these unequal finite indices must lie strictly between 0 and 90 degrees.':check(r`n_{1,\rm implied}=\frac{n_2}{\sin\theta_{c,\rm choice}}=\frac1{\sin${n(v)}^\circ}\approx${n(1/Math.sin(deg(v)))}`,r`$n_1=${index.toFixed(2)}$`);
   }
  }
  if(!arithmetic||!rule||!inverse)throw Error('Missing numerical teaching: '+q.id);
  const choices=[1,1.25,.5,2].map(factor=>fmt(q.answer*factor)+' '+q.unit);
  const reasons=choices.map((choice,index)=>index===0?rule+' The substitution and arithmetic below give this value.':inverse(parseFloat(choice)));
  const steps=[...q.steps.slice(0,2),...(conversion?[{title:'Convert the units before calculating',tex:conversion}]:[]),...q.steps.slice(2,4),{title:'Evaluate the intermediate values',tex:arithmetic},...q.steps.slice(4)];
  return {reasons,steps,explanation:rule};
 }
 window.PhysicsNumericalFeedback={make};
 window.PhysicsPractice.forEach(q=>Object.assign(q,make(q)));
})();
