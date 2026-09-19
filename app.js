const grid = document.querySelector('#grid');
const status = document.querySelector('#grid-status');
const filterList = document.querySelector('#filters');
const lightbox = document.querySelector('#lightbox');

const dateFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

let entries = [];
let activeTag = 'all';

function formatDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? value : dateFormat.format(parsed);
}

function renderEntries() {
  const visible =
    activeTag === 'all'
      ? entries
      : entries.filter((entry) => (entry.tags ?? []).includes(activeTag));

  grid.replaceChildren();

  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'grid__status';
    empty.textContent = 'Nothing filed under that tag yet.';
    grid.append(empty);
    return;
  }

  for (const entry of visible) {
    const card = document.createElement('article');
    card.className = 'card';

    const button = document.createElement('button');
    button.className = 'card__button';
    button.type = 'button';
    button.addEventListener('click', () => openLightbox(entry));

    const image = document.createElement('img');
    image.className = 'card__media';
    image.src = entry.image;
    image.alt = entry.alt ?? entry.title;
    image.loading = 'lazy';
    image.decoding = 'async';

    const body = document.createElement('div');
    body.className = 'card__body';
    body.innerHTML = `
      <p class="card__meta"><span>${formatDate(entry.date)}</span></p>
      <h2 class="card__title"></h2>
      <p class="card__note"></p>
    `;
    body.querySelector('.card__title').textContent = entry.title;
    body.querySelector('.card__note').textContent = entry.note ?? '';

    button.append(image, body);
    card.append(button);

    if (entry.tags?.length) {
      const tags = document.createElement('ul');
      tags.className = 'card__tags';
      for (const tag of entry.tags) {
        const item = document.createElement('li');
        item.className = 'tag';
        item.textContent = tag;
        tags.append(item);
      }
      card.append(tags);
    }

    grid.append(card);
  }
}

function renderFilters() {
  const tags = ['all', ...new Set(entries.flatMap((entry) => entry.tags ?? []))];
  filterList.replaceChildren();

  for (const tag of tags) {
    const item = document.createElement('li');
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.type = 'button';
    chip.textContent = tag;
    chip.setAttribute('aria-pressed', String(tag === activeTag));
    chip.addEventListener('click', () => {
      activeTag = tag;
      renderFilters();
      renderEntries();
    });
    item.append(chip);
    filterList.append(item);
  }
}

function openLightbox(entry) {
  const image = lightbox.querySelector('#lightbox-image');
  const source = lightbox.querySelector('#lightbox-source');

  image.src = entry.image;
  image.alt = entry.alt ?? entry.title;
  lightbox.querySelector('#lightbox-title').textContent = entry.title;
  lightbox.querySelector('#lightbox-note').textContent = entry.note ?? '';

  if (entry.source) {
    source.href = entry.source;
    source.textContent = 'View source ↗';
    source.hidden = false;
  } else {
    source.hidden = true;
  }

  lightbox.showModal();
}

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox || event.target.hasAttribute('data-close')) {
    lightbox.close();
  }
});

const themeToggle = document.querySelector('#theme-toggle');
const storedTheme = localStorage.getItem('inspo-theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  localStorage.setItem('inspo-theme', theme);
}

applyTheme(storedTheme ?? (prefersLight ? 'light' : 'dark'));

themeToggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

try {
  const response = await fetch('data/entries.json');
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  entries = (await response.json()).sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  status.remove();
  renderFilters();
  renderEntries();
} catch (error) {
  status.textContent =
    'Could not load entries. Serve the site over HTTP (for example `python3 -m http.server`) rather than opening the file directly.';
  console.error(error);
}
