import { getToken,clearSession } from './auth.js';

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function jfetch(url, opts = {}) {
  const finalOpts = {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
      ...authHeaders()
    }
  };
  console.log('[API]', finalOpts.method || 'GET', url, finalOpts);
  const res = await fetch(url, finalOpts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[API] error', res.status, json);
    throw new Error(json?.error || `Request failed (${res.status})`);
  }
  return json;
}

// PUBLIC
export const api = {
  // auth (public)
  register: (body) => jfetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => jfetch('/api/auth/login',    { method: 'POST', body: JSON.stringify(body) }),

  // movies (public)
  trending: (period='day', page=1) => jfetch(`/api/movies/trending/${period}?page=${page}`),
  search:   (name, year, page=1)   => jfetch(`/api/movies/search?name=${encodeURIComponent(name)}&year=${encodeURIComponent(year)}&page=${page}`),
  reviews:  (id, page=1)           => jfetch(`/api/movies/${id}/reviews?page=${page}`),
  trailer:  (id)                   => jfetch(`/api/movies/${id}/trailer`),

  // internal (protected)
  internal: {
    list:    ()       => jfetch('/api/movies/internal'),
    add:     (movie)  => jfetch('/api/movies/internal',     { method: 'POST', body: JSON.stringify(movie) }),
    remove:  (id)     => jfetch(`/api/movies/internal/${id}`, { method: 'DELETE' }),
    reviews: {
      get:   (movieId) => jfetch(`/api/movies/internal/reviews?movie_id=${movieId}`),
      add:   (review)  => jfetch('/api/movies/internal/reviews', { method: 'POST', body: JSON.stringify(review) })
    }
  }
};
