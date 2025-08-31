// Pull in required modules
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

async function register(display_name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error; // Let controller handle error
  }

  // If no identities, the email is already registered
  if (
    Array.isArray(data.user.identities) &&
    data.user.identities.length === 0
  ) {
    throw { status: 409, message: "Email already registered." };
  }

  // Add user display name to user_profiles table
  if (data.user.id) {
    const { error: upsertErr } = await supabase.from("user_profiles").upsert(
      { user_id: data.user.id, display_name },
      { onConflict: "user_id" } // Ensure we don't create duplicates based on user_id
    );

    if (upsertErr) { throw upsertErr; } // Let controller handle error
  }

  // Return user info along with display_name
  const user_response = { display_name, ...data };
  return user_response;
}

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) { throw error; } // Let controller handle error
}

module.exports = { login, register, logout };
