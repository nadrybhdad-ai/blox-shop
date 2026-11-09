// js/items.js
const itemsGrid = document.getElementById('items-grid');
const filtersContainer = document.getElementById('filters-container');
const items = getItems();
const categories = getCategories();

// ۱. ساخت دکمه‌های فیلتر
function renderFilters() {
    // دکمه "همه" با رنگ نارنجی پیش‌فرض سایت
    let html = `<button class="filter-btn active" data-filter="all" style="--cat-color: var(--primary-orange);">همه</button>`;
    
    categories.forEach(cat => {
        if(cat.id === 'Service') return; // دسته بندی خدمات در این صفحه نمایش داده نمیشود
        html += `
            <button class="filter-btn" data-filter="${cat.id}" style="--cat-color: ${cat.color};">${cat.name}</button>
        `;
    });

    filtersContainer.innerHTML = html;

    // اضافه کردن رویداد کلیک
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // حذف کلاس active از همه
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // اضافه کردن به دکمه کلیک شده
            e.target.classList.add('active');
            
            renderItems(e.target.dataset.filter);
        });
    });
}

// ۲. نمایش آیتم‌ها
function renderItems(filter = 'all') {
    itemsGrid.innerHTML = '';
    const filtered = filter === 'all' ? items.filter(i => i.category !== 'Service') : items.filter(i => i.category === filter);
    
    filtered.forEach(item => {
        const catInfo = categories.find(c => c.id === item.category) || { color: 'var(--primary-blue)' };
        const isOutOfStock = item.status === false;
        
        const statusBadge = isOutOfStock 
            ? '<div class="badge" style="top:40px; background:var(--danger); color:#fff; font-size:0.75rem;">ناموجود</div>' 
            : '<div class="badge" style="top:40px; background:#00cc66; color:#fff; font-size:0.75rem;">موجود</div>';

        const btnHTML = isOutOfStock 
            ? `<button class="btn-buy" style="background:var(--danger); color:white; border-color:var(--danger); cursor:not-allowed;">ناموجود</button>`
            : `<button class="btn-buy" onclick="addToCart(${item.id}, '${item.name}', '${item.price}', '${item.img}')">افزودن به سبد خرید</button>`;

        itemsGrid.innerHTML += `
            <div class="product-card" style="${isOutOfStock ? 'opacity: 0.8;' : ''}">
                <div class="badge" style="background: ${catInfo.color}; color: #fff;">${item.category}</div>
                ${statusBadge}
                <img src="${item.img}" alt="${item.name}" loading="lazy" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}">
                <h3 style="color: ${catInfo.color};">${item.name}</h3>
                <p class="price">${item.price} تومان</p>
                ${btnHTML}
            </div>
        `;
    });
}

renderFilters();
renderItems();