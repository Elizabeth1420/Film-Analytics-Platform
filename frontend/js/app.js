 import { isAuthed, clearSession } from "./auth";
 import{startRouter} from "./router.js";

 const isLogin =
  location.pathname === '/login' ||
  location.pathname.endsWith('/login.html');

 document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try{ await fetch("/api/auth/logout"); } catch{}
    clearSession();
    location.href = "/login";
 });

 if(location.pathname !== "/login" && !isAuthed()){
    location.href = "/login";
 }else {
    const app = document.getElementById("app");
    startRouter(app);
 }
