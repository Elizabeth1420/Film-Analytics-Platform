const KEY = "fa.session"


export function saveToken(token)
{
    localStorage.setItem(KEY,JSON.stringify({token}))
}

export function getToken(){
    try{ return JSON.parse(localStorage.getItem(KEY))?.token || null}
    catch{ return null}
}

export function clearsession() {
    localStorage.removeItem(KEY)
}

export function isAuthed() {
    return !!getToken();
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