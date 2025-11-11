(function(){
  const langMap = { en:'English', es:'Español', fr:'Français', de:'Deutsch', it:'Italiano', ja:'日本語' };
  async function loadDict(lang){
    try { const res = await fetch(`i18n/${lang}.json`); if(!res.ok) throw new Error('fetch'); return await res.json(); }
    catch { if(lang!=='en'){ return loadDict('en'); } return {}; }
  }
  function applyDict(dict){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      if(dict[key]) el.setAttribute('placeholder', dict[key]);
    });
    const btn = document.getElementById('languageBtn');
    if(btn){ const current = localStorage.getItem('language')||'en'; btn.textContent = langMap[current]||current; }
  }
  async function setLang(lang){
    const dict = await loadDict(lang);
    applyDict(dict);
  }
  async function init(){
    const current = localStorage.getItem('language')||'en';
    await setLang(current);
  }
  const orig = window.changeLanguage;
  window.changeLanguage = async function(newLang){
    if(typeof orig === 'function'){ orig(newLang); }
    await setLang(newLang);
  }
  window.applyTranslations = () => init();
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('storage', (e)=>{ if(e.key==='language'){ init(); }});
})();
