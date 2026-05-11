/**
 * data-loader.js
 * 從 Google 試算表（已發佈到網路）讀取建案資料並動態渲染。
 *
 * 兩種頁面模式（由 <body data-page="..."> 決定）：
 *   - data-page="home"   ：抓取 SLUGS 中的所有建案，渲染卡片網格 #projectGrid
 *   - data-page="detail" ：抓取單一建案，替換 [data-key]、[data-key-src]、[data-key-href] 等
 *
 * 詳情頁網址用法：
 *   detail.html?id=hsyss
 *   detail.html?gid=0
 */

const CONFIG = {
  // Google 試算表「發佈到網路」的 ID（網址 /d/e/ 後那一串）
  PUB_ID: '2PACX-1vRzkaVc1B48sFRIDA8KcafVIjKCX5qJiZpC1_2V-4IQJseZxLED6MRZZewDy1nJTy1Hkx10AZlVd8d2',

  // 預設要載入的房源（沒帶 ?id= 或 ?gid= 時用這個）
  DEFAULT_SLUG: 'hsyss',

  // 友善網址 → 分頁 gid 對應（首頁卡片也會依此順序渲染）
  // 想新增建案：在此加一筆，並在試算表新增對應的分頁
  SLUGS: {
    hsyss: { gid: '0',          name: '惠宇覞山112' },
    fjjy:  { gid: '1331822735', name: '馥景莊園' },
    yjjy:  { gid: '1343571758', name: '御景莊園' },
    djjy:  { gid: '236781261',  name: '大景莊園' },
    sjjy:  { gid: '286298041',  name: '澍景莊園' },
  },

  // key 別名：當試算表的欄位名跟 HTML 上的 data-key 不同時可在此對應
  KEY_ALIASES: {
    '預計/建築完工': '預計完工',
  },
};

// =========================================================
// 入口
// =========================================================
(async function init() {
  const page = document.body.getAttribute('data-page') || 'detail';
  try {
    if (page === 'home') {
      await renderHomePage();
    } else {
      await renderDetailPage();
    }
  } catch (err) {
    console.error('[data-loader] 載入失敗：', err);
  } finally {
    revealPage();
  }
})();

// =========================================================
// 首頁：抓所有建案，渲染卡片
// =========================================================
async function renderHomePage() {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  const slugs = Object.entries(CONFIG.SLUGS);
  // 並行抓取
  const results = await Promise.all(
    slugs.map(async ([slug, info]) => {
      try {
        const csv = await fetchSheetCsv(CONFIG.PUB_ID, info.gid);
        const data = csvToKeyValue(csv);
        applyAliases(data, CONFIG.KEY_ALIASES);
        return { slug, info, data };
      } catch (e) {
        console.warn(`[data-loader] 抓取 ${slug} 失敗`, e);
        return { slug, info, data: null };
      }
    })
  );

  const succeeded = results.filter(r => r.data);
  grid.innerHTML = succeeded
    .map(({ slug, info, data }) => buildProjectCard(slug, info, data))
    .join('');

  // 同步更新「精選建案」數量
  const countEl = document.getElementById('statProjectCount');
  if (countEl) countEl.textContent = `${succeeded.length}+`;
}

function buildProjectCard(slug, info, data) {
  const name        = data['建案案名'] || info.name;
  const subtitle    = data['副標題'] || '';
  const location    = data['基地位置'] || '';
  const units       = data['戶數規劃'] || '';
  const completion  = data['預計完工'] || '';
  const heroImg     = toDirectImageUrl(data['img_1'] || '');
  // 從 location 抓「區」當地區徽章（例如「台中市潭子區...」→「潭子區」）
  const district    = (location.match(/[^市]*?區/) || [''])[0];
  // 用建設營造或社區規劃推 chips
  const chips       = pickChips(data);
  const placeholder = !heroImg
    ? `<div style="aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;color:#aaa;background:linear-gradient(135deg,#f0eadb,#e6dec8)">圖片載入中</div>`
    : '';

  return `
    <a class="project-card" href="detail.html?id=${slug}" aria-label="查看 ${escapeHtml(name)}">
      <div class="project-card-image">
        ${heroImg ? `<img src="${heroImg}" alt="${escapeHtml(name)}" loading="lazy">` : placeholder}
        ${district ? `<span class="badge-corner">${escapeHtml(district)}</span>` : ''}
      </div>
      <div class="project-card-body">
        <h3 class="project-card-title">${escapeHtml(name)}</h3>
        <p class="project-card-subtitle">${escapeHtml(truncate(subtitle, 60))}</p>
        <div class="project-card-meta">
          ${units      ? `<span>📐 ${escapeHtml(units)}</span>` : ''}
          ${completion ? `<span>📅 ${escapeHtml(completion)}</span>` : ''}
        </div>
        <div class="project-card-tags">
          ${chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join('')}
        </div>
      </div>
    </a>
  `;
}

function pickChips(data) {
  const chips = [];
  // 從規劃產品抓房數
  const planned = data['規劃產品'] || '';
  if (/3房/.test(planned) && /4房/.test(planned)) chips.push('3-4房');
  else if (/3房/.test(planned)) chips.push('3房');
  else if (/4房/.test(planned)) chips.push('4房');
  // 完工狀態
  const complete = data['預計完工'] || '';
  if (/^\d{2,3}年/.test(complete) || /已完工|新成屋/.test(complete)) chips.push('新成屋');
  else if (/預計/.test(complete)) chips.push('預售屋');
  // 建商
  const builder = data['建設營造'] || '';
  const builderShort = builder.split(/[｜|]/)[0]?.trim();
  if (builderShort && builderShort.length <= 6) chips.push(builderShort);
  return chips.slice(0, 3);
}

// =========================================================
// 詳情頁：抓單一建案，替換 DOM
// =========================================================
async function renderDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id');
  let gid = params.get('gid');

  if (!gid && slug && CONFIG.SLUGS[slug]) {
    gid = CONFIG.SLUGS[slug].gid;
  }
  if (!gid) {
    gid = CONFIG.SLUGS[CONFIG.DEFAULT_SLUG]?.gid || '0';
  }

  const csv = await fetchSheetCsv(CONFIG.PUB_ID, gid);
  const data = csvToKeyValue(csv);
  applyAliases(data, CONFIG.KEY_ALIASES);

  applyToDom(data);
  updateMeta(data);
  renderFacilities(data);
  renderGallery(data);
  initLightbox();
}

function renderFacilities(data) {
  const grid = document.getElementById('facilitiesGrid');
  if (!grid) return;

  const text = (data['公設'] || '').trim();
  // 用 、 ， , ｜ | / 分隔
  const items = text
    ? text.split(/[、，,｜|/]/).map(s => s.trim()).filter(Boolean)
    : [];

  if (items.length === 0) {
    grid.parentElement.style.display = 'none';
    return;
  }

  grid.innerHTML = items.map(t => `<div class="feat">${escapeHtml(t)}</div>`).join('');
}

function renderGallery(data) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const html = [];
  for (let i = 5; i <= 15; i++) {
    const url = data[`img_${i}`];
    if (url) {
      const directUrl = toDirectImageUrl(url);
      html.push(`<div class="img-box"><img class="zoomable" src="${directUrl}" loading="lazy" alt=""></div>`);
    }
  }
  if (html.length === 0) { grid.parentElement.style.display = 'none'; return; }
  grid.innerHTML = html.join('');
}

// =========================================================
// Lightbox（點圖放大）
// =========================================================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg    = lightbox.querySelector('.lightbox-img');
  const counter  = lightbox.querySelector('.lightbox-counter');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev  = lightbox.querySelector('.lightbox-prev');
  const btnNext  = lightbox.querySelector('.lightbox-next');

  // 收集所有實際顯示的 .zoomable 圖片（依 DOM 順序）
  const triggers = Array.from(document.querySelectorAll('img.zoomable'))
    .filter(img => img.src && img.style.display !== 'none');
  if (triggers.length === 0) return;

  let idx = 0;

  const show = (i) => {
    idx = (i + triggers.length) % triggers.length;
    lbImg.src = triggers[idx].src;
    counter.textContent = `${idx + 1} / ${triggers.length}`;
    const showNav = triggers.length > 1;
    counter.style.display = showNav ? '' : 'none';
    btnPrev.style.display = showNav ? '' : 'none';
    btnNext.style.display = showNav ? '' : 'none';
  };
  const open = (i) => {
    show(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggers.forEach((img, i) => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click',  () => show(idx - 1));
  btnNext.addEventListener('click',  () => show(idx + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')          close();
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft')  show(idx - 1);
  });

  // 觸控滑動切換（行動裝置）
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  const SWIPE_THRESHOLD = 50;       // 至少滑 50px 才算 swipe
  const SWIPE_MAX_DURATION = 600;   // 600ms 內完成（避免長按拖曳誤判）

  lightbox.addEventListener('touchstart', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const dt = Date.now() - touchStartTime;
    // 必須以水平為主、距離夠長、時間夠短
    if (Math.abs(dx) > SWIPE_THRESHOLD
        && Math.abs(dx) > Math.abs(dy)
        && dt < SWIPE_MAX_DURATION) {
      if (dx < 0) show(idx + 1);   // 左滑 → 下一張
      else        show(idx - 1);   // 右滑 → 上一張
    }
  }, { passive: true });
}

// =========================================================
// 共用：CSV / DOM 替換 / 工具
// =========================================================

async function fetchSheetCsv(pubId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/e/${pubId}/pub?gid=${encodeURIComponent(gid)}&single=true&output=csv`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

function csvToKeyValue(csv) {
  const rows = parseCsv(csv);
  const data = {};
  for (const row of rows) {
    const key = (row[0] || '').trim();
    const value = (row[1] || '').trim();
    if (key) data[key] = value;
  }
  return data;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell); cell = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); cell = '';
        rows.push(row); row = [];
      } else {
        cell += ch;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function applyAliases(data, aliases) {
  for (const [from, to] of Object.entries(aliases)) {
    if (data[from] != null && data[to] == null) {
      data[to] = data[from];
    }
  }
}

function applyToDom(data) {
  document.querySelectorAll('[data-key]').forEach((el) => {
    const k = el.getAttribute('data-key');
    if (data[k] !== undefined && data[k] !== '') {
      el.innerHTML = textToHtml(data[k]);
    }
  });
  document.querySelectorAll('[data-key-src]').forEach((el) => {
    const k = el.getAttribute('data-key-src');
    const v = data[k];
    if (v) {
      el.src = toDirectImageUrl(v);
    } else {
      el.style.display = 'none';
    }
  });
  document.querySelectorAll('[data-key-href]').forEach((el) => {
    const k = el.getAttribute('data-key-href');
    if (data[k]) el.href = data[k];
  });
  document.querySelectorAll('[data-key-content]').forEach((el) => {
    const k = el.getAttribute('data-key-content');
    if (data[k]) el.setAttribute('content', data[k]);
  });
}

function updateMeta(data) {
  const name = data['建案案名'];
  if (name) {
    document.title = `${name}｜楊依依`;
    setMeta('og:title',       `${name}｜楊依依`, 'property');
  }
  const desc = data['副標題'];
  if (desc) {
    setMeta('og:description', desc, 'property');
  }
  const img = data['img_1'];
  if (img) {
    setMeta('og:image', toDirectImageUrl(img), 'property');
  }
  // og:url：以當前完整網址為準
  setMeta('og:url', location.href, 'property');

  // 更新 JSON-LD Schema
  const schemaEl = document.getElementById('schema-listing');
  if (schemaEl) {
    const schema = JSON.parse(schemaEl.textContent);
    if (data['建案案名']) schema.name = data['建案案名'];
    if (data['副標題'])   schema.description = data['副標題'];
    schema.url = location.href;
    const images = [];
    for (let i = 1; i <= 10; i++) {
      if (data[`img_${i}`]) images.push(toDirectImageUrl(data[`img_${i}`]));
    }
    if (images.length) schema.image = images;
    if (data['價格']) schema.offers.price = data['價格'];
    schemaEl.textContent = JSON.stringify(schema, null, 2);
  }
}

function setMeta(nameOrProp, value, attr = 'name') {
  const el = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
  if (el) el.setAttribute('content', value);
}

function textToHtml(s) {
  if (s == null) return '';
  if (/<[a-z][^>]*>/i.test(s)) return s;
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function toDirectImageUrl(url) {
  if (!url) return url;
  if (/^https?:\/\/lh3\.googleusercontent\.com\//.test(url)) return url;
  let m = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`;
  m = url.match(/[?&]id=([^&]+)/);
  if (m && /drive\.google\.com/.test(url)) return `https://lh3.googleusercontent.com/d/${m[1]}`;
  return url;
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function revealPage() {
  const body = document.body;
  if (!body) return;
  body.removeAttribute('data-loading');
  body.style.opacity = '0';
  body.style.transition = 'opacity 0.3s ease-out';
  void body.offsetWidth;
  requestAnimationFrame(() => {
    body.style.opacity = '1';
    setTimeout(() => {
      body.style.transition = '';
      body.style.opacity = '';
    }, 350);
  });
}
