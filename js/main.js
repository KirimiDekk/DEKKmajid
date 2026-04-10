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

// ========== ACCESSIBILITY ANNOUNCER ==========
const announcer = document.getElementById('a11y-announcer');
function announce(msg) {
  if (announcer) {
    announcer.textContent = msg;
    setTimeout(() => { if (announcer.textContent === msg) announcer.textContent = ''; }, 3000);
  }
}

// ========== LOADING OVERLAY ==========
const loader = document.getElementById('global-loader');
function showLoading() { if (loader) loader.style.display = 'flex'; }
function hideLoading() { if (loader) loader.style.display = 'none'; }

// ========== OFFLINE DETECTION ==========
const offlineBanner = document.getElementById('offline-banner');
function updateOnlineStatus() {
  if (!navigator.onLine) {
    if (offlineBanner) offlineBanner.style.display = 'block';
    showToast('You are offline. Check your connection.', 'error');
  } else {
    if (offlineBanner) offlineBanner.style.display = 'none';
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// ========== DARK MODE TOGGLE ==========
const themeToggle = document.getElementById('themeToggleBtn');
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.innerHTML = '🌙';
  }
  storage.set('theme', theme);
}
const savedTheme = storage.get('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`${newTheme} mode activated`, 'info');
  });
}

// ========== NOTIFICATION POPUP ==========
const notifBtn = document.getElementById('notificationToggleBtn');
const notifPopup = document.getElementById('notification-popup');
if (notifBtn && notifPopup) {
  notifPopup.classList.add('hidden');
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifPopup.classList.toggle('hidden');
  });
  document.body.addEventListener('click', (e) => {
    if (!notifBtn.contains(e.target) && !notifPopup.contains(e.target))
      notifPopup.classList.add('hidden');
  });
}

// ========== MOBILE MENU ==========
const menuIcon = document.getElementById('mobileMenuIcon');
const navLinks = document.getElementById('navLinks');
if (menuIcon && navLinks) {
  menuIcon.addEventListener('click', () => navLinks.classList.toggle('show'));
  document.addEventListener('click', (e) => {
    if (!menuIcon.contains(e.target) && !navLinks.contains(e.target))
      navLinks.classList.remove('show');
  });
}

// ========== LOGOUT ==========
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  storage.remove('auth_token');
  storage.remove('user');
  storage.remove('welcomeClosed');
  showToast('🔐 Logged out', 'success');
  setTimeout(() => location.reload(), 1000);
});

// ========== DYNAMIC TEXT CAROUSEL ==========
const h2El = document.getElementById('dynamicH2');
const pEl = document.getElementById('dynamicP');
const textSlides = [
  { h2: "⚡ Zero Investment. Real Gold.", p: "Start earning instantly – watch videos, complete tasks, and withdraw your gold daily." },
  { h2: "💰 250,000+ Happy Miners", p: "Join the fastest-growing mining community – no fees, no tricks." },
  { h2: "🚀 10% Lifetime Referrals", p: "Invite friends and earn passive gold forever." },
  { h2: "🏆 Daily Jackpot: 5,000 GOLD", p: "Spin the wheel every day – your luck could change instantly." }
];
let textIndex = 0;
function updateDynamicText(index) {
  if (h2El && pEl && textSlides[index]) {
    h2El.textContent = textSlides[index].h2;
    pEl.textContent = textSlides[index].p;
  }
}
document.getElementById('prevTextBtn')?.addEventListener('click', () => {
  textIndex = (textIndex - 1 + textSlides.length) % textSlides.length;
  updateDynamicText(textIndex);
});
document.getElementById('nextTextBtn')?.addEventListener('click', () => {
  textIndex = (textIndex + 1) % textSlides.length;
  updateDynamicText(textIndex);
});
[h2El, pEl].forEach(el => el?.addEventListener('click', () => {
  textIndex = (textIndex + 1) % textSlides.length;
  updateDynamicText(textIndex);
}));
setInterval(() => {
  textIndex = (textIndex + 1) % textSlides.length;
  updateDynamicText(textIndex);
}, 12000);

// ========== ANIMATED COUNTERS (Dashboard) ==========
const counters = document.querySelectorAll('#total-gold, #total-earnings, #active-miners, #recent-transactions');
function animateCounter(el, target, isCurrency = false) {
  if (!el) return;
  let start = 0;
  const duration = 1500;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    let val = Math.floor(current);
    if (isCurrency) el.textContent = `KES ${val.toLocaleString()}`;
    else if (el.id === 'total-gold') el.textContent = `${val.toLocaleString()} KG`;
    else el.textContent = val.toLocaleString();
  }, stepTime);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target)) {
        if (el.id === 'total-earnings') animateCounter(el, target, true);
        else animateCounter(el, target, false);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });
counters.forEach(c => counterObserver.observe(c));

// ========== ROTATING STATS ==========
const stat1 = document.getElementById('stat1Value'), stat2 = document.getElementById('stat2Value'), stat3 = document.getElementById('stat3Value');
const label1 = document.getElementById('stat1Label'), label2 = document.getElementById('stat2Label'), label3 = document.getElementById('stat3Label');
const statSets = [
  { v1: "250K+", l1: "Active Miners", v2: "$50M+", l2: "Gold Withdrawn", v3: "99.9%", l3: "Happy Users" },
  { v1: "1.2M+", l1: "Daily Tasks", v2: "$120M+", l2: "Total Earnings", v3: "150+", l3: "Countries" },
  { v1: "500K+", l1: "Verified Users", v2: "4.9★", l2: "App Rating", v3: "24/7", l3: "Support" }
];
let statIdx = 0;
function updateStats() {
  if (stat1 && stat2 && stat3) {
    stat1.textContent = statSets[statIdx].v1;
    stat2.textContent = statSets[statIdx].v2;
    stat3.textContent = statSets[statIdx].v3;
    label1.textContent = statSets[statIdx].l1;
    label2.textContent = statSets[statIdx].l2;
    label3.textContent = statSets[statIdx].l3;
    statIdx = (statIdx + 1) % statSets.length;
  }
}
setInterval(updateStats, 5000);
updateStats();

// ========== TESTIMONIAL SLIDER ==========
const testimonialCards = document.querySelectorAll('.testimonial-card');
const navContainer = document.getElementById('testimonialNav');
if (testimonialCards.length && navContainer) {
  let current = 0;
  function showTestimonial(index) {
    testimonialCards.forEach((c, i) => c.classList.toggle('active', i === index));
    const dots = navContainer.querySelectorAll('button');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }
  navContainer.innerHTML = '';
  for (let i = 0; i < testimonialCards.length; i++) {
    const dot = document.createElement('button');
    dot.addEventListener('click', (() => { current = i; showTestimonial(current); }));
    navContainer.appendChild(dot);
  }
  showTestimonial(0);
  setInterval(() => {
    current = (current + 1) % testimonialCards.length;
    showTestimonial(current);
  }, 6000);
}

// ========== WELCOME BACK BANNER (handles missing HTML gracefully) ==========
const welcomeBanner = document.getElementById('welcomeBanner');
const closeWelcomeBtn = document.getElementById('closeWelcomeBtn');
const welcomeUserNameSpan = document.getElementById('welcomeUserName');

let user = storage.get('user');
if (!user) {
  user = { name: 'Guest Miner', email: 'guest@dekk.com' };
  storage.set('user', user, 86400000);
}
if (welcomeUserNameSpan) welcomeUserNameSpan.textContent = user.name || 'Miner';

const welcomeClosed = storage.get('welcomeClosed');
const today = new Date().toDateString();
if (welcomeBanner && (!welcomeClosed || welcomeClosed !== today)) {
  welcomeBanner.classList.remove('hidden');
  announce(`Welcome back, ${user.name || 'Miner'}! You earned 0.05 GOLD today.`);
  const todayEarningSpan = document.querySelector('#welcomeBanner #todayEarning');
  if (todayEarningSpan) {
    const randomEarn = (Math.random() * 0.2 + 0.01).toFixed(2);
    todayEarningSpan.textContent = `${randomEarn} GOLD`;
  }
} else if (welcomeBanner) {
  welcomeBanner.classList.add('hidden');
}

if (closeWelcomeBtn) {
  closeWelcomeBtn.addEventListener('click', () => {
    if (welcomeBanner) welcomeBanner.classList.add('hidden');
    storage.set('welcomeClosed', today, 86400000);
    showToast('Welcome banner dismissed. See you tomorrow!', 'info');
  });
}

// ========== FLOATING CTA CLICK HANDLER ==========
const floatingCta = document.getElementById('floatingCta');
if (floatingCta) {
  floatingCta.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('🚀 Start mining now! Create an account or login.', 'info');
    // Uncomment to redirect: window.location.href = 'register.html';
  });
}

// ========== SCROLL TO TOP BUTTON (lively utility) ==========
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '↑';
scrollBtn.className = 'scroll-top';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== LAZY LOADING FOR IMAGES ==========
function initLazyLoading() {
  const images = document.querySelectorAll('img.lazy');
  if (!images.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
        }
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
}
initLazyLoading();

// ========== CONFETTI ON FIRST VISIT (extra liveliness) ==========
const hasVisited = storage.get('hasVisited');
if (!hasVisited) {
  storage.set('hasVisited', true, 86400000); // once per day
  setTimeout(() => {
    // Simple confetti effect using canvas (optional, but adds fun)
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10000';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 5 + 2,
        speedY: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        p.y += p.speedY;
        if (p.y < canvas.height) active = true;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      if (active) requestAnimationFrame(animateConfetti);
      else canvas.remove();
    }
    animateConfetti();
    showToast('🎉 Welcome to Dekk Gold Miner! Start mining now!', 'success', 5000);
  }, 500);
}

// ========== INITIALIZATION ==========
async function init() {
  showLoading();
  await new Promise(resolve => setTimeout(resolve, 500));
  hideLoading();
  showToast('✨ Welcome back, Miner! Start earning now.', 'success', 4000);
}
init();