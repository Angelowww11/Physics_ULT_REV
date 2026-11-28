/* Full explanations for the unchanged 600 numerical questions and answer values. */
(()=>{
 const r=String.raw;
 const number=value=>{if(value===0)return '0';if(Math.abs(value)<.001||Math.abs(value)>=1e6){const [a,b]=value.toExponential(6).split('e');return `${Number(a)}\\times10^{${Number(b)}}`;}return String(Number(value.toPrecision(7)));};
 const units={'kg/m³':r`\mathrm{kg\,m^{-3}}`,'m/s²':r`\mathrm{m\,s^{-2}}`,'N/C':r`\mathrm{N\,C^{-1}}`,'μF':r`\mu\mathrm F`,'°':r`{}^\circ`,'°F':r`{}^\circ\mathrm F`,'Ω':r`\Omega`};
 window.PhysicsPractice.forEach(q=>{
  const i=Math.floor((Number(q.id.split('q')[1])-1)/3)+1,family=(Number(q.id.split('q')[1])-1)%3;
  const data={
   1:[
    ['Average density','Use the stated mass and the whole object volume.',r`m=${i+2}\,\mathrm{kg},\quad V=${number((i+2)/1000)}\,\mathrm{m^3}`,r`m=\rho V\quad\Longrightarrow\quad\rho=\frac mV`,'The result has units kg/m³. Mass divided by volume describes average density, not relative density.'],
    ['Gauge pressure at depth','The fluid is stationary and its density is treated as constant.',r`\rho=1000\,\mathrm{kg\,m^{-3}},\quad h=${i*.5}\,\mathrm m`,r`P-P_0=\rho gh`,'This is pressure above the surface pressure. Add the atmosphere only if absolute pressure is requested.'],
    ['Buoyant force','Use the volume of displaced fluid, rather than an unsupported assumption about body mass.',r`V_{\mathrm{disp}}=${number((i+2)/1000)}\,\mathrm{m^3}`,r`F_B=\rho_{\mathrm f}gV_{\mathrm{disp}}`,'The force is upward. Being submerged does not by itself establish that buoyancy equals the body’s weight.']
   ],
   2:[
    ['Fahrenheit temperature','This is a temperature reading, so the Celsius–Fahrenheit offset is needed.',r`T_C=${i*3}\,{}^\circ\mathrm C`,r`T_F=\frac95T_C+32`,'The 32-degree offset belongs to readings. A temperature change would instead obey $\\Delta T_F=(9/5)\\Delta T_C$.'],
    ['Length increase','The coefficient describes linear expansion and the temperature change is already in kelvins.',r`\alpha=12\times10^{-6}\,\mathrm{K^{-1}},\quad L_0=${i+1}\,\mathrm m,\quad\Delta T=20\,\mathrm K`,r`L_f=L_0(1+\alpha\Delta T)\quad\Longrightarrow\quad\Delta L=\alpha L_0\Delta T`,'The question asks for the increase, not the final length. Add L0 only when final length is requested.'],
    ['Heat absorbed','The problem explicitly excludes a phase change, so sensible heat applies.',r`m=${i/10}\,\mathrm{kg},\quad c=4186\,\mathrm{J\,kg^{-1}\,K^{-1}},\quad\Delta T=5\,\mathrm K`,r`Q=mc\Delta T`,'A positive temperature change gives positive absorbed heat. Latent heat is a separate term for a phase change.']
   ],
   3:[
    ['Charge after electron removal','Removing negative charges leaves a positive net charge.',r`N=${i}\times10^{10},\quad e=1.602\times10^{-19}\,\mathrm C`,r`Q=+Ne`,'The electron count is dimensionless. Charge conservation applies to the complete transfer, including where the electrons go.'],
    ['Coulomb-force magnitude','Use charge magnitudes for magnitude, then infer attraction from the opposite signs.',r`|q_1|=${i}\times10^{-9}\,\mathrm C,\quad |q_2|=10\times10^{-9}\,\mathrm C,\quad r=0.10\,\mathrm m`,r`F=\frac{k|q_1q_2|}{r^2}`,'The separation is squared. The forces on the pair have equal magnitudes and opposite directions.'],
    ['Force after doubling separation','The charges remain fixed, so only the inverse-square distance factor changes.',r`F_0=${i}\,\mathrm N,\quad r_{\mathrm{new}}=2r_0`,r`\frac{F_{\mathrm{new}}}{F_0}=\frac{r_0^2}{(2r_0)^2}=\frac14`,'A doubled separation gives one quarter of the original force, not one half.']
   ],
   4:[
    ['Point-charge field magnitude','The source charge is positive; its field points away from the source.',r`Q=${i}\times10^{-9}\,\mathrm C,\quad r=0.50\,\mathrm m`,r`E=\frac{F}{|q_{\mathrm{test}}|}=\frac{k|Q|}{r^2}`,'The field is a property of the source arrangement. Do not multiply by another test charge unless a force is requested.'],
    ['Electric-force magnitude','The test charge is positive, so force and electric field point in the same direction.',r`q=${i}\times10^{-6}\,\mathrm C,\quad E=200\,\mathrm{N\,C^{-1}}`,r`\vec F=q\vec E`,'C × (N/C) gives newtons. A negative test charge would reverse the direction, not the field itself.'],
    ['Acceleration in the stated model','Only the electric force is included; the problem tells you to ignore other forces.',r`q=${i}\times10^{-6}\,\mathrm C,\quad E=100\,\mathrm{N\,C^{-1}},\quad m=0.002\,\mathrm{kg}`,r`ma=qE\quad\Longrightarrow\quad a=\frac{qE}{m}`,'Dividing force by mass gives m/s². This is a hypothetical particle under the explicitly simplified force model.']
   ],
   5:[
    ['Potential relative to infinity','Keep the source charge sign; potential is a scalar.',r`Q=${i}\times10^{-9}\,\mathrm C,\quad r=0.25\,\mathrm m`,r`V=\frac{kQ}{r}`,'Potential is energy per unit charge, measured in volts. This positive source produces positive potential under the stated reference.'],
    ['Electric potential energy','The supplied potential is due to fixed sources, not the test charge’s own field.',r`q=${i}\times10^{-6}\,\mathrm C,\quad V=50\,\mathrm V`,r`U=qV`,'C × V gives joules. Potential and potential energy are different quantities, even when their signs agree here.'],
    ['Work done by the electric field','Distinguish field work from the potential-energy change.',r`q=${i}\times10^{-6}\,\mathrm C,\quad V_a=100\,\mathrm V,\quad V_b=40\,\mathrm V`,r`\Delta U=q(V_b-V_a),\quad W_{\mathrm{field}}=-\Delta U=q(V_a-V_b)`,'The positive charge moves toward lower potential, so its potential energy decreases and field work is positive.']
   ],
   6:[
    ['Charge on one capacitor plate','The requested magnitude is the charge on one plate, not the sum of both absolute plate charges.',r`C=${i}\times10^{-6}\,\mathrm F,\quad V=12\,\mathrm V`,r`C=\frac QV\quad\Longrightarrow\quad Q=CV`,'The two plate charges are +Q and −Q in the ideal model. Their algebraic sum is zero.'],
    ['Stored capacitor energy','Convert microfarads to farads before evaluating joules.',r`C=${i}\times10^{-6}\,\mathrm F,\quad V=10\,\mathrm V`,r`U=\int_0^Q\frac qC\,dq=\frac{Q^2}{2C}=\frac12CV^2`,'Retain the factor of one half and square the voltage. This is energy, not charge.'],
    ['Equivalent series capacitance','The initially neutral isolated intermediate node establishes equal series charge magnitudes.',r`C_1=${i}\,\mu\mathrm F,\quad C_2=${2*i}\,\mu\mathrm F`,r`\frac1{C_{\mathrm{eq}}}=\frac1{C_1}+\frac1{C_2}\quad\Longrightarrow\quad C_{\mathrm{eq}}=\frac{C_1C_2}{C_1+C_2}`,'The result stays in μF because both component capacitances use μF. It must be smaller than the smaller component.']
   ],
   7:[
    ['Current through an ohmic resistor','The given voltage is across the stated resistor.',r`V=12\,\mathrm V,\quad R=${i+2}\,\Omega`,r`V=IR\quad\Longrightarrow\quad I=\frac VR`,'At fixed voltage, a larger resistance gives a smaller current. The model assumes the stated ohmic resistance is applicable.'],
    ['Resistance of a uniform wire','The cross-sectional area is already given in square metres.',r`\rho=2\times10^{-8}\,\Omega\,\mathrm m,\quad L=${i}\,\mathrm m,\quad A=10^{-6}\,\mathrm{m^2}`,r`E=\rho J,\quad V=EL,\quad J=I/A\quad\Longrightarrow\quad R=\frac{\rho L}{A}`,'Resistivity and resistance are not the same quantity. Increasing area lowers resistance at fixed material and length.'],
    ['RC time constant','Convert the capacitance to farads and retain the circuit resistance in ohms.',r`R=1000\,\Omega,\quad C=${i}\times10^{-6}\,\mathrm F`,r`\tau_{RC}=RC`,'Ohm × farad gives seconds. The time constant is not the half-life; a decay half-life is τ ln 2.']
   ],
   8:[
    ['Force on a current-carrying wire','The wire segment is perpendicular to the field, so sin θ=1.',r`I=${i}\,\mathrm A,\quad L=0.20\,\mathrm m,\quad B=0.30\,\mathrm T`,r`F=ILB\sin\theta`,'This gives the magnitude. A full force direction needs the actual current and field directions.'],
    ['Force on a moving charge','The velocity is perpendicular to the field; use the charge magnitude for the requested magnitude.',r`q=${i}\times10^{-6}\,\mathrm C,\quad v=1000\,\mathrm{m\,s^{-1}},\quad B=0.10\,\mathrm T`,r`F=|q|vB\sin90^\circ`,'Magnetic force is perpendicular to the velocity and does no instantaneous work on the particle.'],
    ['Field of a long straight wire','The long-wire model applies at the stated perpendicular distance.',r`I=${i}\,\mathrm A,\quad r=0.10\,\mathrm m,\quad\mu_0=4\pi\times10^{-7}\,\mathrm{T\,m\,A^{-1}}`,r`B(2\pi r)=\mu_0I\quad\Longrightarrow\quad B=\frac{\mu_0I}{2\pi r}`,'The field falls as 1/r, not 1/r². The grip rule sets its circulation direction.']
   ],
   9:[
    ['Magnetic flux magnitude','Perpendicular to the loop’s plane means parallel to its area normal.',r`B=0.20\,\mathrm T,\quad A=${i/100}\,\mathrm{m^2},\quad\theta=0^\circ`,r`\Phi_B=\vec B\cdot\vec A=BA\cos\theta`,'Use the angle to the area normal. T × m² gives webers.'],
    ['Induced-emf magnitude','The field changes uniformly while area and orientation stay fixed.',r`N=${i*10},\quad A=0.020\,\mathrm{m^2},\quad |\Delta B|=0.40\,\mathrm T,\quad\Delta t=0.20\,\mathrm s`,r`|\mathcal E|=N\frac{|\Delta\Phi_B|}{\Delta t}=\frac{NA|\Delta B|}{\Delta t}`,'The question asks for a magnitude. To determine a signed emf or current direction, also specify the oriented normal and use Lenz’s law.'],
    ['RL time constant','Use the total series resistance with the stated inductance.',r`L=${i/100}\,\mathrm H,\quad R=2\,\Omega`,r`\tau_{RL}=\frac LR`,'H/Ω gives seconds. For a simple decay, one time constant leaves e⁻¹ of the initial current.']
   ],
   10:[
    ['Vacuum wavelength in nanometres','Calculate metres first, then convert the requested unit.',r`c=3.00\times10^8\,\mathrm{m\,s^{-1}},\quad f=${i+3}\times10^{14}\,\mathrm{Hz}`,r`c=f\lambda\quad\Longrightarrow\quad\lambda=\frac cf`,'Multiply the metre result by 10⁹ to obtain nanometres. A higher frequency gives a shorter vacuum wavelength.'],
    ['Refracted angle from the normal','The ray enters a higher-index medium from air.',r`n_1=1.00,\quad n_2=1.50,\quad\theta_1=${i*2}^\circ`,r`n_1\sin\theta_1=n_2\sin\theta_2\quad\Longrightarrow\quad\theta_2=\sin^{-1}\!\left(\frac{n_1}{n_2}\sin\theta_1\right)`,'Use degree mode. The ray bends toward the normal, so the refracted angle must be smaller than the incident angle.'],
    ['Critical angle from the normal','A critical angle exists here because light moves from higher to lower refractive index.',r`n_1=${(1.2+i*.02).toFixed(2)},\quad n_2=1.00`,r`n_1\sin\theta_c=n_2\sin90^\circ\quad\Longrightarrow\quad\theta_c=\sin^{-1}\!\left(\frac{n_2}{n_1}\right)`,'At the critical angle the refracted ray grazes the interface. Total internal reflection requires a greater incident angle.']
   ]
  }[q.module][family];
  const [target,conditions,givens,derivation,check]=data;
  q.steps=[
   {title:'Identify the requested quantity',text:target+'. '+conditions},
   {title:'Write the values and units',tex:givens},
   {title:'Choose and arrange the law',tex:derivation},
   {title:'Substitute the stated values',tex:q.workingTex},
   {title:'Calculate the answer',tex:number(q.answer)+r`\,`+(units[q.unit]||r`\mathrm{${q.unit}}`)},
   {title:'Check the interpretation',text:check}
  ];
 });
})();
