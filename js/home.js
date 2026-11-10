// js/home.js
const homeItems = JSON.parse(localStorage.getItem('bloxItems')) || [];
const categories = JSON.parse(localStorage.getItem('bloxCategories')) || [];

// ۱. رندر اسلایدرها
function renderHomeSliders() {
    const container = document.getElementById('home-sliders-container');
    if (!container) return;
    container.innerHTML = '';

    categories.forEach(category => {
        // اسلایدر "خدمات" را در صفحه خانه نشان نمی‌دهیم (case-insensitive)
        if (category.id.toLowerCase() === 'service') return;

        const filtered = homeItems.filter(i => i.category === category.id);
        if (filtered.length === 0) return; 

        const sliderHTML = `
            <div class="slider-section">
                <h3 style="color: ${category.color}; border-bottom-color: ${category.color};">${category.name}</h3>
                <div class="swiper mySwiper" id="swiper-${category.id}">
                    <div class="swiper-wrapper"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', sliderHTML);

        const wrapper = document.querySelector(`#swiper-${category.id} .swiper-wrapper`);
        
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
                    <h4 style="color: ${category.color};">${item.name} ${statusText}</h4>
                    <p style="color:var(--primary-blue); font-weight:bold; margin-top:5px;">${item.price} تومان</p>
                    ${btnHTML}
                </div>
            `;
        });

        new Swiper(`#swiper-${category.id}`, {
            slidesPerView: 'auto', spaceBetween: 20, centerInsufficientSlides: true,
            navigation: { nextEl: `#swiper-${category.id} .swiper-button-next`, prevEl: `#swiper-${category.id} .swiper-button-prev` }
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
        banner.innerHTML = '';
        
        serviceDescs.slice(0, 4).forEach(service => {
            banner.innerHTML += `
                <div class="service-mini-card">
                    <i class="${service.icon}"></i>
                    <h3>${service.title}</h3>
                    <p>${service.desc.substring(0, 35)}...</p>
                </div>
            `;
        });
        
        if (viewAllBtn) banner.appendChild(viewAllBtn);
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