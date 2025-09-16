import { isAuthed, clearSession, getToken } from './auth.js';

console.log('[APP] loaded');

if (!isAuthed()) {
  console.log('[APP] no session → redirect to /login');
  location.href = '/login';
}

const app = document.getElementById('app');
if (!app) {
  console.warn('[APP] #app not found');
} else {
  const token = getToken();
  app.innerHTML = `
    <section class="card" style="margin-top:32px;">
      <h1>Welcome</h1>
      <p>You are signed in. Token present: <b>${token ? 'yes' : 'no'}</b></p>
      <button class="btn" id="logoutBtn">Log out</button>
      <p class="small" style="margin-top:12px;">
        Try the mock pages: <a href="/mock/home.html">Home mock</a> · <a href="/mock/search.html">Search mock</a>
      </p>
    </section>`;
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try { await fetch('/api/auth/logout'); } catch {}
    clearSession();
    location.href = '/login';
  });
}
