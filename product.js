(function(){
  function qs(k){ return new URLSearchParams(location.search).get(k); }
  const id = parseInt(qs('id')||'',10);
  const data = (window.PRODUCTS||[]).find(p=>p.id===id);

  const titleEl = document.getElementById('productTitle');
  const priceEl = document.getElementById('productPrice');
  const imgEl = document.getElementById('productImage');
  const skuEl = document.getElementById('productSku');
  const dimsEl = document.getElementById('productDims');
  const matEl = document.getElementById('productMaterial');
  const stockEl = document.getElementById('productStock');
  const descEl = document.getElementById('productDesc');
  const crumbEl = document.getElementById('crumbName');
  const qtyEl = document.getElementById('qtyInput');
  const addBtn = document.getElementById('addToCartBtn');

  if(!data){
    titleEl.textContent = 'Product Not Found';
    document.querySelector('.product-grid').style.display='block';
    document.querySelector('.product-grid').innerHTML = '<p>Sorry, this product could not be found.</p>';
    return;
  }

  function fmt(n){ return (window.formatPrice? window.formatPrice(n): `$${n.toFixed(2)}`); }

  titleEl.textContent = data.name;
  crumbEl.textContent = data.name;
  priceEl.textContent = fmt(data.price);
  imgEl.src = data.image; imgEl.alt = data.name;
  skuEl.textContent = data.sku;
  dimsEl.textContent = data.dimensions;
  matEl.textContent = data.material;
  stockEl.textContent = `${data.inStock} in stock`;
  descEl.textContent = data.description;

  addBtn.addEventListener('click',()=>{
    const qty = Math.max(1, parseInt(qtyEl.value||'1',10));
    if(window.cart){
      window.cart.addItem(data, qty);
      window.openCartSidebar();
    }
  });
})();
