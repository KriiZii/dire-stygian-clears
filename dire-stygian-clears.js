let CLEARS = [];

// ── Rarity ────────────────────────────────────────────────────────────────────
const FOUR_STAR_CHARS = new Set([
  'Aino', 'Amber', 'Barbara', 'Beidou', 'Bennett', 'Candace',
  'Charlotte', 'Chevreuse', 'Chongyun', 'Collei', 'Dahlia', 'Diona',
  'Dori', 'Faruzan', 'Fischl', 'Freminet', 'Gaming', 'Gorou',
  'Iansan', 'Ifa', 'Illuga', 'Jahoda', 'Kachina', 'Kaeya', 'Kaveh',
  'Kirara', 'Kujou Sara', 'Kuki Shinobu', 'Lan Yan', 'Layla', 'Lisa',
  'Lynette', 'Mika', 'Ningguang', 'Noelle', 'Ororon', 'Prune',
  'Razor', 'Rosaria', 'Sayu', 'Sethos', 'Shikanoin Heizou', 'Sucrose',
  'Thoma', 'Traveler', 'Xiangling', 'Xingqiu', 'Xinyan', 'Yanfei',
  'Yaoyao', 'Yun Jin', 'Traveler'
]);

function is5Star(name) {
  return !FOUR_STAR_CHARS.has(name);
}

const SIGNATURE_WEAPONS = new Set([
  'A Thousand Blazing Suns',
  'A Thousand Floating Dreams',
  'Absolution',
  "Amos' Bow",
  "Angelos' Heptades",
  'Aqua Simulacra',
  'Aquila Favonia',
  "Astral Vulture's Crimson Plumage",
  'Athame Artis',
  "Azurelight",
  "Beacon of the Reed Sea",
  "Bloodsoaked Ruins",
  "Calamity Queller",
  "Cashflow Supervision",
  "Crane's Echoing Call",
  "Crimson Moon's Semblance",
  "Elegy for the End",
  "Engulfing Lightning",
  "Everlasting Moonglow",
  "Fang of the Mountain King",
  "Fractured Halo",
  "Freedom-Sworn",
  "Gest of the Mighty Wolf",
  "Golden Frostbound Oath",
  "Haran Geppaku Futsu",
  "Hunter's Path",
  "Jadefall's Splendor",
  "Kagura's Verity",
  "Key of Khaj-Nisut",
  "Light of Foliar Incision",
  "Lightbearing Moonshard",
  "Lost Prayer to the Sacred Winds",
  "Lumidouce Elegy",
  "Memory of Dust",
  "Mistsplitter Reforged",
  "Nightweaver's Looking Glass",
  "Nocturne's Curtain Call",
  "Peak Patrol Song",
  "Polar Star",
  "Primordial Jade Cutter",
  "Primordial Jade Winged-Spear",
  "Redhorn Stonethresher",
  "Reliquary of Truth",
  "Silvershower Heartstrings",
  "Song of Broken Pines",
  "Splendor of Tranquil Waters",
  "Staff of Homa",
  "Staff of the Scarlet Sands",
  "Starcaller's Watch",
  "Summit Shaper",
  "Sunny Morning Sleep-In",
  "Surf's Up",
  "Symphonist of Scents",
  "The Daybreak Chronicles",
  "The First Great Magic",
  "The Unforged",
  "Thundering Pulse",
  "Tome of the Eternal Flow",
  "Tulaytullah's Remembrance",
  "Uraku Misugiri",
  "Verdict",
  "Vivid Notions",
  "Vortex Vanquisher"
]);

// ── Config ────────────────────────────────────────────────────────────────────

const CHAR_ID_OVERRIDES = {
  'Xianyun':  'Liuyun',
  'Skirk':    'SkirkNew',
  'Yanfei':   'Feiyan',
  'Hu Tao':   'Hutao',
  'Ororon':   'Olorun',
  'Lynette':  'Linette',
  'Traveler': 'PlayerGirl'
};

function charIconUrl(name) {
  const id = CHAR_ID_OVERRIDES[name] || name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  return `https://api.lunaris.moe/data/assets/avataricon/UI_AvatarIcon_${id}.webp`;
}

function extractVideoId(url) {
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /embed\/([^?&]+)/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ── Boss icon bar ─────────────────────────────────────────────────────────────

const BOSS_ICON_URLS = {
  'Glacial Wolf': 'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_Magbeast_Steppenwolf.png',
  'Tulpa':        'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_Narcissusborn.png',
  'Watcher':      'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_Watcher_Primo.png',
};

let selectedBoss = null;

function buildBossIcons() {
  const bosses = [...new Set(CLEARS.map(v => v.boss))].sort();
  const container = document.getElementById('bossIcons');
  bosses.forEach(boss => {
    const div = document.createElement('div');
    div.className = 'char-icon';
    div.dataset.boss = boss;
    const iconUrl = BOSS_ICON_URLS[boss] || '';
    div.innerHTML = `<img src="${iconUrl}" onerror="this.style.display='none'"><span>${boss}</span>`;
    div.addEventListener('click', () => toggleBoss(boss));
    container.appendChild(div);
  });
}

function toggleBoss(boss) {
  selectedBoss = selectedBoss === boss ? null : boss;
  document.querySelectorAll('#bossIcons .char-icon').forEach(el => {
    el.classList.toggle('active', el.dataset.boss === selectedBoss);
  });
  applyFilter();
}

// ── Character icon bar ────────────────────────────────────────────────────────

const selectedChars = new Set();
let c0FilterActive = false;
let noSigFilterActive = false;

document.getElementById('charToggle').addEventListener('click', toggleCharBar);

function toggleCharBar() {
  const icons = document.getElementById('charIcons');
  const btn = document.getElementById('charToggle');
  const hidden = icons.style.display === 'none';
  icons.style.display = hidden ? '' : 'none';
  document.getElementById('bossIconsSection').style.display = hidden ? '' : 'none';
  document.getElementById('charIconsDivider').style.display = hidden ? '' : 'none';
  btn.textContent = hidden ? '▲' : '▼';
}

function buildCharIcons() {
  const seen = new Set();
  const names = [];
  CLEARS.forEach(v => v.characters.forEach(c => {
    if (!seen.has(c.name)) { seen.add(c.name); names.push(c.name); }
  }));
  names.sort();

  const container = document.getElementById('charIcons');
  names.forEach(name => {
    const div = document.createElement('div');
    div.className = 'char-icon';
    div.dataset.name = name;
    div.innerHTML = `<img src="${charIconUrl(name)}" data-char="${name}" onerror="this.style.display='none'"><span>${name}</span>`;
    div.addEventListener('click', () => toggleChar(name));
    container.appendChild(div);
  });
}

function toggleChar(name) {
  if (selectedChars.has(name)) {
    selectedChars.delete(name);
  } else {
    selectedChars.add(name);
  }
  document.querySelectorAll('#charIcons .char-icon').forEach(el => {
    el.classList.toggle('active', selectedChars.has(el.dataset.name));
  });
  applyFilter();
}

document.getElementById('c0FilterBtn').addEventListener('click', function () {
  c0FilterActive = !c0FilterActive;
  this.classList.toggle('active', c0FilterActive);
  applyFilter();
});

document.getElementById('noSigFilterBtn').addEventListener('click', function () {
  noSigFilterActive = !noSigFilterActive;
  this.classList.toggle('active', noSigFilterActive);
  applyFilter();
});

document.getElementById('charSearch').addEventListener('input', function () {
  const q = this.value.toLowerCase();
  document.querySelectorAll('#charIcons .char-icon').forEach(el => {
    el.style.display = !q || el.dataset.name.toLowerCase().includes(q) ? '' : 'none';
  });
});

// ── Rendering ─────────────────────────────────────────────────────────────────

const STAT_LABELS = {
  hp:         'HP',
  atk:        'ATK',
  def:        'DEF',
  em:         'Elemental Mastery',
  er:         'Energy Recharge',
  critRate:   'Crit Rate',
  critDmg:    'Crit DMG',
};
const STAT_PERCENT = new Set(['er', 'critRate', 'critDmg', 'healBonus', 'pyroDmg', 'hydroDmg', 'cryoDmg', 'electroDmg', 'anemoDmg', 'geoDmg', 'dendroDmg', 'physDmg']);

function formatStat(key, val) {
  const label = STAT_LABELS[key] || key;
  const value = STAT_PERCENT.has(key) ? `${val}%` : val;
  return [label, value];
}

function cardIcon(url, name) {
  const img = url ? `<img src="${url}" width="48" height="48" onerror="this.style.display='none'" alt="${name}">` : '';
  return `<div class="char-card-icon">${img}<span>${name}</span></div>`;
}

function weaponArtifactRow(w, artifacts) {
  const artifactIcons = artifacts.map(name => cardIcon(ICON_MAP.artifacts[name], name)).join('');
  return `
    <div class="char-card-header">
      ${cardIcon(ICON_MAP.weapons[w.name], w.name)}
      <div class="char-card-meta">R${w.refinement}<br>Lv${w.level}</div>
      <div class="artifacts-row">${artifactIcons}</div>
    </div>`;
}

function characterCard(c) {
  const statRows = Object.entries(c.stats).map(([k, v]) => {
    const [label, value] = formatStat(k, v);
    return `<tr><td class="stat-key">${label}</td><td class="stat-val">${value}</td></tr>`;
  }).join('');
  return `
    <table class="char-card">
      <tr>
        <th colspan="2">
          <div class="char-card-header">
            <div class="char-card-icon">
              <img src="${charIconUrl(c.name)}" data-char="${c.name}" width="48" height="48" onerror="this.style.display='none'">
              <span>${c.name}</span>
            </div>
            <div class="char-card-meta">
              C${c.constellation}<br>Lv${c.level}
              <div class="char-card-talents">${c.talents[0]} / ${c.talents[1]} / ${c.talents[2]}</div>
            </div>
          </div>
        </th>
      </tr>
      <tr><td colspan="2">${weaponArtifactRow(c.weapon, c.artifacts)}</td></tr>
      <tr><td colspan="2" class="stats-heading">Stats</td></tr>
      ${statRows}
    </table>
  `;
}

window.loadVideo = function loadVideo(el, videoId) {
  el.outerHTML = `<iframe class="video-iframe" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
}

function renderVideos() {
  const container = document.getElementById('videoList');
  container.innerHTML = '';

  const filtered = CLEARS.filter(v => {
    const matchChar = selectedChars.size === 0 || [...selectedChars].some(name => v.characters.some(c => c.name === name));
    const matchBoss = !selectedBoss || v.boss === selectedBoss;
    const matchC0 = !c0FilterActive || v.characters.every(c => !is5Star(c.name) || c.constellation === 0);
    const matchNoSig = !noSigFilterActive || v.characters.every(c => !SIGNATURE_WEAPONS.has(c.weapon.name));
    return matchChar && matchBoss && matchC0 && matchNoSig;
  }).sort((a, b) => parseInt(a.clearTime) - parseInt(b.clearTime));

  document.getElementById('clearCount').textContent = `${filtered.length} Clears`;

  if (filtered.length === 0) {
    container.innerHTML = '<p>No videos found.</p>';
    return;
  }

  filtered.forEach(video => {
    const videoId = extractVideoId(video.url);
    const embed = videoId
      ? `${video.author ? `<p class="video-author">${video.author}</p>` : ''}
         <div class="video-wrapper">
           <div class="video-embed-placeholder" onclick="loadVideo(this, '${videoId}')">
             <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" width="560" height="315" class="video-thumb">
             <div class="video-play-btn">&#9654; View Video</div>
           </div>
         </div>`
      : `<a href="${video.url}" target="_blank">${video.url}</a>`;

    const charCards = video.characters.map(c => `<div class="char-card-wrap">${characterCard(c)}</div>`).join('');

    const section = document.createElement('div');
    section.className = 'video-section';
    section.innerHTML = `
      <div class="video-layout">
        ${embed}
        <p class="video-title"><strong>${video.boss}</strong> - ${video.clearTime}</p>
        <div class="char-cards-grid">${charCards}</div>
      </div>
    `;
    container.appendChild(section);
  });
}

function applyFilter() {
  renderVideos();
}

function clearFilter() {
  selectedChars.clear();
  selectedBoss = null;
  c0FilterActive = false;
  noSigFilterActive = false;
  document.querySelectorAll('#charIcons .char-icon, #bossIcons .char-icon').forEach(el => el.classList.remove('active'));
  document.getElementById('charSearch').value = '';
  document.querySelectorAll('#charIcons .char-icon').forEach(el => el.style.display = '');
  document.getElementById('c0FilterBtn').classList.remove('active');
  document.getElementById('noSigFilterBtn').classList.remove('active');
  renderVideos();
}

// ── Mobile tabs ───────────────────────────────────────────────────────────────

function switchTab(tab) {
  document.querySelectorAll('.mobile-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.body.classList.toggle('mobile-filters-active', tab === 'filters');
}

document.querySelectorAll('.mobile-tab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Restore both panels when resizing to desktop
window.addEventListener('resize', () => {
  if (!window.matchMedia('(max-width: 768px)').matches) {
    document.body.classList.remove('mobile-filters-active');
    document.querySelectorAll('.mobile-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === 'clears');
    });
  }
});

// ── Theme ─────────────────────────────────────────────────────────────────────

function applyTheme(light) {
  document.body.classList.toggle('light', light);
  document.getElementById('themeToggle').textContent = light ? '☾ Dark' : '☀ Light';
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

function toggleTheme() {
  const nowLight = !document.body.classList.contains('light');
  localStorage.setItem('theme', nowLight ? 'light' : 'dark');
  applyTheme(nowLight);
}

applyTheme(localStorage.getItem('theme') === 'light');

let ICON_MAP = { weapons: {}, artifacts: {} };

Promise.all([
  fetch('clears.json').then(r => r.json()),
  fetch('icon_map.json').then(r => r.json()),
]).then(([clears, icons]) => {
  CLEARS = clears;
  ICON_MAP = icons;
}).finally(() => {
  buildBossIcons();
  buildCharIcons();
  renderVideos();
});
