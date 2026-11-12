// js/app.js

// =========================================
// ۰. تزریق صفحه لودینگ (Preloader)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('page-loader')) {
        const loaderHTML = `
            <div id="page-loader">
                <div class="loader-spinner"></div>
                <div class="loader-logo">Blox <span>Shop</span></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    }

    setTimeout(() => {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('hidden'); 
            setTimeout(() => loader.remove(), 600);
        }
    }, 1000); 
});

// =========================================
// ۰.۵ بررسی فعال بودن تم مناسبتی
// =========================================
function isSeasonThemeActive() {
    const seasonTheme = localStorage.getItem('bloxSeasonTheme') || 'default';
    return seasonTheme !== 'default';
}

// =========================================
// ۱. سیستم نوتیفیکیشن (Toast)
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
// ۲. مدیریت تم (روز/شب)
// =========================================
const savedTheme = localStorage.getItem('theme') || 'dark';
const initialTheme = isSeasonThemeActive() ? 'dark' : savedTheme;
document.body.setAttribute('data-theme', initialTheme);

function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    const seasonActive = isSeasonThemeActive();
    
    toggleBtns.forEach(btn => {
        if (seasonActive) {
            btn.style.display = 'none';
            return;
        }
        
        btn.style.display = 'flex';
        btn.innerText = document.body.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        btn.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            btn.innerText = newTheme === 'dark' ? '☀️' : '🌙';
        });
    });
}

// =========================================
// ۳. دیتابیس اولیه و توابع
// =========================================
// =========================================
// دیتابیس اولیه خدمات (توضیحات)
// =========================================
let servicesData = JSON.parse(localStorage.getItem('bloxServices'));

if (!servicesData || !Array.isArray(servicesData) || servicesData.length === 0) {
    // اگر سایت تازه باز شده، این کارت‌های پیش‌فرض ساخته می‌شوند
    servicesData = [
        { id: 1, title: 'لول اپ (Level Up)', desc: 'رسیدن به لول دلخواه (مثلا از لول ۱ تا ۲۵۰۰) با سرعت بالا و بدون ریسک بن.', icon: 'fas fa-arrow-up' },
        { id: 2, title: 'مستری آپ (Mastery)', desc: 'فارم و بالا بردن مستری میوه‌ها، شمشیرها، گان‌ها و استایل‌های مبارزه تا لول ۶۰۰.', icon: 'fas fa-hand-rock' },
        { id: 3, title: 'کشتن باس (Boss)', desc: 'کشتن باس‌های مختلف برای دراپ کردن آیتم‌های کمیاب و افسانه‌ای.', icon: 'fas fa-skull' },
        { id: 4, title: 'گان (Gun)', desc: 'کمک به شما برای گرفتن گان‌های نایاب و قدرتمند در بازی.', icon: 'fas fa-gun' },
        { id: 5, title: 'نژاد (Race)', desc: 'ری‌رول و آنلاک کردن نژادهای V2 و V4 با تمام قابلیت‌های ویژه.', icon: 'fas fa-hourglass-half' },
        { id: 6, title: 'گرفتن سورد (Sword)', desc: 'کمک به شما برای بدست آوردن سوردهای افسانه‌ای، میتیک و نایاب بازی.', icon: 'fas fa-khanda' } // 👈 کارت جدید
    ];
    localStorage.setItem('bloxServices', JSON.stringify(servicesData));
} else {
    // اگر از قبل کارت‌ها وجود داشتند (مثل عکس شما)، این کد چک می‌کند که آیا "گرفتن سورد" هست یا نه
    if (!servicesData.find(s => s.title.includes('سورد'))) {
        servicesData.push({ 
            id: Date.now(), 
            title: 'گرفتن سورد (Sword)', 
            desc: 'کمک به شما برای بدست آوردن سوردهای افسانه‌ای، میتیک و نایاب بازی.', 
            icon: 'fas fa-khanda' 
        });
        localStorage.setItem('bloxServices', JSON.stringify(servicesData));
    }
}

// =========================================
// مدیریت دیتابیس دسته‌بندی‌ها (اضافه شدن گرفتن سورد)
// =========================================
let categoriesData = JSON.parse(localStorage.getItem('bloxCategories'));

if (!categoriesData || !Array.isArray(categoriesData) || categoriesData.length === 0) {
    // اگر دیتابیس خالی بود، پیش‌فرض‌ها را بساز
    categoriesData = [
        { id: 'Mythical', name: 'Mythical', color: '#ff3333', type: 'item' },
        { id: 'Legendary', name: 'Legendary', color: '#ff66cc', type: 'item' },
        { id: 'Service', name: 'Level Up (خدمات)', color: '#ffd700', type: 'service' },
        { id: 'Sword', name: 'گرفتن سورد', color: '#00d2ff', type: 'service' } // 👈 دسته جدید
    ];
    localStorage.setItem('bloxCategories', JSON.stringify(categoriesData));
} else {
    // آپدیت خودکار دیتابیس‌های قدیمی
    let updated = false;
    
    // ۱. اضافه کردن نوع (type) به دسته‌بندی‌هایی که ندارند
    categoriesData.forEach(c => {
        if (!c.type) {
            c.type = (c.id.toLowerCase() === 'service') ? 'service' : 'item';
            updated = true;
        }
    });

    // ۲. چک کردن وجود "گرفتن سورد"، اگر نبود اضافه شود
    if (!categoriesData.find(c => c.id.toLowerCase() === 'sword')) {
        categoriesData.push({ id: 'Sword', name: 'گرفتن سورد', color: '#00d2ff', type: 'service' });
        updated = true;
    }

    if (updated) {
        localStorage.setItem('bloxCategories', JSON.stringify(categoriesData));
    }
}

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

// توابع اسلایدرهای داینامیک
function getServiceSliders() {
    let sliders = JSON.parse(localStorage.getItem('bloxServiceSliders'));
    if (!sliders || !Array.isArray(sliders) || sliders.length === 0) {
        sliders = [
            { id: 'default-desc', title: 'خدمات تخصصی Blox Fruits', type: 'services' },
            { id: 'default-shop', title: 'خرید خدمات (Level Up)', type: 'items', categoryId: 'Service' }
        ];
        localStorage.setItem('bloxServiceSliders', JSON.stringify(sliders));
    }
    return sliders;
}
function saveServiceSliders(sliders) { localStorage.setItem('bloxServiceSliders', JSON.stringify(sliders)); }

function getHomeSliders() {
    const stored = localStorage.getItem('bloxHomeSliders');
    if (stored !== null) return JSON.parse(stored);
    
    let sliders = [];
    getCategories().forEach(c => {
        if (c.type === 'item') sliders.push({ id: 'cat-' + c.id, title: c.name, categoryId: c.id });
    });
    return sliders;
}
function saveHomeSliders(sliders) { localStorage.setItem('bloxHomeSliders', JSON.stringify(sliders)); }

// =========================================
// ۴. هدر و منو و جستجوی سراسری
// =========================================
function injectGlobalSearch() {
    const header = document.querySelector('header');
    if (!header || document.getElementById('globalSearchInput')) return;

    const searchHTML = `
        <div class="header-search-box" id="headerSearchBox">
            <button onclick="performGlobalSearch()"><i class="fas fa-search"></i></button>
            <input type="text" id="globalSearchInput" placeholder="جستجو..." autocomplete="off" readonly onfocus="this.removeAttribute('readonly')" onkeypress="if(event.key === 'Enter') performGlobalSearch()">
            <div id="search-suggestions" class="search-suggestions"></div>
        </div>
    `;
    
    const logo = header.querySelector('.logo');
    if (logo) {
        logo.insertAdjacentHTML('afterend', searchHTML);
    } else {
        header.insertAdjacentHTML('afterbegin', searchHTML);
    }

    const input = document.getElementById('globalSearchInput');
    
    input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        const sugBox = document.getElementById('search-suggestions');
        
        if (query.length < 2) {
            sugBox.style.display = 'none';
            return;
        }

        const items = getItems();
        const services = getServices();

        const filteredItems = items.filter(i => i.name.toLowerCase().includes(query));
        const filteredServices = services.filter(s => s.title.toLowerCase().includes(query));

        if (filteredItems.length === 0 && filteredServices.length === 0) {
            sugBox.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">نتیجه‌ای یافت نشد</div>';
            sugBox.style.display = 'block';
            return;
        }

        let html = '';
        filteredItems.slice(0, 5).forEach(item => {
            html += `
                <div class="suggestion-item" onclick="window.location.href='items.html?search=${encodeURIComponent(item.name)}'">
                    <img src="${item.img}" alt="${item.name}">
                    <span class="sug-title">${item.name}</span>
                    <span class="sug-type">آیتم</span>
                </div>
            `;
        });

        filteredServices.slice(0, 5).forEach(service => {
            const iconHTML = service.img ? `<img src="${service.img}" alt="${service.title}">` : `<i class="${service.icon || 'fas fa-star'}"></i>`;
            html += `
                <div class="suggestion-item" onclick="window.location.href='services.html?search=${encodeURIComponent(service.title)}'">
                    ${iconHTML}
                    <span class="sug-title">${service.title}</span>
                    <span class="sug-type">خدمت</span>
                </div>
            `;
        });

        sugBox.innerHTML = html;
        sugBox.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        const searchBox = document.getElementById('headerSearchBox');
        if (searchBox && !searchBox.contains(e.target)) {
            const sugBox = document.getElementById('search-suggestions');
            if (sugBox) sugBox.style.display = 'none';
        }
    });
}

function performGlobalSearch() {
    const input = document.getElementById('globalSearchInput');
    if (input && input.value.trim() !== '') {
        window.location.href = `items.html?search=${encodeURIComponent(input.value.trim())}`;
    }
}

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
        <li><a href="contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">تماس</a></li>
    `;

    if (isAdmin) {
        menuHTML += `<li><a href="admin.html" style="color:var(--primary-orange); font-weight:bold;" class="${currentPath === 'admin.html' ? 'active' : ''}">پنل ادمین</a></li>`;
        authContainer.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="color:var(--primary-blue); font-weight:bold; font-size: 0.9rem;">ادمین</span>
                <button onclick="logoutAdmin()" class="btn-logout" style="padding: 6px 12px; font-size: 0.85rem;">خروج <i class="fas fa-sign-out-alt"></i></button>
            </div>`;
    } else if (user) {
        menuHTML += `<li><a href="javascript:void(0)" onclick="openCustomerOrders()" style="color:#00cc66; font-weight:bold;">سفارش‌های قبلی</a></li>`;
        authContainer.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="color:var(--primary-blue); font-weight:bold; font-size: 0.9rem;">${user.username}</span>
                <button onclick="logout()" class="btn-logout" style="padding: 6px 12px; font-size: 0.85rem;">خروج <i class="fas fa-sign-out-alt"></i></button>
            </div>`;
    } else {
        authContainer.innerHTML = `<a href="login.html" class="btn" style="padding: 8px 15px; font-size: 0.9rem;">ورود / ثبت‌نام</a>`;
    }
    
    navUl.innerHTML = menuHTML;
    injectGlobalSearch(); 
    updateFooterYear();
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
// ۵. سبد خرید
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

function injectTrackingModal() {
    if (document.getElementById('tracking-modal')) return;
    const modalHTML = `
        <div id="tracking-modal" class="cart-modal" style="display:none; z-index: 3000;">
            <div class="cart-modal-content" style="text-align: center; border-color: #00cc66; padding: 30px;">
                <h2 style="color: #00cc66; margin-bottom: 20px;"><i class="fas fa-check-circle"></i> سفارش ثبت شد!</h2>
                <p style="margin-bottom: 15px;">کد پیگیری شما:</p>
                <div id="display-tracking-code" style="font-size: 2.5rem; font-weight: 900; color: var(--primary-blue); letter-spacing: 5px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px dashed var(--primary-blue);">XXX</div>
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

function generateTrackingCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
}

function checkout() {
    const cart = getCart();
    const user = getCurrentUser();

    if (cart.length === 0) { showToast('سبد خرید شما خالی است!', 'error'); return; }
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
// ۶. سفارش‌های قبلی مشتری
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
// ۷. نوار پیشرفت اسکرول
// =========================================
function injectScrollProgress() {
    if (document.getElementById('scroll-progress-bar')) return;

    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        } else {
            progressBar.style.width = '0%';
        }
    });
}

// =========================================
// ۸. افکت سه‌بعدی (3D Tilt)
// =========================================
function initTiltEffects() {
    const tiltElements = document.querySelectorAll(`
        .product-card, 
        .swiper-slide, 
        .feature-card, 
        .service-mini-card, 
        .contact-card, 
        .service-card
    `);
    
    if (window.matchMedia("(pointer: coarse)").matches) return;

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', handleTilt);
        el.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5; 
    const rotateY = ((x - centerX) / centerX) * 5;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    el.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
    el.style.zIndex = '10'; 
    el.style.boxShadow = '0 15px 30px rgba(0, 210, 255, 0.2)'; 
}

function resetTilt(e) {
    const el = e.currentTarget;
    el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    el.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    el.style.zIndex = ''; 
    el.style.boxShadow = ''; 
}

// =========================================
// ۹. اجرای اولیه
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    updateAuthUI();
    injectScrollProgress();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isAuthPage = currentPage === 'login.html';

    if (!isAuthPage) {
        injectCartUI();
        updateCartUI();
        injectCustomerOrdersModal();
        injectTrackingModal();
        
        setTimeout(initTiltEffects, 500);
    }

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

function updateFooterYear() {
    const stats = JSON.parse(localStorage.getItem('bloxStats')) || {};
    const year = stats.year || '۱۴۰۴';
    document.querySelectorAll('.footer-year-text').forEach(el => {
        el.innerText = year;
    });
}

function toggleMobileMenu() {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('active-mobile-menu');
}