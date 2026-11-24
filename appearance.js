// Set the saved appearance before the first frame to avoid a light-mode flash.
(() => {
  try {
    const p=JSON.parse(localStorage.getItem('field-notes-look-v1')||'{}');
    const mode=['light','dark','system'].includes(p.mode)?p.mode:'system';
    document.documentElement.dataset.mode=mode==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;
    document.documentElement.dataset.palette=['violet','lagoon','peach'].includes(p.palette)?p.palette:'lagoon';
    if(p.reduceMotion)document.documentElement.dataset.reduceMotion='true';
    if(p.largeText)document.documentElement.dataset.largeText='true';
  }catch{document.documentElement.dataset.mode='light';document.documentElement.dataset.palette='violet';}
})();
