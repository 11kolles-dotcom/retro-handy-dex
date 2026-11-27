import '@fontsource/press-start-2p/400.css';
import './style.css';
import { brands, brandColor, phoneById, phones, rarityLabel, typeLabel, type Phone } from './catalog';
import * as db from './db';
import type { Condition, Owned } from './db';
import { phoneSprite } from './pixel';
import * as sfx from './sound';

const app = document.getElementById('app')!;

// ---------- Zustand ----------

const owned = new Map<string, Owned>();
const photoUrls = new Map<string, string>();

const filters = {
  q: '',
  brand: '',
  show: 'all' as 'all' | 'owned' | 'missing',
};

// Entwurf beim Einsammeln
let draft: { blob: Blob; url: string; phoneId: string | null } | null = null;

async function loadOwned() {
  for (const url of photoUrls.values()) URL.revokeObjectURL(url);
  photoUrls.clear();
  owned.clear();
  for (const o of await db.getAll()) {
    owned.set(o.phoneId, o);
    photoUrls.set(o.phoneId, URL.createObjectURL(o.photo));
  }
}

// ---------- Hilfen ----------

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const no = (p: Phone) => `#${String(p.no).padStart(3, '0')}`;
const stars = (p: Phone) => '★'.repeat(p.rarity) + '☆'.repeat(3 - p.rarity);

const conditionLabel: Record<Condition, string> = {
  mint: 'Wie neu',
  gut: 'Gut',
  gebraucht: 'Gebraucht',
  defekt: 'Defekt',
};

function go(hash: string) {
  location.hash = hash;
}

function header(): string {
  const n = owned.size;
  const pct = Math.round((n / phones.length) * 100);
  return `
    <header class="top">
      <a href="#/" class="logo" aria-label="Startseite">HANDY<span>-</span>DEX</a>
      <a href="#/settings" class="icon-btn" aria-label="Einstellungen">⚙</a>
    </header>
    <div class="progress" title="${pct}% gesammelt">
      <div class="progress-bar" style="width:${pct}%"></div>
      <span class="progress-label">${String(n).padStart(3, '0')} / ${phones.length}</span>
    </div>`;
}

function spriteFor(p: Phone, isOwned: boolean) {
  return phoneSprite(p.type, brandColor(p.brand), isOwned);
}

// ---------- Ansichten ----------

function viewHome() {
  const q = filters.q.trim().toLowerCase();
  const list = phones.filter((p) => {
    const has = owned.has(p.id);
    if (filters.show === 'owned' && !has) return false;
    if (filters.show === 'missing' && has) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (q && !`${p.brand} ${p.model} ${p.year} ${p.no}`.toLowerCase().includes(q)) return false;
    return true;
  });

  app.innerHTML = `
    ${header()}
    <section class="toolbar">
      <input id="q" type="search" placeholder="Suchen…" value="${esc(filters.q)}" autocomplete="off" />
      <select id="brand" aria-label="Marke">
        <option value="">Alle Marken</option>
        ${brands.map((b) => `<option ${b === filters.brand ? 'selected' : ''}>${esc(b)}</option>`).join('')}
      </select>
      <div class="chips" role="group" aria-label="Anzeige">
        ${(['all', 'owned', 'missing'] as const)
          .map(
            (k) =>
              `<button class="chip ${filters.show === k ? 'on' : ''}" data-show="${k}">${
                { all: 'Alle', owned: 'Gesammelt', missing: 'Fehlt' }[k]
              }</button>`,
          )
          .join('')}
      </div>
    </section>
    <main class="grid">
      ${
        list.length
          ? list.map(card).join('')
          : `<p class="empty">Nichts gefunden.</p>`
      }
    </main>
    <button class="fab" id="catch">📷 EINSAMMELN</button>
  `;

  const qEl = app.querySelector<HTMLInputElement>('#q')!;
  qEl.addEventListener('input', () => {
    filters.q = qEl.value;
    const pos = qEl.selectionStart;
    viewHome();
    const n = app.querySelector<HTMLInputElement>('#q')!;
    n.focus();
    n.setSelectionRange(pos, pos);
  });
  app.querySelector<HTMLSelectElement>('#brand')!.addEventListener('change', (e) => {
    filters.brand = (e.target as HTMLSelectElement).value;
    viewHome();
  });
  app.querySelectorAll<HTMLButtonElement>('[data-show]').forEach((b) =>
    b.addEventListener('click', () => {
      sfx.blip();
      filters.show = b.dataset.show as typeof filters.show;
      viewHome();
    }),
  );
  app.querySelector('#catch')!.addEventListener('click', () => startCatch(null));
}

function card(p: Phone): string {
  const has = owned.has(p.id);
  const img = has
    ? `<img src="${photoUrls.get(p.id)}" alt="" loading="lazy" />`
    : spriteFor(p, false);
  return `
    <a class="card ${has ? 'owned' : 'missing'} r${p.rarity}" href="#/p/${p.id}" style="--brand:${brandColor(p.brand)}">
      <span class="card-no">${no(p)}</span>
      <div class="card-img">${img}</div>
      <span class="card-name">${has ? esc(p.model) : '???'}</span>
      <span class="card-brand">${esc(p.brand)}</span>
    </a>`;
}

function viewDetail(id: string) {
  const p = phoneById.get(id);
  if (!p) return go('#/');
  const o = owned.get(id);

  app.innerHTML = `
    ${header()}
    <main class="detail" style="--brand:${brandColor(p.brand)}">
      <a href="#/" class="back">◀ ZURÜCK</a>
      <div class="detail-card ${o ? 'owned' : 'missing'}">
        <div class="detail-head">
          <span>${no(p)}</span>
          <span class="rarity r${p.rarity}" title="${rarityLabel[p.rarity]}">${stars(p)}</span>
        </div>
        <div class="detail-visual">
          <div class="detail-sprite">${spriteFor(p, true)}</div>
          ${o ? `<img class="detail-photo" src="${photoUrls.get(id)}" alt="Dein Foto vom ${esc(p.model)}" />` : ''}
        </div>
        <h1>${esc(p.brand)}<br /><strong>${esc(p.model)}</strong></h1>
        <dl class="stats">
          <dt>Jahr</dt><dd>${p.year}</dd>
          <dt>Bauform</dt><dd>${typeLabel[p.type]}</dd>
          <dt>Seltenheit</dt><dd>${rarityLabel[p.rarity]}</dd>
          ${
            o
              ? `<dt>Gesammelt</dt><dd>${new Date(o.caughtAt).toLocaleDateString('de-AT')}</dd>
                 <dt>Zustand</dt><dd>${conditionLabel[o.condition]}</dd>`
              : `<dt>Status</dt><dd class="blink">NOCH NICHT GESAMMELT</dd>`
          }
        </dl>
        ${o?.note ? `<p class="note">„${esc(o.note)}“</p>` : ''}
      </div>
      <div class="actions">
        ${
          o
            ? `<button class="btn" id="recatch">📷 FOTO ERSETZEN</button>
               <button class="btn danger" id="release">FREILASSEN</button>`
            : `<button class="btn primary" id="recatch">📷 EINSAMMELN</button>`
        }
      </div>
    </main>`;

  app.querySelector('#recatch')!.addEventListener('click', () => startCatch(id));
  app.querySelector('#release')?.addEventListener('click', async () => {
    if (!confirm(`${p.brand} ${p.model} wirklich aus der Sammlung entfernen?`)) return;
    await db.remove(id);
    await loadOwned();
    sfx.error();
    viewDetail(id);
  });
}

// ---------- Einsammeln ----------

function startCatch(phoneId: string | null) {
  sfx.blip();
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.setAttribute('capture', 'environment');
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const blob = await shrink(file);
      if (draft) URL.revokeObjectURL(draft.url);
      draft = { blob, url: URL.createObjectURL(blob), phoneId };
      go('#/catch');
    } catch {
      sfx.error();
      alert('Das Foto konnte nicht gelesen werden.');
    }
  });
  input.click();
}

/** Verkleinert das Foto auf max. 900 px, damit die Sammlung klein bleibt. */
async function shrink(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const max = 900;
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise<Blob>((res, rej) =>
      c.toBlob((b) => (b ? res(b) : rej(new Error('toBlob'))), 'image/jpeg', 0.82),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function viewCatch() {
  if (!draft) return go('#/');
  const d = draft;
  let q = '';

  const pickList = () => {
    const s = q.trim().toLowerCase();
    return phones
      .filter((p) => !s || `${p.brand} ${p.model} ${p.year}`.toLowerCase().includes(s))
      .slice(0, 40)
      .map(
        (p) => `
        <button class="pick ${d.phoneId === p.id ? 'on' : ''}" data-id="${p.id}" style="--brand:${brandColor(p.brand)}">
          <span class="pick-sprite">${spriteFor(p, true)}</span>
          <span class="pick-text"><b>${esc(p.brand)} ${esc(p.model)}</b><small>${no(p)} · ${p.year}${
            owned.has(p.id) ? ' · schon gesammelt' : ''
          }</small></span>
        </button>`,
      )
      .join('');
  };

  const selected = d.phoneId ? phoneById.get(d.phoneId) : null;

  app.innerHTML = `
    ${header()}
    <main class="catch">
      <a href="#/" class="back" id="cancel">◀ ABBRECHEN</a>
      <div class="catch-photo"><img src="${d.url}" alt="Dein Foto" /></div>
      <h2>WELCHES HANDY IST DAS?</h2>
      ${
        selected
          ? `<div class="picked" style="--brand:${brandColor(selected.brand)}">
               <span class="pick-sprite">${spriteFor(selected, true)}</span>
               <span class="pick-text"><b>${esc(selected.brand)} ${esc(selected.model)}</b><small>${no(selected)} · ${selected.year}</small></span>
               <button class="btn small" id="change">ÄNDERN</button>
             </div>`
          : `<input id="pq" type="search" placeholder="Marke oder Modell, z. B. 3310" autocomplete="off" />
             <div class="pick-list" id="picks">${pickList()}</div>`
      }
      <label class="field">ZUSTAND
        <select id="cond">
          ${Object.entries(conditionLabel)
            .map(([k, v]) => `<option value="${k}" ${k === 'gut' ? 'selected' : ''}>${v}</option>`)
            .join('')}
        </select>
      </label>
      <label class="field">NOTIZ
        <textarea id="note" rows="2" maxlength="300" placeholder="Wo gefunden? Geschichte?"></textarea>
      </label>
      <button class="btn primary big" id="save" ${selected ? '' : 'disabled'}>SPEICHERN</button>
    </main>`;

  app.querySelector('#cancel')!.addEventListener('click', () => {
    URL.revokeObjectURL(d.url);
    draft = null;
  });
  app.querySelector('#change')?.addEventListener('click', () => {
    d.phoneId = null;
    viewCatch();
  });

  const bindPicks = () =>
    app.querySelectorAll<HTMLButtonElement>('.pick').forEach((b) =>
      b.addEventListener('click', () => {
        sfx.blip();
        d.phoneId = b.dataset.id!;
        viewCatch();
      }),
    );
  bindPicks();
  const pq = app.querySelector<HTMLInputElement>('#pq');
  pq?.addEventListener('input', () => {
    q = pq.value;
    app.querySelector('#picks')!.innerHTML = pickList();
    bindPicks();
  });

  app.querySelector('#save')!.addEventListener('click', async () => {
    if (!d.phoneId) return;
    const prev = owned.get(d.phoneId);
    const entry: Owned = {
      phoneId: d.phoneId,
      photo: d.blob,
      caughtAt: prev?.caughtAt ?? new Date().toISOString(),
      condition: (app.querySelector<HTMLSelectElement>('#cond')!.value as Condition) ?? 'gut',
      note: app.querySelector<HTMLTextAreaElement>('#note')!.value.trim(),
    };
    await db.put(entry);
    await loadOwned();
    URL.revokeObjectURL(d.url);
    draft = null;
    const p = phoneById.get(entry.phoneId)!;
    celebrate(p, !prev);
  });
}

function celebrate(p: Phone, isNew: boolean) {
  sfx.caught();
  const el = document.createElement('div');
  el.className = 'celebrate';
  el.style.setProperty('--brand', brandColor(p.brand));
  el.innerHTML = `
    <div class="celebrate-box">
      <div class="celebrate-sprite">${spriteFor(p, true)}</div>
      <p class="celebrate-title">${isNew ? 'GESAMMELT!' : 'AKTUALISIERT!'}</p>
      <p>${esc(p.brand)} ${esc(p.model)}</p>
      <p class="celebrate-count">${owned.size} / ${phones.length}</p>
    </div>`;
  document.body.appendChild(el);
  const done = () => {
    el.remove();
    go(`#/p/${p.id}`);
  };
  el.addEventListener('click', done);
  setTimeout(done, 2600);
}

// ---------- Einstellungen ----------

function viewSettings() {
  app.innerHTML = `
    ${header()}
    <main class="settings">
      <a href="#/" class="back">◀ ZURÜCK</a>
      <h2>EINSTELLUNGEN</h2>
      <button class="btn" id="mute">${sfx.isMuted() ? '🔇 TÖNE: AUS' : '🔊 TÖNE: AN'}</button>
      <h3>SICHERUNG</h3>
      <p>Deine Sammlung liegt nur auf diesem Gerät. Mach ab und zu eine Sicherung, zum Beispiel bevor du den Browser-Speicher löschst oder das Handy wechselst.</p>
      <button class="btn" id="export">💾 SICHERUNG SPEICHERN</button>
      <label class="btn" for="import">📂 SICHERUNG LADEN</label>
      <input type="file" id="import" accept="application/json,.json" hidden />
      <h3>GEFAHRENZONE</h3>
      <button class="btn danger" id="reset">ALLES LÖSCHEN</button>
      <h3>ÜBER</h3>
      <p>Handy-Dex ${__APP_VERSION__} · ${phones.length} Modelle von 1995 bis 2020. Funktioniert offline. Fotos bleiben auf deinem Gerät.</p>
    </main>`;

  app.querySelector('#mute')!.addEventListener('click', () => {
    sfx.setMuted(!sfx.isMuted());
    sfx.blip();
    viewSettings();
  });
  app.querySelector('#export')!.addEventListener('click', async () => {
    const blob = await db.exportBackup();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `handy-dex-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  app.querySelector<HTMLInputElement>('#import')!.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const n = await db.importBackup(file);
      await loadOwned();
      sfx.caught();
      alert(`${n} Handys geladen.`);
      go('#/');
    } catch (err) {
      sfx.error();
      alert((err as Error).message || 'Sicherung konnte nicht geladen werden.');
    }
  });
  app.querySelector('#reset')!.addEventListener('click', async () => {
    if (!confirm('Wirklich die ganze Sammlung löschen? Das kann nicht rückgängig gemacht werden.')) return;
    await db.clear();
    await loadOwned();
    sfx.error();
    go('#/');
  });
}

// ---------- Router ----------

function route() {
  const h = location.hash || '#/';
  window.scrollTo(0, 0);
  const m = h.match(/^#\/p\/(.+)$/);
  if (m) return viewDetail(decodeURIComponent(m[1]));
  if (h === '#/catch') return viewCatch();
  if (h === '#/settings') return viewSettings();
  viewHome();
}

window.addEventListener('hashchange', route);

loadOwned()
  .catch(() => {
    /* ohne Speicher trotzdem anzeigen */
  })
  .finally(route);

// Offline-Unterstützung
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
