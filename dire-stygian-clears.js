let CLEARS = [];

// ── Config ────────────────────────────────────────────────────────────────────

const CHAR_ID_OVERRIDES = {
  'Xianyun':  'Liuyun',
  'Skirk':    'SkirkNew',
  'Yanfei':   'Feiyan',
  'Hu Tao':   'Hutao',
  'Ororon':   'Olorun',
  'Lynette':  'Linette'
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

function toggleCharBar() {
  const icons = document.getElementById('charIcons');
  const btn = document.getElementById('charToggle');
  const hidden = icons.style.display === 'none';
  icons.style.display = hidden ? '' : 'none';
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
    div.innerHTML = `<img src="${charIconUrl(name)}" onerror="this.style.display='none'"><span>${name}</span>`;
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
              <img src="${charIconUrl(c.name)}" width="48" height="48" onerror="this.style.display='none'">
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

function renderVideos() {
  const container = document.getElementById('videoList');
  container.innerHTML = '';

  const filtered = CLEARS.filter(v => {
    const matchChar = selectedChars.size === 0 || [...selectedChars].every(name => v.characters.some(c => c.name === name));
    const matchBoss = !selectedBoss || v.boss === selectedBoss;
    return matchChar && matchBoss;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p>No videos found.</p>';
    return;
  }

  filtered.forEach(video => {
    const videoId = extractVideoId(video.url);
    const embed = videoId
      ? `<div class="video-embed-placeholder"
             onclick="this.outerHTML='<iframe width=560 height=315 src=https://www.youtube.com/embed/${videoId}?autoplay=1 frameborder=0 allowfullscreen></iframe>'">
           <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" width="560" height="315" class="video-thumb">
           <div class="video-play-btn">&#9654; View Video</div>
         </div>`
      : `<a href="${video.url}" target="_blank">${video.url}</a>`;

    const charCards = video.characters.map(c => `<td style="vertical-align:top">${characterCard(c)}</td>`).join('');

    const section = document.createElement('div');
    section.className = 'video-section';
    section.innerHTML = `
      <p class="video-title"><strong>${video.boss}</strong> - ${video.clearTime}</p>
      <div class="video-layout">
        ${embed}
        <table><tr>${charCards}</tr></table>
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
  document.querySelectorAll('#charIcons .char-icon, #bossIcons .char-icon').forEach(el => el.classList.remove('active'));
  document.getElementById('charSearch').value = '';
  document.querySelectorAll('#charIcons .char-icon').forEach(el => el.style.display = '');
  renderVideos();
}

// ── Theme ─────────────────────────────────────────────────────────────────────

function applyTheme(light) {
  document.body.classList.toggle('light', light);
  document.getElementById('themeToggle').textContent = light ? '☾ Dark' : '☀ Light';
}

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
