/* ===== Данные товаров ===== */
const PRODUCTS = [
  { id:1, title:'Футболка Minecraft', price:350, category:'Футболки', img:'https://via.placeholder.com/600x400/ffb6c1/000000?text=T-shirt' },
  { id:2, title:'Кепка Lovely', price:250, category:'Кепки', img:'https://via.placeholder.com/600x400/ffd1dc/000000?text=Cap' },
  { id:3, title:'Игровая кружка', price:200, category:'Кружки', img:'https://via.placeholder.com/600x400/ffc0cb/000000?text=Mug' },
  { id:4, title:'Толстовка Cozy', price:700, category:'Футболки', img:'https://via.placeholder.com/600x400/ffc9de/000000?text=Hoodie' },
  { id:5, title:'Бейсболка Sun', price:300, category:'Кепки', img:'https://via.placeholder.com/600x400/ffe4e6/000000?text=Cap2' },
  { id:6, title:'Термокружка', price:450, category:'Кружки', img:'https://via.placeholder.com/600x400/ffdfe6/000000?text=Thermo' }
];

/* ===== Корзина ===== */
let CART = JSON.parse(localStorage.getItem('lovely_cart') || '[]');
function saveCart(){ localStorage.setItem('lovely_cart', JSON.stringify(CART)); updateCartCounters(); }
function updateCartCounters(){ 
  const count = CART.reduce((sum,i)=>sum+i.qty,0);
  document.querySelectorAll('#cart-count').forEach(el=>el.textContent=count);
}
function addToCart(id){
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return;
  const existing = CART.find(i=>i.id===id);
  existing? existing.qty++ : CART.push({id:prod.id, title:prod.title, price:prod.price, qty:1});
  saveCart();
  renderCartPanel();
}

/* ===== Панель корзины ===== */
function cartTotal(){ return CART.reduce((sum,i)=>sum+i.price*i.qty,0);}
function renderCartPanel(){
  const cartItems=document.getElementById('cartItems');
  const cartTotalEl=document.getElementById('cartTotal');
  if(!cartItems || !cartTotalEl) return;
  if(CART.length===0){ cartItems.innerHTML='<p>Корзина пуста</p>'; cartTotalEl.textContent='0 грн'; return; }
  cartItems.innerHTML=CART.map(i=>`<div class="cart-item"><span>${i.title}</span><span>${i.price} × ${i.qty}</span></div>`).join('');
  cartTotalEl.textContent=cartTotal()+' грн';
}
function clearCart(){ CART=[]; saveCart(); renderCartPanel(); renderCatalog(); }

/* ===== Каталог ===== */
function renderCatalogList(listEl, products){
  if(!listEl) return; listEl.innerHTML='';
  products.forEach(p=>{
    const card=document.createElement('article'); card.className='card';
    card.innerHTML=`
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.price} грн</p>
      <div class="card-actions">
        <button class="btn primary" data-id="${p.id}">В корзину</button>
      </div>
    `;
    listEl.appendChild(card);
  });
  listEl.querySelectorAll('.btn').forEach(btn=>btn.addEventListener('click',()=>addToCart(+btn.dataset.id)));
}

/* ===== Фильтры и поиск ===== */
function applyFilters(){
  let filtered = PRODUCTS.slice();
  const priceVal = document.getElementById('priceRange')?.value;
  if(priceVal) filtered = filtered.filter(p=>p.price<=priceVal);
  const checkedCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(c=>c.value);
  if(checkedCats.length) filtered = filtered.filter(p=>checkedCats.includes(p.category));
  const searchVal = document.getElementById('searchInput')?.value.toLowerCase();
  if(searchVal) filtered = filtered.filter(p=>p.title.toLowerCase().includes(searchVal));
  renderCatalogList(document.getElementById('catalogList') || document.getElementById('bestsellers'), filtered);
}

/* ===== Сортировка ===== */
document.getElementById('sortSelect')?.addEventListener('change', e=>{
  const val = e.target.value; let list = document.getElementById('catalogList'); if(!list) return;
  let items = Array.from(list.children);
  items.sort((a,b)=>{
    const pa = +a.querySelector('p').textContent.replace(' грн','');
    const pb = +b.querySelector('p').textContent.replace(' грн','');
    const ta = a.querySelector('h3').textContent;
    const tb = b.querySelector('h3').textContent;
    if(val==='price-asc') return pa-pb;
    if(val==='price-desc') return pb-pa;
    if(val==='name') return ta.localeCompare(tb);
    return 0;
  });
  items.forEach(i=>list.appendChild(i));
});

/* ===== Панель корзины ===== */
const cartBtn=document.getElementById('cartBtn'), cartPanel=document.getElementById('cartPanel'), cartOverlay=document.getElementById('cartOverlay');
document.getElementById('closeCart')?.addEventListener('click',()=>{ cartPanel.classList.remove('open'); cartOverlay.classList.remove('show'); });
cartBtn?.addEventListener('click',()=>{ cartPanel.classList.add('open'); cartOverlay.classList.add('show'); });
cartOverlay?.addEventListener('click',()=>{ cartPanel.classList.remove('open'); cartOverlay.classList.remove('show'); });
document.getElementById('clearCartBtn')?.addEventListener('click',clearCart);
document.getElementById('checkoutBtn')?.addEventListener('click',()=>alert('Спасибо за заказ!'));

/* ===== Search & Filters ===== */
document.getElementById('applyFilters')?.addEventListener('click',applyFilters);
document.getElementById('resetFilters')?.addEventListener('click',()=>{ 
  document.querySelectorAll('.cat-filter').forEach(c=>c.checked=true); 
  if(document.getElementById('priceRange')) document.getElementById('priceRange').value=1000;
  applyFilters(); 
});
document.getElementById('priceRange')?.addEventListener('input',()=>{ document.getElementById('priceVal').textContent=document.getElementById('priceRange').value+' грн'; });

/* ===== Contact Form ===== */
document.getElementById('contactForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('cfName').value;
  const email=document.getElementById('cfEmail').value;
  const msg=document.getElementById('cfMsg').value;
  document.getElementById('cfResult').textContent=`Спасибо, ${name}! Мы получили ваше сообщение.`;
  e.target.reset();
});

/* ===== Инициализация ===== */
updateCartCounters();
renderCartPanel();
applyFilters();
