
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

function finishOrder() {
  if (CART.length === 0) {
    alert('Ваша корзина пуста!');
    return;
  }

  const orderId = Math.floor(100000 + Math.random() * 900000);
  localStorage.removeItem('lovely_cart');

  // скрываем checkout
  document.querySelector('.checkout-page').style.display = 'none';
  // показываем благодарность
  const thanksBlock = document.getElementById('orderThanks');
  thanksBlock.style.display = 'block';
  document.getElementById('thanksOrderId').textContent = `#${orderId}`;
}


// ===== Запуск рендера корзины =====
renderCheckoutCart();

