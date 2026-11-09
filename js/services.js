// js/services.js

// =========================================
// ۱. رندر کردن توضیحات خدمات در اسلایدر
// =========================================
const servicesDescWrapper = document.getElementById('services-desc-wrapper');
const serviceDescriptions = JSON.parse(localStorage.getItem('bloxServices')) || [];

function renderServiceDescriptions() {
    if (!servicesDescWrapper) return;
    servicesDescWrapper.innerHTML = '';

    if (serviceDescriptions.length === 0) {
        servicesDescWrapper.innerHTML = '<div class="swiper-slide" style="width:100%; text-align:center; color:var(--text-muted); background:transparent; border:none;">در حال حاضر توضیحاتی برای خدمات ثبت نشده است.</div>';
        return;
    }

    serviceDescriptions.forEach(service => {
        const mediaHTML = service.img 
            ? `<img src="${service.img}" alt="${service.title}" class="service-card-img" loading="lazy">`
            : `<i class="${service.icon}"></i>`;

        servicesDescWrapper.innerHTML += `
            <div class="swiper-slide" style="width: 300px; height: auto;">
                <div class="service-card">
                    ${mediaHTML}
                    <h3>${service.title}</h3>
                    <p>${service.desc}</p>
                </div>
            </div>
        `;
    });

    // راه‌اندازی اسلایدر توضیحات
    new Swiper('#services-desc-slider', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        centerInsufficientSlides: true,
        navigation: {
            nextEl: '#services-desc-slider .swiper-button-next',
            prevEl: '#services-desc-slider .swiper-button-prev'
        }
    });
}

// =========================================
// ۲. رندر کردن آیتم‌های خریدنی (Level Up) در اسلایدر پایین
// =========================================
const servicesSliderWrapper = document.querySelector('#services-slider .swiper-wrapper');
const allItems = JSON.parse(localStorage.getItem('bloxItems')) || [];

function renderServicesSlider() {
    if (!servicesSliderWrapper) return;
    servicesSliderWrapper.innerHTML = '';
    
    const filtered = allItems.filter(item => item.category === 'Service');
    
    if (filtered.length === 0) {
        servicesSliderWrapper.innerHTML = '<div class="swiper-slide" style="width:100%; text-align:center; color:var(--text-muted); background:transparent; border:none;">در حال حاضر خدمتی برای فروش ثبت نشده است.</div>';
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

        servicesSliderWrapper.innerHTML += `
            <div class="swiper-slide" style="${isOutOfStock ? 'opacity: 0.8;' : ''}">
                <div class="badge" style="background: var(--cat-service); color: #000; font-weight:bold;">سرویس</div>
                ${statusBadge}
                <img src="${item.img}" alt="${item.name}" loading="lazy" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}">
                <h3>${item.name}</h3>
                <p class="price">${item.price} تومان</p>
                ${btnHTML}
            </div>
        `;
    });

    // راه‌اندازی اسلایدر خرید
    new Swiper('#services-slider', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        centerInsufficientSlides: true,
        navigation: {
            nextEl: '#services-slider .swiper-button-next',
            prevEl: '#services-slider .swiper-button-prev'
        }
    });
}

// اجرای توابع
renderServiceDescriptions();
renderServicesSlider();