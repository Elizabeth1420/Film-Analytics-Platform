// frontend/js/details.js
export function renderDetails(root) {
  const u = new URL(location.href);
  const id = u.searchParams.get('id');
  root.innerHTML = `
    <section class="card">
      <h1>Movie details</h1>
      ${id ? `<p class="muted small">TMDB id: ${id}</p>` : `<p class="error">Missing movie id</p>`}
      <p class="muted">Coming next: title/year/poster/director, OMDb ratings, TMDb reviews, and trailer embed.</p>
      <p><a class="link-muted" href="/search">← Back to search</a></p>
    </section>
  `;
}
