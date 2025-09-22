# Film-Analytics-Platform

Film Analytics — Quick Start (Local)
Prerequisites

Node.js v18+ (v20+ recommended): node -v

Accounts/keys:

TMDb Bearer token

OMDb API key

Supabase service role key (for your project)

1) Clone the repo
git clone <your-repo-url>
cd Film-Analytics-Platform

2) Create backend .env

The details for the .env file can be accessed in the frontend documentation for this project
Create a file at backend/.env (note the exact var names; OMDb key var is spelled OMBD_API_KEY here):

PORT=3000
TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
OMBD_API_KEY=your_omdb_key_here
SUPABASE_SECRET_DEFAULT_KEY=your_supabase_service_role_key_here


Make sure this file is inside /backend, not the repo root.

3) Install backend deps
cd backend
npm install

4) Run the server
npm start        # or: node src/server.js


Server listens on http://localhost:3000

It also serves the frontend from the /frontend folder.

5) Open the app

Register: http://localhost:3000/register

Login: http://localhost:3000/login

Home: http://localhost:3000/

Admin (protected): http://localhost:3000/admin

After login, a session token is stored in localStorage and sent as a Bearer token to protected endpoints.

Optional

Dev auto-reload:

npm i -D nodemon
# package.json -> "dev": "nodemon src/server.js"
npm run dev




Troubleshooting

“supabaseKey is required.”
.env is missing/wrong location. Put it in /backend, ensure SUPABASE_SECRET_DEFAULT_KEY is set, then restart npm start.

“Cannot POST /register” or page reloads
Use the app URL /register (not opening HTML files directly). The form is handled by JS and posts to /api/auth/register.

401 on /admin
Log in again (or clear localStorage.fa.session), then refresh. Requests must include Authorization: Bearer <token> (the app does this automatically once logged in).

That’s it—once the server is running and you’ve registered/logged in, you can browse trending, search, view details (ratings/reviews/trailer), and use the admin page to add/update movies.