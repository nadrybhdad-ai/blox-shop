// js/items.js

document.addEventListener('DOMContentLoaded', () => {
    const itemsGrid = document.getElementById('items-grid');
    const filtersContainer = document.getElementById('filters-container');
    const emptyState = document.getElementById('empty-state');
    const sortSelect = document.getElementById('sortSelect');
    const headerSearchInput = document.getElementById('globalSearchInput'); 
    
    const allItems = getItems();
    const categories = getCategories();

    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'default';

    // ۱. خواندن پارامتر جستجو از URL (اگر از هدر جستجو شده باشد)
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearch = urlParams.get('search');
    if (urlSearch) {
        currentSearch = urlSearch;
        if (headerSearchInput) headerSearchInput.value = urlSearch; 
    }

    // تابع کمکی برای تبدیل قیمت (رشته) به عدد واقعی برای مرتب‌سازی
    function parsePriceToNumber(priceStr) {
        if (!priceStr) return 0;
        const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
        for (let i = 0; i < 10; i++) {
            priceStr = priceStr.toString().replace(persianNumbers[i], i);
        }
        const numericString = priceStr.replace(/[^\d]/g, '');
        return parseInt(numericString) || 0;
    }

    // ۲. ساخت دکمه‌های فیلتر
    function renderFilters() {
        if(!filtersContainer) return;
        let html = `<button class="filter-btn active" data-filter="all" style="--cat-color: var(--primary-orange);">همه</button>`;
        
        categories.forEach(cat => {
            // 👇 اینجا دقیقا چک میکنیم که فقط دسته بندی های نوع آیتم نمایش داده بشن
            if(cat.type !== 'item') return;
            html += `
                <button class="filter-btn" data-filter="${cat.id}" style="--cat-color: ${cat.color};">${cat.name}</button>
            `;
        });

        filtersContainer.innerHTML = html;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (filtersContainer.dataset.dragging === 'true') {
                    return;
                }

                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                
                if (currentSearch !== '') {
                    currentSearch = '';
                    if(headerSearchInput) headerSearchInput.value = '';
                    window.history.replaceState({}, '', window.location.pathname);
                }
                
                applyFilters();
            });
        });
    }

    // ۳. اعمال همزمان فیلتر، جستجو و مرتب‌سازی
    function applyFilters() {
        let filtered = [];

        if (currentSearch.trim() !== '') {
            filtered = allItems.filter(i => i.name.toLowerCase().includes(currentSearch.toLowerCase().trim()));
        } else {
            // 👇 اینجا هم دقیقا چک میکنیم آیتم هایی که دسته بندی شون از نوع item هست نمایش داده بشن
            filtered = allItems.filter(i => {
                const cat = categories.find(c => c.id === i.category);
                return cat && cat.type === 'item';
            });
            
            if (currentFilter !== 'all') {
                filtered = filtered.filter(i => i.category === currentFilter);
            }
        }

        // مرتب‌سازی (با استفاده از تابع تبدیل قیمت به عدد)
        if (currentSort === 'price-low') {
            filtered.sort((a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price));
        } else if (currentSort === 'price-high') {
            filtered.sort((a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price));
        } else if (currentSort === 'name-az') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        renderItemsHTML(filtered);
    }

    // ۴. رندر کردن HTML کارت‌ها
    function renderItemsHTML(filteredItems) {
        if(!itemsGrid) return;
        itemsGrid.innerHTML = '';
        
        if (filteredItems.length === 0) {
            if(emptyState) emptyState.style.display = 'block';
            return;
        }
        if(emptyState) emptyState.style.display = 'none';

        filteredItems.forEach(item => {
            const catInfo = categories.find(c => c.id === item.category) || { color: 'var(--primary-blue)' };
            const isOutOfStock = item.status === false;
            
            const btnHTML = isOutOfStock 
                ? `<button class="btn-buy" style="background:var(--danger); color:white; border-color:var(--danger); cursor:not-allowed;">ناموجود</button>`
                : `<button class="btn-buy" onclick="addToCart(${item.id})">افزودن به سبد خرید</button>`;

            itemsGrid.innerHTML += `
                <div class="product-card" style="${isOutOfStock ? 'opacity: 0.8;' : ''}">
                    
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

    // ۵. رویدادهای مربوط به جستجو و مرتب‌سازی
    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            applyFilters();
            
            const newUrl = currentSearch ? `?search=${encodeURIComponent(currentSearch)}` : window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFilters();
        });
    }

    // ۶. قابلیت کشیدن با موس (Drag to scroll) برای اسلایدر فیلترها
    let isDown = false;
    let startX;
    let scrollLeft;

    if (filtersContainer) {
        filtersContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            filtersContainer.dataset.dragging = 'false';
            filtersContainer.style.cursor = 'grabbing';
            startX = e.pageX - filtersContainer.offsetLeft;
            scrollLeft = filtersContainer.scrollLeft;
        });

        filtersContainer.addEventListener('mouseleave', () => {
            isDown = false;
            filtersContainer.style.cursor = 'grab';
        });

        filtersContainer.addEventListener('mouseup', () => {
            isDown = false;
            filtersContainer.style.cursor = 'grab';
            setTimeout(() => { filtersContainer.dataset.dragging = 'false'; }, 50);
        });

        filtersContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - filtersContainer.offsetLeft;
            const walk = (x - startX) * 2; 
            
            if (Math.abs(walk) > 5) {
                filtersContainer.dataset.dragging = 'true';
            }
            
            filtersContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // اجرای اولیه
    renderFilters();
    applyFilters();
});