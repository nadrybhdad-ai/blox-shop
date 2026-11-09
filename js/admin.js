// js/admin.js

// --- بررسی لاگین ادمین ---
if (localStorage.getItem('bloxAdminLoggedIn') !== 'true') {
    alert('ابتدا باید به عنوان ادمین وارد شوید!');
    window.location.href = 'login.html';
}

// متغیرهای نگهدارنده عکس‌های آپلود شده
let currentImageBase64 = '';
let currentServiceImageBase64 = '';

// =========================================
// ۱. مدیریت دسته‌بندی‌ها
// =========================================
function addCategory() {
    const nameEl = document.getElementById('newCatName');
    const colorEl = document.getElementById('newCatColor');
    if (!nameEl || !colorEl) return;

    const name = nameEl.value.trim();
    const color = colorEl.value;

    if (!name) { alert('نام دسته‌بندی الزامی است!'); return; }
    
    const id = name.replace(/\s+/g, '-').toLowerCase(); 
    let categories = getCategories();

    if (categories.find(c => c.id === id)) {
        alert('این دسته‌بندی قبلاً وجود دارد!');
        return;
    }

    categories.push({ id, name, color });
    try {
        saveCategories(categories);
        nameEl.value = '';
        updateCategoryDropdown();
        renderAdminCategories();
        renderAdminSliders();
        alert('دسته‌بندی جدید با موفقیت اضافه شد!');
    } catch (error) {
        alert('حافظه مرورگر پر شده است! چند آیتم قدیمی را حذف کنید.');
    }
}

function deleteCategory(id) {
    if (id === 'service' || id === 'Service') {
        alert('دسته‌بندی خدمات قابل حذف نیست!');
        return;
    }
    if (confirm(`آیا از حذف دسته‌بندی "${id}" مطمئن هستید؟ (آیتم‌های داخل آن حذف نمی‌شوند اما نمایش داده نمی‌شوند)`)) {
        let categories = getCategories();
        categories = categories.filter(c => c.id !== id);
        saveCategories(categories);
        updateCategoryDropdown();
        renderAdminCategories();
        renderAdminSliders();
    }
}

function moveCategory(id, direction) {
    let categories = getCategories();
    const index = categories.findIndex(c => c.id === id);
    
    if (direction === 'up' && index > 0) {
        [categories[index], categories[index - 1]] = [categories[index - 1], categories[index]];
    } else if (direction === 'down' && index < categories.length - 1) {
        [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
    }
    
    saveCategories(categories);
    renderAdminCategories();
    renderAdminSliders();
}

function renderAdminCategories() {
    const list = document.getElementById('admin-categories-list');
    if (!list) return;
    const categories = getCategories();
    list.innerHTML = '';

    categories.forEach((cat, index) => {
        const upStyle = index === 0 ? 'opacity: 0.3; pointer-events: none;' : '';
        const downStyle = index === categories.length - 1 ? 'opacity: 0.3; pointer-events: none;' : '';

        list.innerHTML += `
            <div class="admin-item-row" style="padding: 8px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color);">
                <div><strong style="color:${cat.color};">${cat.name}</strong></div>
                <div style="display:flex; gap:5px;">
                    <button onclick="moveCategory('${cat.id}', 'up')" style="background:var(--text-muted); color:#fff; border:none; padding:5px; border-radius:5px; cursor:pointer; ${upStyle}"><i class="fas fa-arrow-up"></i></button>
                    <button onclick="moveCategory('${cat.id}', 'down')" style="background:var(--text-muted); color:#fff; border:none; padding:5px; border-radius:5px; cursor:pointer; ${downStyle}"><i class="fas fa-arrow-down"></i></button>
                    <button onclick="deleteCategory('${cat.id}')" style="background:var(--danger); color:#fff; border:none; padding:5px; border-radius:5px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function updateCategoryDropdown() {
    const select = document.getElementById('itemCategory');
    if (!select) return;
    const categories = getCategories();
    select.innerHTML = '';
    categories.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
}

// =========================================
// ۲. مدیریت آمار سایت
// =========================================
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('bloxStats')) || { orders: '', rating: '' };
    const ordersEl = document.getElementById('set-orders');
    const ratingEl = document.getElementById('set-rating');
    if(ordersEl) ordersEl.value = stats.orders;
    if(ratingEl) ratingEl.value = stats.rating;
}

function saveStats() {
    const ordersEl = document.getElementById('set-orders');
    const ratingEl = document.getElementById('set-rating');
    if(!ordersEl || !ratingEl) return;
    
    const orders = ordersEl.value;
    const rating = ratingEl.value;
    localStorage.setItem('bloxStats', JSON.stringify({ orders, rating }));
    alert('آمار سایت با موفقیت به‌روزرسانی شد!');
}

// =========================================
// ۳. مدیریت آیتم‌ها (میوه‌ها/شمشیرها)
// =========================================
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
            if(preview) {
                preview.src = currentImageBase64;
                preview.style.display = 'block';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function saveItem() {
    const idEl = document.getElementById('edit-item-id');
    const nameEl = document.getElementById('itemName');
    const priceEl = document.getElementById('itemPrice');
    const categoryEl = document.getElementById('itemCategory');
    
    if(!idEl || !nameEl || !priceEl || !categoryEl) return;

    const id = idEl.value;
    const name = nameEl.value.trim();
    const price = priceEl.value.trim();
    const category = categoryEl.value;
    
    if (!name || !price) { alert('نام و قیمت الزامی است!'); return; }
    if (!currentImageBase64) { alert('لطفاً یک عکس برای آیتم انتخاب کنید!'); return; }

    let items = getItems();
    if (id) {
        const index = items.findIndex(i => i.id == id);
        if (index > -1) items[index] = { ...items[index], name, price, category, img: currentImageBase64 };
    } else {
        items.push({ id: Date.now(), name, price, category, img: currentImageBase64, status: true });
    }
    
    try {
        saveItems(items);
        resetForm();
        renderAdminSliders();
        alert(id ? 'آیتم ویرایش شد!' : 'آیتم جدید اضافه شد!');
    } catch (error) {
        alert('حافظه پر شده است! چند آیتم حذف کنید.');
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
    if(preview) {
        preview.src = item.img;
        preview.style.display = 'block';
    }
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
    if(preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
    document.getElementById('cancel-btn').style.display = 'none';
}

function deleteItem(id) {
    if (confirm('حذف شود؟')) {
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

// =========================================
// ۴. مدیریت توضیحات خدمات (با عکس)
// =========================================
document.getElementById('serviceImgFile')?.addEventListener('change', function(e) {
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
            currentServiceImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            const preview = document.getElementById('serviceImgPreview');
            if(preview) {
                preview.src = currentServiceImageBase64;
                preview.style.display = 'block';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function saveService() {
    const idEl = document.getElementById('edit-service-id');
    const titleEl = document.getElementById('serviceTitle');
    const descEl = document.getElementById('serviceDesc');
    const iconEl = document.getElementById('serviceIcon');

    if(!idEl || !titleEl || !descEl || !iconEl) return;

    const id = idEl.value;
    const title = titleEl.value.trim();
    const desc = descEl.value.trim();
    const icon = iconEl.value.trim() || 'fas fa-star'; 
    const img = currentServiceImageBase64 || '';

    if (!title || !desc) { alert('عنوان و توضیحات الزامی است!'); return; }

    let services = getServices();
    if (id) {
        const index = services.findIndex(s => s.id == id);
        if (index > -1) services[index] = { ...services[index], title, desc, icon, img };
    } else {
        services.push({ id: Date.now(), title, desc, icon, img });
    }

    try {
        saveServices(services);
        resetServiceForm();
        renderAdminServices();
        alert(id ? 'خدمت ویرایش شد!' : 'خدمت جدید اضافه شد!');
    } catch (error) {
         alert('حافظه پر شده است!');
    }
}

function editService(id) {
    const services = getServices();
    const service = services.find(s => s.id == id);
    if (!service) return;
    
    document.getElementById('service-form-title').innerText = 'ویرایش خدمت';
    document.getElementById('edit-service-id').value = service.id;
    document.getElementById('serviceTitle').value = service.title;
    document.getElementById('serviceDesc').value = service.desc;
    document.getElementById('serviceIcon').value = service.icon;
    
    currentServiceImageBase64 = service.img || '';
    const preview = document.getElementById('serviceImgPreview');
    if(preview) {
        if(service.img) {
            preview.src = service.img;
            preview.style.display = 'block';
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    }

    document.getElementById('cancel-service-btn').style.display = 'block';
    document.getElementById('service-form-card').scrollIntoView({ behavior: 'smooth' });
}

function resetServiceForm() {
    document.getElementById('service-form-title').innerText = 'افزودن خدمت جدید';
    document.getElementById('edit-service-id').value = '';
    document.getElementById('serviceTitle').value = '';
    document.getElementById('serviceDesc').value = '';
    document.getElementById('serviceIcon').value = '';
    
    currentServiceImageBase64 = '';
    document.getElementById('serviceImgFile').value = '';
    const preview = document.getElementById('serviceImgPreview');
    if(preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
    
    document.getElementById('cancel-service-btn').style.display = 'none';
}

function deleteService(id) {
    if (confirm('حذف شود؟')) {
        let services = getServices();
        services = services.filter(s => s.id != id);
        saveServices(services);
        renderAdminServices();
    }
}

function renderAdminServices() {
    const list = document.getElementById('admin-services-list');
    if(!list) return;
    const services = getServices();
    list.innerHTML = '';
    if (services.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">لیست خالی است.</p>';
        return;
    }
    services.forEach(s => {
        const displayMedia = s.img 
            ? `<img src="${s.img}" style="width: 30px; height: 30px; object-fit: contain; border-radius: 4px; vertical-align: middle; margin-left: 5px;">`
            : `<i class="${s.icon}" style="margin-left: 5px;"></i>`;

        list.innerHTML += `
            <div class="admin-item-row" style="padding: 10px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; align-items:center;">
                    ${displayMedia}
                    <strong style="color:var(--primary-blue);">${s.title}</strong>
                </div>
                <div style="display:flex; gap:5px;">
                    <button onclick="editService(${s.id})" style="background:var(--primary-blue); color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteService(${s.id})" style="background:var(--danger); color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

// =========================================
// ۵. ساخت اسلایدرهای داینامیک پنل ادمین
// =========================================
function renderAdminSliders() {
    const container = document.getElementById('admin-sliders-container');
    if(!container) return;
    const categories = getCategories();
    const items = getItems();
    container.innerHTML = ''; 

    categories.forEach(category => {
        const sliderHTML = `
            <div class="slider-section" id="section-${category.id}">
                <h3 style="color: ${category.color};">${category.name}</h3>
                <div class="swiper mySwiper" id="swiper-${category.id}">
                    <div class="swiper-wrapper"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', sliderHTML);

        const wrapper = document.querySelector(`#swiper-${category.id} .swiper-wrapper`);
        const filtered = items.filter(i => i.category === category.id);
        
        if (filtered.length === 0) {
            document.getElementById(`section-${category.id}`).style.display = 'none';
            return;
        }

        filtered.forEach((item, index) => {
            const leftBtnStyle = index === 0 ? 'opacity: 0.3; pointer-events: none;' : '';
            const rightBtnStyle = index === filtered.length - 1 ? 'opacity: 0.3; pointer-events: none;' : '';
            const isAvailable = item.status !== false;
            const statusIcon = isAvailable ? '<i class="fas fa-check-circle" style="color:#fff;"></i>' : '<i class="fas fa-times-circle" style="color:#fff;"></i>';
            const toggleBtnStyle = isAvailable ? 'background: #00cc66; color: #fff;' : 'background: var(--danger); color: #fff;';
            const statusText = isAvailable ? '<span style="color:#00cc66; font-size:0.8rem;">(موجود)</span>' : '<span style="color:var(--danger); font-size:0.8rem;">(ناموجود)</span>';

            wrapper.innerHTML += `
                <div class="swiper-slide" style="${!isAvailable ? 'opacity: 0.8;' : ''}">
                    <div class="admin-actions">
                        <button class="btn-move" onclick="moveItem(${item.id}, 'left')" style="${leftBtnStyle}" title="جابجایی"><i class="fas fa-arrow-right"></i></button>
                        <button class="btn-move" onclick="moveItem(${item.id}, 'right')" style="${rightBtnStyle}" title="جابجایی"><i class="fas fa-arrow-left"></i></button>
                        <button class="btn-edit" onclick="editItem(${item.id})" title="ویرایش"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteItem(${item.id})" title="حذف"><i class="fas fa-trash"></i></button>
                        <button onclick="toggleStatus(${item.id})" style="width:35px; height:35px; border-radius:50%; border:none; cursor:pointer; display:flex; justify-content:center; align-items:center; ${toggleBtnStyle}" title="موجودی">${statusIcon}</button>
                    </div>
                    <img src="${item.img}" alt="${item.name}" loading="lazy" style="height:100px; width:100px; object-fit:contain; border-radius:10px; ${!isAvailable ? 'filter: grayscale(100%);' : ''}">
                    <h4 style="margin-top: 10px; color: ${category.color};">${item.name} ${statusText}</h4>
                    <p style="color:var(--primary-blue); font-weight:bold; margin-top:5px;">${item.price} تومان</p>
                </div>
            `;
        });

        new Swiper(`#swiper-${category.id}`, {
            slidesPerView: 'auto', spaceBetween: 20, centerInsufficientSlides: true,
            navigation: { nextEl: `#swiper-${category.id} .swiper-button-next`, prevEl: `#swiper-${category.id} .swiper-button-prev` }
        });
    });
}

// =========================================
// ۶. مدیریت تم مناسبت‌ها (جدید)
// =========================================
function loadSeasonTheme() {
    const theme = localStorage.getItem('bloxSeasonTheme') || 'default';
    const select = document.getElementById('seasonThemeSelect');
    if (select) select.value = theme;
}

function saveSeasonTheme() {
    const select = document.getElementById('seasonThemeSelect');
    if (!select) return;
    
    const theme = select.value;
    localStorage.setItem('bloxSeasonTheme', theme);
    alert('تم سایت با موفقیت تغییر کرد! صفحه را رفرش کنید تا تغییرات را ببینید.');
}

// =========================================
// اجرای اولیه تمام توابع بعد از لود صفحه
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    updateCategoryDropdown();
    renderAdminCategories();
    renderAdminSliders();
    renderAdminServices();
    loadSeasonTheme(); // <--- اجرای تابع لود تم مناسبت
});