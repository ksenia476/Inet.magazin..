/* ===== Товары ===== */
const PRODUCTS = [
  { id: 1, title: 'Футболка Minecraft', price: 350, category: 'Футболки', img: 'images/futbolka.jpg' },
  { id: 2, title: 'Кепка Lovely', price: 250, category: 'Кепки', img: 'images/kepka.jpg' },
  { id: 3, title: 'Ігрова чашка', price: 200, category: 'Кружки', img: 'images/cahka.jpg' },
  { id: 4, title: 'Кофта', price: 700, category: 'Футболки', img: 'images/kofta.jpg' },
  { id: 5, title: 'Бейзболка', price: 300, category: 'Кепки', img: 'images/kepka 2.jpg' },
  { id: 6, title: ' Кружка Minecraft', price: 450, category: 'Кружки', img: 'images/gdhdtj.jpg' },
  { id: 7, title: 'Футболка Anime', price: 380, category: 'Футболки', img: 'images/anime.jpg' },
  { id: 8, title: 'Футболка мила', price: 420, category: 'Футболки', img: 'images/Sweet.jpg' },
  { id: 9, title: 'Худі', price: 850, category: 'Футболки', img: 'images/xydi.jpg' },

  { id: 11, title: 'Кепка чоловіча', price: 260, category: 'Кепки', img: 'images/kepka x.jpg' },

  { id: 12, title: 'Кружка Pink', price: 220, category: 'Кружки', img: 'images/kryhka.jpg' },
  { id: 13, title: 'Кружка Dota', price: 240, category: 'Кружки', img: 'images/dota.jpg' },
  { id: 14, title: 'Кружка дитяча', price: 210, category: 'Кружки', img: 'images/Detu.jpg' },

  /* ===== Штани ===== */
  { id: 15, title: 'Штани Classic', price: 600, category: 'Штани', img: 'images/htani.jpg' },
  { id: 16, title: 'Джинси Baggy', price: 680, category: 'Штани', img: 'images/baggy.jpg' },
  { id: 17, title: 'Штани Sport', price: 720, category: 'Штани', img: 'images/sport x.jpg' },
  { id: 18, title: 'Штани Oversize', price: 750, category: 'Штани', img: 'images/over.jpg' },
  { id: 19, title: 'Джинси Cargo', price: 800, category: 'Штани', img: 'images/cargo.jpg' }
];



/* ===== Корзина ===== */
let CART = JSON.parse(localStorage.getItem('lovely_cart') || '[]');

function saveCart() {
  localStorage.setItem('lovely_cart', JSON.stringify(CART));
  updateCartCounters();
}

function updateCartCounters() {
  const count = CART.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function addToCart(id) {
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return;

  const existing = CART.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    CART.push({ id: prod.id, title: prod.title, price: prod.price, qty: 1 });
  }

  saveCart();
  renderCartPanel();
}

/* ===== Панель корзины ===== */
function cartTotal() {
  return CART.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCartPanel() {
  const cartItems = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  if (!cartItems || !cartTotalEl) return;

  if (CART.length === 0) {
    cartItems.innerHTML = '<p>Корзина пуста</p>';
    cartTotalEl.textContent = '0 грн';
    return;
  }

  cartItems.innerHTML = CART.map(i => `
    <div class="cart-item">
      <span>${i.title}</span>
      <span>${i.price} × ${i.qty}</span>
    </div>
  `).join('');

  cartTotalEl.textContent = cartTotal() + ' грн';
}

function clearCart() {
  CART = [];
  saveCart();
  renderCartPanel();
  renderCatalogList();
}

/* ===== Каталог ===== */
function renderCatalogList(listEl, products) {
  if (!listEl) return;
  listEl.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.price} грн</p>
      <div class="card-actions">
        <button class="btn primary add-to-cart" data-id="${p.id}">В корзину</button>
      </div>
    `;

    // Добавляем переход на страницу товара при клике на карточку
    card.addEventListener('click', e => {
      if (!e.target.classList.contains('add-to-cart')) {
        window.location.href = `product.html?id=${p.id}`;
      }
    });

    listEl.appendChild(card);
  });

  // Кнопки "В корзину" остаются рабочими
  listEl.querySelectorAll('.add-to-cart').forEach(btn =>
    btn.addEventListener('click', () => addToCart(+btn.dataset.id))
  );
}

/* ===== Фильтры и поиск ===== */
function applyFilters() {
  const list = document.getElementById('catalogList');
  if (!list) return; // якщо це index.html — не виконуємо фільтрацію

  let filtered = PRODUCTS.slice();

  const priceVal = document.getElementById('priceRange')?.value;
  if (priceVal) filtered = filtered.filter(p => p.price <= priceVal);

  const checkedCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(c => c.value);
  if (checkedCats.length) filtered = filtered.filter(p => checkedCats.includes(p.category));

  const searchVal = document.getElementById('searchInput')?.value.toLowerCase();
  if (searchVal) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchVal));

  renderCatalogList(list, filtered);
}


/* ===== Сортировка ===== */
document.getElementById('sortSelect')?.addEventListener('change', e => {
  const val = e.target.value;
  const list = document.getElementById('catalogList');
  if (!list) return;

  let items = Array.from(list.children);
  items.sort((a, b) => {
    const pa = +a.querySelector('p').textContent.replace(' грн', '');
    const pb = +b.querySelector('p').textContent.replace(' грн', '');
    const ta = a.querySelector('h3').textContent;
    const tb = b.querySelector('h3').textContent;

    if (val === 'price-asc') return pa - pb;
    if (val === 'price-desc') return pb - pa;
    if (val === 'name') return ta.localeCompare(tb);
    return 0;
  });

  items.forEach(i => list.appendChild(i));
});

/* ===== Панель корзины ===== */
const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');

document.getElementById('closeCart')?.addEventListener('click', () => {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('show');
});

cartBtn?.addEventListener('click', () => {
  cartPanel.classList.add('open');
  cartOverlay.classList.add('show');
});

cartOverlay?.addEventListener('click', () => {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('show');
});

document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
document.getElementById('checkoutBtn')
  ?.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });

/* ===== Search & Filters ===== */
document.getElementById('applyFilters')?.addEventListener('click', applyFilters);

document.getElementById('resetFilters')?.addEventListener('click', () => {
  document.querySelectorAll('.cat-filter').forEach(c => c.checked = true);
  if (document.getElementById('priceRange')) document.getElementById('priceRange').value = 1000;
  applyFilters();
});

document.getElementById('priceRange')?.addEventListener('input', () => {
  document.getElementById('priceVal').textContent = document.getElementById('priceRange').value + ' грн';
});

/* ===== Contact Form ===== */
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('cfName').value;
  const email = document.getElementById('cfEmail').value;
  const msg = document.getElementById('cfMsg').value;

  document.getElementById('cfResult').textContent = `Дякую, ${name}! Ми отримали Ваше повідомлення.`;
  e.target.reset();
});

/* ===== Инициализация ===== */
updateCartCounters();
renderCartPanel();
applyFilters();

/* ===== Страница товара ===== */
if (window.location.pathname.endsWith('product.html')) {
  const params = new URLSearchParams(window.location.search);
  const productId = +params.get('id');
  const product = PRODUCTS.find(p => p.id === productId);

  const container = document.getElementById('productDetails');

  if (product && container) {
    container.innerHTML = `
      <div class="product-card">
        <img src="${product.img}" alt="${product.title}" class="product-image">
        <div class="product-info">
          <h2>${product.title}</h2>
          <p class="product-price">${product.price} грн</p>
          <p class="product-desc">
            Ці ${product.category.toLowerCase()} створені з любов'ю. Відмінна якість і стильний дизайн
          </p>
          ${product.category === 'Футболки', 'Штани' ? `
            <div class="sizes">
              <label>Розмір:</label>
              <select>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>` : ''}
          <button class="btn primary" onclick="addToCart(${product.id})">Додати в кошику</button>
        </div>
      </div>
    `;
  } else if (container) {
    container.innerHTML = '<p>Товар не знайден 😢</p>';
  }
}
/* ===== Хіти продажу на головній ===== */
function renderBestSellers() {
  const best = PRODUCTS.slice(0, 5); // в хіти 5 товара
  const box = document.getElementById('bestsellers');
  if (!box) return;

  renderCatalogList(box, best);
}
updateCartCounters();
renderCartPanel();

if (document.getElementById('bestsellers')) {
  renderBestSellers(); // головна сторінка
}

if (document.getElementById('catalogList')) {
  applyFilters(); // каталог
}

