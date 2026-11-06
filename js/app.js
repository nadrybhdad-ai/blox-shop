// js/app.js

// --- ۱. مدیریت تم ---
const currentTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', currentTheme);

function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach(btn => {
        btn.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
        btn.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            btn.innerText = newTheme === 'dark' ? '☀️' : '🌙';
        });
    });
}

// --- ۲. دیتابیس آیتم‌ها ---
if (!localStorage.getItem('bloxItems')) {
    const defaultItems = [
        { id: 1, name: 'Dragon', price: '250,000', category: 'Mythical', img: 'https://via.placeholder.com/150/ff3333/ffffff?text=Dragon', status: true },
        { id: 2, name: 'Leopard', price: '350,000', category: 'Mythical', img: 'https://via.placeholder.com/150/ff3333/ffffff?text=Leopard', status: true },
        { id: 3, name: 'Dough', price: '150,000', category: 'Legendary', img: 'https://via.placeholder.com/150/ff66cc/ffffff?text=Dough', status: true },
        { id: 4, name: 'Venom', price: '120,000', category: 'Legendary', img: 'https://via.placeholder.com/150/ff66cc/ffffff?text=Venom', status: true },
        { id: 5, name: 'Shadow', price: '80,000', category: 'Rare', img: 'https://via.placeholder.com/150/9933ff/ffffff?text=Shadow', status: true },
        // آیتم های لول اپ
        { id: 11, name: 'Level Up 1000', price: '150,000', category: 'Service', img: 'https://via.placeholder.com/150/ffd700/000000?text=Lvl+1000', status: true },
        { id: 12, name: 'Level Up 2000', price: '250,000', category: 'Service', img: 'https://via.placeholder.com/150/ffd700/000000?text=Lvl+2000', status: true },
        { id: 13, name: 'Level Up Max', price: '500,000', category: 'Service', img: 'https://via.placeholder.com/150/ffd700/000000?text=Max+Lvl', status: true }
    ];
    localStorage.setItem('bloxItems', JSON.stringify(defaultItems));
}

// --- ۳. سیستم ثبت‌نام و ورود ---
function getUsers() { return JSON.parse(localStorage.getItem('bloxUsers')) || []; }
function saveUsers(users) { localStorage.setItem('bloxUsers', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('bloxCurrentUser')); }

function updateAuthUI() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;
    const user = getCurrentUser();
    if (user) {
        authContainer.innerHTML = `<span style="color:var(--primary-blue); font-weight:bold;">سلام، ${user.username}</span> <button onclick="logout()" class="btn" style="background:var(--danger); margin-right:10px; padding:5px 10px; font-size:0.8rem;">خروج</button>`;
    } else {
        authContainer.innerHTML = `<a href="login.html" class="btn">ورود / ثبت‌نام</a>`;
    }
}

function logout() {
    localStorage.removeItem('bloxCurrentUser');
    window.location.reload();
}

// --- ۴. سیستم سبد خرید ---
function getCart() { return JSON.parse(localStorage.getItem('bloxCart')) || []; }
function saveCart(cart) { localStorage.setItem('bloxCart', JSON.stringify(cart)); }

// تابع اضافه کردن به سبد خرید
function addToCart(itemId, itemName, itemPrice, itemImg) {
    let cart = getCart();
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: itemId, name: itemName, price: itemPrice, img: itemImg, quantity: 1 });
    }
    
    saveCart(cart);
    updateCartUI();
    alert(`آیتم "${itemName}" به سبد خرید اضافه شد! 🛒`);
}

function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== itemId);
    saveCart(cart);
    updateCartUI();
    renderCartItems(); 
}

function injectCartUI() {
    if (document.getElementById('cart-floating-btn')) return;

    const cartHTML = `
        <div id="cart-floating-btn" onclick="toggleCartModal()">
            <i class="fas fa-shopping-cart"></i>
            <span id="cart-badge" class="cart-badge">0</span>
        </div>
        <div id="cart-modal" class="cart-modal">
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h3>سبد خرید شما</h3>
                    <button onclick="toggleCartModal()" class="close-btn">&times;</button>
                </div>
                <div id="cart-items-container" class="cart-items"></div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>مجموع:</span>
                        <strong id="cart-total-price">0 تومان</strong>
                    </div>
                    <button onclick="checkout()" class="btn btn-primary" style="width:100%;">ثبت سفارش و پرداخت</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);
}

function updateCartUI() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        renderCartItems();
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('cart-total-price');
    const cart = getCart();
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">سبد خرید شما خالی است! 🛒</p>`;
        totalPriceEl.innerText = '0 تومان';
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        const numericPrice = parseInt(item.price.replace(/,/g, '')) || 0;
        totalPrice += numericPrice * item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} تومان <span style="color:var(--primary-blue);">(x${item.quantity})</span></p>
                </div>
                <button onclick="removeFromCart(${item.id})" class="btn-delete-item"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });

    totalPriceEl.innerText = totalPrice.toLocaleString() + ' تومان';
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است!');
        return;
    }
    alert('سفارش شما با موفقیت ثبت شد! برای هماهنگی به تلگرام پشتیبانی پیام دهید.');
    localStorage.removeItem('bloxCart');
    updateCartUI();
    toggleCartModal();
}

// اجرای اولیه در همه صفحات
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    updateAuthUI();
    injectCartUI();
    updateCartUI();
});