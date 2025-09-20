
import { isAuthed, clearSession, normaliseSession } from './auth.js';
import { startRouter } from './router.js';

normaliseSession()

console.log('[APP] LOADED path=', location.pathname);

if (location.pathname === '/login' || location.pathname === '/register') {
  // Those pages have their own scripts
  console.log('[APP] auth page → router not started');
} else if (!isAuthed()) {
  console.warn('[APP] no session → redirect /login');
  location.href = '/login';
} else {
  const root = document.getElementById('app');
  console.log('[APP] mount router, #app exists?', !!root);
  startRouter(root);
}

const gForm = document.getElementById('globalSearchForm');
gForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(gForm);
  const title = (fd.get('name') || fd.get('q') || '').trim();
  const year  = (fd.get('year') || '').trim();
  if (!title || !year) return;
  location.href = `/search?name=${encodeURIComponent(title)}&year=${encodeURIComponent(year)}&page=1`;
});


const logoutBtn = document.getElementById('logoutBtn');

// Show/hide Admin & Logout based on auth
(function authHeaderVisibility() {
  const authed = isAuthed();
  if (logoutBtn) logoutBtn.hidden = !authed;
  const adminLink = document.querySelector('.top-links a[href="/admin"]');
  if (adminLink) adminLink.hidden = !authed;
})();

// Logout click
logoutBtn?.addEventListener('click', async () => {
  try { await fetch('/api/auth/logout'); } catch {}
  clearSession();
  location.href = '/login';
});

// Gate pages behind auth
if (location.pathname !== '/login' && location.pathname !== '/register' && !isAuthed()) {
  location.href = '/login';
} else {
  const app = document.getElementById('app');
  startRouter(app);
}
