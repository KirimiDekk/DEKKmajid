// ========== STORAGE HELPER ==========
const storage = {
  set(key, value, ttl = null) {
    const item = { value, expiry: ttl ? Date.now() + ttl : null };
    localStorage.setItem(key, JSON.stringify(item));
  },
  get(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      const item = JSON.parse(raw);
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch { return null; }
  },
  remove(key) { localStorage.removeItem(key); }
};

// ========== TOAST NOTIFICATIONS ==========
const toastContainer = document.getElementById('toast-container');
function showToast(message, type = 'info', duration = 4000) {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ========== PASSWORD VISIBILITY TOGGLE ==========
const toggleBtn = document.getElementById('togglePasswordBtn');
const passwordInput = document.getElementById('password');
if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
  });
}

// ========== FORGOT PASSWORD MODAL ==========
const modal = document.getElementById('forgotModal');
const forgotLink = document.getElementById('forgotPasswordLink');
const closeModal = document.querySelector('.close-modal');
const sendResetBtn = document.getElementById('sendResetBtn');
const resetEmail = document.getElementById('resetEmail');
const resetMessageDiv = document.getElementById('resetMessage');

function openModal() {
  modal.style.display = 'flex';
  resetEmail.value = '';
  resetMessageDiv.innerHTML = '';
}
function closeModalFn() {
  modal.style.display = 'none';
}

if (forgotLink) forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  openModal();
});
if (closeModal) closeModal.addEventListener('click', closeModalFn);
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModalFn();
});

if (sendResetBtn) {
  sendResetBtn.addEventListener('click', () => {
    const email = resetEmail.value.trim();
    if (!email) {
      resetMessageDiv.innerHTML = '<span style="color:#dc2626;">Please enter your email address.</span>';
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      resetMessageDiv.innerHTML = '<span style="color:#dc2626;">Enter a valid email address.</span>';
      return;
    }
    // Simulate sending reset link
    resetMessageDiv.innerHTML = '<span style="color:#10b981;">✅ Reset link sent! (Demo mode – check console)</span>';
    showToast(`Password reset link sent to ${email}`, 'success');
    console.log(`[Demo] Reset link for ${email}`);
    setTimeout(() => closeModalFn(), 2000);
  });
}

// ========== REMEMBER ME: load saved credentials ==========
const rememberCheck = document.getElementById('remember');
const usernameInput = document.getElementById('username');
const loginForm = document.getElementById('login-form');

// Load saved credentials
const savedUsername = storage.get('remembered_username');
const savedPassword = storage.get('remembered_password');
if (savedUsername && savedPassword) {
  usernameInput.value = savedUsername;
  passwordInput.value = savedPassword;
  rememberCheck.checked = true;
}

// ========== LOGIN HANDLER (demo mode) ==========
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const errorDiv = document.getElementById('error-message');

  if (!username || !password) {
    errorDiv.textContent = 'Please enter both username/email and password.';
    return;
  }

  // Demo authentication – accepts any non-empty credentials
  // In real app, replace with fetch to backend
  if (username.length >= 3 && password.length >= 1) {
    // Store user info in storage (simulate session)
    const user = {
      name: username.includes('@') ? username.split('@')[0] : username,
      email: username.includes('@') ? username : `${username}@dekkminer.com`,
      loginTime: Date.now()
    };
    storage.set('auth_token', 'demo_token_' + Date.now(), 3600000); // 1 hour
    storage.set('user', user, 86400000);

    // Handle "Remember me"
    if (rememberCheck.checked) {
      storage.set('remembered_username', username, 2592000000); // 30 days
      storage.set('remembered_password', password, 2592000000);
    } else {
      storage.remove('remembered_username');
      storage.remove('remembered_password');
    }

    showToast(`Welcome back, ${user.name}! Redirecting...`, 'success', 2000);
    errorDiv.textContent = '';

    // Redirect to main dashboard (or index.html)
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } else {
    errorDiv.textContent = 'Invalid credentials. (Demo: any username/password works)';
  }
});

// ========== PREVENT DEFAULT REGISTER LINK (if needed) ==========
document.querySelector('.register-link a')?.addEventListener('click', (e) => {
  // allow normal navigation, but you can add analytics here
  console.log('Navigate to register page');
});