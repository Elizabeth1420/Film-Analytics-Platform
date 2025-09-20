// frontend/js/auth.js
const KEY = 'fa.session';

export function saveSession(token) {
  try { localStorage.setItem(KEY, JSON.stringify({ token })); } catch {}
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return null; }
}

function extractToken(s) {
  return (
    s?.access_token ||               
    s?.token?.access_token ||         
    s?.token ||                     
    s?.session?.access_token ||       
    s?.user?.session?.access_token ||
    null
  );
}

export function getToken() {
  return extractToken(getSession())
}

export function normaliseSession() {
  const s = getSession();
  const tok = extractToken(s);
  if (!tok) return;
  const normalised = {
    access_token: tok,
    user_id: s.user_id || s.user?.id || null,
    email:    s.email   || s.user?.email || null,
  };
  
  if (!s.access_token || s.access_token !== tok) saveSession(normalised);
}

export function getUserId()  { return getSession()?.user_id || null; }

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