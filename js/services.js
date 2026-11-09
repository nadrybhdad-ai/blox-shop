// js/services.js

// =========================================
// ۱. رندر کردن توضیحات خدمات (کارت‌های بالای صفحه)
// =========================================
const servicesDescGrid = document.getElementById('services-desc-grid');
const serviceDescriptions = JSON.parse(localStorage.getItem('bloxServices')) || [];

function renderServiceDescriptions() {
    if (!servicesDescGrid) return;
    servicesDescGrid.innerHTML = '';

    if (serviceDescriptions.length === 0) {
        servicesDescGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--text-muted);">در حال حاضر توضیحاتی برای خدمات ثبت نشده است.</p>';
        return;
    }

    serviceDescriptions.forEach(service => {
        // بررسی وجود عکس برای خدمت
        const mediaHTML = service.img 
            ? `<img src="${service.img}" alt="${service.title}" class="service-card-img" loading="lazy">`
            : `<i class="${service.icon}"></i>`;

        servicesDescGrid.innerHTML += `
            <div class="service-card">
                ${mediaHTML}
                <h3>${service.title}</h3>
                <p>${service.desc}</p>
            </div>
        `;
    });
}

// =========================================
// ۲. رندر کردن آیتم‌های خریدنی (Level Up)
// =========================================
const servicesGrid = document.getElementById('services-grid');
const allItems = JSON.parse(localStorage.getItem('bloxItems')) || [];

function renderServices() {
    if (!servicesGrid) return;
    servicesGrid.innerHTML = '';
    
    const filtered = allItems.filter(item => item.category === 'Service');
    
    if (filtered.length === 0) {
        servicesGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:var(--text-muted);">در حال حاضر خدمتی برای فروش ثبت نشده است.</p>';
        return;
    }

    filtered.forEach(item => {
        const isOutOfStock = item.status === false;
        
        const statusBadge = isOutOfStock 
            ? '<div class="badge" style="top:40px; background:var(--danger); color:#fff; font-size:0.75rem;">ناموجود</div>' 
            : '<div class="badge" style="top:40px; background:#00cc66; color:#fff; font-size:0.75rem;">موجود</div>';

        const btnHTML = isOutOfStock 
            ? `<button class="btn-buy" style="background:var(--danger); color:white; border-color:var(--danger); cursor:not-allowed;">ناموجود</button>`
            : `<button class="btn-buy" onclick="addToCart(${item.id}, '${item.name}', '${item.price}', '${item.img}')">سفارش خدمت</button>`;

        servicesGrid.innerHTML += `
            <div class="product-card" style="${isOutOfStock ? 'opacity: 0.8;' : ''}">
                <div class="badge" style="background: var(--cat-service); color: #000; font-weight:bold;">سرویس</div>
                ${statusBadge}
                <img src="${item.img}" alt="${item.name}" loading="lazy" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}">
                <h3>${item.name}</h3>
                <p class="price">${item.price} تومان</p>
                ${btnHTML}
            </div>
        `;
    });
}

// =========================================
// اجرای توابع
// =========================================
renderServiceDescriptions();
renderServices();