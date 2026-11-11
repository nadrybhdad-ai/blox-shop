// js/admin.js

if (localStorage.getItem('bloxAdminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

let currentImageBase64 = '';
let currentServiceImageBase64 = '';
let adminSwipers = [];

// =========================================
// ۱. مدیریت دسته‌بندی‌ها
// =========================================
function addCategory() {
    const name = document.getElementById('newCatName').value.trim();
    const color = document.getElementById('newCatColor').value;
    if (!name) { showToast('نام دسته‌بندی الزامی است!', 'error'); return; }
    
    const id = name.replace(/\s+/g, '-').toLowerCase(); 
    let categories = getCategories();
    if (categories.find(c => c.id.toLowerCase() === id.toLowerCase())) {
        showToast('این دسته‌بندی وجود دارد!', 'error');
        return;
    }

    categories.push({ id, name, color });
    saveCategories(categories);
    document.getElementById('newCatName').value = '';
    updateCategoryDropdown();
    renderAdminCategories();
    renderAdminSliders();
    updateServiceSliderCategoryDropdown();
    updateHomeSliderCategoryDropdown(); // آپدیت منوی خانه
    showToast('دسته‌بندی جدید اضافه شد!', 'success');
}

function deleteCategory(id) {
    if (id.toLowerCase() === 'service') {
        showToast('دسته‌بندی خدمات قابل حذف نیست!', 'error');
        return;
    }
    if (confirm(`حذف دسته‌بندی "${id}"؟`)) {
        saveCategories(getCategories().filter(c => c.id !== id));
        updateCategoryDropdown();
        renderAdminCategories();
        renderAdminSliders();
        updateServiceSliderCategoryDropdown();
        updateHomeSliderCategoryDropdown(); // آپدیت منوی خانه
    }
}

function moveCategory(id, direction) {
    let categories = getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (direction === 'up' && index > 0) [categories[index], categories[index - 1]] = [categories[index - 1], categories[index]];
    else if (direction === 'down' && index < categories.length - 1) [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
    saveCategories(categories);
    renderAdminCategories();
    renderAdminSliders();
}

function renderAdminCategories() {
    const list = document.getElementById('admin-categories-list');
    if (!list) return;
    list.innerHTML = '';
    getCategories().forEach((cat, index) => {
        const upStyle = index === 0 ? 'opacity: 0.3; pointer-events: none;' : '';
        const downStyle = index === getCategories().length - 1 ? 'opacity: 0.3; pointer-events: none;' : '';
        list.innerHTML += `
            <div class="admin-item-row" style="padding: 8px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color);">
                <div><strong style="color:${cat.color};">${cat.name}</strong></div>
                <div style="display:flex; gap:5px;">
                    <button onclick="moveCategory('${cat.id}', 'up')" style="background:var(--text-muted); color:#fff; border:none; padding:5px; border-radius:5px; ${upStyle}"><i class="fas fa-arrow-up"></i></button>
                    <button onclick="moveCategory('${cat.id}', 'down')" style="background:var(--text-muted); color:#fff; border:none; padding:5px; border-radius:5px; ${downStyle}"><i class="fas fa-arrow-down"></i></button>
                    <button onclick="deleteCategory('${cat.id}')" style="background:var(--danger); color:#fff; border:none; padding:5px; border-radius:5px;"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
    });
}

function updateCategoryDropdown() {
    const select = document.getElementById('itemCategory');
    if (!select) return;
    select.innerHTML = '';
    getCategories().forEach(cat => select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`);
}

// =========================================
// ۱.۵. مدیریت اسلایدرهای صفحه خدمات
// =========================================
function updateServiceSliderCategoryDropdown() {
    const select = document.getElementById('newSliderCategory');
    if (!select) return;
    select.innerHTML = '';
    getCategories().forEach(cat => select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`);
}

document.getElementById('newSliderType')?.addEventListener('change', function(e) {
    const catSelect = document.getElementById('newSliderCategory');
    if (catSelect) catSelect.style.display = e.target.value === 'items' ? 'block' : 'none';
});

function renderAdminServiceSliders() {
    const list = document.getElementById('admin-service-sliders-list');
    if (!list) return;
    list.innerHTML = '';
    const sliders = getServiceSliders();
    
    sliders.forEach((slider, index) => {
        const typeLabel = slider.type === 'services' ? 'توضیحات خدمات' : `لیست آیتم‌ها (دسته: ${slider.categoryId})`;
        list.innerHTML += `
            <div class="admin-item-row" style="padding: 10px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); background:rgba(0,0,0,0.1); border-radius:8px;">
                <div>
                    <strong style="color:var(--primary-blue);">${slider.title}</strong>
                    <br><span style="font-size:0.8rem; color:var(--text-muted);">${typeLabel}</span>
                </div>
                <div style="display:flex; gap:5px;">
                    <button onclick="moveServiceSlider('${slider.id}', 'up')" style="background:var(--text-muted); color:#fff; border:none; padding:5px; border-radius:5px; ${index === 0 ? 'opacity: 0.3; pointer-events: none;' : ''}"><i class="fas fa-arrow-up"></i></button>
                    <button onclick="moveServiceSlider('${slider.id}', 'down')" style="background:var(--text-muted); color:#fff; border:none; padding:5px; border-radius:5px; ${index === sliders.length - 1 ? 'opacity: 0.3; pointer-events: none;' : ''}"><i class="fas fa-arrow-down"></i></button>
                    <button onclick="deleteServiceSlider('${slider.id}')" style="background:var(--danger); color:#fff; border:none; padding:5px; border-radius:5px;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function addServiceSlider() {
    const title = document.getElementById('newSliderTitle').value.trim();
    const type = document.getElementById('newSliderType').value;
    const categoryId = document.getElementById('newSliderCategory').value;
    
    if (!title) { showToast('عنوان اسلایدر الزامی است!', 'error'); return; }
    
    let sliders = getServiceSliders();
    const id = Date.now().toString();
    sliders.push({ id, title, type, categoryId: type === 'items' ? categoryId : null });
    saveServiceSliders(sliders);
    
    document.getElementById('newSliderTitle').value = '';
    renderAdminServiceSliders();
    showToast('اسلایدر جدید به صفحه خدمات اضافه شد!', 'success');
}

function deleteServiceSlider(id) {
    if (confirm('حذف شود؟')) {
        let sliders = getServiceSliders().filter(s => s.id !== id);
        saveServiceSliders(sliders);
        renderAdminServiceSliders();
        showToast('اسلایدر حذف شد.', 'success');
    }
}

function moveServiceSlider(id, direction) {
    let sliders = getServiceSliders();
    const index = sliders.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) [sliders[index], sliders[index-1]] = [sliders[index-1], sliders[index]];
    else if (direction === 'down' && index < sliders.length - 1) [sliders[index], sliders[index+1]] = [sliders[index+1], sliders[index]];
    saveServiceSliders(sliders);
    renderAdminServiceSliders();
}

// =========================================
// ۱.۶. مدیریت اسلایدرهای صفحه خانه (جدید)
// =========================================
function updateHomeSliderCategoryDropdown() {
    const select = document.getElementById('newHomeSliderCategory');
    if (!select) return;
    select.innerHTML = '';
    getCategories().forEach(cat => {
        if (cat.id.toLowerCase() !== 'service') {
            select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        }
    });
}

function renderAdminHomeSliders() {
    const list = document.getElementById('admin-home-sliders-list');
    if (!list) return;
    list.innerHTML = '';
    const sliders = getHomeSliders();
    
    sliders.forEach((slider, index) => {
        list.innerHTML += `
            <div class="admin-item-row" style="padding: 10px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); background:rgba(0,0,0,0.1); border-radius:8px;">
                <div>
                    <strong style="color:var(--primary-orange);">${slider.title}</strong>
                    <br><span style="font-size:0.8rem; color:var(--text-muted);">دسته: ${slider.categoryId}</span>
                </div>
                <div style="display:flex; gap:5px;">
                    <button onclick="moveHomeSlider('${slider.id}', 'up')" style="background:var(--text-muted); color:#fff; border:none; padding:5px; border-radius:5px; ${index === 0 ? 'opacity: 0.3; pointer-events: none;' : ''}"><i class="fas fa-arrow-up"></i></button>
                    <button onclick="moveHomeSlider('${slider.id}', 'down')" style="background:var(--text-muted); color:#fff; border:none; padding:5px; border-radius:5px; ${index === sliders.length - 1 ? 'opacity: 0.3; pointer-events: none;' : ''}"><i class="fas fa-arrow-down"></i></button>
                    <button onclick="deleteHomeSlider('${slider.id}')" style="background:var(--danger); color:#fff; border:none; padding:5px; border-radius:5px;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function addHomeSlider() {
    const title = document.getElementById('newHomeSliderTitle').value.trim();
    const categoryId = document.getElementById('newHomeSliderCategory').value;
    
    if (!title) { showToast('عنوان اسلایدر الزامی است!', 'error'); return; }
    if (!categoryId) { showToast('دسته‌بندی الزامی است!', 'error'); return; }
    
    let sliders = getHomeSliders();
    const id = Date.now().toString();
    sliders.push({ id, title, categoryId });
    saveHomeSliders(sliders);
    
    document.getElementById('newHomeSliderTitle').value = '';
    renderAdminHomeSliders();
    showToast('اسلایدر جدید به صفحه خانه اضافه شد!', 'success');
}

function deleteHomeSlider(id) {
    if (confirm('حذف شود؟')) {
        let sliders = getHomeSliders().filter(s => s.id !== id);
        saveHomeSliders(sliders);
        renderAdminHomeSliders();
        showToast('اسلایدر حذف شد.', 'success');
    }
}

function moveHomeSlider(id, direction) {
    let sliders = getHomeSliders();
    const index = sliders.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) [sliders[index], sliders[index-1]] = [sliders[index-1], sliders[index]];
    else if (direction === 'down' && index < sliders.length - 1) [sliders[index], sliders[index+1]] = [sliders[index+1], sliders[index]];
    saveHomeSliders(sliders);
    renderAdminHomeSliders();
}

// =========================================
// ۲. مدیریت آمار سایت
// =========================================
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('bloxStats')) || { orders: '', rating: '', year: '۱۴۰۴' };
    const ordersEl = document.getElementById('set-orders');
    const ratingEl = document.getElementById('set-rating');
    const yearEl = document.getElementById('set-year');
    
    if (ordersEl) ordersEl.value = stats.orders || '';
    if (ratingEl) ratingEl.value = stats.rating || '';
    if (yearEl) yearEl.value = stats.year || '۱۴۰۴';
}

function saveStats() {
    const orders = document.getElementById('set-orders').value;
    const rating = document.getElementById('set-rating').value;
    const year = document.getElementById('set-year').value.trim() || '۱۴۰۴'; // اگر خالی بود، ۱۴۰۴ بذار
    
    localStorage.setItem('bloxStats', JSON.stringify({ orders, rating, year }));
    showToast('تنظیمات با موفقیت ذخیره شد!', 'success');
}

// =========================================
// ۳. مدیریت آیتم‌ها
// =========================================
document.getElementById('itemImgFile')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const scaleSize = 400 / img.width;
            canvas.width = 400;
            canvas.height = img.height * scaleSize;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            currentImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById('imagePreview').src = currentImageBase64;
            document.getElementById('imagePreview').style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function saveItem() {
    const id = document.getElementById('edit-item-id').value;
    const name = document.getElementById('itemName').value.trim();
    const price = document.getElementById('itemPrice').value.trim();
    const category = document.getElementById('itemCategory').value;
    
    if (!name || !price || !currentImageBase64) { showToast('نام، قیمت و عکس الزامی است!', 'error'); return; }

    let items = getItems();
    if (id) {
        const index = items.findIndex(i => i.id == id);
        items[index] = { ...items[index], name, price, category, img: currentImageBase64 };
    } else {
        items.push({ id: Date.now(), name, price, category, img: currentImageBase64, status: true });
    }
    saveItems(items);
    resetForm();
    renderAdminSliders();
    showToast(id ? 'آیتم ویرایش شد!' : 'آیتم اضافه شد!', 'success');
}

function editItem(id) {
    const item = getItems().find(i => i.id == id);
    if (!item) return;
    document.getElementById('form-title').innerText = 'ویرایش آیتم';
    document.getElementById('edit-item-id').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemCategory').value = item.category;
    currentImageBase64 = item.img;
    document.getElementById('imagePreview').src = item.img;
    document.getElementById('imagePreview').style.display = 'block';
    document.getElementById('cancel-btn').style.display = 'block';
}

function resetForm() {
    document.getElementById('form-title').innerText = 'افزودن آیتم جدید';
    document.getElementById('edit-item-id').value = '';
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    currentImageBase64 = '';
    document.getElementById('itemImgFile').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';
}

function deleteItem(id) {
    if (confirm('حذف شود؟')) {
        saveItems(getItems().filter(i => i.id != id));
        renderAdminSliders();
    }
}

function moveItem(id, direction) {
    let items = getItems();
    const index = items.findIndex(i => i.id == id);
    if (direction === 'left' && index > 0) [items[index], items[index - 1]] = [items[index - 1], items[index]];
    else if (direction === 'right' && index < items.length - 1) [items[index], items[index + 1]] = [items[index + 1], items[index]];
    saveItems(items);
    renderAdminSliders();
}

function toggleStatus(id) {
    let items = getItems();
    const index = items.findIndex(i => i.id == id);
    items[index].status = items[index].status === false ? true : false;
    saveItems(items);
    renderAdminSliders();
}

// =========================================
// ۴. مدیریت خدمات (توضیحات)
// =========================================
document.getElementById('serviceImgFile')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const scaleSize = 400 / img.width;
            canvas.width = 400;
            canvas.height = img.height * scaleSize;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            currentServiceImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById('serviceImgPreview').src = currentServiceImageBase64;
            document.getElementById('serviceImgPreview').style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function saveService() {
    const id = document.getElementById('edit-service-id').value;
    const title = document.getElementById('serviceTitle').value.trim();
    const desc = document.getElementById('serviceDesc').value.trim();
    const icon = document.getElementById('serviceIcon').value.trim() || 'fas fa-star'; 

    if (!title || !desc) { showToast('عنوان و توضیحات الزامی است!', 'error'); return; }

    let services = getServices();
    if (id) {
        const index = services.findIndex(s => s.id == id);
        services[index] = { ...services[index], title, desc, icon, img: currentServiceImageBase64 || services[index].img };
    } else {
        services.push({ id: Date.now(), title, desc, icon, img: currentServiceImageBase64 || '' });
    }
    saveServices(services);
    resetServiceForm();
    renderAdminServices();
    showToast(id ? 'خدمت ویرایش شد!' : 'خدمت اضافه شد!', 'success');
}

function editService(id) {
    const service = getServices().find(s => s.id == id);
    if (!service) return;
    document.getElementById('service-form-title').innerText = 'ویرایش خدمت';
    document.getElementById('edit-service-id').value = service.id;
    document.getElementById('serviceTitle').value = service.title;
    document.getElementById('serviceDesc').value = service.desc;
    document.getElementById('serviceIcon').value = service.icon;
    currentServiceImageBase64 = service.img || '';
    if(service.img) { document.getElementById('serviceImgPreview').src = service.img; document.getElementById('serviceImgPreview').style.display = 'block'; }
    document.getElementById('cancel-service-btn').style.display = 'block';
}

function resetServiceForm() {
    document.getElementById('service-form-title').innerText = 'افزودن خدمت جدید';
    document.getElementById('edit-service-id').value = '';
    document.getElementById('serviceTitle').value = '';
    document.getElementById('serviceDesc').value = '';
    document.getElementById('serviceIcon').value = '';
    currentServiceImageBase64 = '';
    document.getElementById('serviceImgFile').value = '';
    document.getElementById('serviceImgPreview').style.display = 'none';
    document.getElementById('cancel-service-btn').style.display = 'none';
}

function deleteService(id) {
    if (confirm('حذف شود؟')) {
        saveServices(getServices().filter(s => s.id != id));
        renderAdminServices();
    }
}

function renderAdminServices() {
    const list = document.getElementById('admin-services-list');
    if(!list) return;
    list.innerHTML = '';
    getServices().forEach(s => {
        const displayMedia = s.img ? `<img src="${s.img}" style="width: 30px; height: 30px; object-fit: contain; margin-left: 5px;">` : `<i class="${s.icon}" style="margin-left: 5px;"></i>`;
        list.innerHTML += `
            <div class="admin-item-row" style="padding: 10px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; align-items:center;">${displayMedia}<strong style="color:var(--primary-blue);">${s.title}</strong></div>
                <div style="display:flex; gap:5px;">
                    <button onclick="editService(${s.id})" style="background:var(--primary-blue); color:#fff; border:none; padding:5px 10px; border-radius:5px;"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteService(${s.id})" style="background:var(--danger); color:#fff; border:none; padding:5px 10px; border-radius:5px;"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
    });
}

// =========================================
// ۵. اسلایدرهای صفحه اصلی (مدیریت آیتم‌ها)
// =========================================
function renderAdminSliders() {
    adminSwipers.forEach(s => { try { s.destroy(true, true); } catch(e){} });
    adminSwipers = [];

    const container = document.getElementById('admin-sliders-container');
    if(!container) return;
    container.innerHTML = ''; 

    getCategories().forEach(category => {
        if (category.id.toLowerCase() === 'service') return; // در این بخش خدمات را نشان نمی‌دهیم

        container.insertAdjacentHTML('beforeend', `
            <div class="slider-section" id="section-${category.id}">
                <h3 style="color: ${category.color};">${category.name}</h3>
                <div class="swiper mySwiper" id="swiper-${category.id}">
                    <div class="swiper-wrapper"></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div>
                </div>
            </div>`);

        const wrapper = document.querySelector(`#swiper-${category.id} .swiper-wrapper`);
        const filtered = getItems().filter(i => i.category === category.id);
        
        if (filtered.length === 0) { document.getElementById(`section-${category.id}`).style.display = 'none'; return; }

        filtered.forEach((item, index) => {
            const isAvailable = item.status !== false;
            const statusIcon = isAvailable ? '<i class="fas fa-check-circle" style="color:#fff;"></i>' : '<i class="fas fa-times-circle" style="color:#fff;"></i>';
            const toggleBtnStyle = isAvailable ? 'background: #00cc66;' : 'background: var(--danger);';
            
            wrapper.innerHTML += `
                <div class="swiper-slide" style="${!isAvailable ? 'opacity: 0.8;' : ''}">
                    <div class="admin-actions">
                        <button class="btn-move" onclick="moveItem(${item.id}, 'left')"><i class="fas fa-arrow-right"></i></button>
                        <button class="btn-move" onclick="moveItem(${item.id}, 'right')"><i class="fas fa-arrow-left"></i></button>
                        <button class="btn-edit" onclick="editItem(${item.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteItem(${item.id})"><i class="fas fa-trash"></i></button>
                        <button onclick="toggleStatus(${item.id})" style="width:35px; height:35px; border-radius:50%; color:#fff; border:none; ${toggleBtnStyle}">${statusIcon}</button>
                    </div>
                    <img src="${item.img}" style="height:100px; width:100px; object-fit:contain; ${!isAvailable ? 'filter: grayscale(100%);' : ''}">
                    <h4 style="margin-top: 10px; color: ${category.color};">${item.name}</h4>
                    <p style="color:var(--primary-blue); font-weight:bold;">${item.price} تومان</p>
                </div>`;
        });

        adminSwipers.push(new Swiper(`#swiper-${category.id}`, {
            slidesPerView: 'auto', spaceBetween: 20, centerInsufficientSlides: true,
            navigation: { nextEl: `#swiper-${category.id} .swiper-button-next`, prevEl: `#swiper-${category.id} .swiper-button-prev` }
        }));
    });
}

// =========================================
// ۶. تم و بنر
// =========================================
function loadSeasonTheme() {
    const theme = localStorage.getItem('bloxSeasonTheme') || 'default';
    const themeSelect = document.getElementById('seasonThemeSelect');
    if (themeSelect) themeSelect.value = theme;
}

function saveSeasonTheme() {
    localStorage.setItem('bloxSeasonTheme', document.getElementById('seasonThemeSelect').value);
    showToast('تم سایت تغییر کرد! صفحه را رفرش کنید.', 'success');
}

// =========================================
// ۷. مدیریت سفارش‌ها
// =========================================
function renderAdminOrders() {
    const ordersList = document.getElementById('admin-orders-list');
    const usersCountEl = document.getElementById('total-users-count');
    
    if (usersCountEl) usersCountEl.innerText = getUsers().length;
    if (!ordersList) return;
    
    const orders = getOrders().filter(o => !o.adminDeleted);
    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="color:var(--text-muted); grid-column: 1/-1;">هیچ سفارش فعالی وجود ندارد.</p>';
        return;
    }

    orders.slice().reverse().forEach(order => {
        const isCompleted = order.status === 'completed';
        const statusBtnColor = isCompleted ? '#00cc66' : 'var(--primary-orange)';
        const statusText = isCompleted ? 'انجام شده ✅' : 'در انتظار ⏳';

        ordersList.innerHTML += `
            <div class="admin-form-card" style="padding: 15px; border-color: ${statusBtnColor};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
                    <div>
                        <strong style="color:var(--primary-blue); font-size:1.2rem;">${order.trackingCode}</strong>
                        <br><span style="font-size:0.85rem; color:var(--text-muted);">کاربر: ${order.username}</span>
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button onclick="toggleOrderStatus(${order.id})" style="background:${statusBtnColor}; color:#fff; border:none; padding:5px 10px; border-radius:5px; font-size:0.8rem;">${statusText}</button>
                        <button onclick="deleteOrder(${order.id})" style="background:var(--danger); color:#fff; border:none; padding:5px 10px; border-radius:5px;"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                
                <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; font-size:0.85rem; margin-bottom:10px; border: 1px solid var(--primary-blue);">
                    <strong style="color:var(--primary-blue);">اطلاعات اکانت روبلاکس:</strong>
                    <ul style="list-style:none; margin-top:5px;">
                        <li>یوزر: <span style="color:#fff;">${order.rbxData ? order.rbxData.user : 'نامشخص'}</span></li>
                        <li>پسورد: <span style="color:#fff;">${order.rbxData ? order.rbxData.pass : 'نامشخص'}</span></li>
                        <li>بکاپ ۱: <span style="color:#fff;">${order.rbxData ? order.rbxData.backup1 : 'نامشخص'}</span></li>
                        <li>بکاپ ۲: <span style="color:#fff;">${order.rbxData ? order.rbxData.backup2 : 'نامشخص'}</span></li>
                    </ul>
                </div>

                <div style="font-size:0.9rem; margin-bottom:10px;">
                    <span style="color:var(--text-muted);">تاریخ:</span> ${order.date} | <span style="color:var(--text-muted);">مبلغ:</span> <span style="color:var(--primary-blue);">${order.totalPrice} تومان</span>
                </div>
                <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; font-size:0.85rem;">
                    <ul style="list-style:none;">${order.items.map(i => `<li style="margin-bottom:3px;">- ${i.name} (تعداد: ${i.quantity})</li>`).join('')}</ul>
                </div>
            </div>
        `;
    });
}

function toggleOrderStatus(id) {
    let orders = getOrders();
    const index = orders.findIndex(o => o.id == id);
    if (index > -1) {
        orders[index].status = orders[index].status === 'completed' ? 'pending' : 'completed';
        saveOrders(orders);
        renderAdminOrders();
    }
}

function deleteOrder(id) {
    if (confirm('آیا از حذف این سفارش از پنل ادمین مطمئن هستید؟ (برای مشتری باقی می‌ماند)')) {
        let orders = getOrders();
        const index = orders.findIndex(o => o.id == id);
        if (index > -1) {
            orders[index].adminDeleted = true;
            saveOrders(orders);
            renderAdminOrders();
            showToast('سفارش از پنل ادمین حذف شد.', 'success');
        }
    }
}

function clearAllOrders() {
    if (confirm('آیا مطمئن هستید؟ تمام سفارش‌ها پاک می‌شوند!')) {
        localStorage.removeItem('bloxOrders');
        renderAdminOrders();
        showToast('تمام سفارش‌ها با موفقیت پاک شدند.', 'success');
    }
}

// =========================================
// اجرای اولیه
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    try { loadStats(); } catch(e) { console.warn(e); }
    try { updateCategoryDropdown(); } catch(e) { console.warn(e); }
    try { renderAdminCategories(); } catch(e) { console.warn(e); }
    
    try { updateServiceSliderCategoryDropdown(); } catch(e) { console.warn(e); }
    try { renderAdminServiceSliders(); } catch(e) { console.warn(e); }
    
    try { updateHomeSliderCategoryDropdown(); } catch(e) { console.warn(e); }
    try { renderAdminHomeSliders(); } catch(e) { console.warn(e); }
    
    try { renderAdminSliders(); } catch(e) { console.warn(e); }
    try { renderAdminServices(); } catch(e) { console.warn(e); }
    try { loadSeasonTheme(); } catch(e) { console.warn(e); }
    try { renderAdminOrders(); } catch(e) { console.warn(e); }
});