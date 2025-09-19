const express = require('express');
const { handleApiError } = require('./utils/apiUtils');

// Validate environment variables are set
const EnvHelper = require('./utils/envHelper');
EnvHelper.validate();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Use CORS to allow cross-origin requests
const cors = require('cors');
app.use(cors());

// Expose the movies routes
app.use('/api/movies', require('./routes/movies.routes'));

// Expose the auth routes
app.use('/api/auth', require('./routes/users.routes'));

const path = require('path');
const FRONTEND_DIR = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

// app.get(['/', '/login', '/register', '/search', '/details', '/admin'], (req, res) => {
//   const file =
//     req.path === '/login'    ? 'login.html' :
//     req.path === '/register' ? 'register.html' :
//                                'index.html';
//   res.sendFile(path.join(FRONTEND_DIR, file));
// });

app.get('/login',    (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'register.html')));

// SPA routes: always send index.html so the client router can render
app.get(['/', '/search', '/details', '/admin'], (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
})


// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err);
  handleApiError(err, res, next);
});

module.exports = app;