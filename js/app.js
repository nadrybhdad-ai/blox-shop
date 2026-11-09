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

// --- ۲. دیتابیس اولیه ---
if (!localStorage.getItem('bloxItems')) {
    const defaultItems = [
        { id: 1, name: 'Dragon', price: '250,000', category: 'Mythical', img: 'https://via.placeholder.com/150/ff3333/ffffff?text=Dragon', status: true },
        { id: 2, name: 'Leopard', price: '350,000', category: 'Mythical', img: 'https://via.placeholder.com/150/ff3333/ffffff?text=Leopard', status: true },
        { id: 3, name: 'Dough', price: '150,000', category: 'Legendary', img: 'https://via.placeholder.com/150/ff66cc/ffffff?text=Dough', status: true },
        { id: 5, name: 'Shadow', price: '80,000', category: 'Rare', img: 'https://via.placeholder.com/150/9933ff/ffffff?text=Shadow', status: true },
        { id: 11, name: 'Level Up 1000', price: '150,000', category: 'Service', img: 'https://via.placeholder.com/150/ffd700/000000?text=Lvl+1000', status: true }
    ];
    localStorage.setItem('bloxItems', JSON.stringify(defaultItems));
}

if (!localStorage.getItem('bloxServices')) {
    const defaultServices = [
        { id: 1, title: 'لول اپ (Level Up)', desc: 'رسیدن به لول دلخواه (مثلاً از لول 1 تا 2500) با سرعت بالا و بدون ریسک بن.', icon: 'fas fa-level-up-alt' },
        { id: 2, title: 'مستری آپ (Mastery)', desc: 'فارم و بالا بردن مستری میوه‌ها، شمشیرها، گان‌ها و استایل‌های مبارزه تا لول 600.', icon: 'fas fa-fist-raised' },
        { id: 3, title: 'کشتن باس (Boss)', desc: 'کشتن باس‌های مختلف برای دراپ کردن آیتم‌های کمیاب و افسانه‌ای.', icon: 'fas fa-skull' },
        { id: 4, title: 'گرفتن سورد (Sword)', desc: 'انجام مراحل و کوئست‌های سخت برای به دست آوردن شمشیرهای خاص و قدرتمند.', icon: 'fas fa-sword' },
        { id: 5, title: 'گان (Gun)', desc: 'کمک به شما برای گرفتن گان‌های نایاب و قدرتمند در بازی.', icon: 'fas fa-gun' },
        { id: 6, title: 'نژاد (Race)', desc: 'ری‌رول و آنلاک کردن نژادهای V2 و V3 و V4 با تمام قابلیت‌های ویژه.', icon: 'fas fa-dna' },
        { id: 7, title: 'فایتینگ استایل', desc: 'آنلاک کردن تمام استایل‌های مبارزه (مثل Godhuman, Superhuman, Death Step و...).', icon: 'fas fa-hand-rock' },
        { id: 8, title: 'سایر خدمات', desc: 'هر خدمتی که در لیست نیست را می‌توانید از طریق تلگرام به ما سفارش دهید.', icon: 'fas fa-star' }
    ];
    localStorage.setItem('bloxServices', JSON.stringify(defaultServices));
}

if (!localStorage.getItem('bloxCategories')) {
    const defaultCategories = [
        { id: 'Mythical', name: 'Mythical', color: '#ff3333' },
        { id: 'Legendary', name: 'Legendary', color: '#ff66cc' },
        { id: 'Rare', name: 'Rare', color: '#9933ff' },
        { id: 'Uncommon', name: 'Uncommon', color: '#00ccff' },
        { id: 'Common', name: 'Common', color: '#999999' },
        { id: 'Service', name: 'Level Up (خدمات)', color: '#ffd700' }
    ];
    localStorage.setItem('bloxCategories', JSON.stringify(defaultCategories));
}

// --- ۳. توابع دیتابیس (برای استفاده در همه صفحات) ---
function getItems() { return JSON.parse(localStorage.getItem('bloxItems')) || []; }
function saveItems(items) { localStorage.setItem('bloxItems', JSON.stringify(items)); }
function getServices() { return JSON.parse(localStorage.getItem('bloxServices')) || []; }
function saveServices(services) { localStorage.setItem('bloxServices', JSON.stringify(services)); }
function getCategories() { return JSON.parse(localStorage.getItem('bloxCategories')) || []; }
function saveCategories(categories) { localStorage.setItem('bloxCategories', JSON.stringify(categories)); }
function getUsers() { return JSON.parse(localStorage.getItem('bloxUsers')) || []; }
function saveUsers(users) { localStorage.setItem('bloxUsers', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('bloxCurrentUser')); }

function updateAuthUI() {
    const authContainer = document.getElementById('auth-container');
    const navUl = document.querySelector('header nav ul');
    if (!authContainer || !navUl) return;

    const isAdmin = localStorage.getItem('bloxAdminLoggedIn') === 'true';
    const user = getCurrentUser();
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // ساخت منو
    let menuHTML = `
        <li><a href="index.html" class="${currentPath === 'index.html' ? 'active' : ''}">خانه</a></li>
        <li><a href="items.html" class="${currentPath === 'items.html' ? 'active' : ''}">آیتم‌ها</a></li>
        <li><a href="services.html" class="${currentPath === 'services.html' ? 'active' : ''}">خدمات</a></li>
        <li><a href="contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">تماس</a></li>
    `;

    if (isAdmin) {
        menuHTML += `<li><a href="admin.html" style="color:var(--primary-orange); font-weight:bold;" class="${currentPath === 'admin.html' ? 'active' : ''}">پنل ادمین</a></li>`;
        // استفاده از کلاس btn-logout برای دکمه خروج
        authContainer.innerHTML = `
            <span style="color:var(--primary-blue); font-weight:bold; margin-left: 10px;">ادمین</span> 
            <button onclick="logoutAdmin()" class="btn-logout">خروج <i class="fas fa-sign-out-alt"></i></button>
        `;
    } else if (user) {
        authContainer.innerHTML = `
            <span style="color:var(--primary-blue); font-weight:bold; margin-left: 10px;">سلام، ${user.username}</span> 
            <button onclick="logout()" class="btn-logout">خروج <i class="fas fa-sign-out-alt"></i></button>
        `;
    } else {
        authContainer.innerHTML = `<a href="login.html" class="btn">ورود / ثبت‌نام</a>`;
    }
    
    navUl.innerHTML = menuHTML;
}

function logout() {
    localStorage.removeItem('bloxCurrentUser');
    window.location.reload();
}

function logoutAdmin() {
    localStorage.removeItem('bloxAdminLoggedIn');
    window.location.href = 'index.html'; // هدایت به صفحه اصلی
}

// --- ۵. سیستم سبد خرید ---
function getCart() { return JSON.parse(localStorage.getItem('bloxCart')) || []; }
function saveCart(cart) { localStorage.setItem('bloxCart', JSON.stringify(cart)); }

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

// اجرای اولیه
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    updateAuthUI();
    injectCartUI();
    updateCartUI();
});
// --- ۶. تابع باز و بسته کردن منوی موبایل ---
function toggleMobileMenu() {
    const header = document.querySelector('header');
    if (header) {
        header.classList.toggle('active-mobile-menu');
    }
}