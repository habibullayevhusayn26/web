const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const palettes = [
  ['#7dd3fc', '#a78bfa'],
  ['#f9a8d4', '#f97316'],
  ['#a7f3d0', '#34d399'],
  ['#fde68a', '#f59e0b'],
  ['#93c5fd', '#60a5fa'],
  ['#c4b5fd', '#8b5cf6'],
  ['#99f6e4', '#14b8a6'],
  ['#fda4af', '#fb7185'],
  ['#bfdbfe', '#3b82f6'],
  ['#ddd6fe', '#7c3aed']
];

const backdropStyles = {
  black: ['#070b11', '#1d2431'],
  silver: ['#dfe7f1', '#8e9aa8'],
  red: ['#3a1114', '#d03a52'],
  green: ['#102c21', '#2a9d6b'],
  blue: ['#0f2047', '#3d7af5']
};

const backdropImageMap = {
  black: './img/gift-bg/black.jpg',
  silver: './img/gift-bg/silver.jpg',
  red: './img/gift-bg/red.jpg',
  green: './img/gift-bg/green.jpg',
  blue: './img/gift-bg/blue.png'
};

const backdropOptions = ['black', 'silver', 'red', 'green', 'blue'];
const artTypes = ['brick', 'piano', 'cat', 'console', 'duck', 'car', 'bee', 'game', 'crate', 'mario'];
const tags = ['rare', 'legendary', 'limited', 'rare', 'legendary', 'limited'];
const realGiftAssets = [
  { name: 'Plush Pepe', file: 'plush-pepe.png' },
  { name: 'Lol Pop', file: 'lol-pop.png' },
  { name: 'Lol Pop Red', file: 'lol-pop-red.png' },
  { name: 'Faith Amulet Blue', file: 'Faith-Amulet-blue.png', model: 'Moon Gem', symbol: 'Dessert', backdropLabel: 'Tactical Pine' },
  { name: 'Clover Pins', file: 'Clover Pins.png' }
];

const giftImageCatalog = Object.fromEntries(
  realGiftAssets.map((item) => [
    item.name.toLowerCase().replace(/[^a-z0-9]+/g, ''),
    `./img/gifts/${encodeURIComponent(item.file)}`
  ])
);
giftImageCatalog.default = './img/gifts/plush-pepe.png';

function getGiftImage(giftName) {
  const name = String(giftName || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const match = Object.keys(giftImageCatalog).find((key) => name.includes(key));
  return match ? giftImageCatalog[match] : giftImageCatalog.default;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate() {
  const month = monthNames[randomInt(0, 11)];
  const day = randomInt(1, 28);
  const hour = String(randomInt(0, 23)).padStart(2, '0');
  const minute = String(randomInt(0, 59)).padStart(2, '0');
  return `${month} ${day} at ${hour}:${minute}`;
}

function makeSvg(type, colors) {
  const [c1, c2] = colors;

  const shapes = {
    brick: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.25"/>
      <g transform="translate(52 38)">
        <rect width="134" height="90" rx="14" fill="${c1}" transform="rotate(-3 67 45)"/>
        <rect x="18" y="14" width="18" height="54" rx="6" fill="rgba(255,255,255,0.25)"/>
        <rect x="48" y="14" width="18" height="54" rx="6" fill="rgba(255,255,255,0.25)"/>
        <rect x="78" y="14" width="18" height="54" rx="6" fill="rgba(255,255,255,0.25)"/>
        <rect x="108" y="14" width="18" height="54" rx="6" fill="rgba(255,255,255,0.25)"/>
        <rect y="16" width="134" height="7" fill="rgba(0,0,0,0.16)"/>
        <rect y="70" width="134" height="7" fill="rgba(0,0,0,0.14)"/>
      </g>
    `,

    piano: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.25"/>
      <g transform="translate(40 46)">
        <rect x="24" y="36" width="110" height="62" rx="10" fill="#f5f7ff" opacity="0.95"/>
        <rect x="0" y="26" width="160" height="12" rx="5" fill="#d8e4f4"/>
        <rect x="35" y="0" width="18" height="36" rx="6" fill="#1e2635"/>
        <rect x="61" y="0" width="18" height="36" rx="6" fill="#1e2635"/>
        <rect x="87" y="0" width="18" height="36" rx="6" fill="#1e2635"/>
        <rect x="113" y="0" width="18" height="36" rx="6" fill="#1e2635"/>
        <rect x="38" y="40" width="12" height="48" fill="#0f1a2a"/>
        <rect x="57" y="40" width="12" height="48" fill="#0f1a2a"/>
        <rect x="76" y="40" width="12" height="48" fill="#0f1a2a"/>
        <rect x="95" y="40" width="12" height="48" fill="#0f1a2a"/>
        <rect x="114" y="40" width="12" height="48" fill="#0f1a2a"/>
      </g>
    `,

    cat: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.25"/>
      <g transform="translate(35 35)">
        <rect x="16" y="42" width="120" height="70" rx="24" fill="#f6d7a2"/>
        <circle cx="52" cy="42" r="26" fill="#f6d7a2"/>
        <circle cx="110" cy="42" r="26" fill="#f6d7a2"/>
        <circle cx="58" cy="36" r="8" fill="#1e1c2b"/>
        <circle cx="106" cy="36" r="8" fill="#1e1c2b"/>
        <path d="M67 52 Q79 60 91 52" stroke="#282b32" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M76 70 L86 86 L94 70" fill="none" stroke="#282b32" stroke-width="4" stroke-linecap="round"/>
        <path d="M58 18 L48 6 L68 0" fill="#f6d7a2"/>
        <path d="M108 18 L118 6 L98 0" fill="#f6d7a2"/>
      </g>
    `,

    console: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.25"/>
      <g transform="translate(30 42)">
        <rect x="0" y="18" width="140" height="84" rx="18" fill="#6e8fe8"/>
        <rect x="18" y="0" width="104" height="32" rx="12" fill="#dbe9ff" opacity="0.88"/>
        <circle cx="48" cy="48" r="12" fill="#d7ebff"/>
        <circle cx="98" cy="48" r="12" fill="#d7ebff"/>
        <rect x="30" y="72" width="82" height="10" rx="5" fill="#d7ebff" opacity="0.85"/>
        <rect x="54" y="86" width="32" height="8" rx="4" fill="#cfe0ff"/>
      </g>
    `,

    duck: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.22"/>
      <g transform="translate(28 48)">
        <ellipse cx="76" cy="40" rx="64" ry="34" fill="#f5f7ff"/>
        <ellipse cx="76" cy="40" rx="42" ry="24" fill="#dff3ff"/>
        <circle cx="98" cy="28" r="11" fill="#f4d23b"/>
        <path d="M118 18 L144 8 L142 30 Z" fill="#f4d23b"/>
        <circle cx="57" cy="38" r="5" fill="#232b38"/>
        <circle cx="100" cy="38" r="5" fill="#232b38"/>
        <path d="M63 52 Q79 62 96 52" stroke="#242d39" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>
    `,

    car: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.25"/>
      <g transform="translate(22 52)">
        <rect x="10" y="40" width="120" height="38" rx="18" fill="#5b69f5"/>
        <path d="M36 38 L64 18 H110 L130 38 Z" fill="#7fa9ff"/>
        <rect x="30" y="22" width="26" height="18" rx="6" fill="#dfe9ff"/>
        <rect x="80" y="22" width="28" height="18" rx="6" fill="#dfe9ff"/>
        <circle cx="42" cy="82" r="16" fill="#24314a"/>
        <circle cx="106" cy="82" r="16" fill="#24314a"/>
        <circle cx="42" cy="82" r="7" fill="#dfe9ff"/>
        <circle cx="106" cy="82" r="7" fill="#dfe9ff"/>
        <path d="M22 46 H130" stroke="rgba(255,255,255,0.7)" stroke-width="3"/>
      </g>
    `,

    bee: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.25"/>
      <g transform="translate(32 38)">
        <rect x="28" y="26" width="92" height="88" rx="16" fill="#f0d054"/>
        <rect x="36" y="12" width="20" height="18" rx="8" fill="#f7f7ff"/>
        <rect x="88" y="12" width="20" height="18" rx="8" fill="#f7f7ff"/>
        <path d="M50 26 L48 0 L62 26" fill="#f7f7ff"/>
        <path d="M98 26 L100 0 L86 26" fill="#f7f7ff"/>
        <circle cx="58" cy="62" r="8" fill="#1d2734"/>
        <circle cx="94" cy="62" r="8" fill="#1d2734"/>
        <path d="M72 62 Q82 74 90 62" stroke="#1d2734" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M52 82 L74 92 L94 82" stroke="#1d2734" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>
    `,

    game: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.22"/>
      <g transform="translate(25 38)">
        <rect x="12" y="16" width="120" height="84" rx="16" fill="#d9d4ff"/>
        <rect x="26" y="34" width="24" height="24" rx="4" fill="#1a2333"/>
        <rect x="58" y="34" width="24" height="24" rx="4" fill="#1a2333"/>
        <rect x="90" y="34" width="24" height="24" rx="4" fill="#1a2333"/>
        <rect x="44" y="64" width="34" height="18" rx="8" fill="#333d52"/>
        <rect x="84" y="64" width="18" height="18" rx="8" fill="#333d52"/>
        <circle cx="38" cy="84" r="7" fill="#f7e5a1"/>
        <rect x="24" y="90" width="72" height="4" rx="2" fill="rgba(0,0,0,0.2)"/>
      </g>
    `,

    crate: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.26"/>
      <g transform="translate(38 36)">
        <rect x="18" y="18" width="90" height="90" rx="18" fill="#d6dfff"/>
        <rect x="26" y="26" width="74" height="74" rx="12" fill="#8ea8ef"/>
        <path d="M58 26 V102" stroke="#dfe9ff" stroke-width="8"/>
        <path d="M26 60 H102" stroke="#dfe9ff" stroke-width="8"/>
        <path d="M38 38 L52 52" stroke="#dfe9ff" stroke-width="6" stroke-linecap="round"/>
        <path d="M76 76 L90 90" stroke="#dfe9ff" stroke-width="6" stroke-linecap="round"/>
      </g>
    `,

    mario: `
      <defs>
        <linearGradient id="g-${type}" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-${type})" opacity="0.28"/>
      <g transform="translate(30 38)">
        <rect x="20" y="38" width="100" height="58" rx="16" fill="#f5a6a2"/>
        <circle cx="58" cy="42" r="26" fill="#fef2d7"/>
        <circle cx="102" cy="42" r="26" fill="#fef2d7"/>
        <path d="M44 34 L32 18 L58 18 L64 32 Z" fill="#f5a6a2"/>
        <path d="M116 34 L128 18 L102 18 L96 32 Z" fill="#f5a6a2"/>
        <circle cx="52" cy="42" r="5" fill="#1d2435"/>
        <circle cx="106" cy="42" r="5" fill="#1d2435"/>
        <path d="M72 48 Q82 58 92 48" stroke="#1d2435" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect x="70" y="56" width="18" height="12" rx="5" fill="#1d2435"/>
      </g>
    `
  };

  return shapes[type] || shapes.brick;
}

function buildGiftRecord(index) {
  const type = artTypes[index % artTypes.length];
  const colors = palettes[index % palettes.length];
  const rarity = tags[index % tags.length];
  const backdrop = backdropOptions[index % backdropOptions.length];
  const asset = realGiftAssets[index % realGiftAssets.length];
  const name = asset.name;
  const price = Number((1.8 + (index % 10) * 0.9 + index * 0.12).toFixed(1));
  const sold = randomInt(280, 960);
  const serial = String(1000 + index).padStart(4, '0');
  const status = ['available', 'auction', 'owned'][index % 3];

  return {
    id: index + 1,
    type,
    colors,
    rarity,
    backdrop,
    model: asset.model || name,
    symbol: asset.symbol || type,
    backdropLabel: asset.backdropLabel || backdrop,
    name,
    serial,
    status,
    price,
    sold,
    date: formatDate(),
    owner: '@admn28',
    from: '@MintLab',
    to: '@Atlas',
    usd: (price * 360).toFixed(0),
    image: `./img/gifts/${encodeURIComponent(asset.file)}`
  };
}

const fallbackItems = Array.from({ length: realGiftAssets.length }, (_, index) => buildGiftRecord(index));
const catalog = document.getElementById('catalog');
const catalogSecondary = document.getElementById('catalog-secondary');
const auctionTableBody = document.getElementById('auction-table-body');
const purchaseLink = 'https://t.me/habibullayev_28';

function loadCatalog() {
  return fallbackItems;
}

let modalScrollPosition = 0;
let modalUnlockTimer;

function lockPageScroll() {
  window.clearTimeout(modalUnlockTimer);
  if (document.body.classList.contains('modal-open')) return;

  modalScrollPosition = window.scrollY;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.setProperty('--modal-scroll-top', `-${modalScrollPosition}px`);
  document.body.style.setProperty('--modal-scrollbar-width', `${scrollbarWidth}px`);
  document.body.classList.add('modal-open');
}

function unlockPageScroll() {
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('--modal-scroll-top');
  document.body.style.removeProperty('--modal-scrollbar-width');
  window.scrollTo({ top: modalScrollPosition, behavior: 'instant' });
}

function openGiftDetail(item) {
  const modal = document.getElementById('gift-detail-modal');
  if (!modal || !item) return;

  const name = document.getElementById('gift-detail-name');
  const model = document.getElementById('gift-detail-model');
  const symbol = document.getElementById('gift-detail-symbol');
  const serial = document.getElementById('gift-detail-serial');
  const backdrop = document.getElementById('gift-detail-backdrop');
  const art = document.getElementById('gift-detail-art');
  const img = document.getElementById('gift-detail-image');
  const imageWrap = document.getElementById('gift-detail-image-wrap');
  const buyLink = document.getElementById('gift-buy-link');

  if (name) name.textContent = item.name || 'Gift';
  if (model) model.textContent = item.model || item.name || 'Gift';
  if (symbol) {
    const symbolName = item.symbol || item.type || 'Gift';
    symbol.textContent = symbolName.charAt(0).toUpperCase() + symbolName.slice(1);
  }
  if (serial) serial.textContent = `#${item.serial || (item.id || 0)}`;
  if (backdrop) {
    const backdropName = item.backdropLabel || item.backdrop || 'Black';
    backdrop.textContent = backdropName.charAt(0).toUpperCase() + backdropName.slice(1);
  }
  const artBackground = backdropImageMap[item.backdrop || 'black'] || backdropImageMap.black;
  if (art) art.style.backgroundImage = `url("${artBackground}")`;
  const giftImage = item.image || getGiftImage(item.name || 'Gift');
  if (img) {
    img.src = giftImage;
    img.alt = item.name || 'Gift';
  }
  if (imageWrap) imageWrap.style.setProperty('--gift-detail-image-mask', `url("${giftImage}")`);
  if (buyLink) {
    buyLink.href = purchaseLink;
    buyLink.setAttribute('target', '_blank');
    buyLink.setAttribute('rel', 'noopener noreferrer');
  }

  lockPageScroll();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeGiftDetail() {
  const modal = document.getElementById('gift-detail-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  const unlockDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;
  modalUnlockTimer = window.setTimeout(unlockPageScroll, unlockDelay);
}

const giftArtObserver = typeof IntersectionObserver === 'undefined'
  ? null
  : new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const panel = entry.target;
      const image = panel.dataset.backgroundImage;
      if (image) {
        panel.style.backgroundImage = `url("${image}")`;
        delete panel.dataset.backgroundImage;
      }
      observer.unobserve(panel);
    });
  }, { rootMargin: '160px 0px' });

function renderGiftCard(item) {
  const article = document.createElement('article');
  const palette = Array.isArray(item.bgColors) && item.bgColors.length >= 2 ? item.bgColors : ['#2f2f59', '#516d95'];
  const backdropKey = item.backdrop || 'black';
  const backdrop = backdropStyles[backdropKey] || backdropStyles.black;
  const backdropImage = backdropImageMap[backdropKey] || backdropImageMap.black;
  const imageSrc = item.image || getGiftImage(item.name || item.title || 'Gift');
  const statusText = item.status === 'auction' ? 'Auksion' : item.status === 'owned' ? 'Mulkda' : 'Sotuvda';

  article.className = 'card gift-card';
  article.tabIndex = 0;
  article.setAttribute('role', 'button');
  article.setAttribute('aria-label', `Gift ma'lumotlarini ochish: ${item.name || 'Gift'}`);
  article.dataset.itemId = String(item.id || 0);
  article.innerHTML = `
    <div class="gift-art-panel" data-background-image="${backdropImage}">
      <div class="gift-art-pattern"></div>
      <img
        class="gift-card-image"
        src="${imageSrc}"
        alt="${item.name || item.title || 'Gift'}"
        loading="lazy"
      />
    </div>
    <div class="meta">
      <div class="meta-top">
        <span class="meta-rarity">${item.rarity || 'rarity'}</span>
        <span class="meta-backdrop">${backdropKey}</span>
        <span class="meta-price">${Number(item.price || 0).toFixed(1)} TON</span>
      </div>
      <h3 class="title">${item.name || item.title || 'Gift'}</h3>
      <div class="meta-bottom">
        <span class="date">#${item.serial || (item.id || 0)}</span>
        <span class="sold ${item.status === 'auction' ? 'auction-status' : ''}">${statusText}</span>
      </div>
      <div class="gift-card-footer">
        <span class="gift-timestamp">${item.date || 'Now'}</span>
        <span class="gift-badge">${item.sold || 0} sold</span>
      </div>
    </div>
  `;

  const artPanel = article.querySelector('.gift-art-panel');
  if (giftArtObserver) {
    giftArtObserver.observe(artPanel);
  } else {
    artPanel.style.backgroundImage = `url("${backdropImage}")`;
    delete artPanel.dataset.backgroundImage;
  }

  article.addEventListener('click', () => openGiftDetail(item));
  article.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGiftDetail(item);
    }
  });

  return article;
}

function renderCatalog(items, filter = 'all', target = catalog) {
  if (!target) return;

  if (giftArtObserver) {
    target.querySelectorAll('.gift-art-panel[data-background-image]').forEach(panel => giftArtObserver.unobserve(panel));
  }
  target.innerHTML = '';

  const visibleItems = filter === 'all'
    ? items
    : items.filter(item => item.status === filter || item.rarity === filter);

  visibleItems.forEach(item => target.appendChild(renderGiftCard(item)));
}

const detailModal = document.getElementById('gift-detail-modal');
if (detailModal) {
  detailModal.addEventListener('click', (event) => {
    if (event.target === detailModal) {
      closeGiftDetail();
    }
  });

  const closeButton = detailModal.querySelector('.close-modal');
  closeButton?.addEventListener('click', closeGiftDetail);
}

function renderAuctionTable(items) {
  if (!auctionTableBody) return;
  auctionTableBody.innerHTML = '';

  items.filter(item => item.status === 'auction').slice(0, 5).forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="asset-cell">
          <div class="mini-gift"></div>
          <span>${item.name} #${item.serial}</span>
        </div>
      </td>
      <td>
        <div class="price-cell">
          <strong>${item.price} TON</strong>
          <small>$${item.usd}</small>
        </div>
      </td>
      <td>${item.from}</td>
      <td>${item.to}</td>
      <td class="time-cell">${randomInt(2, 18)}:${String(randomInt(0, 59)).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}</td>
    `;
    auctionTableBody.appendChild(tr);
  });
}

let currentItems = [...fallbackItems];
let activeFilter = 'all';

function initCatalog() {
  currentItems = loadCatalog();
  renderCatalog(currentItems, activeFilter, catalog);
  renderCatalog(currentItems, activeFilter, catalogSecondary);
  renderAuctionTable(currentItems);
}

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    activeFilter = button.dataset.filter || 'all';
    renderCatalog(currentItems, activeFilter, catalog);
    renderCatalog(currentItems, activeFilter, catalogSecondary);
  });
});

const giftSearch = document.getElementById('gift-search');
if (giftSearch) {
  giftSearch.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    const filtered = currentItems.filter(item => {
      const haystack = `${item.name} ${item.serial} ${item.rarity}`.toLowerCase();
      return haystack.includes(query);
    });

    renderCatalog(filtered, activeFilter, catalog);
    renderCatalog(filtered, activeFilter, catalogSecondary);
  });
}

initCatalog();

const comingSoonModal = document.getElementById('coming-soon-modal');
if (comingSoonModal) {
  const serviceLabel = comingSoonModal.querySelector('[data-coming-soon-service]');
  const closeButtons = comingSoonModal.querySelectorAll('[data-coming-soon-close]');
  let lastComingSoonTrigger = null;

  function closeComingSoonModal() {
    comingSoonModal.classList.remove('active');
    comingSoonModal.setAttribute('aria-hidden', 'true');
    lastComingSoonTrigger?.focus();
  }

  document.querySelectorAll('[data-coming-soon]').forEach(button => {
    button.addEventListener('click', () => {
      lastComingSoonTrigger = button;
      if (serviceLabel) serviceLabel.textContent = button.querySelector('.contact-link-label')?.textContent || '';
      comingSoonModal.classList.add('active');
      comingSoonModal.setAttribute('aria-hidden', 'false');
      comingSoonModal.querySelector('[data-coming-soon-close]')?.focus();
    });
  });

  closeButtons.forEach(button => button.addEventListener('click', closeComingSoonModal));
  comingSoonModal.addEventListener('click', event => {
    if (event.target === comingSoonModal) closeComingSoonModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && comingSoonModal.classList.contains('active')) closeComingSoonModal();
  });
}

const mainNavigation = document.querySelector('.main-nav');
if (mainNavigation) {
  const navigationLinks = [...mainNavigation.querySelectorAll(':scope > a')];
  let activeNavigationLink = navigationLinks.find(link => link.hasAttribute('aria-current')) || navigationLinks[0];
  let scrollUpdatePending = false;

  function positionNavigationIndicator(link) {
    const indicator = mainNavigation.querySelector('.nav-indicator');
    if (!indicator || !link) return;

    const navigationRect = mainNavigation.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    mainNavigation.style.setProperty('--indicator-left', `${linkRect.left - navigationRect.left - mainNavigation.clientLeft}px`);
    mainNavigation.style.setProperty('--indicator-width', `${linkRect.width}px`);
  }

  function setActiveNavigationLink(link) {
    if (!navigationLinks.includes(link)) return;

    activeNavigationLink = link;
    positionNavigationIndicator(link);
    navigationLinks.forEach(item => {
      if (item === link) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
  }

  function prepareNavigationTarget(link) {
    const pageShell = document.querySelector('.page-shell');
    const target = document.getElementById(link.hash.slice(1));
    if (!pageShell || !target) return;

    pageShell.style.setProperty('--nav-scroll-runway', '0px');
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const runway = Math.max(0, targetTop + window.innerHeight - document.documentElement.scrollHeight);
    pageShell.style.setProperty('--nav-scroll-runway', `${runway}px`);
  }

  function previewNavigationLink(link) {
    positionNavigationIndicator(link);
    mainNavigation.classList.add('nav-hovering');
  }

  function restoreActiveNavigationLink() {
    positionNavigationIndicator(activeNavigationLink);
    mainNavigation.classList.remove('nav-hovering');
  }

  function updateActiveNavigationLink() {
    const activationLine = window.innerHeight * 0.42;
    let visibleLink = navigationLinks[0];

    navigationLinks.forEach(link => {
      const target = document.getElementById(link.hash.slice(1));
      if (target && target.getBoundingClientRect().top <= activationLine) visibleLink = link;
    });

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
      visibleLink = navigationLinks[navigationLinks.length - 1];
    }

    if (visibleLink !== activeNavigationLink) setActiveNavigationLink(visibleLink);
  }

  navigationLinks.forEach(link => {
    link.addEventListener('click', () => {
      prepareNavigationTarget(link);
      setActiveNavigationLink(link);
    });
    link.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') previewNavigationLink(link);
    });
    link.addEventListener('focus', () => previewNavigationLink(link));
  });

  mainNavigation.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') restoreActiveNavigationLink();
  });
  mainNavigation.addEventListener('focusout', event => {
    if (!mainNavigation.contains(event.relatedTarget)) restoreActiveNavigationLink();
  });

  window.addEventListener('scroll', () => {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    window.requestAnimationFrame(() => {
      updateActiveNavigationLink();
      scrollUpdatePending = false;
    });
  }, { passive: true });
  window.addEventListener('resize', () => positionNavigationIndicator(activeNavigationLink));

  setActiveNavigationLink(activeNavigationLink);
  updateActiveNavigationLink();
}
