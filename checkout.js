(function(){
  function fmt(n){ return (window.formatPrice? window.formatPrice(n): `$${n.toFixed(2)}`); }
  const summaryEl = document.getElementById('summary');
  const grandEl = document.getElementById('grandTotal');
  const payBtn = document.getElementById('payBtn');
  const noteEl = document.getElementById('payNote');
  const agree = document.getElementById('agree');

  function render(){
    const items = (window.cart? window.cart.items: []);
    if(!items.length){
      summaryEl.innerHTML = '<p>Your cart is empty.</p>';
      grandEl.textContent = fmt(0);
      payBtn.classList.add('disabled'); payBtn.disabled = true;
      return;
    }
    summaryEl.innerHTML = items.map(i=>`<div class="summary-item"><img src="${i.image}" alt="${i.name}"><div><div><strong>${i.name}</strong></div><div>${i.quantity} × ${fmt(i.price)}</div></div></div>`).join('');
    const total = items.reduce((t,i)=>t+(i.price*i.quantity),0);
    grandEl.textContent = fmt(total);
  }

  render();

  payBtn.addEventListener('click', async ()=>{
    if(!agree.checked){ noteEl.textContent = 'Please agree to the terms to continue.'; return; }
    const items = (window.cart? window.cart.items: []);
    if(!items.length){ noteEl.textContent = 'Your cart is empty.'; return; }
    payBtn.disabled = true; noteEl.textContent = 'Preparing payment...';
    try {
      const amount = items.reduce((t,i)=>t+(i.price*i.quantity),0);
      const reference = 'ECI-' + Date.now();
      const payload = {
        amount,
        currency: 'USD',
        reference,
        items: items.map(i=>({id:i.id, quantity:i.quantity, price:i.price, name:i.name}))
      };
      const res = await fetch('/.netlify/functions/initiate-payment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      const data = await res.json().catch(()=>({}));
      if(res.status === 503){
        noteEl.textContent = data.message || 'Payment is not configured yet.';
        payBtn.disabled = false;
        return;
      }
      if(!res.ok){
        noteEl.textContent = data.error || 'Unable to start payment.';
        payBtn.disabled = false;
        return;
      }
      if(data.pollUrl){ sessionStorage.setItem('paynowPollUrl', data.pollUrl); }
      if(data.redirectUrl){ window.location.href = data.redirectUrl; return; }
      noteEl.textContent = 'No redirect URL received.';
      payBtn.disabled = false;
    } catch (e) {
      noteEl.textContent = 'Network error starting payment.';
      payBtn.disabled = false;
    }
  });
})();
