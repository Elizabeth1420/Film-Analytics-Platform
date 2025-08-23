const supabase = require("../utils/supabaseClient");

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error; // Let controller handle error
  }

  return data;
}

async function register(email, password) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error; // Let controller handle error
  }

  return data;
}

async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error; // Let controller handle error
  }

}

module.exports = { login, register, logout};
