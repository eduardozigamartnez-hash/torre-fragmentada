const HEROES = [
  { id:'kael', name:'Kael el Errante', race:'Humano', rarity:'SSR', avatar:'🧙', bg:'rgba(127,119,221,0.2)',
    atk:85, maxHp:120, skills:[
      {name:'Golpe del Eco', cost:0, dmg:28, heal:0},
      {name:'Memoria Perdida', cost:2, dmg:55, heal:0},
      {name:'Velo del Errante', cost:1, dmg:0, heal:30},
      {name:'Fragmento de Torre', cost:3, dmg:90, heal:0}
    ]},
  { id:'aelith', name:'Aelith Veyrhan', race:'Veyrhan', rarity:'SSR', avatar:'✨', bg:'rgba(127,119,221,0.2)',
    atk:70, maxHp:100, skills:[
      {name:'Eco Resonante', cost:0, dmg:22, heal:0},
      {name:'Voz del Ancestro', cost:2, dmg:48, heal:0},
      {name:'Susurro Sanador', cost:1, dmg:0, heal:35},
      {name:'Coro del Eco', cost:3, dmg:80, heal:0}
    ]},
  { id:'drakar', name:'Drakar Llama Negra', race:'Draekari', rarity:'SR', avatar:'🐉', bg:'rgba(216,90,48,0.15)',
    atk:95, maxHp:90, skills:[
      {name:'Llamarada', cost:0, dmg:32, heal:0},
      {name:'Escama Ígnea', cost:1, dmg:0, heal:25},
      {name:'Aliento Oscuro', cost:2, dmg:60, heal:0},
      {name:'Furia Draekari', cost:3, dmg:95, heal:0}
    ]},
  { id:'lyra', name:'Lyra Luz Rota', race:'Nivarii', rarity:'SR', avatar:'🌙', bg:'rgba(127,119,221,0.15)',
    atk:60, maxHp:110, skills:[
      {name:'Destellos', cost:0, dmg:20, heal:0},
      {name:'Escudo Lunar', cost:1, dmg:0, heal:40},
      {name:'Prisma Sagrado', cost:2, dmg:50, heal:0},
      {name:'Colapso de Luz', cost:3, dmg:85, heal:0}
    ]},
  { id:'thal', name:'Thal del Olvido', race:'Thalriem', rarity:'R', avatar:'🌊', bg:'rgba(29,158,117,0.15)',
    atk:50, maxHp:130, skills:[
      {name:'Corriente Fría', cost:0, dmg:18, heal:0},
      {name:'Memoria Sumergida', cost:1, dmg:0, heal:28},
      {name:'Marea Oscura', cost:2, dmg:42, heal:0},
      {name:'Abismo Total', cost:3, dmg:75, heal:0}
    ]},
  { id:'soren', name:'Soren Veyrhan', race:'Veyrhan', rarity:'R', avatar:'🔮', bg:'rgba(29,158,117,0.1)',
    atk:45, maxHp:95, skills:[
      {name:'Pulso de Eco', cost:0, dmg:16, heal:0},
      {name:'Reflejo Ancestral', cost:1, dmg:0, heal:22},
      {name:'Eco Amplificado', cost:2, dmg:38, heal:0},
      {name:'Resonancia Final', cost:3, dmg:65, heal:0}
    ]}
];

const ENEMIES = [
  {name:'Eco Corrupto', avatar:'👁️', maxHp:120, atk:18},
  {name:'Guardián Roto', avatar:'🗿', maxHp:150, atk:22},
  {name:'Sombra de la Torre', avatar:'🌑', maxHp:100, atk:28}
];

const state = {
  gems: 3000,
  pity: 0,
  owned: ['kael'],
  selectedHero: null,
  combat: null
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  syncGems();
  if (id === 'heroes') renderHeroes();
  if (id === 'combat-prep') renderCombatPrep();
}

function syncGems() {
  ['gem-main','gem-gacha'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '♦ ' + state.gems;
  });
}

function getRarity() {
  state.pity++;
  if (state.pity >= 80) { state.pity = 0; return 'SSR'; }
  const r = Math.random() * 100;
  if (r < 3) { state.pity = 0; return 'SSR'; }
  if (r < 18) return 'SR';
  return 'R';
}

function pickHero(rarity) {
  const pool = HEROES.filter(h => h.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function doGacha(times) {
  const cost = times * 150;
  if (state.gems < cost) {
    document.getElementById('gacha-result').innerHTML = '<div style="color:#E24B4A;font-size:13px;padding:10px 0;text-align:center">Gemas insuficientes.</div>';
    return;
  }
  state.gems -= cost;
  syncGems();

  const results = [];
  for (let i = 0; i < times; i++) {
    const rarity = getRarity();
    const hero = pickHero(rarity);
    results.push({hero, rarity});
    if (!state.owned.includes(hero.id)) state.owned.push(hero.id);
  }

  const pct = Math.round((state.pity / 80) * 100);
  document.getElementById('pity-fill').style.width = pct + '%';
  document.getElementById('pity-txt').textContent = state.pity + ' / 80';

  const area = document.getElementById('gacha-result');
  if (times === 1) {
    const r = results[0];
    const rc = r.rarity === 'SSR' ? 'badge-ssr' : r.rarity === 'SR' ? 'badge-sr' : 'badge-r';
    area.innerHTML = `<div class="gacha-result result-anim">
      <div class="gacha-big">${r.hero.avatar}</div>
      <div class="gacha-name">${r.hero.name}</div>
      <div class="gacha-race">${r.hero.race}</div>
      <span class="badge ${rc}">${r.rarity}</span>
    </div>`;
  } else {
    let html = '<div class="multi-grid">';
    results.forEach(r => {
      const rc = r.rarity === 'SSR' ? 'badge-ssr' : r.rarity === 'SR' ? 'badge-sr' : 'badge-r';
      html += `<div class="multi-card"><div class="avatar">${r.hero.avatar}</div><div class="mname">${r.hero.name}</div><span class="badge ${rc}" style="margin-top:4px">${r.rarity}</span></div>`;
    });
    html += '</div>';
    area.innerHTML = html;
  }
}

function renderHeroes() {
  const list = document.getElementById('hero-list');
  const owned = HEROES.filter(h => state.owned.includes(h.id));
  if (!owned.length) {
    list.innerHTML = '<div style="color:var(--text2);font-size:13px;text-align:center;padding:20px 0">Aún no tienes héroes. ¡Invoca primero!</div>';
    return;
  }
  list.innerHTML = owned.map(h => {
    const rc = h.rarity === 'SSR' ? 'badge-ssr' : h.rarity === 'SR' ? 'badge-sr' : 'badge-r';
    return `<div class="card">
      <div class="hero-header">
        <div class="hero-avatar" style="background:${h.bg}">${h.avatar}</div>
        <div>
          <div class="hero-name">${h.name}</div>
          <div class="hero-race">${h.race} &middot; <span class="badge ${rc}">${h.rarity}</span></div>
        </div>
      </div>
      <div class="stat-row">
        <span class="stat">ATK <span>${h.atk}</span></span>
        <span class="stat">HP <span>${h.maxHp}</span></span>
        <span class="stat">Habilidades <span>${h.skills.length}</span></span>
      </div>
    </div>`;
  }).join('');
}

function renderCombatPrep() {
  const area = document.getElementById('combat-select');
  const owned = HEROES.filter(h => state.owned.includes(h.id));
  area.innerHTML = owned.map(h => {
    const rc = h.rarity === 'SSR' ? 'badge-ssr' : h.rarity === 'SR' ? 'badge-sr' : 'badge-r';
    return `<div class="card" id="pick-${h.id}" onclick="selectHero('${h.id}')">
      <div class="hero-header">
        <div class="hero-avatar" style="background:${h.bg}">${h.avatar}</div>
        <div>
          <div class="hero-name">${h.name}</div>
          <div class="hero-race">${h.race} &middot; <span class="badge ${rc}">${h.rarity}</span></div>
        </div>
      </div>
      <div class="stat-row">
        <span class="stat">ATK <span>${h.atk}</span></span>
        <span class="stat">HP <span>${h.maxHp}</span></span>
      </div>
    </div>`;
  }).join('');
}

function selectHero(id) {
  state.selectedHero = id;
  document.querySelectorAll('#combat-select .card').forEach(c => c.classList.remove('selected'));
  document.getElementById('pick-' + id).classList.add('selected');
  document.getElementById('btn-fight').disabled = false;
}

function startCombat() {
  const base = HEROES.find(h => h.id === state.selectedHero);
  const enemyBase = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
  state.combat = {
    hero: { ...base, hp: base.maxHp, mana: 0, maxMana: 3 },
    enemy: { ...enemyBase, hp: enemyBase.maxHp },
    over: false
  };
  showScreen('combat');
  renderCombat();
  setLog('El combate comienza. ' + base.avatar + ' vs ' + enemyBase.avatar + ' ' + enemyBase.name + '!');
}

function renderCombat() {
  const c = state.combat;
  document.getElementById('hero-combat-name').textContent = c.hero.avatar + ' ' + c.hero.name;
  document.getElementById('enemy-avatar').textContent = c.enemy.avatar;
  document.getElementById('enemy-name').textContent = c.enemy.name;
  updateBars();
  renderMana();
  renderSkills();
}

function updateBars() {
  const c = state.combat;
  const hPct = Math.max(0, Math.round(c.hero.hp / c.hero.maxHp * 100));
  const ePct = Math.max(0, Math.round(c.enemy.hp / c.enemy.maxHp * 100));
  document.getElementById('hero-hp-bar').style.width = hPct + '%';
  document.getElementById('enemy-hp-bar').style.width = ePct + '%';
  document.getElementById('hero-hp-text').textContent = Math.max(0,c.hero.hp) + ' / ' + c.hero.maxHp + ' HP';
  document.getElementById('enemy-hp-text').textContent = Math.max(0,c.enemy.hp) + ' / ' + c.enemy.maxHp + ' HP';
}

function renderMana() {
  const c = state.combat;
  let html = '';
  for (let i = 0; i < c.hero.maxMana; i++) {
    html += `<div class="mana-dot${i < c.hero.mana ? ' filled' : ''}"></div>`;
  }
  document.getElementById('mana-dots').innerHTML = html;
}

function renderSkills() {
  const c = state.combat;
  document.getElementById('skill-grid').innerHTML = c.hero.skills.map((s, i) => {
    const ok = !c.over && c.hero.mana >= s.cost;
    return `<button class="skill-btn" onclick="useSkill(${i})" ${ok ? '' : 'disabled'}>
      <div class="skill-name">${s.name}</div>
      <div class="skill-cost">${s.cost === 0 ? 'Básico' : 'Eco: ' + s.cost} &middot; ${s.dmg > 0 ? 'DMG '+s.dmg : 'Cura '+s.heal}</div>
    </button>`;
  }).join('');
}

function setLog(msg) {
  document.getElementById('combat-log').innerHTML = msg;
}

function useSkill(idx) {
  const c = state.combat;
  if (c.over) return;
  const s = c.hero.skills[idx];
  if (c.hero.mana < s.cost) return;

  c.hero.mana -= s.cost;
  let msg = '';

  if (s.dmg > 0) {
    const dmg = s.dmg + Math.floor(Math.random() * 10) - 4;
    c.enemy.hp -= dmg;
    msg = `<span class="special">${c.hero.avatar} ${s.name}:</span> <span class="dmg">-${dmg} HP</span> al enemigo.`;
  } else {
    const heal = s.heal + Math.floor(Math.random() * 8);
    c.hero.hp = Math.min(c.hero.maxHp, c.hero.hp + heal);
    msg = `<span class="special">${c.hero.avatar} ${s.name}:</span> <span class="heal">+${heal} HP</span> recuperados.`;
  }

  if (c.hero.mana < c.hero.maxMana) c.hero.mana++;
  updateBars();
  renderMana();

  if (c.enemy.hp <= 0) {
    setLog(msg + '<br><span class="heal">&#10024; Victoria! El enemigo ha caído.</span>');
    c.over = true;
    renderSkills();
    document.getElementById('btn-end').style.display = 'block';
    return;
  }

  setTimeout(() => {
    const dmg = c.enemy.atk + Math.floor(Math.random() * 8) - 3;
    c.hero.hp -= dmg;
    const full = msg + '<br>' + c.enemy.avatar + ' ataca: <span class="dmg">-' + dmg + ' HP</span>.';
    updateBars();
    renderSkills();
    if (c.hero.hp <= 0) {
      setLog(full + '<br><span class="dmg">Derrota. El Eco te consume...</span>');
      c.over = true;
      document.getElementById('btn-end').style.display = 'block';
    } else {
      setLog(full);
    }
  }, 600);
}

syncGems();
