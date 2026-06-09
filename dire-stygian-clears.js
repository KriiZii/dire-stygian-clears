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

const STANDARD_WEAPONS = new Set([
  "Amos' Bow",
  'Aquila Favonia',
  "Lost Prayer to the Sacred Winds",
  "Primordial Jade Winged-Spear",
  'Skyward Atlas',
  'Skyward Blade',
  'Skyward Harp',
  'Skyward Pride',
  'Skyward Spine',
  "Wolf's Gravestone"
]);

let costMode = 'default';

function calcCost(video) {
  let cost = 0;
  const inclStd = costMode === 'includeStandard' || costMode === 'includeAll';
  const incl4Star = costMode === 'includeAll';
  for (const c of video.characters) {
    const isLimited = is5Star(c.name) && !STANDARD_5STAR_CHARS.has(c.name) && !FREE_CON_5STAR_CHARS.has(c.name);
    if (isLimited) cost += 1 + c.constellation;
    else if (inclStd && STANDARD_5STAR_CHARS.has(c.name)) cost += 1;
    else if (incl4Star && !is5Star(c.name)) cost += c.constellation * 0.5;
    if (SIGNATURE_WEAPONS.has(c.weapon.name)) cost += c.weapon.refinement;
    else if (inclStd && STANDARD_WEAPONS.has(c.weapon.name)) cost += 1;
  }
  return cost;
}

const SIGNATURE_WEAPONS = new Set([
  'A Thousand Blazing Suns',
  'A Thousand Floating Dreams',
  'Absolution',
  "Angelos' Heptades",
  'Aqua Simulacra',
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
  "Lumidouce Elegy",
  "Memory of Dust",
  "Mistsplitter Reforged",
  "Nightweaver's Looking Glass",
  "Nocturne's Curtain Call",
  "Peak Patrol Song",
  "Polar Star",
  "Primordial Jade Cutter",
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
  'Traveler': 'PlayerGirl',
  'Alhaitham': 'Alhatham',
  'Baizhu':   'Baizhuer',
  'Lan Yan':  'Lanyan',
  'Amber':    'Ambor',
  'Raiden':   'Shougun',
  'Kuki':     'Shinobu',
  'Lyney':    'Liney',
  'Noelle':   'Noel'
};

function charIconUrl(name) {
  const id = CHAR_ID_OVERRIDES[name] || name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  return `https://api.lunaris.moe/data/assets/avataricon/UI_AvatarIcon_${id}.webp`;
}

function extractVideoId(url) {
  const biliMatch = url.match(/bilibili\.com\/video\/(BV[^/?]+)/);
  if (biliMatch) return { id: biliMatch[1], platform: 'bilibili' };
  const twitterMatch = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  if (twitterMatch) return { id: twitterMatch[1], platform: 'twitter' };
  const ytPatterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /embed\/([^?&]+)/
  ];
  for (const p of ytPatterns) {
    const m = url.match(p);
    if (m) return { id: m[1], platform: 'youtube' };
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
let charFilterMode = 'all';
let charSnapshots = { all: null, any: new Set() };
let weaponFilterMode = 'all';
let weaponSnapshots = { all: null, any: new Set() };
let c0FilterActive = false;
let includeStandardActive = false;
let includeFreeConsActive = false;
let noSigFilterActive = false;
let sortBy = 'time';
let visibleCount = 50;
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
  document.getElementById('charFilterModeBtn').style.display = tab === 'chars' ? '' : 'none';
  document.getElementById('weaponFilterModeBtn').style.display = tab === 'weapons' ? '' : 'none';
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

document.getElementById('charFilterModeBtn').addEventListener('click', function () {
  const allIcons = document.querySelectorAll('#charIcons .char-icon');
  // Snapshot current mode's selection before switching
  charSnapshots[charFilterMode] = new Set(selectedChars);
  charFilterMode = charFilterMode === 'all' ? 'any' : 'all';
  // Restore the new mode's snapshot
  const snapshot = charSnapshots[charFilterMode];
  selectedChars.clear();
  if (snapshot === null) {
    allIcons.forEach(el => selectedChars.add(el.dataset.name));
  } else {
    snapshot.forEach(n => selectedChars.add(n));
  }
  allIcons.forEach(el => el.classList.toggle('active', selectedChars.has(el.dataset.name)));
  this.textContent = charFilterMode === 'all' ? 'Mode: And' : 'Mode: Or';
  this.classList.toggle('active', charFilterMode === 'any');
  applyFilter();
});

document.getElementById('weaponFilterModeBtn').addEventListener('click', function () {
  const allIcons = document.querySelectorAll('#weaponIcons .char-icon');
  weaponSnapshots[weaponFilterMode] = new Set(selectedWeapons);
  weaponFilterMode = weaponFilterMode === 'all' ? 'any' : 'all';
  const snapshot = weaponSnapshots[weaponFilterMode];
  selectedWeapons.clear();
  if (snapshot === null) {
    allIcons.forEach(el => selectedWeapons.add(el.dataset.name));
  } else {
    snapshot.forEach(n => selectedWeapons.add(n));
  }
  allIcons.forEach(el => el.classList.toggle('active', selectedWeapons.has(el.dataset.name)));
  this.textContent = weaponFilterMode === 'all' ? 'Mode: And' : 'Mode: Or';
  this.classList.toggle('active', weaponFilterMode === 'any');
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

const COST_MODE_CYCLE = ['default', 'includeStandard', 'includeAll'];
const COST_MODE_LABELS = { default: 'Default', includeStandard: 'Incl. Standard', includeAll: 'Incl. S+4★' };

document.getElementById('costModeBtn').addEventListener('click', function () {
  const idx = COST_MODE_CYCLE.indexOf(costMode);
  costMode = COST_MODE_CYCLE[(idx + 1) % COST_MODE_CYCLE.length];
  this.textContent = COST_MODE_LABELS[costMode];
  this.classList.toggle('active', costMode !== 'default');
  applyFilter();
});

document.getElementById('costModeInfoBtn').addEventListener('click', function (e) {
  e.stopPropagation();
  const tip = document.getElementById('costModeTooltip');
  tip.hidden = !tip.hidden;
});
document.addEventListener('click', function () {
  document.getElementById('costModeTooltip').hidden = true;
});

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
              ${c.talents && c.talents.length ? `<div class="char-card-talents">${c.talents[0]} / ${c.talents[1]} / ${c.talents[2]}</div>` : ''}
              ${c.mainStats ? `<div class="char-card-mainstats">${c.mainStats.join(' / ')}</div>` : ''}
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

window.loadVideo = function loadVideo(el, id, platform) {
  const src = platform === 'bilibili'
    ? `https://player.bilibili.com/player.html?bvid=${id}&autoplay=1`
    : platform === 'twitter'
    ? `https://platform.twitter.com/embed/Tweet.html?id=${id}`
    : `https://www.youtube.com/embed/${id}?autoplay=1`;
  el.outerHTML = `<iframe class="video-iframe" src="${src}" frameborder="0" allowfullscreen></iframe>`;
}

function renderVideos() {
  const container = document.getElementById('videoList');
  container.innerHTML = '';

  const filtered = CLEARS.filter(v => {
    const matchChar = charFilterMode === 'any'
      ? (selectedChars.size === 0 || v.characters.some(c => selectedChars.has(c.name)))
      : v.characters.every(c => selectedChars.has(c.name));
    const matchWeapon = weaponFilterMode === 'any'
      ? (selectedWeapons.size === 0 || v.characters.some(c => selectedWeapons.has(c.weapon.name)))
      : v.characters.every(c => selectedWeapons.has(c.weapon.name));
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

  const visible = filtered.slice(0, visibleCount);

  visible.forEach(video => {
    const videoInfo = extractVideoId(video.url);
    const embed = videoInfo
      ? `${video.author ? `<p class="video-author">${video.author}</p>` : ''}
         <div class="video-wrapper">
           <div class="video-embed-placeholder" onclick="loadVideo(this, '${videoInfo.id}', '${videoInfo.platform}')">
             ${videoInfo.platform === 'youtube'
               ? `<img src="https://i.ytimg.com/vi/${videoInfo.id}/hqdefault.jpg" width="560" height="315" class="video-thumb">`
               : ''}
             <div class="video-play-btn">&#9654; View Video</div>
           </div>
         </div>`
      : `<a href="${video.url}" target="_blank">${video.url}</a>`;

    const charCards = video.characters.map(c => `<div class="char-card-wrap">${characterCard(c)}</div>`).join('');
    const missingStats = video.characters.some(c => !c.stats || Object.keys(c.stats).length === 0);
    const helpBtn = missingStats
      ? `<span class="help-stats-btn help-stats-ghost" aria-hidden="true">Help add stats!</span><strong>${video.boss}</strong> - ${video.clearTime} - ${calcCost(video)} Cost<a href="https://forms.gle/dGshsWdPAPDuNTNbA" target="_blank" class="help-stats-btn">Help add stats!</a>`
      : `<strong>${video.boss}</strong> - ${video.clearTime} - ${calcCost(video)} Cost`;

    const section = document.createElement('div');
    section.className = 'video-section';
    section.innerHTML = `
      <div class="video-layout">
        ${embed}
        <p class="video-title">${helpBtn}</p>
        <div class="char-cards-grid">${charCards}</div>
      </div>
    `;
    container.appendChild(section);
  });

  if (visibleCount < filtered.length) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'load-more-btn';
    loadMoreBtn.textContent = `Load More (${filtered.length - visibleCount} remaining)`;
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += 50;
      renderVideos();
    });
    container.appendChild(loadMoreBtn);
  }

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
  const allIcons = document.querySelectorAll('#charIcons .char-icon');
  // Compute effective snapshots (active mode uses current selectedChars)
  const effectiveAll = charFilterMode === 'all' ? selectedChars : (charSnapshots.all ?? 'all');
  const effectiveAny = charFilterMode === 'any' ? selectedChars : charSnapshots.any;

  const allModeDeselected = [];
  if (effectiveAll !== 'all') {
    allIcons.forEach(el => { if (!effectiveAll.has(el.dataset.name)) allModeDeselected.push(el.dataset.name); });
  }
  const anyModeSelected = [...effectiveAny];

  const effectiveWeaponAll = weaponFilterMode === 'all' ? selectedWeapons : (weaponSnapshots.all ?? 'all');
  const effectiveWeaponAny = weaponFilterMode === 'any' ? selectedWeapons : weaponSnapshots.any;
  const allWeaponModeDeselected = [];
  if (effectiveWeaponAll !== 'all') {
    document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
      if (!effectiveWeaponAll.has(el.dataset.name)) allWeaponModeDeselected.push(el.dataset.name);
    });
  }
  const anyWeaponModeSelected = [...effectiveWeaponAny];
  localStorage.setItem('filters', JSON.stringify({
    allModeDeselected,
    anyModeSelected,
    allWeaponModeDeselected,
    anyWeaponModeSelected,
    weaponFilterMode,
    costMode,
    boss: selectedBoss,
    c0: c0FilterActive,
    includeStandard: includeStandardActive,
    includeFreeCons: includeFreeConsActive,
    noSig: noSigFilterActive,
    charFilterMode,
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

  // Restore both mode snapshots (fall back to legacy deselectedChars for all-mode)
  const allDesel = new Set(state.allModeDeselected ?? state.deselectedChars ?? []);
  if (allDesel.size > 0) {
    const allChars = new Set();
    document.querySelectorAll('#charIcons .char-icon').forEach(el => {
      if (!allDesel.has(el.dataset.name)) allChars.add(el.dataset.name);
    });
    charSnapshots.all = allChars;
  }
  charSnapshots.any = new Set(state.anyModeSelected || []);

  if (state.charFilterMode === 'any') {
    charFilterMode = 'any';
    selectedChars.clear();
    charSnapshots.any.forEach(n => selectedChars.add(n));
    document.querySelectorAll('#charIcons .char-icon').forEach(el => {
      el.classList.toggle('active', selectedChars.has(el.dataset.name));
    });
    const btn = document.getElementById('charFilterModeBtn');
    btn.textContent = 'Mode: Or';
    btn.classList.add('active');
  } else if (charSnapshots.all !== null) {
    document.querySelectorAll('#charIcons .char-icon').forEach(el => {
      if (!charSnapshots.all.has(el.dataset.name)) {
        selectedChars.delete(el.dataset.name);
        el.classList.remove('active');
      }
    });
  }

  const weaponAllDesel = new Set(state.allWeaponModeDeselected ?? state.deselectedWeapons ?? []);
  if (weaponAllDesel.size > 0) {
    const allWeapons = new Set();
    document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
      if (!weaponAllDesel.has(el.dataset.name)) allWeapons.add(el.dataset.name);
    });
    weaponSnapshots.all = allWeapons;
  }
  weaponSnapshots.any = new Set(state.anyWeaponModeSelected || []);

  if (state.weaponFilterMode === 'any') {
    weaponFilterMode = 'any';
    selectedWeapons.clear();
    weaponSnapshots.any.forEach(n => selectedWeapons.add(n));
    document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
      el.classList.toggle('active', selectedWeapons.has(el.dataset.name));
    });
    const btn = document.getElementById('weaponFilterModeBtn');
    btn.textContent = 'Mode: Or';
    btn.classList.add('active');
  } else if (weaponSnapshots.all !== null) {
    document.querySelectorAll('#weaponIcons .char-icon').forEach(el => {
      if (!weaponSnapshots.all.has(el.dataset.name)) {
        selectedWeapons.delete(el.dataset.name);
        el.classList.remove('active');
      }
    });
  }

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

  if (state.costMode && state.costMode !== 'default') {
    costMode = state.costMode;
    const btn = document.getElementById('costModeBtn');
    btn.textContent = COST_MODE_LABELS[costMode] ?? 'Default';
    btn.classList.add('active');
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
  visibleCount = 50;
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
  charFilterMode = 'all';
  charSnapshots = { all: null, any: new Set() };
  const modeBtn = document.getElementById('charFilterModeBtn');
  modeBtn.textContent = 'Mode: And';
  modeBtn.classList.remove('active');
  weaponFilterMode = 'all';
  weaponSnapshots = { all: null, any: new Set() };
  const weaponModeBtn = document.getElementById('weaponFilterModeBtn');
  weaponModeBtn.textContent = 'Mode: And';
  weaponModeBtn.classList.remove('active');
  costMode = 'default';
  const costModeBtn = document.getElementById('costModeBtn');
  costModeBtn.textContent = 'Default';
  costModeBtn.classList.remove('active');
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
