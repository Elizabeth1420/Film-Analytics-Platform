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

    console.log('[LOGIN] response', json);
    const token  = json?.user?.session?.access_token;
    const userId = json?.user?.user?.id;
    const email  = json?.user?.user?.email;
    console.log('[LOGIN] token starts:', (token || '').slice(0, 16));
    if (!token) throw new Error('No session token returned');

    saveSession({ access_token: token, user_id: userId, email });
    location.href = '/';
  } catch (e2) {
    err.textContent = e2.message || 'Sign-in failed';
    err.hidden = false;
  }
});
