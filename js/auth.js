// js/auth.js
const ADMIN_USER = 'ahr';
const ADMIN_PASS = 'ahr51r@ahr51r1';

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active-form'));

    if (tab === 'login') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active-form');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active-form');
    }
}

// ثبت‌نام
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('regUser').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPass').value;

    let users = getUsers();
    if (users.find(u => u.username === username || u.email === email)) {
        showToast('این نام کاربری یا ایمیل قبلاً ثبت شده است!', 'error');
        return;
    }

    users.push({ username, email, password });
    saveUsers(users);
    showToast('ثبت‌نام با موفقیت انجام شد! حالا وارد شوید.', 'success');
    switchTab('login');
    document.getElementById('loginUser').value = username;
});

// ورود
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;

    // ورود ادمین
    if (login === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem('bloxAdminLoggedIn', 'true');
        localStorage.removeItem('bloxCurrentUser');
        showToast('خوش آمدید ادمین عزیز!', 'success');
        setTimeout(() => window.location.href = 'admin.html', 800);
        return;
    }

    // ورود کاربر عادی
    let users = getUsers();
    const user = users.find(u => (u.username === login || u.email === login) && u.password === pass);

    if (user) {
        localStorage.removeItem('bloxAdminLoggedIn');
        localStorage.setItem('bloxCurrentUser', JSON.stringify(user));
        showToast('ورود موفقیت‌آمیز بود!', 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
    } else {
        showToast('نام کاربری یا رمز عبور اشتباه است!', 'error');
    }
});