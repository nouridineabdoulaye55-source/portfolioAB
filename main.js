// ── THEME ──
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeBtn) {
  themeBtn.textContent = savedTheme === 'dark' ? '☀️ Changer le thème' : '🌙 Changer le thème';
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const newTheme = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeBtn.textContent = newTheme === 'dark' ? '☀️ Changer le thème' : '🌙 Changer le thème';
  });
}
 
// ── HAMBURGER & SIDEBAR MOBILE ──
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar      = document.getElementById('sidebar');
const overlay      = document.getElementById('sidebarOverlay');
const navItems     = document.querySelectorAll('.nav-item');
 
function isMobile() {
  return window.innerWidth <= 900;
}
 
function openSidebar() {
  if (!sidebar) return;
  sidebar.classList.add('open');
  sidebar.setAttribute('aria-hidden', 'false');
  if (hamburgerBtn) {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }
  if (overlay) overlay.classList.add('visible');
  // On bloque uniquement le scroll, PAS position:fixed (casse les ancres)
  document.body.style.overflow = 'hidden';
}
 
function closeSidebar() {
  if (!sidebar) return;
  sidebar.classList.remove('open');
  sidebar.setAttribute('aria-hidden', 'true');
  if (hamburgerBtn) {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  if (overlay) overlay.classList.remove('visible');
  document.body.style.overflow = '';
}
 
function handleResize() {
  if (!isMobile()) {
    if (sidebar) {
      sidebar.classList.remove('open');
      sidebar.setAttribute('aria-hidden', 'false');
    }
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
  } else {
    if (sidebar && !sidebar.classList.contains('open')) {
      sidebar.setAttribute('aria-hidden', 'true');
    }
  }
}
 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });
} else {
  handleResize();
  window.addEventListener('resize', handleResize);
}
 
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}
 
if (overlay) {
  overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSidebar();
  });
}
 
// FIX LIENS NAV : délai pour que le navigateur traite l'ancre AVANT de fermer
navItems.forEach(a => {
  a.addEventListener('click', () => {
    if (isMobile() && sidebar && sidebar.classList.contains('open')) {
      setTimeout(closeSidebar, 50);
    }
  });
});
 
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
    closeSidebar();
  }
});
 
// Fermer au clic en dehors (passive:true pour ne pas bloquer le scroll)
document.addEventListener('click', (e) => {
  if (isMobile() && sidebar && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && hamburgerBtn && !hamburgerBtn.contains(e.target)) {
      closeSidebar();
    }
  }
}, { passive: true });
 
// ── NAV ACTIVE (scroll spy) ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });
 
// ── HERO BACKGROUND SLIDESHOW ──
const heroSection = document.getElementById('presentation');
const heroBackgrounds = [
  'images/photo-1623121608391-5ddbfa78428e.webp',
  'images/photo-1573166364971-d70fb4913897.webp',
  'images/photo-1565688461878-f329a0226094.webp'
];
let heroBgIndex = 0;
if (heroSection) {
  setInterval(() => {
    heroBgIndex = (heroBgIndex + 1) % heroBackgrounds.length;
    heroSection.style.backgroundImage =
      `linear-gradient(180deg, rgba(14,17,23,0.92) 0%, rgba(14,17,23,0.68) 30%, rgba(14,17,23,0.95) 100%), url('${heroBackgrounds[heroBgIndex]}')`;
  }, 5000);
}
 
// ── REVEAL ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
 
// ── SKILL BARS ──
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-row').forEach(r => r.classList.add('animated'));
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-category').forEach(el => skillObserver.observe(el));
 
// ── COUNTERS ──
function animCount(el, target, suffix) {
  let s = 0;
  const dur = 1600;
  const step = ts => {
    if (!s) s = ts;
    const p    = Math.min((ts - s) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(el => {
        animCount(el, +el.dataset.target, el.dataset.suffix);
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObs.observe(statsRow);
 
// ── PROJECT FILTER ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(c => {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
    });
  });
});
 
// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
 
async function handleSubmit(e) {
  // Empêche le rechargement de page (crucial sur mobile)
  if (e && e.preventDefault) e.preventDefault();
 
  const name    = document.getElementById('fieldName').value.trim();
  const email   = document.getElementById('fieldEmail').value.trim();
  const subject = document.getElementById('fieldSubject').value.trim();
  const message = document.getElementById('fieldMessage').value.trim();
  const btn     = document.getElementById('submitBtn');
 
  if (!name || !email || !subject || !message) {
    showStatus('Veuillez remplir tous les champs.', 'error');
    return;
  }
 
  btn.disabled = true;
  btn.classList.add('loading');
  btn.querySelector('.btn-text').textContent = 'Envoi en cours…';
 
  try {
    const fd = new FormData();
    fd.append('access_key', '77236ab6-8bb7-4efd-9814-dbe23435fd89');
    fd.append('name', name);
    fd.append('email', email);
    fd.append('subject', subject);
    fd.append('message', message);
 
    const res    = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
    const result = await res.json();
 
    if (result.success) {
      showStatus("Message envoyé avec succès ! Merci de m'avoir contacté.", 'success');
      if (contactForm) contactForm.reset();
      btn.querySelector('.btn-text').textContent = 'Envoyé ✓';
      setTimeout(() => {
        btn.querySelector('.btn-text').textContent = 'Envoyer le message →';
      }, 4000);
    } else {
      throw new Error(result.message || 'Erreur inconnue');
    }
  } catch (err) {
    showStatus('Une erreur est survenue. Veuillez réessayer ou me contacter directement.', 'error');
    btn.querySelector('.btn-text').textContent = 'Envoyer le message →';
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}
 
function showStatus(msg, type) {
  const s = document.getElementById('formStatus');
  if (!s) return;
  s.textContent = msg;
  s.className   = `form-status ${type} visible`;
  // S'assure que le message est visible (override du display:none CSS)
  s.style.display = 'block';
}
 
// Attacher sur submit du formulaire (fiable sur tous les navigateurs mobiles)
if (contactForm) {
  contactForm.addEventListener('submit', handleSubmit);
}
// Attacher aussi sur le clic bouton (double sécurité)
if (submitBtn) {
  submitBtn.addEventListener('click', handleSubmit);
}
 
// ── IMAGE MODAL ──
const modal    = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-modal');
 
document.querySelectorAll('.hero-profile-images img').forEach(img => {
  img.addEventListener('click', () => {
    if (!modal || !modalImg) return;
    modal.style.display = 'block';
    modalImg.src = img.src;
    modalImg.alt = img.alt;
  });
});
 
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
  });
}
 
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}
 
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && modal.style.display === 'block') modal.style.display = 'none';
    if (isMobile() && sidebar && sidebar.classList.contains('open')) closeSidebar();
  }
});
 
// ── BACK TO TOP ──
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
 
// ── LOADER ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
});
