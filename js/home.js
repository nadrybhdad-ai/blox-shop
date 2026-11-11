// js/home.js
const categories = JSON.parse(localStorage.getItem('bloxCategories')) || [];

// ۱. رندر اسلایدرها (داینامیک از تنظیمات ادمین)
function renderHomeSliders() {
    const container = document.getElementById('home-sliders-container');
    if (!container) return;
    container.innerHTML = '';

    const sliders = getHomeSliders(); // از app.js میاد
    const homeItems = getItems();

    sliders.forEach(slider => {
        const filtered = homeItems.filter(i => i.category === slider.categoryId);
        if (filtered.length === 0) return; 

        const catInfo = categories.find(c => c.id === slider.categoryId) || { color: 'var(--primary-blue)' };

        const sliderHTML = `
            <div class="slider-section">
                <h3 style="color: ${catInfo.color}; border-bottom-color: ${catInfo.color};">${slider.title}</h3>
                <div class="swiper mySwiper" id="swiper-${slider.id}">
                    <div class="swiper-wrapper"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', sliderHTML);

        const wrapper = document.querySelector(`#swiper-${slider.id} .swiper-wrapper`);
        
        filtered.forEach(item => {
            const isOutOfStock = item.status === false;
            const statusText = isOutOfStock 
                ? `<span style="color:var(--danger); font-size:0.85rem;">(ناموجود)</span>` 
                : `<span style="color:#00cc66; font-size:0.85rem;">(موجود)</span>`;

            const btnHTML = isOutOfStock 
                ? `<button disabled style="margin-top:10px; background:transparent; border:1px solid var(--text-muted); color:var(--text-muted); padding:5px 10px; border-radius:5px; cursor:not-allowed;">افزودن به سبد</button>`
                : `<button onclick="addToCart(${item.id})" style="margin-top:10px; background:transparent; border:1px solid var(--primary-blue); color:var(--primary-blue); padding:5px 10px; border-radius:5px; cursor:pointer; transition:0.3s;">افزودن به سبد</button>`;

            wrapper.innerHTML += `
                <div class="swiper-slide" style="${isOutOfStock ? 'opacity: 0.8;' : ''}">
                    <img src="${item.img}" alt="${item.name}" loading="lazy" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}">
                    <h4 style="color: ${catInfo.color};">${item.name} ${statusText}</h4>
                    <p style="color:var(--primary-blue); font-weight:bold; margin-top:5px;">${item.price} تومان</p>
                    ${btnHTML}
                </div>
            `;
        });

        new Swiper(`#swiper-${slider.id}`, {
            slidesPerView: 'auto', spaceBetween: 20, centerInsufficientSlides: true,
            navigation: { nextEl: `#swiper-${slider.id} .swiper-button-next`, prevEl: `#swiper-${slider.id} .swiper-button-prev` }
        });
    });
}

// ۲. رندر بنر خدمات در صفحه اصلی
function renderHomeServicesBanner() {
    const banner = document.querySelector('.services-banner');
    if (!banner) return;

    const serviceDescs = JSON.parse(localStorage.getItem('bloxServices')) || [];
    const viewAllBtn = banner.querySelector('a');

    if (serviceDescs.length > 0) {
        let html = '';
        
        // ساخت کارت‌های خدمات
        serviceDescs.slice(0, 4).forEach(service => {
            html += `
                <div class="service-mini-card">
                    <i class="${service.icon}"></i>
                    <h3>${service.title}</h3>
                    <p>${service.desc.substring(0, 35)}...</p>
                </div>
            `;
        });
        
        // قرار دادن دکمه در یک ردیف جداگانه در پایین
        if (viewAllBtn) {
            html += `
                <div style="width: 100%; display: flex; justify-content: center; margin-top: 15px;">
                    <a href="services.html" class="btn-primary" style="min-width: 200px;">مشاهده تمام خدمات</a>
                </div>
            `;
        }
        
        banner.innerHTML = html;
    }
}
// ۳. نمایش آمار
document.addEventListener('DOMContentLoaded', () => {
    const stats = JSON.parse(localStorage.getItem('bloxStats'));
    if (stats) {
        const ordersEl = document.getElementById('stat-orders-display');
        const ratingEl = document.getElementById('stat-rating-display');
        if (ordersEl) ordersEl.innerText = stats.orders;
        if (ratingEl) ratingEl.innerText = stats.rating;
    }
});

// اجرا
renderHomeSliders();
renderHomeServicesBanner();