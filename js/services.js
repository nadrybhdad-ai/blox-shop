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
            // اسلایدر توضیحات
            if (allServices.length === 0) {
                wrapper.innerHTML = '<div class="swiper-slide" style="width:100%; text-align:center; color:var(--text-muted); background:transparent; border:none;">در حال حاضر توضیحاتی ثبت نشده است.</div>';
            } else {
                allServices.forEach(service => {
                    const mediaHTML = service.img 
                        ? `<img src="${service.img}" alt="${service.title}" class="service-card-img" loading="lazy">` 
                        : `<i class="${service.icon}"></i>`;
                        
                    wrapper.innerHTML += `
                        <div class="swiper-slide" style="width: 300px; height: auto;">
                            <div class="service-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 15px; padding: 25px; text-align: center; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.3s;">
                                ${mediaHTML}
                                <h3 style="margin-top: 15px; color: var(--primary-orange);">${service.title}</h3>
                                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-top: 10px;">${service.desc}</p>
                            </div>
                        </div>
                    `;
                });
            }
        } else {
            // اسلایدر خرید
            const catId = slider.categoryId;
            const filtered = allItems.filter(item => item.category === catId);
            const catInfo = categories.find(c => c.id === catId) || { color: 'var(--primary-blue)' };
            
            if (filtered.length === 0) {
                wrapper.innerHTML = '<div class="swiper-slide" style="width:100%; text-align:center; color:var(--text-muted); background:transparent; border:none;">در حال حاضر آیتمی در این دسته ثبت نشده است.</div>';
            } else {
                filtered.forEach(item => {
                    const isOutOfStock = item.status === false;
                    const statusBadge = isOutOfStock 
                        ? '<div class="badge" style="top:40px; background:var(--danger); color:#fff; font-size:0.75rem;">ناموجود</div>' 
                        : '<div class="badge" style="top:40px; background:#00cc66; color:#fff; font-size:0.75rem;">موجود</div>';
                    const btnHTML = isOutOfStock 
                        ? `<button class="btn-buy" style="background:var(--danger); color:white; border-color:var(--danger); cursor:not-allowed;">ناموجود</button>`
                        : `<button class="btn-buy" onclick="addToCart(${item.id})">سفارش خدمت</button>`;

                    wrapper.innerHTML += `
                        <div class="swiper-slide" style="${isOutOfStock ? 'opacity: 0.8;' : ''}; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 15px; padding: 20px; text-align: center; position: relative; width: 260px;">
                            <div class="badge" style="background: ${catInfo.color}; color: #000; font-weight:bold;">${item.category}</div>
                            ${statusBadge}
                            <img src="${item.img}" alt="${item.name}" loading="lazy" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}; width: 120px; height: 120px; object-fit: contain; margin: 30px auto 15px;">
                            <h3 style="color: var(--cat-service); margin-bottom: 10px;">${item.name}</h3>
                            <p class="price" style="color: var(--primary-blue); font-weight: bold; margin-bottom: 15px;">${item.price} تومان</p>
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