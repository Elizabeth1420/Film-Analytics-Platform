// frontend/js/router.js
import { renderHome } from './home.js';

export function startRouter(rootEl) {
  const el = rootEl || document.getElementById('app');
  if (!el) {
    console.error('[ROUTER] #app missing – ensure <main id="app"> exists and app.js is loaded after it.');
    return;
  }

  const path = location.pathname;
  console.log('[ROUTER] start path:', path);

  try {
    if (path === '/' || path === '/index.html') {
      renderHome(el);
      return;
    }

    
    el.innerHTML = `<section class="card"><h1>Not found</h1><p class="muted">${path}</p></section>`;
  } catch (e) {
    console.error('[ROUTER] render error', e);
    el.innerHTML = `<section class="card"><h1>Error</h1><pre class="small">${e?.message || e}</pre></section>`;
  }
}
