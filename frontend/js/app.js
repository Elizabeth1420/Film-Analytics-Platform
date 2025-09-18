// import { isAuthed, clearSession, getToken } from './auth.js';
// import { startRouter } from './router.js';

// console.log('[APP] loaded');

// // if (!isAuthed()) {
// //   console.log('[APP] no session → redirect to /login');
// //   location.href = '/login';
// // }
// if (location.pathname !== '/login' && location.pathname !== '/register' && !isAuthed()) {
//   location.href = '/login';
// } else if (location.pathname === '/') {
//   const root = document.getElementById('app');
//   startRouter(root);
// }
// const app = document.getElementById('app');
// if (!app) {
//   console.warn('[APP] #app not found');
// } else {
//   const token = getToken();
//   app.innerHTML = `
//     <section class="card" style="margin-top:32px;">
//       <h1>Welcome</h1>
//       <p>You are signed in. Token present: <b>${token ? 'yes' : 'no'}</b></p>
//       <button class="btn" id="logoutBtn">Log out</button>
//       <p class="small" style="margin-top:12px;">
//         Try the mock pages: <a href="/mock/home.html">Home mock</a> · <a href="/mock/search.html">Search mock</a>
//       </p>
//     </section>`;
//   document.getElementById('logoutBtn')?.addEventListener('click', async () => {
//     try { await fetch('/api/auth/logout'); } catch {}
//     clearSession();
//     location.href = '/login';
//   });
// }

// frontend/js/app.js
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
  const q = (fd.get('q') || '').trim();
  const year = (fd.get('year') || '').trim();

  if (!q || !year) return; // backend requires a valid year
  location.href = `/search?name=${encodeURIComponent(q)}&year=${encodeURIComponent(year)}&page=1`;
});


// Optional logout handler if you add a button with id="logoutBtn"
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  try { await fetch('/api/auth/logout'); } catch {}
  clearSession();
  location.href = '/login';
});
