let CLEARS = [];

// ── Rarity ────────────────────────────────────────────────────────────────────
const STANDARD_5STAR_CHARS = new Set([
  'Jean', 'Diluc', 'Qiqi', 'Mona', 'Keqing', 'Tighnari', 'Dehya', 'Yumemizuki Mizuki'
]);

const FREE_CON_5STAR_CHARS = new Set([
  'Baizhu', 'Wanderer', 'Nilou', 'Tighnari', 'Kamisato Ayato', 'Yae Miko', 'Shenhe',
  'Arataki Itto', 'Sangonomiya Kokomi', 'Yoimiya', 'Kamisato Ayaka', 'Eula', 'Hu Tao',
  'Xiao', 'Ganyu', 'Albedo', 'Tartaglia', 'Klee'
]);

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

function calcCost(video) {
  let cost = 0;
  for (const c of video.characters) {
    const isLimited = is5Star(c.name) && !STANDARD_5STAR_CHARS.has(c.name) && !FREE_CON_5STAR_CHARS.has(c.name);
    if (isLimited) cost += 1 + c.constellation;
    if (SIGNATURE_WEAPONS.has(c.weapon.name)) cost += c.weapon.refinement;
  }
  return cost;
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
const selectedWeapons = new Set();
let activeFilterTab = 'chars';
let charBarCollapsed = false;
let c0FilterActive = false;
let includeStandardActive = false;
let includeFreeConsActive = false;
let noSigFilterActive = false;
let sortBy = 'time';
let timeSortAscending = true;
let costSortAscending = true;
let timeMin = '', timeMax = '', costMin = '', costMax = '';

document.getElementById('charToggle').addEventListener('click', toggleCharBar);

function toggleCharBar() {
  charBarCollapsed = !charBarCollapsed;
  document.getElementById('charToggle').textContent = charBarCollapsed ? '▼' : '▲';
  document.getElementById('bossIconsSection').style.display = charBarCollapsed ? 'none' : '';
  document.getElementById('charIconsDivider').style.display = charBarCollapsed ? 'none' : '';
  document.getElementById('charWeaponTabRow').style.display = charBarCollapsed ? 'none' : '';
  document.getElementById('charIcons').style.display = !charBarCollapsed && activeFilterTab === 'chars' ? '' : 'none';
  document.getElementById('weaponIcons').style.display = !charBarCollapsed && activeFilterTab === 'weapons' ? '' : 'none';
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
    selectedChars.add(name);
    const div = document.createElement('div');
    div.className = 'char-icon active';
    div.dataset.name = name;
    div.innerHTML = `<img src="${charIconUrl(name)}" data-char="${name}" onerror="this.style.display='none'"><span>${name}</span>`;
    div.addEventListener('click', () => toggleChar(name));
    container.appendChild(div);
  });
}

function buildWeaponIcons() {
  const seen = new Set();
  const sigs = [], others = [];
  CLEARS.forEach(v => v.characters.forEach(c => {
    if (!seen.has(c.weapon.name)) {
      seen.add(c.weapon.name);
      (SIGNATURE_WEAPONS.has(c.weapon.name) ? sigs : others).push(c.weapon.name);
    }
  }));
  sigs.sort();
  others.sort();

  const container = document.getElementById('weaponIcons');

  function addGroup(label, names) {
    const header = document.createElement('div');
    header.className = 'weapon-group';
    header.innerHTML = `<div class="filter-section-label weapon-group-label">${label}</div><div class="weapon-group-icons"></div>`;
    const iconsDiv = header.querySelector('.weapon-group-icons');
    names.forEach(name => {
      selectedWeapons.add(name);
      const div = document.createElement('div');
      div.className = 'char-icon active';
      div.dataset.name = name;
      const iconUrl = ICON_MAP.weapons[name] || '';
      div.innerHTML = `<img src="${iconUrl}" onerror="this.style.display='none'"><span>${name}</span>`;
      div.addEventListener('click', () => toggleWeapon(name));
      iconsDiv.appendChild(div);
    });
    container.appendChild(header);
  }

  addGroup('Signatures', sigs);
  addGroup('Other', others);
}

function toggleChar(name) {
  if (selectedChars.has(name)) selectedChars.delete(name);
  else selectedChars.add(name);
  document.querySelectorAll('#charIcons .char-icon').forEach(el => {
    el.classList.toggle('active', selectedChars.has(el.dataset.name));
  });
  applyFilter();
}

function toggleWeapon(name) {
  if (selectedWeapons.has(name)) selectedWeapons.delete(name);
  else selectedWeapons.add(name);
  document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
    el.classList.toggle('active', selectedWeapons.has(el.dataset.name));
  });
  applyFilter();
}

function switchFilterTab(tab) {
  activeFilterTab = tab;
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filterTab === tab);
  });
  if (!charBarCollapsed) {
    document.getElementById('charIcons').style.display = tab === 'chars' ? '' : 'none';
    document.getElementById('weaponIcons').style.display = tab === 'weapons' ? '' : 'none';
  }
  const noSigBtn = document.getElementById('noSigFilterBtn');
  noSigBtn.style.display = tab === 'weapons' ? '' : 'none';
  if (tab !== 'weapons' && noSigFilterActive) {
    noSigFilterActive = false;
    noSigBtn.classList.remove('active');
    applyFilter();
  }
  const search = document.getElementById('charSearch');
  search.placeholder = tab === 'chars' ? 'Search characters...' : 'Search weapons...';
  search.value = '';
  document.querySelectorAll('#charIcons .char-icon, #weaponIcons .char-icon').forEach(el => el.style.display = '');
}

document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => switchFilterTab(btn.dataset.filterTab));
});

document.getElementById('selectAllBtn').addEventListener('click', function () {
  if (activeFilterTab === 'chars') {
    document.querySelectorAll('#charIcons .char-icon').forEach(el => {
      selectedChars.add(el.dataset.name);
      el.classList.add('active');
    });
  } else {
    document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
      selectedWeapons.add(el.dataset.name);
      el.classList.add('active');
    });
  }
  applyFilter();
});

document.getElementById('unselectAllBtn').addEventListener('click', function () {
  if (activeFilterTab === 'chars') {
    selectedChars.clear();
    document.querySelectorAll('#charIcons .char-icon').forEach(el => el.classList.remove('active'));
  } else {
    selectedWeapons.clear();
    document.querySelectorAll('#weaponIcons .char-icon').forEach(el => el.classList.remove('active'));
  }
  applyFilter();
});

document.getElementById('c0FilterBtn').addEventListener('click', function () {
  c0FilterActive = !c0FilterActive;
  this.classList.toggle('active', c0FilterActive);
  const subBtns = document.querySelectorAll('.c0-sub-btn');
  subBtns.forEach(btn => { btn.style.visibility = c0FilterActive ? 'visible' : 'hidden'; });
  if (!c0FilterActive) {
    includeStandardActive = false;
    includeFreeConsActive = false;
    document.getElementById('includeStandardBtn').classList.remove('active');
    document.getElementById('includeFreeConsBtn').classList.remove('active');
  }
  applyFilter();
});

document.getElementById('includeStandardBtn').addEventListener('click', function () {
  includeStandardActive = !includeStandardActive;
  this.classList.toggle('active', includeStandardActive);
  applyFilter();
});

document.getElementById('includeFreeConsBtn').addEventListener('click', function () {
  includeFreeConsActive = !includeFreeConsActive;
  this.classList.toggle('active', includeFreeConsActive);
  applyFilter();
});

document.getElementById('noSigFilterBtn').addEventListener('click', function () {
  noSigFilterActive = !noSigFilterActive;
  this.classList.toggle('active', noSigFilterActive);
  document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
    if (SIGNATURE_WEAPONS.has(el.dataset.name)) {
      if (noSigFilterActive) {
        selectedWeapons.delete(el.dataset.name);
        el.classList.remove('active');
      } else {
        selectedWeapons.add(el.dataset.name);
        el.classList.add('active');
      }
    }
  });
  applyFilter();
});

function updateSortBtns() {
  document.getElementById('sortTimeBtn').textContent = (timeSortAscending ? '▲' : '▼') + ' Clear Time';
  document.getElementById('sortCostBtn').textContent = (costSortAscending ? '▲' : '▼') + ' Cost';
  document.getElementById('sortTimeBtn').classList.toggle('active', sortBy === 'time');
  document.getElementById('sortCostBtn').classList.toggle('active', sortBy === 'cost');
}

document.getElementById('sortTimeBtn').addEventListener('click', function () {
  if (sortBy === 'time') timeSortAscending = !timeSortAscending;
  else sortBy = 'time';
  updateSortBtns();
  applyFilter();
});

document.getElementById('sortCostBtn').addEventListener('click', function () {
  if (sortBy === 'cost') costSortAscending = !costSortAscending;
  else sortBy = 'cost';
  updateSortBtns();
  applyFilter();
});

updateSortBtns();

document.getElementById('timeMin').addEventListener('input', function () { timeMin = this.value; applyFilter(); });
document.getElementById('timeMax').addEventListener('input', function () { timeMax = this.value; applyFilter(); });
document.getElementById('costMin').addEventListener('input', function () { costMin = this.value; applyFilter(); });
document.getElementById('costMax').addEventListener('input', function () { costMax = this.value; applyFilter(); });

document.getElementById('charSearch').addEventListener('input', function () {
  const q = this.value.toLowerCase();
  const containerId = activeFilterTab === 'chars' ? '#charIcons' : '#weaponIcons';
  document.querySelectorAll(`${containerId} .char-icon`).forEach(el => {
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
    const matchChar = v.characters.every(c => selectedChars.has(c.name));
    const matchWeapon = v.characters.every(c => selectedWeapons.has(c.weapon.name));
    const matchBoss = !selectedBoss || v.boss === selectedBoss;
    const matchC0 = !c0FilterActive || v.characters.every(c =>
      !is5Star(c.name) ||
      c.constellation === 0 ||
      (includeStandardActive && STANDARD_5STAR_CHARS.has(c.name)) ||
      (includeFreeConsActive && FREE_CON_5STAR_CHARS.has(c.name))
    );
    const time = parseInt(v.clearTime);
    const cost = calcCost(v);
    const matchTimeRange = (timeMin === '' || time >= +timeMin) && (timeMax === '' || time <= +timeMax);
    const matchCostRange = (costMin === '' || cost >= +costMin) && (costMax === '' || cost <= +costMax);
    return matchChar && matchWeapon && matchBoss && matchC0 && matchTimeRange && matchCostRange;
  }).sort((a, b) => {
    if (sortBy === 'cost') {
      const diff = calcCost(a) - calcCost(b);
      return costSortAscending ? diff : -diff;
    }
    const diff = parseInt(a.clearTime) - parseInt(b.clearTime);
    return timeSortAscending ? diff : -diff;
  });

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
        <p class="video-title"><strong>${video.boss}</strong> - ${video.clearTime} - ${calcCost(video)} Cost</p>
        <div class="char-cards-grid">${charCards}</div>
      </div>
    `;
    container.appendChild(section);
  });

  document.querySelectorAll('.char-cards-grid').forEach(grid => {
    const cards = [...grid.querySelectorAll('.char-card')];

    const ths = cards.map(c => c.querySelector('th'));
    ths.forEach(el => el.style.height = '');
    const maxThH = Math.max(...ths.map(el => el.offsetHeight));
    ths.forEach(el => el.style.height = maxThH + 'px');

    const weaponTds = cards.map(c => c.querySelector('td'));
    weaponTds.forEach(el => el.style.height = '');
    const maxTdH = Math.max(...weaponTds.map(el => el.offsetHeight));
    weaponTds.forEach(el => el.style.height = maxTdH + 'px');
  });
}

function saveFilters() {
  const deselectedChars = [];
  document.querySelectorAll('#charIcons .char-icon').forEach(el => {
    if (!selectedChars.has(el.dataset.name)) deselectedChars.push(el.dataset.name);
  });
  const deselectedWeapons = [];
  document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
    if (!selectedWeapons.has(el.dataset.name)) deselectedWeapons.push(el.dataset.name);
  });
  localStorage.setItem('filters', JSON.stringify({
    deselectedChars,
    deselectedWeapons,
    boss: selectedBoss,
    c0: c0FilterActive,
    includeStandard: includeStandardActive,
    includeFreeCons: includeFreeConsActive,
    noSig: noSigFilterActive,
    sortBy,
    timeAsc: timeSortAscending,
    costAsc: costSortAscending,
    timeMin, timeMax, costMin, costMax,
  }));
}

function restoreFilters() {
  let state;
  try { state = JSON.parse(localStorage.getItem('filters')); } catch { return; }
  if (!state) return;

  const deselectedChars = new Set(state.deselectedChars || []);
  document.querySelectorAll('#charIcons .char-icon').forEach(el => {
    if (deselectedChars.has(el.dataset.name)) {
      selectedChars.delete(el.dataset.name);
      el.classList.remove('active');
    }
  });

  const deselectedWeapons = new Set(state.deselectedWeapons || []);
  document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
    if (deselectedWeapons.has(el.dataset.name)) {
      selectedWeapons.delete(el.dataset.name);
      el.classList.remove('active');
    }
  });

  if (state.boss) {
    selectedBoss = state.boss;
    document.querySelectorAll('#bossIcons .char-icon').forEach(el => {
      el.classList.toggle('active', el.dataset.boss === selectedBoss);
    });
  }

  if (state.c0) {
    c0FilterActive = true;
    document.getElementById('c0FilterBtn').classList.add('active');
    document.querySelectorAll('.c0-sub-btn').forEach(btn => btn.style.visibility = 'visible');
    if (state.includeStandard) {
      includeStandardActive = true;
      document.getElementById('includeStandardBtn').classList.add('active');
    }
    if (state.includeFreeCons) {
      includeFreeConsActive = true;
      document.getElementById('includeFreeConsBtn').classList.add('active');
    }
  }

  if (state.noSig) {
    noSigFilterActive = true;
    document.getElementById('noSigFilterBtn').classList.add('active');
  }

  if (state.sortBy) sortBy = state.sortBy;
  if (state.timeAsc !== undefined) timeSortAscending = state.timeAsc;
  if (state.costAsc !== undefined) costSortAscending = state.costAsc;
  updateSortBtns();

  if (state.timeMin) { timeMin = state.timeMin; document.getElementById('timeMin').value = timeMin; }
  if (state.timeMax) { timeMax = state.timeMax; document.getElementById('timeMax').value = timeMax; }
  if (state.costMin) { costMin = state.costMin; document.getElementById('costMin').value = costMin; }
  if (state.costMax) { costMax = state.costMax; document.getElementById('costMax').value = costMax; }
}

function applyFilter() {
  saveFilters();
  renderVideos();
}

function clearFilter() {
  selectedChars.clear();
  selectedWeapons.clear();
  document.querySelectorAll('#charIcons .char-icon').forEach(el => {
    selectedChars.add(el.dataset.name);
    el.classList.add('active');
    el.style.display = '';
  });
  document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
    selectedWeapons.add(el.dataset.name);
    el.classList.add('active');
    el.style.display = '';
  });
  selectedBoss = null;
  document.querySelectorAll('#bossIcons .char-icon').forEach(el => el.classList.remove('active'));
  document.getElementById('charSearch').value = '';
  c0FilterActive = false;
  includeStandardActive = false;
  includeFreeConsActive = false;
  noSigFilterActive = false;
  document.getElementById('c0FilterBtn').classList.remove('active');
  document.getElementById('includeStandardBtn').classList.remove('active');
  document.getElementById('includeFreeConsBtn').classList.remove('active');
  document.querySelectorAll('.c0-sub-btn').forEach(btn => { btn.style.visibility = 'hidden'; });
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
  buildWeaponIcons();
  restoreFilters();
  renderVideos();
});
