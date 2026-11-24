(() => {
  'use strict';
  const KEY='field-notes-look-v1';
  const paths={
    home:'m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
    book:'M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1m0-15c3-2 6-2 10-1v15c-4-1-7-1-10 1zm0 0v15',
    spark:'m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7z',
    grid:'M4 3h6v7H3V4a1 1 0 0 1 1-1zm10 0h7v7h-7zm0 11h7v6a1 1 0 0 1-1 1h-6zM3 14h7v7H3z',
    chart:'M4 21V13h4v8m2 0V7h4v14m2 0V3h4v18M2 21h20',
    keyboard:'M3 5h18v14H3zM6 9h1m4 0h1m4 0h1M6 12h1m4 0h1m4 0h1M7 16h10',
    cards:'m7 3 14 3-3 15-14-3zM4 5 2 17',
    loop:'M20 7v5h-5M4 17v-5h5m11 0a8 8 0 0 0-14-6m-2 6a8 8 0 0 0 14 6',
    clock:'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M9 2h6',
    path:'M6 3v5a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v7M3 5l3-3 3 3m6 13 3 3 3-3',
    palette:'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.5 1.5 0 0 1 1.1-2.5H18a4 4 0 0 0 4-4c0-4-4.5-8.2-10-8.2M7 9h.01M11 6h.01M16 7h.01M6 13h.01',
    sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1',
    moon:'M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13',
    monitor:'M3 4h18v13H3zM8 21h8m-4-4v4',
    medal:'m8 3 4 6 4-6M5 3l4 7m10-7-4 7m3 6a6 6 0 1 1-12 0 6 6 0 0 1 12 0m-6-3v6m-3-3h6',
    check:'m5 12 4 4L19 6',
    chevron:'m9 5 7 7-7 7'
  };
  function icon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.spark}"/></svg>`;}
  let prefs={mode:'system',palette:'lagoon',reduceMotion:false,largeText:false};
  try{const p=JSON.parse(localStorage.getItem(KEY)||'{}');if(['light','dark','system'].includes(p.mode))prefs.mode=p.mode;if(['violet','lagoon','peach'].includes(p.palette))prefs.palette=p.palette;prefs.reduceMotion=!!p.reduceMotion;prefs.largeText=!!p.largeText;}catch{}
  const media=matchMedia('(prefers-color-scheme: dark)');
  function apply(){
    const mode=prefs.mode==='system'?(media.matches?'dark':'light'):prefs.mode;
    const html=document.documentElement;html.dataset.mode=mode;html.dataset.palette=prefs.palette;html.dataset.reduceMotion=String(prefs.reduceMotion);html.dataset.largeText=String(prefs.largeText);
    document.querySelector('meta[name="theme-color"]').content=mode==='dark'?'#171d30':'#f6f5fb';
    document.querySelectorAll('[name="appearance-mode"]').forEach(el=>el.checked=el.value===prefs.mode);
    document.querySelectorAll('[name="appearance-palette"]').forEach(el=>el.checked=el.value===prefs.palette);
    document.querySelector('#reduce-motion').checked=prefs.reduceMotion;document.querySelector('#large-text').checked=prefs.largeText;
    const label=document.querySelector('#appearance-open');label.innerHTML=icon(mode==='dark'?'moon':'palette');label.title='Choose a theme';
    try{localStorage.setItem(KEY,JSON.stringify(prefs));}catch{}
  }
  const appearance=document.createElement('dialog');appearance.id='appearance-dialog';appearance.setAttribute('aria-labelledby','appearance-title');
  appearance.innerHTML=`<div class="dialog-head"><span class="eyebrow">MAKE YOURSELF AT HOME</span><button class="icon-button" id="appearance-close" aria-label="Close appearance settings">×</button></div><h2 id="appearance-title">Your study space,<br>your kind of cozy.</h2><p>Pick a look that feels comfortable. We’ll remember it on this device.</p><fieldset class="look-fieldset"><legend>Lights on or lights off?</legend><div class="mode-picker">${[['light','sun','Light'],['dark','moon','Dark'],['system','monitor','Auto']].map(([value,im,label])=>`<label><input type="radio" name="appearance-mode" value="${value}"><span>${icon(im)}<b>${label}</b></span></label>`).join('')}</div></fieldset><fieldset class="look-fieldset"><legend>A color for your mood</legend><div class="palette-picker">${[['violet','Daydream'],['lagoon','Lagoon'],['peach','Peach club']].map(([value,label])=>`<label><input type="radio" name="appearance-palette" value="${value}"><span class="palette-dots ${value}" aria-hidden="true"><i></i><i></i><i></i></span><strong>${label}</strong><span class="palette-check" aria-hidden="true">✓</span></label>`).join('')}</div></fieldset><label class="comfort-option"><span><strong>Roomier reading</strong><small>Bigger explanations and lesson text</small></span><input type="checkbox" id="large-text"></label><label class="comfort-option"><span><strong>Quiet motion</strong><small>Keep the movements to a minimum</small></span><input type="checkbox" id="reduce-motion"></label><button class="primary blue" id="appearance-done">Looks good. Let’s study →</button>`;
  document.body.append(appearance);
  document.querySelector('#appearance-open').onclick=()=>appearance.showModal();
  document.querySelector('#appearance-close').onclick=document.querySelector('#appearance-done').onclick=()=>appearance.close();
  appearance.addEventListener('change',event=>{const el=event.target;if(el.name==='appearance-mode')prefs.mode=el.value;if(el.name==='appearance-palette')prefs.palette=el.value;if(el.id==='large-text')prefs.largeText=el.checked;if(el.id==='reduce-motion')prefs.reduceMotion=el.checked;apply();});
  media.addEventListener('change',apply);apply();

})();
