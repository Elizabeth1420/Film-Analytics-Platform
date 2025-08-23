// Pull in requied modules
const { login, register } = require("../service/auth.service");
const { handleApiError } = require("../utils/apiUtils");
const { isValidEmail, isValidPassword } = require("../utils/validation");

async function loginUser(req, res, next) {
  const { email, password } = req.body;

   if (!isValidEmail(email) || !isValidPassword(password)) {
    return res.status(400).json({ error: "Email or password invalid or missing." });
  }

  try {
    const data = await login(email, password);
    res.status(201).json({
      message: "Account logged in",
      user: data.user
    });
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
      message: "Account created",
      user: data.user
    });
  } catch (err) {
    handleApiError(err, res, next);
  }
}



module.exports = { loginUser, registerUser };
