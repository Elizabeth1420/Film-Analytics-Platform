import { saveSession } from './auth.js';

const form = document.getElementById('loginForm');
const err  = document.getElementById('loginError');

console.log('[LOGIN] script loaded, form present:', !!form);

form?.addEventListener('submit', async (e) => {
  e.preventDefault();     // stop default POST /login navigation
  err.hidden = true;

  const fd = new FormData(form);
  const payload = {
    email: (fd.get('email') || '').trim(),
    password: fd.get('password')
  };

  console.log('[LOGIN] submit', { email: payload.email });

  console.time('[LOGIN] fetch');
  try {
    const res  = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({}));
    console.timeEnd('[LOGIN] fetch');
    console.log('[LOGIN] status:', res.status);

    if (!res.ok) throw new Error(json?.error || 'Invalid email or password');

    // backend returns { message, user: { session: { access_token }, ... } }
    const token = json?.user?.session?.access_token;
    console.log('[LOGIN] token received?', !!token, token ? '(length ' + token.length + ')' : '');
    if (!token) throw new Error('No session token returned');

    saveSession(token);
    console.log('[LOGIN] session saved, redirect -> /');
    location.href = '/';
  } catch (e2) {
    console.error('[LOGIN] error:', e2);
    err.textContent = e2.message || 'Sign-in failed';
    err.hidden = false;
  }
});
