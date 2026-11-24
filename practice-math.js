/* Presentation only. The numerical answers and saved option values stay in practice-data.js. */
window.PhysicsPractice.forEach(q=>{
  const i=Math.floor((Number(q.id.split('q')[1])-1)/3)+1;
  const family=(Number(q.id.split('q')[1])-1)%3;
  const raw=String.raw;
  const laws={
    1:[raw`\rho=\frac mV`,raw`\Delta P=\rho gh`,raw`F_B=\rho_{\mathrm{fluid}}gV_{\mathrm{displaced}}`],
    2:[raw`T_F=\frac95T_C+32`,raw`\Delta L=\alpha L_0\Delta T`,raw`Q=mc\Delta T`],
    3:[raw`Q=Ne`,raw`F=\frac{k|q_1q_2|}{r^2}`,raw`\frac{F_{\mathrm{new}}}{F_{\mathrm{old}}}=\left(\frac{r_{\mathrm{old}}}{r_{\mathrm{new}}}\right)^2`],
    4:[raw`E=\frac{k|Q|}{r^2}`,raw`F=|q|E`,raw`a=\frac{|q|E}{m}`],
    5:[raw`V=\frac{kQ}{r}`,raw`U=qV`,raw`W_{\mathrm{field}}=q(V_a-V_b)`],
    6:[raw`Q=CV`,raw`U=\frac12CV^2`,raw`C_{\mathrm{eq}}=\frac{C_1C_2}{C_1+C_2}`],
    7:[raw`I=\frac VR`,raw`R=\frac{\rho L}{A}`,raw`\tau_{RC}=RC`],
    8:[raw`F=ILB\sin\theta`,raw`F=|q|vB\sin\theta`,raw`B=\frac{\mu_0I}{2\pi r}`],
    9:[raw`\Phi=BA\cos\theta`,raw`|\mathcal E|=\frac{NA|\Delta B|}{\Delta t}`,raw`\tau_{RL}=\frac LR`],
    10:[raw`\lambda=\frac cf`,raw`\theta_2=\sin^{-1}\left(\frac{n_1\sin\theta_1}{n_2}\right)`,raw`\theta_c=\sin^{-1}\left(\frac{n_2}{n_1}\right)`]
  };
  const working={
    1:[raw`\frac{${i+2}}{${((i+2)/1000).toFixed(3)}}`,raw`1000\times9.81\times${i/2}`,raw`1000\times9.81\times${((i+2)/1000).toFixed(3)}`],
    2:[raw`${i*3}\times\frac95+32`,raw`12\times10^{-6}\times${i+1}\times20`,raw`${i/10}\times4186\times5`],
    3:[raw`${i}\times10^{10}\times1.602\times10^{-19}`,raw`\frac{(8.99\times10^9)(${i}\times10^{-9})(10\times10^{-9})}{0.10^2}`,raw`\frac{${i}}{2^2}`],
    4:[raw`\frac{(8.99\times10^9)(${i}\times10^{-9})}{0.50^2}`,raw`${i}\times10^{-6}\times200`,raw`\frac{(${i}\times10^{-6})(100)}{0.002}`],
    5:[raw`\frac{(8.99\times10^9)(${i}\times10^{-9})}{0.25}`,raw`${i}\times10^{-6}\times50`,raw`${i}\times10^{-6}\times(100-40)`],
    6:[raw`${i}\times10^{-6}\times12`,raw`\frac12(${i}\times10^{-6})(10^2)`,raw`\frac{${i}\times${2*i}}{${i}+${2*i}}`],
    7:[raw`\frac{12}{${i+2}}`,raw`\frac{(2\times10^{-8})(${i})}{10^{-6}}`,raw`1000\times${i}\times10^{-6}`],
    8:[raw`${i}\times0.20\times0.30\times\sin90^\circ`,raw`${i}\times10^{-6}\times1000\times0.10`,raw`\frac{(4\pi\times10^{-7})(${i})}{2\pi\times0.10}`],
    9:[raw`0.20\times${i/100}\times\cos0^\circ`,raw`\frac{(${i*10})(0.020)(0.40)}{0.20}`,raw`\frac{${i/100}}{2}`],
    10:[raw`\frac{3.00\times10^8}{${i+3}\times10^{14}}\times10^9\ \mathrm{nm}`,raw`\sin^{-1}\left(\frac{\sin${i*2}^\circ}{1.50}\right)`,raw`\sin^{-1}\left(\frac1{${(1.2+i*.02).toFixed(2)}}\right)`]
  };
  q.lawTex=laws[q.module][family];
  q.workingTex=working[q.module][family];
});
