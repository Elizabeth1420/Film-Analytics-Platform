import { api } from './api.js';

const PLACEHOLDER = '/assets/poster-placeholder.png';

function getSelected() {
  try { return JSON.parse(sessionStorage.getItem('fa.selectedMovie') || '{}'); } catch { return {}; }
}
function ratingPills(ratings=[]) {
  const map = new Map(ratings.map(r => [r.Source, r.Value]));
  const imdb = map.get('Internet Movie Database') || map.get('IMDb');
  const rt   = map.get('Rotten Tomatoes');
  const mc   = map.get('Metacritic');

  const pill = (label, val) =>
    val ? `<span class="badge">${label} ${val}</span>` : '';

  return [ pill('IMDb', imdb), pill('RT', rt), pill('MC', mc) ].join(' ');
}
function reviewItem(r) {
  const author = r.author || 'Anonymous';
  const cut = (r.content || '').trim();
  const txt = cut.length > 500 ? `${cut.slice(0,500)}…` : cut;
  return `
    <article class="review">
      <div class="author">${author}</div>
      <p class="muted small" style="margin: 4px 0 10px;">${new Date(r.created_at || r.updated_at || Date.now()).toLocaleDateString()}</p>
      <p>${txt || '<em>No text</em>'}</p>
    </article>`;
}

export function renderDetails(root) {
  const u = new URL(location.href);
  const id = u.searchParams.get('id');
  const selected = getSelected();

  if (!id) {
    root.innerHTML = `<section class="card"><h1>Error</h1><p class="error">Missing movie id</p></section>`;
    return;
  }

  root.innerHTML = `
    <section class="card" style="margin-bottom:18px;">
      <div class="details-header">
        <img class="details-poster" src="${selected.poster_path || PLACEHOLDER}" alt="${selected.title || ''} poster"
             onerror="this.onerror=null;this.src='${PLACEHOLDER}'" />
        <div class="details-meta">
          <h1 class="details-title">${selected.title || 'Movie'}</h1>
          <p class="muted">Year: ${selected.year || '—'}</p>
          <div id="agg" class="badges" style="margin-top:8px;"></div>
        </div>
      </div>
    </section>

    <section class="card" style="margin-bottom:18px;">
      <h2 style="margin-top:0;">Trailer</h2>
      <div class="trailer"><iframe id="yt" allowfullscreen title="Trailer"></iframe></div>
      <p id="trailerMsg" class="small muted" style="margin-top:8px;"></p>
    </section>

    <section class="card">
      <header class="row" style="justify-content: space-between; align-items:center;">
        <h2 style="margin:0;">Reviews</h2>
        <nav class="pagination" aria-label="Reviews pagination">
          <button id="prevRv" class="btn" type="button">Prev</button>
          <span id="rvInfo" class="small muted">Page 1 of 1</span>
          <button id="nextRv" class="btn" type="button">Next</button>
        </nav>
      </header>
      <div id="reviews" class="reviews" style="margin-top:12px;"></div>
      <div id="rvMsg" class="small muted" style="margin-top:8px;"></div>
    </section>
  `;

  // elements
  const el = {
    agg: root.querySelector('#agg'),
    yt: root.querySelector('#yt'),
    trailerMsg: root.querySelector('#trailerMsg'),
    reviews: root.querySelector('#reviews'),
    rvMsg: root.querySelector('#rvMsg'),
    rvInfo: root.querySelector('#rvInfo'),
    prev: root.querySelector('#prevRv'),
    next: root.querySelector('#nextRv'),
  };

  // trailer
  (async () => {
    try {
      const t = await api.trailer(id);
      if (t && t.youtube_key) {
        el.yt.src = `https://www.youtube.com/embed/${t.youtube_key}`;
      } else {
        el.trailerMsg.textContent = 'No official trailer found.';
      }
    } catch (e) {
      el.trailerMsg.textContent = 'Failed to load trailer.';
    }
  })();

  
  let rvPage = 1, rvTotal = 1, busy = false;
  const setInfo = () => {
    el.rvInfo.textContent = `Page ${rvPage} of ${rvTotal}`;
    el.prev.disabled = rvPage <= 1 || busy;
    el.next.disabled = rvPage >= rvTotal || busy;
  };

  async function loadReviews() {
    busy = true; setInfo();
    el.rvMsg.textContent = 'Loading…';
    try {
      const data = await api.reviews(id, rvPage);
      // OMDb aggregate ratings pills
      el.agg.innerHTML = ratingPills(data?.ratings || []);
      // TMDb reviews
      const list = data?.reviews || [];
      rvTotal = Math.max(1, data?.total_pages || 1);
      el.reviews.innerHTML = list.map(reviewItem).join('') || `<p class="muted">No reviews yet.</p>`;
      el.rvMsg.textContent = '';
    } catch (e) {
      el.reviews.innerHTML = '';
      el.rvMsg.textContent = 'Failed to load reviews.';
      rvTotal = 1;
    } finally {
      busy = false; setInfo();
    }
  }

  el.prev.addEventListener('click', () => { if (rvPage > 1) { rvPage--; loadReviews(); } });
  el.next.addEventListener('click', () => { if (rvPage < rvTotal) { rvPage++; loadReviews(); } });

  loadReviews();
}
