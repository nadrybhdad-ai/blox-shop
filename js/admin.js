// js/admin.js

// چک کردن لاگین
if (localStorage.getItem('bloxAdminLoggedIn') !== 'true') {
    alert('ابتدا باید به عنوان ادمین وارد شوید!');
    window.location.href = 'login.html';
}

function logoutAdmin() {
    localStorage.removeItem('bloxAdminLoggedIn');
    window.location.href = 'index.html';
}

function getItems() { return JSON.parse(localStorage.getItem('bloxItems')) || []; }
function saveItems(items) { localStorage.setItem('bloxItems', JSON.stringify(items)); }

let currentImageBase64 = '';

document.getElementById('itemImgFile')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            currentImageBase64 = canvas.toDataURL('image/jpeg', 0.7);

            const preview = document.getElementById('imagePreview');
            preview.src = currentImageBase64;
            preview.style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function loadStats() {
    const stats = JSON.parse(localStorage.getItem('bloxStats')) || { orders: '', rating: '' };
    document.getElementById('set-orders').value = stats.orders;
    document.getElementById('set-rating').value = stats.rating;
}

function saveStats() {
    const orders = document.getElementById('set-orders').value;
    const rating = document.getElementById('set-rating').value;
    localStorage.setItem('bloxStats', JSON.stringify({ orders, rating }));
    alert('آمار سایت با موفقیت به‌روزرسانی شد!');
}

function saveItem() {
    const id = document.getElementById('edit-item-id').value;
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const category = document.getElementById('itemCategory').value;
    
    if (!name || !price) { alert('نام و قیمت الزامی است!'); return; }
    if (!currentImageBase64) { alert('لطفاً یک عکس برای آیتم انتخاب کنید!'); return; }

    let items = getItems();

    if (id) {
        const index = items.findIndex(i => i.id == id);
        if (index > -1) {
            items[index] = { ...items[index], name, price, category, img: currentImageBase64 };
        }
    } else {
        const newItem = { id: Date.now(), name, price, category, img: currentImageBase64, status: true };
        items.push(newItem);
    }

    try {
        saveItems(items);
        resetForm();
        renderAdminSliders();
        alert(id ? 'آیتم با موفقیت ویرایش شد!' : 'آیتم جدید با موفقیت اضافه شد!');
    } catch (error) {
        alert('حافظه مرورگر شما پر شده است! لطفاً چند آیتم قدیمی را حذف کنید.');
    }
}

function editItem(id) {
    const items = getItems();
    const item = items.find(i => i.id == id);
    if (!item) return;

    document.getElementById('form-title').innerText = 'ویرایش آیتم';
    document.getElementById('edit-item-id').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemCategory').value = item.category;
    
    currentImageBase64 = item.img;
    const preview = document.getElementById('imagePreview');
    preview.src = item.img;
    preview.style.display = 'block';

    document.getElementById('cancel-btn').style.display = 'block';
    document.getElementById('form-card').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('form-title').innerText = 'افزودن آیتم جدید';
    document.getElementById('edit-item-id').value = '';
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    
    currentImageBase64 = '';
    document.getElementById('itemImgFile').value = '';
    const preview = document.getElementById('imagePreview');
    preview.src = '';
    preview.style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';
}

function deleteItem(id) {
    if (confirm('آیا از حذف این آیتم مطمئن هستید؟')) {
        let items = getItems();
        items = items.filter(i => i.id != id);
        saveItems(items);
        renderAdminSliders();
    }
}

function moveItem(id, direction) {
    let items = getItems();
    const index = items.findIndex(i => i.id == id);
    
    if (direction === 'left' && index > 0) {
        [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === 'right' && index < items.length - 1) {
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }
    
    saveItems(items);
    renderAdminSliders();
}

function toggleStatus(id) {
    let items = getItems();
    const index = items.findIndex(i => i.id == id);
    if (index > -1) {
        items[index].status = items[index].status === false ? true : false;
        saveItems(items);
        renderAdminSliders();
    }
}

function renderAdminSliders() {
    const categories = ['Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common', 'Service'];
    const items = getItems();

    categories.forEach(category => {
        const sliderEl = document.getElementById(`swiper-${category}`);
        if (!sliderEl) return; 
        const wrapper = sliderEl.querySelector('.swiper-wrapper');
        wrapper.innerHTML = ''; 
        
        if (sliderEl.swiper) {
            sliderEl.swiper.destroy(true, true);
        }

        const filtered = items.filter(i => i.category === category);
        
        if (filtered.length === 0) {
            sliderEl.parentElement.style.display = 'none';
            return;
        } else {
            sliderEl.parentElement.style.display = 'block';
        }

        filtered.forEach((item, index) => {
            const leftBtnStyle = index === 0 ? 'opacity: 0.3; pointer-events: none;' : '';
            const rightBtnStyle = index === filtered.length - 1 ? 'opacity: 0.3; pointer-events: none;' : '';
            const isAvailable = item.status !== false;
            const statusIcon = isAvailable ? '<i class="fas fa-check-circle" style="color:#fff;"></i>' : '<i class="fas fa-times-circle" style="color:#fff;"></i>';
            const toggleBtnStyle = isAvailable ? 'background: #00cc66; color: #fff;' : 'background: var(--danger); color: #fff;';
            const statusText = isAvailable 
                ? '<span style="color:#00cc66; font-size:0.8rem;">(موجود)</span>' 
                : '<span style="color:var(--danger); font-size:0.8rem;">(ناموجود)</span>';

            wrapper.innerHTML += `
                <div class="swiper-slide" style="${!isAvailable ? 'opacity: 0.8;' : ''}">
                    <div class="admin-actions">
                        <button class="btn-move" onclick="moveItem(${item.id}, 'left')" style="${leftBtnStyle}" title="جابجایی"><i class="fas fa-arrow-right"></i></button>
                        <button class="btn-move" onclick="moveItem(${item.id}, 'right')" style="${rightBtnStyle}" title="جابجایی"><i class="fas fa-arrow-left"></i></button>
                        <button class="btn-edit" onclick="editItem(${item.id})" title="ویرایش"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteItem(${item.id})" title="حذف"><i class="fas fa-trash"></i></button>
                        
                        <button onclick="toggleStatus(${item.id})" style="width:35px; height:35px; border-radius:50%; border:none; cursor:pointer; display:flex; justify-content:center; align-items:center; ${toggleBtnStyle}" title="تغییر وضعیت موجودی">
                            ${statusIcon}
                        </button>
                    </div>

                    <img src="${item.img}" alt="${item.name}" loading="lazy" style="height:100px; width:100px; object-fit:contain; border-radius:10px; ${!isAvailable ? 'filter: grayscale(100%);' : ''}">
                    <h4 class="text-${category.toLowerCase()}" style="margin-top: 10px;">${item.name} ${statusText}</h4>
                    <p style="color:var(--primary-blue); font-weight:bold; margin-top:5px;">${item.price} تومان</p>
                </div>
            `;
        });

        new Swiper(`#swiper-${category}`, {
            slidesPerView: 'auto',
            spaceBetween: 20,
            centerInsufficientSlides: true,
            navigation: { 
                nextEl: `#swiper-${category} .swiper-button-next`, 
                prevEl: `#swiper-${category} .swiper-button-prev` 
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    renderAdminSliders();
});