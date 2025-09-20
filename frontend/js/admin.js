// frontend/js/admin.js
import { api } from './api.js';
import { getUserId } from './auth.js';

export function renderAdmin(root) {
  root.innerHTML = `
    <section class="card" style="margin-bottom:18px;">
      <h1 style="margin:0 0 12px;">Manage Movies</h1>
      <form id="movieForm" class="form-grid" novalidate>
        <div class="row" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
          <label>Title
            <input class="input" name="title" required placeholder="e.g., Inception" />
          </label>
          <label>Release date
            <input class="input" name="release_date" type="date" required />
          </label>
          <label>Director
            <input class="input" name="director" required placeholder="e.g., Christopher Nolan" />
          </label>
          <label>Genre
            <input class="input" name="genre" required placeholder="e.g., Sci-Fi" />
          </label>
          <label>Runtime (min)
            <input class="input" name="runtime" type="number" min="1" required />
          </label>
          <label>Box office
            <input class="input" name="box_office" type="number" min="0" required />
          </label>
          <label>Budget
            <input class="input" name="budget" type="number" min="0" required />
          </label>
          <label>Award wins
            <input class="input" name="award_wins" type="number" min="0" required />
          </label>
          <label>Award nominations
            <input class="input" name="award_nominations" type="number" min="0" required />
          </label>
        </div>
        <div class="row" style="margin-top:12px; gap:10px;">
          <button class="btn btn-primary" type="submit">Save (add/update)</button>
          <button id="resetBtn" class="btn" type="button">Reset</button>
          <span id="formMsg" class="small muted" style="margin-left:8px;"></span>
        </div>
      </form>
    </section>

    <section class="card">
      <header class="row" style="justify-content: space-between; align-items:center;">
        <h2 style="margin:0;">Your database</h2>
        <button id="reloadBtn" class="btn" type="button">Reload</button>
      </header>
      <div id="list" class="cards cards-4 cards-compact" style="margin-top:12px;"></div>
      <p id="listMsg" class="small muted" style="margin-top:8px;"></p>
    </section>
  `;

  const el = {
    form: root.querySelector('#movieForm'),
    msg:  root.querySelector('#formMsg'),
    reset: root.querySelector('#resetBtn'),
    reload: root.querySelector('#reloadBtn'),
    list: root.querySelector('#list'),
    listMsg: root.querySelector('#listMsg'),
  };

  let rows = [];

  function toPayload(fd) {
    return {
      title: (fd.get('title') || '').trim(),
      release_date: fd.get('release_date'),               // YYYY-MM-DD
      director: (fd.get('director') || '').trim(),
      genre: (fd.get('genre') || '').trim(),
      runtime: Number(fd.get('runtime') || 0),
      box_office: Number(fd.get('box_office') || 0),
      budget: Number(fd.get('budget') || 0),
      award_wins: Number(fd.get('award_wins') || 0),
      award_nominations: Number(fd.get('award_nominations') || 0),
      
    };
  }

  function ownerIdOf(m) {
    
    return m.created_by ?? m.user_id ?? m.owner_id ?? null;
  }
  function canDelete(m) {
    const me = getUserId();
    const owner = ownerIdOf(m);
    return me && owner && owner === me;
  }

  function renderList() {
    if (!Array.isArray(rows) || rows.length === 0) {
      el.list.innerHTML = `<p class="muted">No movies in your database yet.</p>`;
      return;
    }
    el.list.innerHTML = rows.map(m => {
      const yr = (m.release_date || '').slice(0,4) || '—';
      return `
        <article class="card movie-card" data-id="${m.id}">
          <div class="body">
            <h3>${m.title} <span class="meta">(${yr})</span></h3>
            <div class="small muted">${m.genre} • ${m.director}</div>
            <div class="row" style="gap:8px; margin-top:10px;">
              <button class="btn" data-edit="${m.id}" type="button">Edit</button>
              ${canDelete(m) ? `<button class="btn btn-danger" data-del="${m.id}" type="button">Delete</button>` : ''}
            </div>
          </div>
        </article>`;
    }).join('');

    // wire edit/delete
    el.list.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit');
        const m = rows.find(r => String(r.id) === String(id));
        if (!m) return;
        // Prefill form with the row (edit = upsert with same title+release_date)
        el.form.title.value = m.title || '';
        el.form.release_date.value = (m.release_date || '').slice(0,10);
        el.form.director.value = m.director || '';
        el.form.genre.value = m.genre || '';
        el.form.runtime.value = m.runtime || '';
        el.form.box_office.value = m.box_office || '';
        el.form.budget.value = m.budget || '';
        el.form.award_wins.value = m.award_wins || '';
        el.form.award_nominations.value = m.award_nominations || '';
        el.msg.textContent = 'Edit mode (upsert on save)';
      });
    });

    el.list.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-del');
        if (!id) return;
        if (!confirm('Delete this movie?')) return;
        try {
          el.listMsg.textContent = 'Deleting…';
          await api.internal.remove(id);
          el.listMsg.textContent = 'Deleted.';
          await load();
        } catch (e) {
          el.listMsg.textContent = e.message || 'Delete failed.';
        }
      });
    });
  }

  async function load() {
    try {
      el.listMsg.textContent = 'Loading…';
      rows = await api.internal.list();
      el.listMsg.textContent = '';
      renderList();
    } catch (e) {
      el.listMsg.textContent = e.message || 'Failed to load.';
      el.list.innerHTML = '';
    }
  }

  // submit add/update
  el.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    el.msg.textContent = 'Saving…';
    const fd = new FormData(el.form);
    const payload = toPayload(fd);

    try {
      await api.internal.add(payload);     
      el.msg.textContent = 'Saved.';
      el.form.reset();
      await load();
    } catch (e2) {
      el.msg.textContent = e2.message || 'Save failed.';
    }
  });

  el.reset.addEventListener('click', () => { el.form.reset(); el.msg.textContent = ''; });
  el.reload.addEventListener('click', load);

  load();
}
