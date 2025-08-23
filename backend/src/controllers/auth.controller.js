const { login, register } = require("../service/auth.service");
const { handleApiError } = require("../utils/apiUtils");

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await login(email, password);
    res.status(200).json(data);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

async function registerUser(req, res, next) {
  const { email, password } = req.body;


  if (!isValidEmail(email) || !isValidPassword(password)) {
    return res.status(400).json({ error: "Email or password invalid or missing." });
  }

  try {
    const data = await register(email, password);
    res.status(201).json({
      user: data.user,
      message: "Account created",
    });
  } catch (err) {
    handleApiError(err, res, next);
  }
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function isValidEmail(email) {
  // Basic regex for email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { loginUser, registerUser };
