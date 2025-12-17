// ===== Корзина =====
const CART = JSON.parse(localStorage.getItem('lovely_cart') || '[]') || [];

// ===== Рендер корзины =====
function renderCheckoutCart() {
  const list = document.getElementById('orderItems');
  const totalEl = document.getElementById('orderTotal');
  const countEl = document.getElementById('orderCount');

  if (!list) return;

  if (CART.length === 0) {
    list.innerHTML = '<p>Корзина пуста</p>';
    totalEl.textContent = '0 ₴';
    countEl.textContent = '0 товарів';
    return;
  }

  let total = 0;
  let html = '';

  CART.forEach(item => {
    total += item.price * item.qty;

    html += `
      <div class="order-item">
        <div>
          <p class="order-name">${item.title}</p>
          <p class="order-qty">${item.qty} × ${item.price} грн</p>
        </div>
        <strong>${item.price * item.qty} ₴</strong>
      </div>
    `;
  });

  list.innerHTML = html;
  totalEl.textContent = total + ' ₴';
  countEl.textContent = CART.length + ' товар(и)';
}

// ===== Переключение шагов =====
function nextStep(current, next) {
  document.getElementById(current).classList.remove('active');
  document.getElementById(next).classList.add('active');
}

// ===== Проверка контактных данных =====
function validateContacts() {
  const phone = document.getElementById('phone').value.trim();
  const name = document.getElementById('name').value.trim();
  const surname = document.getElementById('surname').value.trim();

  console.log({ phone, name, surname });

  if (phone && name && surname) {
    nextStep('step1', 'step2');
  } else {
    alert('Заповніть всі поля');
  }
}

// ===== Финальное оформление заказа =====
function finishOrder() {
  if (CART.length === 0) {
    alert('Ваша корзина пуста!');
    return;
  }

  const orderId = Math.floor(100000 + Math.random() * 900000);
  localStorage.removeItem('lovely_cart');

  document.body.innerHTML = `
    <div style="max-width:500px;margin:80px auto;text-align:center;font-family:sans-serif">
      <h2>Дякуємо за замовлення 💜</h2>
      <p>Номер замовлення:</p>
      <h1>#${orderId}</h1>
      <a href="index.html" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#ff6f91;color:#fff;text-decoration:none;border-radius:5px;">Повернутися на головну</a>
    </div>
  `;
}

// ===== Запуск рендера корзины =====
renderCheckoutCart();
