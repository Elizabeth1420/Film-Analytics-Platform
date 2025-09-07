// Pull in required modules
const { login, register, logout } = require("../service/auth.service");
const { handleApiError } = require("../utils/apiUtils");
const validation = require("../utils/validation");
const HTTP_STATUS = require("../utils/statusCodes");


async function loginUser(req, res, next) {
  const { email, password } = req.body;

   if (!validation.isValidEmail(email) || !validation.isValidPassword(password)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Email or password invalid or missing." });
  }

  try {
    const data = await login(email, password);
    res.status(HTTP_STATUS.OK).json({
      message: "Account logged in",
      user: data
    });
  } catch (err) {
    handleApiError(err, res, next);
  }
}

async function logoutUser(req, res, next) {
  try {
    await logout();
    res.status(HTTP_STATUS.OK).json({ message: "User signed out" });
  } catch (err) {
    handleApiError(err, res, next);
  }
}

async function registerUser(req, res, next) {
  const { display_name, email, password } = req.body;

  if (!validation.isValidEmail(email) || !validation.isValidPassword(password) || !display_name || display_name.trim() === "") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Display name, Email, or password invalid or missing." });
  }

  try {
    const data = await register(display_name, email, password);
    res.status(HTTP_STATUS.CREATED).json({
      message: "Account created",
      data: data
    });
  } catch (err) {
    handleApiError(err, res, next);
  }
}


module.exports = { loginUser, registerUser, logoutUser };
