// frontend/js/router.js
import { renderHome } from './home.js';
import { renderSearch } from './search.js';
import {renderDetails} from './details.js'; // adding this as a precaution so the code doesnt 404 when we try click on a picture
import {renderAdmin} from './admin.js';
export function startRouter(rootEl) {
  const el = rootEl || document.getElementById('app');
  if (!el) {
    console.error('[ROUTER] #app missing – ensure <main id="app"> exists and app.js is loaded after it.');
    return;
  }

  const path = location.pathname;
  console.log('[ROUTER] start path:', path);

 try {
    if (path === '/' || path === '/index.html') return renderHome(el);
    if (path === '/search')                     return renderSearch(el);
    if (path === '/details')                    return renderDetails(el);
    if (path === '/admin')                      return renderAdmin(el);

    el.innerHTML = `<section class="card"><h1>Not found</h1><p class="muted">${path}</p></section>`;
  } catch (e) {
    console.error('[ROUTER] render error', e);
    el.innerHTML = `<section class="card"><h1>Error</h1><pre class="small">${e?.message || e}</pre></section>`;
  }
}
