
import { api } from './api.js';

const IMG = 'https://image.tmdb.org/t/p/w342';
const PLACEHOLDER = '/assets/poster-placeholder.png';
const poster = p => (p ? `${IMG}${p}` : PLACEHOLDER);

function card(m) {
  const year = (m.release_date || '').slice(0, 4) || '—';
  const rating = typeof m.vote_average === 'number' ? m.vote_average.toFixed(1) : '—';
  return `
    <article class="card movie-card">
      <img class="poster" src="${poster(m.poster_path)}" alt="${m.title} poster"
           onerror="this.onerror=null;this.src='${PLACEHOLDER}'" />
      <div class="body">
        <h3>${m.title} <span class="meta">(${year})</span></h3>
        <div class="badges"><span class="badge">TMDb ${rating}</span></div>
      </div>
    </article>`;
}

export function renderHome(root) {
  console.log('[HOME] render start');
  root.innerHTML = `
   <section class="hero card" aria-labelledby="discoverHeading">
      <h1 id="discoverHeading">Discover Movies</h1>
      <form id="heroSearch" class="row" role="search" aria-label="Search Movies">
        <label class="sr-only" for="home-q">Title</label>
        <input id="home-q" class="input" name="q" placeholder="Search a movie title..." required />
        <label class="sr-only" for="home-year">Year</label>
        <input id="home-year" class="input" name="year" placeholder="Year (e.g. 2024)" inputmode="numeric" pattern="[0-9]*" required />
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
    </section>

    <section class="card" aria-labelledby="tHead">
      <header class="row" style="justify-content:space-between;margin-bottom:10px;">
        <h2 id="tHead">Trending Movies</h2>
        <div class="toggle" role="tablist" aria-label="Trending window">
          <button id="tgDay"  role="tab" class="active" aria-selected="true"  type="button">Day</button>
          <button id="tgWeek" role="tab" aria-selected="false" type="button">Week</button>
        </div>
      </header>
      <div id="grid" class="grid cards" aria-live="polite"></div>
      <div id="msg" class="small muted" style="margin-top:8px;"></div>
      <nav class="pagination" aria-label="Trending pagination">
        <button id="prevBtn" class="btn" type="button">Prev</button>
        <span id="pageInfo" class="small muted">Page 1 of 1</span>
        <button id="nextBtn" class="btn" type="button">Next</button>
      </nav>
    </section>
  `;

  const el = {
    grid: root.querySelector('#grid'),
    msg:  root.querySelector('#msg'),
    info: root.querySelector('#pageInfo'),
    prev: root.querySelector('#prevBtn'),
    next: root.querySelector('#nextBtn'),
    day:  root.querySelector('#tgDay'),
    week: root.querySelector('#tgWeek'),
  };

  const state = { period: 'day', page: 1, total: 1, busy: false };

  const setBusy = v => { state.busy = v; el.msg.textContent = v ? 'Loading…' : ''; };
  const setInfo = () => { el.info.textContent = `Page ${state.page} of ${state.total}`; };
  const setTabs = () => {
    const onDay = state.period === 'day';
    el.day.classList.toggle('active', onDay);
    el.day.setAttribute('aria-selected', String(onDay));
    el.week.classList.toggle('active', !onDay);
    el.week.setAttribute('aria-selected', String(!onDay));
  };
  const updateButtons = () => {
    el.prev.disabled = state.page <= 1 || state.busy;
    el.next.disabled = state.page >= state.total || state.busy;
  };

  async function load() {
  setBusy(true);
  try {
    console.log('[HOME] fetch', state.period, 'page', state.page);
    const data = await api.trending(state.period, state.page);
    const list = data?.results ?? [];
    state.total = Math.max(1, data?.total_pages ?? 1);
    console.log('[HOME] total_pages =', state.total);

    el.grid.innerHTML = list.map(card).join('') || `<p class="muted">No results.</p>`;
    setInfo();
    
  } catch (e) {
    console.error('[HOME] error', e);
    el.msg.textContent = e?.message || 'Failed to load trending.';
    el.grid.innerHTML = '';
    state.total = 1;
    setInfo();
    
  } finally {
    setBusy(false);
    updateButtons(); 
  }
}


  el.prev.addEventListener('click', () => {
    console.log('[HOME] prev clicked');
    if (state.page > 1) { state.page--; load(); }
  });
  el.next.addEventListener('click', () => {
    console.log('[HOME] next clicked');
    if (state.page < state.total) { state.page++; load(); }
  });

  el.day.addEventListener('click',  () => { state.period = 'day';  state.page = 1; setTabs(); load(); });
  el.week.addEventListener('click', () => { state.period = 'week'; state.page = 1; setTabs(); load(); });

  setTabs();
  load();
}
