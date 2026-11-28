const assert = require('node:assert/strict');
// Reading explanations are separate from the unchanged practice-question bank.
const foundations = {
  1: [
    'The force balance determines the tension in the bottom tether.',
    'The comparison determines the water-level change when the stone moves from the floating boat to the tank bottom.',
    'The comparison explains buoyancy at different depths for the same fully submerged rigid block.',
    'The pressure difference across the hatch determines its net force.',
    'The piston area ratio connects the output force and travel to the input force and travel.'
  ],
  2: [
    'The expansion model describes the circular hole to first order.',
    'The energy balance identifies the equilibrium phase and temperature when some ice remains.',
    'The first law connects positive work on the gas to its internal-energy change during adiabatic compression.',
    'The small-expansion model compares the liquid volume with the vessel capacity after heating.',
    'The cycle balance relates total heat and total work by the system when the internal energy returns to its initial value.'
  ],
  3: [
    'Charge conservation determines the final charges and their electric interaction after separation.',
    'Superposition determines the new net force after the positive test charge becomes a negative charge with twice its magnitude.',
    'Newton’s third law relates the mutual forces; the different masses determine the accelerations.',
    'Vector addition combines the perpendicular electric forces without adding their magnitudes directly.',
    'The grounding sequence determines the conductor’s final net charge.'
  ],
  4: [
    'The zero net field determines the instantaneous electric force at the midpoint; stability needs a separate displacement analysis.',
    'The charge sign and electric-field direction determine the initial change in the particle’s speed.',
    'The particle retains horizontal motion while the vertical electric force changes its vertical velocity.',
    'The line density represents the relative electric-field magnitude.',
    'The far-field dipole law determines the magnitude change when the observation distance doubles along a fixed direction.'
  ],
  5: [
    'The midpoint illustrates zero potential with a nonzero electric field for an equal positive–negative charge pair.',
    'Energy conservation determines the kinetic-energy change as the negative charge moves to higher potential.',
    'The work balance relates external work, electric work, and potential-energy change during slow motion.',
    'A common shift of the potential reference leaves measurable fields and endpoint work unchanged.',
    'The pair-energy sum counts each distinct pair once, without counting both ordered versions.'
  ],
  6: [
    'Charge conservation determines the voltage and stored energy after the dielectric enters the isolated capacitor.',
    'The energy balance includes battery work, increased capacitor energy, and mechanical work during dielectric insertion at fixed voltage.',
    'Charge conservation determines the final common voltage; the connection resistance accounts for the field-energy decrease.',
    'The initially neutral middle node determines the series charge magnitudes and the voltage division between unequal capacitances.',
    'The isolated-capacitor model determines the new capacitance, voltage, and energy when the gap doubles.'
  ],
  7: [
    'The length and area changes determine the current after stretching at fixed volume, resistivity, and applied voltage.',
    'The battery model determines the delivered current and terminal voltage as the external resistance increases.',
    'Capacitor-voltage continuity determines the electrical state immediately after switching.',
    'A negative calculated branch current indicates motion opposite the chosen positive direction.',
    'The parallel-circuit model distinguishes the unchanged remaining-branch current from the reduced total source current.'
  ],
  8: [
    'The parallel and perpendicular velocity components explain the helical path and the constant speed.',
    'The radius ratio compares the heavier particle with the lighter particle at equal kinetic energy and charge magnitude.',
    'Reversing the charge sign reverses the magnetic-force direction while preserving the radius magnitude under the stated conditions.',
    'The loop orientation determines the torque relative to its maximum possible magnitude.',
    'The wire field and magnetic force explain the interaction between parallel currents in the same direction.'
  ],
  9: [
    'The rotating-loop model compares instantaneous flux with induced emf when the flux is zero.',
    'Lenz’s law determines the induced conventional-current direction, viewed from the front, as the outward field decreases.',
    'Faraday’s law determines the time integral of the induced emf over the entire interval when the initial flux returns.',
    'The constant final core flux determines the secondary induced emf after the DC transient ends.',
    'Inductor-current continuity determines the current immediately after switching into the closed resistor loop.'
  ],
  10: [
    'The stationary-boundary model distinguishes unchanged frequency and photon energy from changed speed and wavelength.',
    'The angle measured from the glass surface converts to the incident angle measured from the normal.',
    'The critical-angle condition determines the refracted ray direction in the ideal ray model.',
    'The transmission condition explains a calculated final sine greater than one across parallel layers.',
    'The one-photon energy threshold explains the result of doubling intensity at fixed, below-threshold frequency.'
  ]
};
const applications = {
  'manometer': 'The signed gauge result converts to absolute gas pressure by adding atmospheric pressure once.',
  'interface-block': 'Removing the support changes the equilibrium position; the lower-liquid displaced volume controls the buoyancy increase.',
  'raised-hydraulic': 'The different piston elevations introduce a hydrostatic pressure difference in addition to the applied pressure change.',
  'weighing-liquids': 'The equal-displaced-volume comparison depends on keeping the immersed volume unchanged.',
  'raft-freeboard': 'The freeboard comparison uses the same extra dry load in denser water.',
  'metal-calorimeter': 'The full heat balance includes the calorimeter as well as the metal and water.',
  'steam-water': 'The final temperature must agree with the assumed phase sequence and the 100°C condensation condition.',
  'cold-ice': 'The available heat determines whether the final state needs an ice–water mixture calculation or an all-liquid temperature calculation.',
  'composite-wall': 'The steady interface condition connects the heat-transfer rates through both layers.',
  'signed-cycle': 'The complete cycle can have nonzero net work while its internal-energy change is zero.',
  'collinear-forces': 'Changing only the target-charge sign reverses the electric-force vector immediately.',
  'triangle-forces': 'The symmetry and force components explain the cancellation of horizontal forces.',
  'sequential-contact': 'Charge conservation uses the updated charges immediately before the second contact.',
  'charged-pendulums': 'The geometry distinguishes the bead separation from the string length.',
  'square-vector': 'The diagonal source-to-target distance differs from the square side length.',
  'field-components': 'Changing only the test-particle charge from negative to positive reverses its force, while the source field stays unchanged.',
  'turning-electron': 'The highest-point analysis distinguishes zero vertical velocity from nonzero electric acceleration.',
  'opposite-zero': 'The field directions rule out a zero-field point between the opposite-sign sources.',
  'ring-axis': 'Symmetry explains the zero field at the center of the charged ring.',
  'exact-dipole': 'Vector superposition explains the nonzero equatorial field of the dipole.',
  'two-source-potential': 'Scalar addition combines source potentials without resolving them into vector components.',
  'uniform-energy': 'The conservative electric field gives the same work along a longer curved route between the same endpoints.',
  'square-assembly': 'The addition work uses the potential from the existing charges, excluding the newly added charge’s own potential.',
  'retarding-electron': 'The electron’s negative charge explains its slowing as the potential decreases.',
  'potential-gradient': 'Adding 100 V everywhere changes the potential reference while preserving the field and potential differences.',
  'cap-mixed': 'The common connection nodes determine the equal voltage across the parallel capacitor pair.',
  'area-dielectric': 'The side-by-side dielectric regions share a voltage and form parallel capacitances.',
  'isolated-geometry': 'Conservation of charge connects the initial and final states of the isolated capacitor.',
  'opposite-share': 'The connection conserves charge; the field-energy decrease belongs in the complete energy balance.',
  'stacked-dielectrics': 'The successive dielectric layers along the field identify the series arrangement.',
  'loaded-divider': 'The load changes the effective divider resistance and therefore its output voltage.',
  'heated-wire': 'The fixed-temperature condition keeps the stated resistivity applicable during the electrical calculation.',
  'rc-initial': 'The source voltage and the initial capacitor voltage determine the sign of the initial resistor current.',
  'opposing-loop': 'The current direction relative to the smaller source’s positive terminal determines its absorbed electrical power.',
  'maximum-load': 'The source model distinguishes maximum load power from maximum efficiency.',
  'selector-radius': 'The electric and magnetic forces cease to cancel for an off-speed proton in the selector.',
  'levitated-wire': 'Reversing only the current direction reverses the magnetic force while the geometry and field stay fixed.',
  'loop-energy': 'The torque angle lies between the field and the loop normal, with a complementary angle to the loop plane.',
  'opposite-wires': 'The right-hand field directions explain why the source-wire fields reinforce between the wires.',
  'helix-inverse': 'Increasing only the parallel velocity increases the pitch without changing the radius for the same particle and field.',
  'rl-initial': 'An initial current above the new steady current decreases immediately after switching.',
  'rl-decay-energy': 'The inductor’s stored magnetic energy maintains current while the resistor dissipates energy after source removal.',
  'mutual-ramp': 'The mutual inductance already includes flux linkage, so its emf law does not need another turn-count factor.',
  'rod-battery': 'When the battery emf exceeds the motional emf, the constant-speed balance determines the external agent’s braking action.',
  'transformer-loss': 'The unity primary power factor connects the real input power with the primary rms current.',
  'fiber-acceptance': 'The higher core index permits total internal reflection at the core–cladding boundary in this model.',
  'slab-offset': 'Parallel faces and the same outside medium restore the original emerging-ray direction in air.',
  'two-color-photoelectric': 'The same emitting material has one work function for both colors in the stated photoelectric model.',
  'inverse-refraction': 'The stationary interface preserves the light frequency while its speed and wavelength change.',
  'photon-budget': 'Doubling the laser power at fixed wavelength doubles the photon rate when all stated fractions remain constant.'
};
const numericalQuestions = {
  m1h7: 'The calculation determines the fraction of the block volume submerged after loading.',
  m1h9: 'The calculation determines the rise of the large piston.',
  m3h8: 'The calculation determines the x-coordinate between the sources where the test charge has zero net electric force.',
  m4h8: 'The calculation determines the travel distance before the particle first stops.'
};
function readingTopic(q) {
  const titles={m6h2:'The source’s role during connected dielectric insertion',m10h1:'Constant frequency during refraction',m10h2:'The angle convention in Snell’s law'};
  return titles[q.id]||q.topic.replace(/\b[Ff]ind /g,'').replace(' · model check',' · model and interpretation');
}
function narrative(text) {
  return text.replace(/\b([Ff])ind\b/g,(_,c)=>c==='F'?'The calculation determines':'the calculation determines')
    .replace(/\bPredict the scale reading/g,'The calculation predicts the scale reading')
    .replace('Test whether all ice melts before finding equilibrium.','The phase check establishes whether all ice melts before the equilibrium calculation.')
    .replace(/\bEvaluate instantaneous quantities with the quasistatic model\./g,'The instantaneous calculation uses the quasistatic model.')
    .replace(/\bEvaluate the external field at/g,'The external-field calculation uses')
    .replace(/\bEvaluate at/g,'The calculation uses the state at');
}
function readingPrompt(q) {
  if(q.kind==='numerical') {
    let text=narrative(q.prompt);
    if(text.includes('?')) {
      assert(numericalQuestions[q.id], 'Missing numerical reading statement: '+q.id);
      text=text.replace(/[^.!?]*\?/, ' '+numericalQuestions[q.id]);
    }
    assert(!text.includes('?'),q.id);
    return text.trim();
  }
  const focus=q.scenario?applications[q.scenario]:foundations[q.module][Number(q.id.split('h')[1])-1];
  assert(focus,'Missing concept reading statement: '+q.id);
  assert(/[^.!?]*\?$/.test(q.prompt),'Unexpected question boundary: '+q.id);
  return narrative(q.prompt.replace(/[^.!?]*\?$/, '').trim())+'\n\n'+focus;
}
module.exports={readingPrompt,readingTopic};
