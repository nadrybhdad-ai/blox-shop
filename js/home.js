// js/home.js
const homeItems = JSON.parse(localStorage.getItem('bloxItems')) || [];

function initSlider(category) {
    const wrapper = document.querySelector(`#swiper-${category} .swiper-wrapper`);
    if (!wrapper) return;

    const filtered = homeItems.filter(i => i.category === category);
    
    if (filtered.length === 0) {
        document.querySelector(`#swiper-${category}`).parentElement.style.display = 'none';
        return;
    }

    filtered.forEach(item => {
        const isOutOfStock = item.status === false;
        
        const statusText = isOutOfStock 
            ? `<span style="color:var(--danger); font-size:0.85rem;">(ناموجود)</span>` 
            : `<span style="color:#00cc66; font-size:0.85rem;">(موجود)</span>`;

        const btnHTML = isOutOfStock 
            ? `<button disabled style="margin-top:10px; background:transparent; border:1px solid var(--text-muted); color:var(--text-muted); padding:5px 10px; border-radius:5px; cursor:not-allowed;">افزودن به سبد</button>`
            : `<button onclick="addToCart(${item.id}, '${item.name}', '${item.price}', '${item.img}')" style="margin-top:10px; background:transparent; border:1px solid var(--primary-blue); color:var(--primary-blue); padding:5px 10px; border-radius:5px; cursor:pointer; transition:0.3s;">افزودن به سبد</button>`;

        wrapper.innerHTML += `
            <div class="swiper-slide" style="${isOutOfStock ? 'opacity: 0.8;' : ''}">
                <img src="${item.img}" alt="${item.name}" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}">
                <h4 class="text-${category.toLowerCase()}">${item.name} ${statusText}</h4>
                <p style="color:var(--primary-blue); font-weight:bold; margin-top:5px;">${item.price} تومان</p>
                ${btnHTML}
            </div>
        `;
    });

    // تنظیمات جدید اسلایدر برای نمایش درست آیتم‌های کم
    new Swiper(`#swiper-${category}`, {
        slidesPerView: 'auto', // اجازه میده عرض هر اسلاید از CSS خونده بشه
        spaceBetween: 20,
        centerInsufficientSlides: true, // اگر تعداد آیتم ها کم بود، میره وسط
        navigation: { 
            nextEl: `#swiper-${category} .swiper-button-next`, 
            prevEl: `#swiper-${category} .swiper-button-prev` 
        }
    });
}

initSlider('Mythical');
initSlider('Legendary');
initSlider('Rare');
initSlider('Service');

// نمایش آمار داینامیک در صفحه اصلی
document.addEventListener('DOMContentLoaded', () => {
    const stats = JSON.parse(localStorage.getItem('bloxStats'));
    if (stats) {
        const ordersEl = document.getElementById('stat-orders-display');
        const ratingEl = document.getElementById('stat-rating-display');
        if (ordersEl) ordersEl.innerText = stats.orders;
        if (ratingEl) ratingEl.innerText = stats.rating;
    }
});