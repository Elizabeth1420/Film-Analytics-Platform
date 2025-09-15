import {login, clearSession} from "./auth.js";

const form = document.getElementById("login-form");
const errorE1 = document.getElementById("LoginError");

clearSession();

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorE1.hidden = true;
    const fd = new FormData(form);
    try{
        await login(fd.get("email"), fd.get("password"));
        location.href = "/";
    }catch(err){
        errorE1.hidden = false;
        errorE1.textContent = err?.message || "Login failed";
    }
})
