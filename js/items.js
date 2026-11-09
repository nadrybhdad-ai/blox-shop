// js/items.js
const itemsGrid = document.getElementById('items-grid');
const filtersContainer = document.getElementById('filters-container');
const items = getItems();
const categories = getCategories();

// ۱. ساخت دکمه‌های فیلتر
function renderFilters() {
    let html = `<button class="filter-btn active" data-filter="all" style="--cat-color: var(--primary-orange);">همه</button>`;
    
    categories.forEach(cat => {
        if(cat.id === 'Service') return;
        html += `
            <button class="filter-btn" data-filter="${cat.id}" style="--cat-color: ${cat.color};">${cat.name}</button>
        `;
    });

    filtersContainer.innerHTML = html;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
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
        
        const btnHTML = isOutOfStock 
            ? `<button class="btn-buy" style="background:var(--danger); color:white; border-color:var(--danger); cursor:not-allowed;">ناموجود</button>`
            : `<button class="btn-buy" onclick="addToCart(${item.id}, '${item.name}', '${item.price}', '${item.img}')">افزودن به سبد خرید</button>`;

        itemsGrid.innerHTML += `
            <div class="product-card" style="${isOutOfStock ? 'opacity: 0.8;' : ''}">
                
                <!-- باکس برچسب‌ها (دسته‌بندی و موجودی) -->
                <div class="product-badges">
                    <div class="badge" style="background: ${catInfo.color};">${item.category}</div>
                    <div class="badge" style="background: ${isOutOfStock ? 'var(--danger)' : '#00cc66'};">${isOutOfStock ? 'ناموجود' : 'موجود'}</div>
                </div>

                <img src="${item.img}" alt="${item.name}" loading="lazy" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}">
                
                <div class="product-info">
                    <h3 style="color: ${catInfo.color};">${item.name}</h3>
                    <p class="price">${item.price} تومان</p>
                </div>
                
                ${btnHTML}
            </div>
        `;
    });
}

renderFilters();
renderItems();