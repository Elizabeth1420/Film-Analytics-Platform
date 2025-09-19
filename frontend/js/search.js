import {api} from './api.js';
const IMG = 'https://image.tmdb.org/t/p/w342';
const PLACEHOLDER = '/assets/poster-placeholder.png';
const poster = (p) => (p ? `${IMG}${p}` : PLACEHOLDER);

function params() {
  const u = new URL(location.href);
  return {
    name: u.searchParams.get('name')?.trim() || '',
    year: u.searchParams.get('year')?.trim() || '',
    page: Math.max(1, parseInt(u.searchParams.get('page') || '1', 10)),
  };
}

function setQuery(next) {
  const u = new URL(location.href);
  Object.entries(next).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') u.searchParams.delete(k);
    else u.searchParams.set(k, String(v));
  });
  history.pushState({}, '', u.toString());
}

function card(m) {
  const year = (m.release_date || '').slice(0, 4) || '—';
  const rating = typeof m.vote_average === 'number' ? m.vote_average.toFixed(1) : '—';
  return `
    <article class="card movie-card" data-id="${m.id}" tabindex="0" role="button" aria-label="Open details for ${m.title}">
      <img class="poster" loading="lazy"
           src="${poster(m.poster_path)}"
           alt="${m.title} poster"
           onerror="this.onerror=null;this.src='${PLACEHOLDER}'" />
      <div class="body">
        <h3>${m.title} <span class="meta">(${year})</span></h3>
        <div class="badges"><span class="badge">TMDb ${rating}</span></div>
      </div>
    </article>`;
}

export async function renderSearch(root) {
  const q = params();
  root.innerHTML = `
    <section class="card" aria-labelledby="searchHead">
      <h1 id="searchHead">Search</h1>
      <form id="searchForm" class="row" role="search" aria-label="Search movies" style="margin:12px 0 8px;">
        <input class="input"  name="name" placeholder="Movie title (e.g., Inception)" required value="${q.name}">
        <input class="input"  name="year" placeholder="Year (e.g., 2010)" inputmode="numeric" pattern="[0-9]*" required value="${q.year}">
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
      <p class="small muted">Tip: Year is required by the API (valid ≥ 1880).</p>
      <div id="meta" class="small muted" style="margin-top:6px;"></div>
      <div id="grid" class="cards cards-4 cards-compact" aria-live="polite" style="margin-top:12px;"></div>
      <div id="msg" class="small muted" style="margin-top:8px;"></div>
      <nav class="pagination" aria-label="Search pagination">
        <button id="prevBtn" class="btn" type="button">Prev</button>
        <span id="pageInfo" class="small muted">Page 1 of 1</span>
        <button id="nextBtn" class="btn" type="button">Next</button>
      </nav>
    </section>
  `;

  const el = {
    form: root.querySelector('#searchForm'),
    meta: root.querySelector('#meta'),
    grid: root.querySelector('#grid'),
    msg:  root.querySelector('#msg'),
    prev: root.querySelector('#prevBtn'),
    next: root.querySelector('#nextBtn'),
    info: root.querySelector('#pageInfo'),
  };

  let page = q.page;
  let total = 1;
  let busy = false;

  const setBusy = (v) => { busy = v; el.msg.textContent = v ? 'Loading…' : ''; };
  const updatePager = () => {
    el.info.textContent = `Page ${page} of ${total}`;
    el.prev.disabled = page <= 1 || busy;
    el.next.disabled = page >= total || busy;
  };

  async function load() {
    if (!q.name || !q.year) {
      el.msg.textContent = 'Enter a title and year, then press Search.';
      el.grid.innerHTML = '';
      return;
    }

    setBusy(true);
    try {
      el.meta.textContent = `Results for “${q.name}” (${q.year})`;
      const data = await api.search(q.name, q.year, page);
      const list = data?.results ?? [];
      total = Math.max(1, data?.total_pages ?? 1);

      el.grid.innerHTML = list.map(card).join('') || `<p class="muted">No results.</p>`;
      updatePager();

      // click → details
      el.grid.querySelectorAll('.movie-card').forEach((node) => {
        node.addEventListener('click', () => {
          const id = node.getAttribute('data-id');
          if (id) location.href = `/details?id=${id}`;
        });
        node.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); node.click(); }
        });
      });
    } catch (e) {
      el.msg.textContent = e?.message || 'Failed to load results.';
      el.grid.innerHTML = '';
      total = 1;
      updatePager();
    } finally {
      setBusy(false);
    }
  }

  // form submit → reset page to 1 and reload with new query
  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(el.form);
    q.name = (fd.get('name') || '').trim();
    q.year = (fd.get('year') || '').trim();
    page = 1;
    setQuery({ name: q.name, year: q.year, page });
    load();
  });

  el.prev.addEventListener('click', () => { if (page > 1) { page--; setQuery({ page }); load(); } });
  el.next.addEventListener('click', () => { if (page < total) { page++; setQuery({ page }); load(); } });

  // initial load
  await load();
}
