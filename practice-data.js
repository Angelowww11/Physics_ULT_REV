/* Deterministic numerical variants. Every answer is computed from the stated law. */
window.PhysicsPractice=(()=>{
const k=8.99e9,e=1.602e-19,eps=8.85e-12,mu=4*Math.PI*1e-7;
const all=[],add=(module,page,given,ask,answer,unit,law,working)=>{all.push({id:`m${module}q${all.filter(q=>q.module===module).length+1}`,module,page,prompt:given+' '+ask,answer,unit,law,working});};
for(let i=1;i<=20;i++){
let m=2+i,V=(i+2)/1000,h=i*.5,A=.001*i,q=i*1e-9,r=.1+i*.02;
add(1,7,`Mass is ${m} kg; volume is ${V.toFixed(3)} m³.`,'Find density.',m/V,'kg/m³','ρ = m/V',`${m}/${V}`);
add(1,17,`Freshwater density is 1000 kg/m³; depth is ${h} m; g = 9.81 m/s².`,'Find gauge pressure.',1000*9.81*h,'Pa','ΔP = ρgh',`1000 × 9.81 × ${h}`);
add(1,32,`A body displaces ${V.toFixed(3)} m³ of freshwater (density 1000 kg/m³); g = 9.81 m/s².`,'Find buoyant force.',1000*9.81*V,'N','FB = ρfluid g Vdisplaced',`1000 × 9.81 × ${V}`);
add(2,7,`Temperature is ${i*3} °C.`,'Convert to Fahrenheit.',i*3*9/5+32,'°F','TF = (9/5) TC + 32',`${i*3} × 9/5 + 32`);
add(2,10,`A ${i+1} m rod has α = 12 × 10⁻⁶ K⁻¹ and warms by 20 K.`,'Find its length INCREASE.',(i+1)*12e-6*20,'m','ΔL = αL₀ΔT',`12 × 10⁻⁶ × ${i+1} × 20`);
add(2,27,`Water mass is ${((i/10)).toFixed(1)} kg; c = 4186 J/(kg·K); temperature rises 5 K without a phase change.`,'Find heat absorbed.',(i/10)*4186*5,'J','Q = mcΔT',`${(i/10)} × 4186 × 5`);
add(3,8,`${i} × 10¹⁰ electrons are removed from a neutral body. Use e = 1.602 × 10⁻¹⁹ C.`,'Find its positive charge magnitude.',i*1e10*e,'C','Q = Ne',`${i} × 10¹⁰ × 1.602 × 10⁻¹⁹`);
add(3,22,`Charges +${i} nC and −10 nC are 0.10 m apart. Use k = 8.99 × 10⁹.`,'Find force magnitude.',k*q*10e-9/.1**2,'N','F = k|q₁q₂|/r²',`8.99 × 10⁹ × ${i} × 10⁻⁹ × 10 × 10⁻⁹ / 0.10²`);
add(3,19,`An original Coulomb force is ${i} N. Both charge values stay constant while the distance doubles.`,'Find the new force magnitude.',i/4,'N','Fnew/Fold = (rold/rnew)²',`${i}/2²`);
add(4,29,`A point source is +${i} nC. Evaluate its field 0.50 m away. Use k = 8.99 × 10⁹.`,'Find field magnitude.',k*q/.5**2,'N/C','E = k|Q|/r²',`8.99 × 10⁹ × ${i} × 10⁻⁹ / 0.50²`);
add(4,12,`A positive ${i} μC test charge is in a 200 N/C field.`,'Find force magnitude.',i*1e-6*200,'N','F = |q|E',`${i} × 10⁻⁶ × 200`);
add(4,25,`A 0.002 kg hypothetical particle carries +${i} μC in a uniform 100 N/C field. Ignore other forces.`,'Find acceleration magnitude.',i*1e-6*100/.002,'m/s²','a = |q|E/m',`${i} × 10⁻⁶ × 100 / 0.002`);
add(5,32,`A +${i} nC source is 0.25 m from the field point. Choose zero potential at infinity; k = 8.99 × 10⁹.`,'Find potential.',k*q/.25,'V','V = kQ/r',`8.99 × 10⁹ × ${i} × 10⁻⁹ / 0.25`);
add(5,22,`A +${i} μC test charge is at a point whose potential due to fixed sources is 50 V.`,'Find its potential energy.',i*1e-6*50,'J','U = qV',`${i} × 10⁻⁶ × 50`);
add(5,29,`A +${i} μC charge moves from 100 V to 40 V in an electrostatic field.`,'Find work DONE BY THE FIELD.',i*1e-6*60,'J','Wfield = q(Va − Vb)',`${i} × 10⁻⁶ × (100 − 40)`);
add(6,8,`A ${i} μF capacitor has 12 V across its terminals.`,'Find charge magnitude on one plate.',i*1e-6*12,'C','Q = CV',`${i} × 10⁻⁶ × 12`);
add(6,15,`A ${i} μF capacitor is charged to 10 V.`,'Find stored energy.',.5*i*1e-6*100,'J','U = ½CV²',`0.5 × ${i} × 10⁻⁶ × 10²`);
add(6,21,`Capacitors ${i} μF and ${(i*2)} μF are in series with an initially neutral isolated intermediate node.`,'Find equivalent capacitance in μF.',i*2*i/(3*i),'μF','Ceq = C₁C₂/(C₁+C₂)',`${i} × ${2*i} / (${i} + ${2*i})`);
add(7,29,`A ${i+2} Ω ohmic resistor has 12 V across it.`,'Find current.',12/(i+2),'A','I = V/R',`12/${i+2}`);
add(7,26,`A uniform wire has resistivity 2 × 10⁻⁸ Ω·m, length ${i} m, and area 1 × 10⁻⁶ m².`,'Find resistance.',2e-8*i/1e-6,'Ω','R = ρL/A',`2 × 10⁻⁸ × ${i} / 10⁻⁶`);
add(7,79,`A ${i} μF capacitor discharges through 1000 Ω.`,'Find the RC time constant.',1000*i*1e-6,'s','τRC = RC',`1000 × ${i} × 10⁻⁶`);
add(8,13,`A wire carries ${i} A through a 0.20 m segment perpendicular to a uniform 0.30 T field.`,'Find magnetic-force magnitude.',i*.2*.3,'N','F = ILB sinθ',`${i} × 0.20 × 0.30 × sin90°`);
add(8,17,`A +${i} μC particle moves perpendicular to 0.10 T at 1000 m/s.`,'Find magnetic-force magnitude.',i*1e-6*1000*.1,'N','F = |q|vB sinθ',`${i} × 10⁻⁶ × 1000 × 0.10`);
add(8,32,`A long straight wire carries ${i} A. Evaluate the field at 0.10 m; μ₀ = 4π × 10⁻⁷ T·m/A.`,'Find field magnitude.',mu*i/(2*Math.PI*.1),'T','B = μ₀I/(2πr)',`4π × 10⁻⁷ × ${i}/(2π × 0.10)`);
add(9,8,`A uniform 0.20 T field is perpendicular to a loop's ${(i/100)} m² area.`,'Find flux magnitude.',.2*(i/100),'Wb','Φ = BA cosθ',`0.20 × ${(i/100)} × cos0°`);
add(9,18,`A ${i*10}-turn coil has area 0.020 m². Its perpendicular field changes by 0.40 T uniformly in 0.20 s.`,'Find induced-emf magnitude.',i*10*.02*.4/.2,'V','|ℰ| = NA|ΔB|/Δt',`${i*10} × 0.020 × 0.40 / 0.20`);
add(9,44,`A coil has inductance ${(i/100)} H and total series resistance 2 Ω.`,'Find the RL time constant.',(i/100)/2,'s','τRL = L/R',`${(i/100)}/2`);
add(10,8,`Light in vacuum has frequency ${(i+3)} × 10¹⁴ Hz. Use c = 3.00 × 10⁸ m/s.`,'Find wavelength in nm.',3e8/((i+3)*1e14)*1e9,'nm','λ = c/f',`3.00 × 10⁸ / (${i+3} × 10¹⁴), then multiply metres by 10⁹`);
add(10,23,`A ray enters glass (n = 1.50) from air (n = 1.00) at ${i*2}° FROM THE NORMAL.`,'Find the refracted angle.',Math.asin(Math.sin(i*2*Math.PI/180)/1.5)*180/Math.PI,'°','θ₂ = asin[(n₁/n₂) sinθ₁]',`asin[sin(${i*2}°)/1.50]`);
add(10,28,`Light travels from index ${(1.2+i*.02).toFixed(2)} to air (index 1.00).`,'Find the critical angle from the normal.',Math.asin(1/(1.2+i*.02))*180/Math.PI,'°','θc = asin(n₂/n₁)',`asin[1/${(1.2+i*.02).toFixed(2)}]`);
}
return all.sort((a,b)=>a.module-b.module||Number(a.id.split('q')[1])-Number(b.id.split('q')[1]));
})();
