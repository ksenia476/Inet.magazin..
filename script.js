/* ========== Данные товаров ========== */
const PRODUCTS = [
  { id: 1, title: 'Футболка Minecraft', price: 350, category: 'Футболки', img: 'https://via.placeholder.com/600x400/ffb6c1/000000?text=T-shirt' },
  { id: 2, title: 'Кепка Lovely', price: 250, category: 'Кепки', img: 'https://via.placeholder.com/600x400/ffd1dc/000000?text=Cap' },
  { id: 3, title: 'Игровая кружка', price: 200, category: 'Кружки', img: 'https://via.placeholder.com/600x400/ffc0cb/000000?text=Mug' },
  { id: 4, title: 'Толстовка Cozy', price: 700, category: 'Футболки', img: 'https://via.placeholder.com/600x400/ffc9de/000000?text=Hoodie' },
  { id: 5, title: 'Бейсболка Sun', price: 300, category: 'Кепки', img: 'https://via.placeholder.com/600x400/ffe4e6/000000?text=Cap2' },
  { id: 6, title: 'Термокружка', price: 450, category: 'Кружки', img: 'https://via.placeholder.com/600x400/ffdfe6/000000?text=Thermo' }
];

/* ========== Корзина (localStorage) ========== */
let CART = JSON.parse(localStorage.getItem('lovely_cart') || '[]');

function saveCart(){
  localStorage.setItem('lovely_cart', JSON.stringify(CART));
  updateCartCounters();
}

/* обновление счётчика корзины в шапке */
function updateCartCounters(){
  const count = CART.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('#cart-count, #cart-count-top, #cart-count-about').forEach(el=>{
    if(el) el.textContent = count;
  });
}

/* добавить в корзину */
function addToCart(id){
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return;
  const item = CART.find(i=>i.id===id);
  if(item) item.qty++;
  else CART.push({id: prod.id, title: prod.title, price: prod.price, qty:1});
  saveCart();
  flashAdd(prod);
}

/* визуальная подсказка при добавлении */
function flashAdd(prod){
  // простой alert-free индикатор: всплывающее сообщение
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = `Добавлено: ${prod.title}`;
  document.body.appendChild(toast);
  setTimeout(()=> toast.classList.add('show'), 10);
  setTimeout(()=> { toast.classList.remove('show'); setTimeout(()=> toast.remove(),300); }, 1400);
}

/* очистить корзину */
function clearCart(){
  CART = [];
  saveCart();
  renderCatalog(); // карточки могут обновлять кнопки
}

/* получить итог */
function cartTotal(){
  return CART.reduce((s,i)=>s + i.price * i.qty, 0);
}

/* ========== Рендер — каталог и витрины ========== */
function renderCatalogList(listEl, products){
  if(!listEl) return;
  listEl.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.price} грн</p>
      <div class="card-actions">
        <button class="btn primary" data-id="${p.id}">В корзину</button>
        <a class="btn ghost" href="#">Подробнее</a>
      </div>
    `;
    listEl.appendChild(card);
  });

  // повесим обработчики
  listEl.querySelectorAll('button[data-id]').forEach(btn=>{
    btn.addEventListener('click', ()=> addToCart(Number(btn.dataset.id)));
  });
}

/* заполнение хитов продаж на главной (берём первые 4) */
function renderBestSellers(){
  const el = document.getElementById('bestsellers');
  if(!el) return;
  renderCatalogList(el, PRODUCTS.slice(0,4));
}

/* отрисовать каталог с фильтрами */
function renderCatalog(){
  const el = document.getElementById('catalogList');
  if(!el) return;
  // фильтры
  const priceMax = Number(document.getElementById('priceRange')?.value || 10000);
  const checkedCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(i=>i.value);
  let out = PRODUCTS.filter(p => p.price <= priceMax && checkedCats.includes(p.category));
  // сорт
  const sort = document.getElementById('sortSelect')?.value;
  if(sort==='price-asc') out.sort((a,b)=>a.price-b.price);
  if(sort==='price-desc') out.sort((a,b)=>b.price-a.price);
  if(sort==='name') out.sort((a,b)=>a.title.localeCompare(b.title));
  renderCatalogList(el, out);
}

/* поиск (быстрый) */
function attachSearch(){
  const input = document.getElementById('searchInput');
  if(!input) return;
  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    const filtered = PRODUCTS.filter(p => p.title.toLowerCase().includes(q));
    renderCatalogList(document.getElementById('catalogList'), filtered);
  });
}

/* события фильтров */
function attachFilters(){
  const priceRange = document.getElementById('priceRange');
  if(priceRange){
    priceRange.addEventListener('input', ()=>{
      document.getElementById('priceVal').textContent = priceRange.value + ' грн';
    });
  }
  document.getElementById('applyFilters')?.addEventListener('click', renderCatalog);
  document.getElementById('resetFilters')?.addEventListener('click', ()=>{
    document.getElementById('priceRange').value = 1000;
    document.querySelectorAll('.cat-filter').forEach(ch=>ch.checked=true);
    renderCatalog();
  });
  document.getElementById('sortSelect')?.addEventListener('change', renderCatalog);
}

/* обработка формы контактов */
function attachContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    document.getElementById('cfResult').textContent = 'Спасибо! Сообщение отправлено (пример).';
    form.reset();
  });
}

/* toast styles injection */
(function injectToastStyle(){
  const css = `.toast{position:fixed;right:20px;bottom:20px;background:linear-gradient(90deg,var(--accent),var(--accent-2));color:white;padding:10px 14px;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.2);opacity:0;transform:translateY(12px);transition:all .25s}
  .toast.show{opacity:1;transform:translateY(0)}`;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();

/* ========== Инициализация на каждой странице ========== */
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCounters();
  renderBestSellers();
  renderCatalog();
  attachFilters();
  attachSearch();
  attachContactForm();

  // подключение кнопок на главной/каталоге, если есть корзина внутри
  document.querySelectorAll('.btn.primary[data-id]').forEach(b=>{
    b.addEventListener('click', ()=> addToCart(Number(b.dataset.id)));
  });
});
