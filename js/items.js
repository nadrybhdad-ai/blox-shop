// js/items.js
const itemsGrid = document.getElementById('items-grid');
const items = JSON.parse(localStorage.getItem('bloxItems')) || [];

function renderItems(filter = 'all') {
    itemsGrid.innerHTML = '';
    const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
    
    filtered.forEach(item => {
        const catClass = `text-${item.category.toLowerCase()}`;
        const isOutOfStock = item.status === false;
        
        // تعیین وضعیت موجودی
        const statusBadge = isOutOfStock 
            ? '<div class="badge" style="top:40px; background:var(--danger); color:#fff; font-size:0.75rem;">ناموجود</div>' 
            : '<div class="badge" style="top:40px; background:#00cc66; color:#fff; font-size:0.75rem;">موجود</div>';

        // اگر ناموجود بود، دکمه غیرفعال و قرمز میشه
        const btnHTML = isOutOfStock 
            ? `<button class="btn-buy" style="background:var(--danger); color:white; border-color:var(--danger); cursor:not-allowed;">ناموجود</button>`
            : `<button class="btn-buy" onclick="addToCart(${item.id}, '${item.name}', '${item.price}', '${item.img}')">افزودن به سبد خرید</button>`;

        itemsGrid.innerHTML += `
            <div class="product-card" style="${isOutOfStock ? 'opacity: 0.8;' : ''}">
                <div class="badge" style="background: var(--cat-${item.category.toLowerCase()}); color: #fff;">${item.category}</div>
                ${statusBadge}
                <img src="${item.img}" alt="${item.name}" style="${isOutOfStock ? 'filter: grayscale(100%);' : ''}">
                <h3 class="${catClass}">${item.name}</h3>
                <p class="price">${item.price} تومان</p>
                ${btnHTML}
            </div>
        `;
    });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderItems(e.target.dataset.filter);
    });
});

renderItems();