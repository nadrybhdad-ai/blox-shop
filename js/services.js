// js/services.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('service-sliders-container');
    if (!container) return;
    
    const sliders = getServiceSliders();
    const allItems = getItems();
    const allServices = getServices();
    const categories = getCategories();

    let html = '';
    sliders.forEach((slider) => {
        html += `
            <div class="slider-section" style="margin-bottom: 50px;">
                <h2 class="page-title" style="margin-top: 30px; text-align: right; border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">${slider.title}</h2>
                <div class="swiper mySwiper" id="service-slider-${slider.id}" style="padding-bottom: 40px;">
                    <div class="swiper-wrapper" id="service-wrapper-${slider.id}"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;

    sliders.forEach(slider => {
        const wrapper = document.getElementById(`service-wrapper-${slider.id}`);
        if (!wrapper) return;

        if (slider.type === 'services') {
            // اسلایدر توضیحات خدمات
            if (allServices.length === 0) {
                wrapper.innerHTML = '<div class="swiper-slide" style="width:100%; text-align:center; color:var(--text-muted); background:transparent; border:none;">در حال حاضر توضیحاتی ثبت نشده است.</div>';
            } else {
                // 👇 مرتب‌سازی: کارتی که اسمش "سایر خدمات" داره همیشه میره آخر لیست 👇
                const sortedServices = [...allServices].sort((a, b) => {
                    const aIsOther = a.title.includes('سایر خدمات') || a.title.includes('سایر');
                    const bIsOther = b.title.includes('سایر خدمات') || b.title.includes('سایر');
                    if (aIsOther && !bIsOther) return 1;  // a بره بعد
                    if (!aIsOther && bIsOther) return -1; // b بره بعد
                    return 0; // ترتیب عادی
                });

                sortedServices.forEach(service => {
                    const mediaHTML = service.img 
                        ? `<img src="${service.img}" alt="${service.title}" class="service-card-img" loading="lazy">` 
                        : `<i class="${service.icon}"></i>`;
                        
                    wrapper.innerHTML += `
                        <div class="swiper-slide" style="width: 300px; height: auto; display: flex;">
                            <div class="service-card">
                                ${mediaHTML}
                                <h3>${service.title}</h3>
                                <p>${service.desc}</p>
                            </div>
                        </div>
                    `;
                });
            }
        } else {
            // اسلایدر خرید (آیتم‌های داخل دسته خدمات)
            const catId = slider.categoryId;
            const filtered = allItems.filter(item => item.category === catId);
            const catInfo = categories.find(c => c.id === catId) || { color: 'var(--primary-blue)' };
            
            if (filtered.length === 0) {
                wrapper.innerHTML = '<div class="swiper-slide" style="width:100%; text-align:center; color:var(--text-muted); background:transparent; border:none;">در حال حاضر آیتمی در این دسته ثبت نشده است.</div>';
            } else {
                filtered.forEach(item => {
                    const isOutOfStock = item.status === false;
                    
                    const btnHTML = isOutOfStock 
                        ? `<button disabled class="btn-add-cart out-of-stock" style="margin-top: auto;">ناموجود</button>`
                        : `<button onclick="addToCart(${item.id})" class="btn-add-cart" style="margin-top: auto;">سفارش خدمت</button>`;

                    wrapper.innerHTML += `
                        <div class="swiper-slide" style="
                            ${isOutOfStock ? 'opacity: 0.8;' : ''} 
                            width: 260px !important; 
                            padding: 20px; 
                            background: var(--card-bg); 
                            border: 1px solid var(--border-color); 
                            border-radius: 15px; 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            box-sizing: border-box;
                            position: relative;
                        ">
                            <div class="product-badges" style="position: absolute; top: 15px; right: 15px; display: flex; flex-direction: column; gap: 8px; z-index: 10;">
                                <div class="badge" style="background: ${catInfo.color}; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 900; color: #fff; min-width: 80px; text-align: center;">${item.category}</div>
                                <div class="badge" style="background: ${isOutOfStock ? 'var(--danger)' : '#00cc66'}; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 900; color: #fff; min-width: 80px; text-align: center;">${isOutOfStock ? 'ناموجود' : 'موجود'}</div>
                            </div>

                            <img src="${item.img}" alt="${item.name}" loading="lazy" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}; width: 120px; height: 120px; object-fit: contain; margin: 35px auto 15px auto;">
                            
                            <div class="product-info" style="text-align: center; width: 100%; flex-grow: 1; display: flex; flex-direction: column;">
                                <h3 style="color: ${catInfo.color}; margin-bottom: 8px; font-size: 1.3rem; font-weight: 900;">${item.name}</h3>
                                <p class="price" style="color: var(--primary-blue); font-weight: bold; font-size: 1.1rem; margin-bottom: 20px;">${item.price} تومان</p>
                            </div>
                            
                            ${btnHTML}
                        </div>
                    `;
                });
            }
        }

        new Swiper(`#service-slider-${slider.id}`, {
            slidesPerView: 'auto',
            spaceBetween: 20,
            centerInsufficientSlides: true,
            navigation: {
                nextEl: `#service-slider-${slider.id} .swiper-button-next`,
                prevEl: `#service-slider-${slider.id} .swiper-button-prev`
            }
        });
    });
});