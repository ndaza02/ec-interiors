(function(){
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const closeBtn = document.getElementById('searchClose');
  const resultsEl = document.getElementById('searchResults');
  const openBtn = document.getElementById('openSearch');
  if(!overlay||!input||!openBtn) return;

  // Resolve product list from either shop.js (products) or products-data.js (window.PRODUCTS)
  function getList(){
    if (Array.isArray(window.PRODUCTS)) return window.PRODUCTS;
    try { if (typeof products !== 'undefined' && Array.isArray(products)) return products; } catch(_){}
    return [];
  }

  let fuse; let lastBuilt = 0; const REBUILD_MS = 1000;
  function getFuse(){
    const list = getList();
    const now = Date.now();
    if (!fuse || now - lastBuilt > REBUILD_MS) {
      if (typeof Fuse === 'undefined') return null;
      fuse = new Fuse(list, { keys:['name','description','category','style','material'], threshold:0.4 });
      lastBuilt = now;
    }
    return fuse;
  }

  function open(){ overlay.style.display='flex'; setTimeout(()=>input.focus(),50); render(''); }
  function close(){ overlay.style.display='none'; resultsEl.innerHTML=''; input.value=''; }

  function render(query){
    const list = getList();
    if(!query){ resultsEl.innerHTML = list.slice(0,8).map(tile).join(''); return; }
    const f = getFuse();
    if(!f){ resultsEl.innerHTML = '<div class="search-item">Search unavailable</div>'; return; }
    const hits = f.search(query).slice(0,12).map(r=>r.item);
    resultsEl.innerHTML = hits.map(tile).join('') || '<div class="search-item">No results</div>';
  }

  function tile(p){
    const price = (window.formatPrice? window.formatPrice(p.price): `$${p.price.toFixed(2)}`);
    return `<a class="search-item" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"><div><div><strong>${p.name}</strong></div><div>${price}</div></div></a>`;
  }

  let t; input.addEventListener('input', e=>{ clearTimeout(t); const q=e.target.value.trim(); t=setTimeout(()=>render(q),150); });
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
})();
