// js/app.js

// =========================================
// ۱. سیستم نوتیفیکیشن (جایگزین alert)
// =========================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-times-circle';
    if (type === 'info') icon = 'fa-info-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// =========================================
// ۲. مدیریت تم
// =========================================
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

// =========================================
// ۳. دیتابیس اولیه
// =========================================
if (!localStorage.getItem('bloxItems')) {
    const defaultItems = [
        { id: 1, name: 'Dragon', price: '250,000', category: 'Mythical', img: 'https://via.placeholder.com/150/ff3333/ffffff?text=Dragon', status: true },
        { id: 2, name: 'Leopard', price: '350,000', category: 'Mythical', img: 'https://via.placeholder.com/150/ff3333/ffffff?text=Leopard', status: true },
        { id: 3, name: 'Dough', price: '150,000', category: 'Legendary', img: 'https://via.placeholder.com/150/ff66cc/ffffff?text=Dough', status: true },
        { id: 11, name: 'Level Up 1000', price: '150,000', category: 'Service', img: 'https://via.placeholder.com/150/ffd700/000000?text=Lvl+1000', status: true }
    ];
    localStorage.setItem('bloxItems', JSON.stringify(defaultItems));
}
if (!localStorage.getItem('bloxCategories')) {
    const defaultCategories = [
        { id: 'Mythical', name: 'Mythical', color: '#ff3333' },
        { id: 'Legendary', name: 'Legendary', color: '#ff66cc' },
        { id: 'Service', name: 'Level Up (خدمات)', color: '#ffd700' }
    ];
    localStorage.setItem('bloxCategories', JSON.stringify(defaultCategories));
}

// =========================================
// ۴. توابع دیتابیس
// =========================================
function getItems() { return JSON.parse(localStorage.getItem('bloxItems')) || []; }
function saveItems(items) { localStorage.setItem('bloxItems', JSON.stringify(items)); }
function getServices() { return JSON.parse(localStorage.getItem('bloxServices')) || []; }
function saveServices(services) { localStorage.setItem('bloxServices', JSON.stringify(services)); }
function getCategories() { return JSON.parse(localStorage.getItem('bloxCategories')) || []; }
function saveCategories(categories) { localStorage.setItem('bloxCategories', JSON.stringify(categories)); }
function getUsers() { return JSON.parse(localStorage.getItem('bloxUsers')) || []; }
function saveUsers(users) { localStorage.setItem('bloxUsers', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('bloxCurrentUser')); }
function getOrders() { return JSON.parse(localStorage.getItem('bloxOrders')) || []; }
function saveOrders(orders) { localStorage.setItem('bloxOrders', JSON.stringify(orders)); }

// =========================================
// ۵. هدر و منو
// =========================================
function updateAuthUI() {
    const authContainer = document.getElementById('auth-container');
    const navUl = document.querySelector('header nav ul');
    if (!authContainer || !navUl) return;

    const isAdmin = localStorage.getItem('bloxAdminLoggedIn') === 'true';
    const user = getCurrentUser();
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    let menuHTML = `
        <li><a href="index.html" class="${currentPath === 'index.html' ? 'active' : ''}">خانه</a></li>
        <li><a href="items.html" class="${currentPath === 'items.html' ? 'active' : ''}">آیتم‌ها</a></li>
        <li><a href="services.html" class="${currentPath === 'services.html' ? 'active' : ''}">خدمات</a></li>
    `;

    if (isAdmin) {
        menuHTML += `<li><a href="admin.html" style="color:var(--primary-orange); font-weight:bold;" class="${currentPath === 'admin.html' ? 'active' : ''}">پنل ادمین</a></li>`;
        authContainer.innerHTML = `<span style="color:var(--primary-blue); font-weight:bold; margin-left: 10px;">ادمین</span> <button onclick="logoutAdmin()" class="btn-logout">خروج <i class="fas fa-sign-out-alt"></i></button>`;
    } else if (user) {
        menuHTML += `<li><a href="javascript:void(0)" onclick="openCustomerOrders()" style="color:#00cc66; font-weight:bold;">سفارش‌های قبلی</a></li>`;
        authContainer.innerHTML = `<span style="color:var(--primary-blue); font-weight:bold; margin-left: 10px;">${user.username}</span> <button onclick="logout()" class="btn-logout">خروج <i class="fas fa-sign-out-alt"></i></button>`;
    } else {
        authContainer.innerHTML = `<a href="login.html" class="btn">ورود / ثبت‌نام</a>`;
    }
    
    navUl.innerHTML = menuHTML;
}

function logout() {
    localStorage.removeItem('bloxCurrentUser');
    localStorage.removeItem('bloxAdminLoggedIn');
    window.location.reload();
}

function logoutAdmin() {
    localStorage.removeItem('bloxAdminLoggedIn');
    localStorage.removeItem('bloxCurrentUser');
    window.location.href = 'index.html';
}

// =========================================
// ۶. سبد خرید
// =========================================
function getCart() { return JSON.parse(localStorage.getItem('bloxCart')) || []; }
function saveCart(cart) { localStorage.setItem('bloxCart', JSON.stringify(cart)); }

function addToCart(itemId) {
    const item = getItems().find(i => i.id === itemId);
    if (!item) { showToast('آیتم یافت نشد!', 'error'); return; }

    let cart = getCart();
    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ id: item.id, name: item.name, price: item.price, img: item.img, quantity: 1 });
    saveCart(cart);
    updateCartUI();
    showToast(`آیتم "${item.name}" به سبد خرید اضافه شد!`, 'success');
}

function removeFromCart(itemId) {
    let cart = getCart().filter(i => i.id !== itemId);
    saveCart(cart);
    updateCartUI();
    renderCartItems();
}

// مودال موفقیت ثبت سفارش
function injectTrackingModal() {
    if (document.getElementById('tracking-modal')) return;
    const modalHTML = `
        <div id="tracking-modal" class="cart-modal" style="display:none; z-index: 3000;">
            <div class="cart-modal-content" style="text-align: center; border-color: #00cc66; padding: 30px;">
                <h2 style="color: #00cc66; margin-bottom: 20px;"><i class="fas fa-check-circle"></i> سفارش ثبت شد!</h2>
                <p style="margin-bottom: 15px;">کد پیگیری شما:</p>
                <div id="display-tracking-code" style="font-size: 2.5rem; font-weight: 900; color: var(--primary-blue); letter-spacing: 5px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px dashed var(--primary-blue);">
                    XXX
                </div>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.6;">لطفاً این کد را به آیدی روبیکا <strong style="color: var(--primary-orange);">@ahr51r1</strong> ارسال کنید.</p>
                <button onclick="document.getElementById('tracking-modal').style.display='none'" class="btn btn-primary" style="width: 100%;">متوجه شدم</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
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
                <div id="cart-items-container" class="cart-items" style="max-height: 200px;"></div>
                
                <div style="padding: 15px; border-top: 1px dashed var(--border-color); background: rgba(0,0,0,0.1);">
                    <h4 style="color: var(--primary-orange); font-size: 0.95rem; margin-bottom: 10px;"><i class="fas fa-gamepad"></i> اطلاعات اکانت روبلاکس</h4>
                    <input type="text" id="orderRbxUser" placeholder="نام کاربری روبلاکس" style="width: 100%; margin-bottom: 8px; padding: 10px; border-radius: 8px; background: var(--bg-color); border: 1px solid var(--border-color); color: white; font-family: inherit;">
                    <input type="password" id="orderRbxPass" placeholder="رمز عبور" style="width: 100%; margin-bottom: 8px; padding: 10px; border-radius: 8px; background: var(--bg-color); border: 1px solid var(--border-color); color: white; font-family: inherit;">
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="orderRbxBackup1" placeholder="بکاپ کد ۱" style="width: 50%; padding: 10px; border-radius: 8px; background: var(--bg-color); border: 1px solid var(--border-color); color: white; font-family: inherit;">
                        <input type="text" id="orderRbxBackup2" placeholder="بکاپ کد ۲" style="width: 50%; padding: 10px; border-radius: 8px; background: var(--bg-color); border: 1px solid var(--border-color); color: white; font-family: inherit;">
                    </div>
                </div>

                <div class="cart-footer">
                    <div class="cart-total">
                        <span>مجموع:</span>
                        <strong id="cart-total-price">0 تومان</strong>
                    </div>
                    <button onclick="checkout()" class="btn btn-primary" style="width:100%;">ثبت سفارش</button>
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
    if (modal.style.display === 'flex') modal.style.display = 'none';
    else { modal.style.display = 'flex'; renderCartItems(); }
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

// =========================================
// ۷. ثبت سفارش
// =========================================
function generateTrackingCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
}

function checkout() {
    const cart = getCart();
    const user = getCurrentUser();

    if (cart.length === 0) {
        showToast('سبد خرید شما خالی است!', 'error');
        return;
    }
    if (!user) {
        showToast('برای ثبت سفارش ابتدا باید وارد حساب کاربری خود شوید!', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const rbxUser = document.getElementById('orderRbxUser').value.trim();
    const rbxPass = document.getElementById('orderRbxPass').value.trim();
    const backup1 = document.getElementById('orderRbxBackup1').value.trim();
    const backup2 = document.getElementById('orderRbxBackup2').value.trim();

    if (!rbxUser || !rbxPass || !backup1 || !backup2) {
        showToast('لطفاً تمام اطلاعات اکانت روبلاکس را وارد کنید.', 'error');
        return;
    }

    const trackingCode = generateTrackingCode();
    let totalPrice = 0;
    cart.forEach(item => {
        const numericPrice = parseInt(item.price.replace(/,/g, '')) || 0;
        totalPrice += numericPrice * item.quantity;
    });

    const newOrder = {
        id: Date.now(),
        trackingCode: trackingCode,
        username: user.username,
        rbxData: { user: rbxUser, pass: rbxPass, backup1: backup1, backup2: backup2 },
        items: cart,
        totalPrice: totalPrice.toLocaleString(),
        date: new Date().toLocaleDateString('fa-IR'),
        status: 'pending',
        adminDeleted: false
    };

    try {
        let orders = getOrders();
        orders.push(newOrder);
        saveOrders(orders);
        
        document.getElementById('display-tracking-code').innerText = trackingCode;
        document.getElementById('tracking-modal').style.display = 'flex';

        localStorage.removeItem('bloxCart');
        updateCartUI();
        toggleCartModal();
    } catch (e) {
        if (e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014)) {
            showToast('حافظه مرورگر پر شده است! عکس‌های اضافی را حذف کنید.', 'error');
        } else {
            showToast('خطا در ثبت سفارش: ' + (e.message || 'نامشخص'), 'error');
        }
    }
}

// =========================================
// ۸. سفارش‌های قبلی مشتری
// =========================================
function injectCustomerOrdersModal() {
    if (document.getElementById('customer-orders-modal')) return;
    const modalHTML = `
        <div id="customer-orders-modal" class="cart-modal" style="display:none; z-index: 2000;">
            <div class="cart-modal-content" style="max-width: 600px; border-color: #00cc66;">
                <div class="cart-header">
                    <h3 style="color: #00cc66;">سفارش‌های قبلی شما</h3>
                    <button onclick="document.getElementById('customer-orders-modal').style.display='none'" class="close-btn">&times;</button>
                </div>
                <div id="customer-orders-list" style="max-height: 400px; overflow-y: auto; padding: 20px;"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openCustomerOrders() {
    const user = getCurrentUser();
    if (!user) return;
    const header = document.querySelector('header');
    if (header && header.classList.contains('active-mobile-menu')) header.classList.remove('active-mobile-menu');
    
    const modal = document.getElementById('customer-orders-modal');
    const list = document.getElementById('customer-orders-list');
    
    const orders = getOrders().filter(o => o.username === user.username);
    list.innerHTML = '';
    
    if (orders.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding: 30px;"><i class="fas fa-box-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 15px;"></i><p style="color:var(--text-muted);">شما تاکنون سفارشی ثبت نکرده‌اید.</p></div>`;
    } else {
        orders.sort((a, b) => b.id - a.id).forEach(order => {
            const isCompleted = order.status === 'completed';
            const statusBadge = isCompleted 
                ? '<span style="color:#00cc66; font-weight:bold; font-size: 0.85rem;">(تکمیل شده ✅)</span>' 
                : '<span style="color:var(--primary-orange); font-weight:bold; font-size: 0.85rem;">(در حال بررسی ⏳)</span>';

            list.innerHTML += `
                <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-right: 4px solid ${isCompleted ? '#00cc66' : 'var(--primary-orange)'}; margin-bottom: 15px; padding: 15px; border-radius: 8px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom: 1px dashed var(--border-color); padding-bottom: 8px;">
                        <span style="font-size: 0.9rem;">کد پیگیری: <strong style="color:var(--primary-blue); font-size:1.1rem;">${order.trackingCode}</strong></span>
                        ${statusBadge}
                    </div>
                    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:10px;">تاریخ ثبت: ${order.date}</p>
                    <div style="background: rgba(255,255,255,0.05); padding:10px; border-radius: 6px; margin-bottom: 10px;">
                        <ul style="list-style:none; padding-right: 10px; margin-top: 5px; font-size:0.85rem; color: var(--text-muted);">
                            ${order.items.map(i => `<li style="margin-bottom:3px;">- ${i.name} (تعداد: ${i.quantity})</li>`).join('')}
                        </ul>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.95rem; font-weight: bold;">
                        <span>مبلغ کل:</span>
                        <span style="color:var(--primary-blue);">${order.totalPrice} تومان</span>
                    </div>
                </div>
            `;
        });
    }
    modal.style.display = 'flex';
}

// =========================================
// ۹. اجرای اولیه
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    updateAuthUI();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isAuthPage = currentPage === 'login.html';

    if (!isAuthPage) {
        injectCartUI();
        updateCartUI();
        injectCustomerOrdersModal();
        injectTrackingModal();
    }

    // بنر مناسبت‌ها
    const seasonTheme = localStorage.getItem('bloxSeasonTheme') || 'default';
    if (seasonTheme !== 'default') {
        document.body.classList.add(`theme-${seasonTheme}`);
        const banners = {
            'halloween': '🎃 جشنواره هالووین! تخفیف‌های ویژه 🎃',
            'valentine': '❤️ روز ولنتاین مبارک! ❤️',
            'christmas': '🎄 کریسمس مبارک! 🎄',
            'nowruz': '🌸 عید نوروز مبارک! 🌸'
        };
        if (banners[seasonTheme]) {
            const bannerDiv = document.createElement('div');
            bannerDiv.className = `season-banner banner-${seasonTheme}`;
            bannerDiv.innerHTML = banners[seasonTheme];
            document.body.insertBefore(bannerDiv, document.body.firstChild);
        }
    } else {
        const customBanner = JSON.parse(localStorage.getItem('bloxCustomBanner'));
        if (customBanner && customBanner.status === 'on' && customBanner.text) {
            const bannerDiv = document.createElement('div');
            bannerDiv.className = `custom-normal-banner`;
            bannerDiv.innerHTML = customBanner.text;
            document.body.insertBefore(bannerDiv, document.body.firstChild);
        }
    }
});

function toggleMobileMenu() {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('active-mobile-menu');
}