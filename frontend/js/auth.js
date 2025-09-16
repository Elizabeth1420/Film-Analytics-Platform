// frontend/js/auth.js
const KEY = 'fa.session';

export function saveSession(token) {
  try { localStorage.setItem(KEY, JSON.stringify({ token })); } catch {}
}

export function getToken() {
  try { return JSON.parse(localStorage.getItem(KEY))?.token || null; } catch { return null; }
}

export function isAuthed() { return !!getToken(); }

export function clearSession() {
  try { localStorage.removeItem(KEY); } catch {}
}


export async function login(email, password) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ email, password})
    });


const data = await res.json().catch(() => ({}));
if (!res) throw new Error (data?.error || "Login failed");

const token = data?.user?.session?.access_token;
if(!token) throw new Error ("No access token returned")
saveToken(token);
return data;
}