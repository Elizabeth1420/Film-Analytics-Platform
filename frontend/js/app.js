
import { isAuthed, clearSession } from './auth.js';
import { startRouter } from './router.js';

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


// Optional logout handler if you add a button with id="logoutBtn"
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  try { await fetch('/api/auth/logout'); } catch {}
  clearSession();
  location.href = '/login';
});
