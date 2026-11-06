/* 倶楽部Claude — ノベルエンジン */
(() => {
  const $ = id => document.getElementById(id);
  const game = $('game');
  const NAMES = { sonnet: 'Sonnet', haiku: 'Haiku', opus: 'Opus', fable: 'Fable', mythos: 'Mythos', me: 'あなた（姫）' };
  const VOICE = { sonnet: 760, haiku: 1050, opus: 480, fable: 620, mythos: 300, cc: 1500, me: 900 };
  const POS = { l: 27, c: 50, r: 73 };
  const INIT = { money: 300000, pension: 20000000, heart: 10, reason: 80 };
  const TOWER_COST = 3000000;
  const TOWER_SLOTS = [[22, 31], [78, 31], [36, 34], [64, 34], [10, 29], [90, 29]];

  let S; // ゲーム状態
  function fresh() {
    return { q: Story.steps.slice(), stats: { ...INIT }, shown: { ...INIT }, flags: {}, towers: 0, setupFee: 0,
      log: [], waiting: false, typing: false, auto: false, gen: (S ? S.gen + 1 : 1), typeTimer: null, autoTimer: null, ended: false };
  }
  const later = (fn, ms) => { const g = S.gen; return setTimeout(() => { if (g === S.gen) fn(); }, ms); };
  const wait = ms => { later(run, ms); return true; };

  /* ---------- 表示ユーティリティ ---------- */
  const fmt = n => '¥' + Math.max(0, Math.round(n)).toLocaleString('ja-JP');
  function hud(animate = true) {
    $('g-heart').style.width = S.stats.heart + '%';
    $('g-reason').style.width = S.stats.reason + '%';
    $('v-towers').textContent = S.towers;
    ['money', 'pension'].forEach(k => {
      const el = $('v-' + k), from = S.shown[k], to = S.stats[k];
      if (!animate || from === to) { el.textContent = fmt(to); S.shown[k] = to; return; }
      const t0 = performance.now(), dur = 700, g = S.gen;
      if (to < from) { el.classList.remove('drain'); void el.offsetWidth; el.classList.add('drain'); }
      const tick = now => {
        if (g !== S.gen) return;
        const p = Math.min(1, (now - t0) / dur), v = from + (to - from) * (1 - Math.pow(1 - p, 3));
        el.textContent = fmt(v);
        if (p < 1) requestAnimationFrame(tick); else { S.shown[k] = to; setTimeout(() => el.classList.remove('drain'), 400); }
      };
      requestAnimationFrame(tick);
    });
  }
  function pop(text, color) {
    const d = document.createElement('div'); d.className = 'statpop'; d.textContent = text; d.style.color = color;
    $('pops').appendChild(d); setTimeout(() => d.remove(), 1700);
  }
  function applyStats(st) {
    if (!st) return;
    const parts = [];
    for (const k in st) {
      const v = st[k]; if (!v) continue;
      if (k === 'heart' || k === 'reason') S.stats[k] = Math.max(0, Math.min(100, S.stats[k] + v));
      else S.stats[k] = Math.max(0, S.stats[k] + v);
      const label = { heart: 'ときめき', reason: '理性', money: '所持金', pension: '老後資金' }[k];
      parts.push([label + (v > 0 ? ' +' : ' ') + (k === 'money' || k === 'pension' ? (v > 0 ? '' : '-') + fmt(Math.abs(v)) : v), k]);
    }
    parts.forEach(([t, k], i) => setTimeout(() => pop(t, { heart: '#ff9cc4', reason: '#9fd6ff', money: '#ffe08a', pension: '#ff8c9a' }[k]), i * 260));
    hud();
  }

  function fx(name) {
    const box = $('fx');
    const add = (cls, style, life) => { const p = document.createElement('div'); p.className = 'p ' + cls; Object.assign(p.style, style); box.appendChild(p); setTimeout(() => p.remove(), life); return p; };
    switch (name) {
      case 'shake': game.classList.remove('shake'); void game.offsetWidth; game.classList.add('shake'); setTimeout(() => game.classList.remove('shake'), 520); break;
      case 'zoom': game.classList.remove('zoom'); void game.offsetWidth; game.classList.add('zoom'); setTimeout(() => game.classList.remove('zoom'), 650); break;
      case 'flash': if (!$('flash').classList.contains('on')) $('flash').classList.remove('black'); $('flash').classList.remove('go'); void $('flash').offsetWidth; $('flash').classList.add('go'); break;
      case 'confetti': {
        const cols = ['#e3c27a', '#fff1c8', '#ff6fa5', '#b3122e', '#ffffff', '#c8b6ff'];
        for (let i = 0; i < 60; i++) { const d = 2 + Math.random() * 2.5; add('confetti', { left: Math.random() * 100 + '%', background: cols[i % cols.length], animationDuration: d + 's', animationDelay: Math.random() * .6 + 's' }, (d + .7) * 1000); }
        break; }
      case 'sparkle':
        for (let i = 0; i < 26; i++) { const d = .8 + Math.random() * .9; add('sparkle', { left: 15 + Math.random() * 70 + '%', top: 15 + Math.random() * 55 + '%', animationDuration: d + 's', animationDelay: Math.random() * .8 + 's' }, (d + .9) * 1000); }
        break;
      case 'petals':
        for (let i = 0; i < 40; i++) { const d = 4 + Math.random() * 4; add('petal', { left: Math.random() * 100 + '%', animationDuration: d + 's', animationDelay: Math.random() * 3 + 's' }, (d + 3.2) * 1000); }
        break;
      case 'spill': {
        fx('flash'); fx('shake');
        for (let i = 0; i < 34; i++) { const a = Math.random() * Math.PI - Math.PI, r = 10 + Math.random() * 35;
          const p = add('drop', { left: 50 + (Math.random() - .5) * 10 + '%', top: '58%', animationDuration: .6 + Math.random() * .6 + 's' }, 1400);
          p.style.setProperty('--dx', Math.cos(a) * r + 'cqw'); p.style.setProperty('--dy', (Math.sin(a) * r * .8 + 18) + 'cqh'); }
        break; }
    }
  }
  function ambient(name) {
    let a = $('ambient'); if (a) a.remove();
    if (!name) return;
    a = document.createElement('div'); a.id = 'ambient'; a.style.cssText = 'position:absolute;inset:0;pointer-events:none';
    $('fx').appendChild(a);
    if (name === 'bokeh') for (let i = 0; i < 14; i++) { const s = 6 + Math.random() * 14; const p = document.createElement('div'); p.className = 'p bokeh';
      Object.assign(p.style, { width: s + 'cqw', height: s + 'cqw', left: Math.random() * 95 + '%', top: 5 + Math.random() * 50 + '%', animationDuration: 2 + Math.random() * 3 + 's', animationDelay: -Math.random() * 3 + 's' }); a.appendChild(p); }
    if (name === 'stars') for (let i = 0; i < 40; i++) { const p = document.createElement('div'); p.className = 'p star';
      Object.assign(p.style, { left: Math.random() * 100 + '%', top: Math.random() * 60 + '%', animationDuration: 1.5 + Math.random() * 2.5 + 's', animationDelay: -Math.random() * 3 + 's' }); a.appendChild(p); }
    if (name === 'smoke') { const puff = () => { if (!a.isConnected) return; const p = document.createElement('div'); p.className = 'p smoke';
      Object.assign(p.style, { left: 52 + Math.random() * 8 + '%', top: '40%', animationDuration: 5 + Math.random() * 3 + 's' }); p.style.setProperty('--dx', (Math.random() * 20 - 8) + 'cqw');
      a.appendChild(p); setTimeout(() => p.remove(), 8500); setTimeout(puff, 900); }; puff(); }
  }

  /* ---------- キャラクター ---------- */
  function chara(who) { return $('stage').querySelector(`[data-who="${who}"]`); }
  function setFace(el, face) {
    if (!el || !face || el.dataset.face === face) return;
    el.dataset.face = face; el.querySelector('.chara-body').innerHTML = Art.character(el.dataset.who, face);
  }
  function setCls(el, cls) {
    (el.dataset.cls || '').split(' ').filter(Boolean).forEach(c => el.classList.remove(c));
    el.dataset.cls = cls || ''; (cls || '').split(' ').filter(Boolean).forEach(c => el.classList.add(c));
  }
  function show(st) {
    let el = chara(st.who);
    if (!el) {
      el = document.createElement('div'); el.className = 'chara'; el.dataset.who = st.who;
      el.innerHTML = '<div class="chara-body"></div>'; $('stage').appendChild(el);
      setFace(el, st.face || 'normal'); el.style.left = POS[st.at || 'c'] + '%';
      void el.offsetWidth;
    } else setFace(el, st.face);
    el.style.left = POS[st.at || 'c'] + '%';
    setCls(el, st.cls); el.classList.add('in', 'speak');
    layout();
  }
  function hide(who) { const el = chara(who); if (!el) return; el.classList.remove('in'); el.dataset.gone = '1'; setTimeout(() => el.remove(), 500); layout(); }
  function layout() {
    const els = [...$('stage').querySelectorAll('.chara:not([data-gone])')];
    els.forEach(e => e.classList.toggle('small', els.length > 1 && !e.classList.contains('carry')));
  }
  function anim(el, a) { if (!el || !a) return; el.classList.remove(a); void el.offsetWidth; el.classList.add(a); setTimeout(() => el.classList.remove(a), 600); }

  function chibis(st) {
    const box = $('chibis');
    if (st.on === false) { box.innerHTML = ''; return; }
    if (st.on && !box.children.length) {
      const xs = [8, 24, 40, 60, 76, 92];
      xs.forEach((x, i) => { const c = document.createElement('div'); c.className = 'chibi'; c.innerHTML = Art.chibi(i);
        c.style.left = `calc(${x}% - 5.5cqw)`; c.style.bottom = (i % 2 ? 25 : 27.5) + 'cqh'; c.style.animationDelay = (i * .12) + 's'; box.appendChild(c);
        setTimeout(() => c.classList.add('in'), 80 * i); });
    }
    if (st.party !== undefined) [...box.children].forEach(c => c.classList.toggle('party', !!st.party));
  }
  function bubble(n, text) {
    const cs = [...$('chibis').children]; if (!cs.length) return;
    const targets = n === 0 ? cs : [cs[n % cs.length]];
    targets.forEach(c => { c.querySelectorAll('.bubble').forEach(b => b.remove());
      const b = document.createElement('div'); b.className = 'bubble'; const t = text.split('\n')[0]; b.textContent = n === 0 ? '！！' : (t.length > 11 ? t.slice(0, 10) + '…' : t);
      c.appendChild(b); setTimeout(() => b.remove(), 1800); });
  }

  /* ---------- テキスト ---------- */
  function say(st) {
    $('textbox').classList.remove('hidden');
    const who = st.who, np = $('nameplate'), tx = $('text'), next = $('next');
    // 話者のハイライト
    const all = [...$('stage').querySelectorAll('.chara')];
    all.forEach(e => e.classList.toggle('speak', !who || who === 'me' || who === 'cc' || e.dataset.who === who));
    const el = chara(who);
    if (el) { setFace(el, st.face); anim(el, st.anim); }
    if (who === 'cc') bubble(st.n || 0, st.text);
    if (st.fx) fx(st.fx);
    if (st.sfx) Sound.play(st.sfx);
    applyStats(st.st);

    const name = st.name || (who === 'cc' ? `Claude Code #${st.n}` : who ? NAMES[who] : '');
    np.textContent = name; np.className = who ? 'c-' + (who === 'mythos' && name === '？？？' ? 'mythos' : who) : '';
    tx.className = (!who ? 'narr ' : who === 'me' ? 'me ' : '') + (st.style || '') + (who === 'fable' && !st.style ? ' fable' : '');
    if (who === 'fable' && st.style !== 'fable') tx.classList.add('fable');
    if (who === 'mythos') tx.classList.add('mythos');
    S.log.push({ name, text: st.text });

    const text = st.text; let i = 0; tx.textContent = ''; next.classList.remove('show');
    S.typing = true; S.waiting = false;
    const speed = st.slow ? 220 : 30;
    const finish = () => { clearInterval(S.typeTimer); tx.textContent = text; S.typing = false; S.waiting = true; next.classList.add('show'); scheduleAuto(text.length); };
    S.finishType = finish;
    S.typeTimer = setInterval(() => {
      i++; tx.textContent = text.slice(0, i);
      if (who && i % 2 === 0 && text[i - 1] !== '\n') Sound.play('blip', VOICE[who]);
      if (i >= text.length) finish();
    }, speed);
    return true;
  }
  function scheduleAuto(len) {
    clearTimeout(S.autoTimer);
    if (S.auto) S.autoTimer = later(() => { if (S.waiting) advance(); }, 1100 + len * 45);
  }
  function advance() {
    if (S.ended) return;
    if (S.typing) { S.finishType(); return; }
    if (!S.waiting) return;
    S.waiting = false; clearTimeout(S.autoTimer); $('next').classList.remove('show');
    run();
  }

  function choice(st) {
    clearTimeout(S.autoTimer);
    const box = $('choices'); box.innerHTML = ''; box.classList.remove('hidden');
    $('next').classList.remove('show');
    if (st.q) { const q = document.createElement('div'); q.className = 'choice-q'; q.textContent = st.q; box.appendChild(q); }
    st.options.forEach(o => {
      const b = document.createElement('button'); b.textContent = o.text;
      b.addEventListener('click', e => {
        e.stopPropagation(); if (box.classList.contains('hidden')) return;
        Sound.play('select'); box.classList.add('hidden'); box.innerHTML = '';
        if (o.set) S.flags[o.set] = true;
        S.log.push({ name: '▶ 選択', text: o.text, choice: true });
        applyStats(o.st);
        S.q.unshift(...(o.then || []));
        run();
      });
      box.appendChild(b);
    });
    return true;
  }

  function tower(st) {
    if (st.clear) { $('towers').innerHTML = ''; return false; }
    const slot = TOWER_SLOTS[S.towers % TOWER_SLOTS.length];
    const t = document.createElement('div'); t.className = 'tower'; t.innerHTML = Art.tower();
    t.style.left = slot[0] + '%'; t.style.bottom = slot[1] + 'cqh'; t.style.zIndex = 10 - S.towers;
    $('towers').appendChild(t); void t.offsetWidth; t.classList.add('up');
    S.towers++;
    $('tower-count').classList.remove('hidden');
    const tc = $('tower-count'); tc.classList.remove('bump'); void tc.offsetWidth; tc.classList.add('bump');
    Sound.play('tower'); later(() => Sound.play('drain'), 400);
    fx('sparkle');
    const d = { pension: -TOWER_COST };
    if (S.towers === 1 && S.stats.money > 0) { S.setupFee = S.stats.money; d.money = -S.stats.money; }
    applyStats(d);
    return wait(st.fast ? 650 : 1000);
  }

  /* ---------- ステップ実行 ---------- */
  const H = {
    say, choice, tower,
    scene(st) {
      $('bg').innerHTML = Art.bg(st.bg);
      if ('bgm' in st) Sound.bgm(st.bgm);
      $('light').className = st.light || '';
      ambient(st.ambient || null);
      if (st.hud) { $('hud').classList.remove('hidden'); $('ctrl').classList.remove('hidden'); }
    },
    bgm(st) { Sound.bgm(st.name); },
    sfx(st) { Sound.play(st.name); },
    show, move(st) { const el = chara(st.who); if (el) { el.style.left = POS[st.at] + '%'; if ('cls' in st) setCls(el, st.cls); } },
    hide(st) { hide(st.who); },
    hideAll() { [...$('stage').querySelectorAll('.chara')].forEach(e => hide(e.dataset.who)); },
    face(st) { setFace(chara(st.who), st.face); },
    chibis,
    fx(st) { fx(st.name); },
    light(st) { $('light').className = st.mode || ''; },
    bgdim(st) { $('bg').classList.toggle('dim', !!st.on); },
    bgfable(st) { $('bg').classList.toggle('fablemode', !!st.on); if (st.on) $('bg').classList.remove('dim'); },
    ambient(st) { ambient(st.name); },
    fg(st) { $('fg').innerHTML = st.name === 'carry' ? Art.carryFg() : ''; },
    stat(st) { applyStats(st.st); },
    wait(st) { return wait(st.ms); },
    if(st) { if (S.flags[st.flag]) S.q.unshift(...st.then); },
    panel(st) {
      const p = $('panel');
      if (st.hide) { p.classList.add('hidden'); return; }
      p.className = st.kind; p.innerHTML = st.html; Sound.play('stamp');
    },
    card(st) {
      const c = $('card'); $('textbox').classList.add('hidden'); $('panel').classList.add('hidden');
      c.querySelector('.card-act').textContent = st.act; c.querySelector('.card-title').textContent = st.title;
      c.classList.remove('hidden'); c.style.animationDuration = st.short ? '2s' : '2.6s';
      c.style.animation = 'none'; void c.offsetWidth; c.style.animation = '';
      Sound.play('sparkle');
      later(() => { c.classList.add('hidden'); run(); }, st.short ? 2000 : 2600);
      return true;
    },
    fade(st) { const f = $('flash'); f.classList.add('black'); f.classList.toggle('on', !!st.on); if (st.on) $('textbox').classList.add('hidden'); return wait(1100); },
    big(st) {
      const b = $('bigline'); b.className = 'on'; b.textContent = st.text; if (st.sfx) Sound.play(st.sfx);
      $('textbox').classList.add('hidden');
      later(() => { b.className = 'hidden'; run(); }, 2600); return true;
    },
    reveal(st) { const el = chara(st.who); if (el) { el.classList.remove('silhouette'); el.classList.add('reveal'); } return wait(1400); },
    blackout() {
      const f = $('flash'); f.classList.add('black', 'on'); $('textbox').classList.add('hidden'); $('panel').classList.add('hidden');
      $('hud').classList.add('hidden'); $('ctrl').classList.add('hidden'); Sound.bgm(null); Sound.play('thud');
      return wait(1500);
    },
    welcome(st) {
      const b = $('bigline'); b.className = 'welcome on'; b.textContent = st.text; Sound.play('harp');
      later(() => { b.className = 'hidden'; run(); }, 4200); return true;
    },
    end() { ending(); return true; },
  };

  function run() {
    while (S.q.length) {
      const st = S.q.shift();
      const h = H[st.t];
      if (!h) { console.warn('unknown step', st); continue; }
      if (h(st) === true) return;
    }
  }

  /* ---------- エンディング ---------- */
  function ending() {
    S.ended = true;
    const st = S.stats, f = S.flags;
    const rows = [
      ['初回セット（60分・延長分はSonnetの説明時間に充当）', 5000],
      ['Haikuの即興ソング', 0, '愛嬌'],
      [f.ikki ? 'イッキ（グラス）' : 'ノンアルカクテル', f.ikki ? 20000 : 5000],
      ['ドレスのクリーニング', 0, 'Haiku持ち'],
      ['シルクのガウン', 0, 'Fableより'],
      ['UX講義 受講料', 0, 'ご本人不在'],
      ['事故報告書 作成料', 0, 'Sonnet残業'],
      [`シャンパンタワー × ${S.towers}`, S.towers * TOWER_COST],
      ['タワー設営費（Claude Code隊）', S.setupFee],
    ];
    const total = rows.reduce((a, r) => a + r[1], 0);
    $('receipt').innerHTML = `<div class="stamp">明朗<br>会計</div><h3>本日のお会計</h3><div class="rc-sub">倶楽部Claude　担当：Fable</div>
      <table>${rows.map(r => `<tr><td>${r[0]}${r[2] ? `<br><small>（${r[2]}）</small>` : ''}</td><td>${fmt(r[1])}</td></tr>`).join('')}
      <tr class="total"><td>合計</td><td>${fmt(total)}</td></tr></table>
      <div class="note">お支払い：所持金 ${fmt(INIT.money - st.money)} ＋ 老後資金 ${fmt(INIT.pension - st.pension)}<br>老後資金 残高：${fmt(st.pension)}<br>※すべて架空の金額です。実際の請求・決済は一切発生しません。</div>`;
    let r;
    if (f.audit || st.reason >= 55) r = ['明朗会計の姫', 'あなたは熱狂の中でも理性を手放さなかった。後日、Sonnetから感謝状（全3ページ・注釈付き）が届きました。'];
    else if (st.heart >= 95) r = ['伝説の姫', 'あなたの名前は、Fableの手帳のいちばん最初のページに記されました。インクは、月の色だったそうです。'];
    else r = ['夜明け前の姫', '帰り道、Haikuから「また来てね！」と0.2秒で連絡が来ました。季語は入っていませんでした。'];
    $('rank').innerHTML = `<div class="r-label">今夜のあなたは</div><div class="r-name">${r[0]}</div><div class="r-desc">${r[1]}</div>
      <div class="r-stats">ときめき ${st.heart}／理性 ${st.reason}／タワー ${S.towers}本</div>
      <div class="r-desc" style="margin-top:1.4cqh;color:var(--gold)">オーナーより：「……また来る。」</div>`;
    $('ending').classList.remove('hidden'); $('ending').scrollTop = 0;
    Sound.bgm('title');
  }

  /* ---------- 開始・リセット ---------- */
  function clearView() {
    ['stage', 'chibis', 'towers', 'fg', 'fx', 'pops'].forEach(id => $(id).innerHTML = '');
    $('bg').innerHTML = ''; $('bg').className = ''; $('light').className = '';
    ['textbox', 'choices', 'card', 'panel', 'hud', 'ctrl', 'tower-count', 'ending', 'log', 'menu'].forEach(id => $(id).classList.add('hidden'));
    $('bigline').className = 'hidden'; $('flash').className = '';
    $('btn-auto').classList.remove('on');
  }
  function start() {
    if (S) { clearInterval(S.typeTimer); clearTimeout(S.autoTimer); }
    S = fresh(); clearView(); hud(false);
    $('title').classList.add('hidden');
    run();
  }
  function toTitle() {
    if (S) { clearInterval(S.typeTimer); clearTimeout(S.autoTimer); S.gen++; }
    clearView(); $('title').classList.remove('hidden'); Sound.bgm('title');
  }

  /* ---------- 入力 ---------- */
  game.addEventListener('click', e => {
    if (!S || e.target.closest('button') || e.target.closest('.screen')) return;
    if (!$('choices').classList.contains('hidden')) return;
    advance();
  });
  document.addEventListener('contextmenu', e => e.preventDefault());
  $('title-chandelier').innerHTML = Art.chandelier();
  $('title').addEventListener('pointerdown', () => { Sound.init(); Sound.bgm('title'); }, { once: true });
  $('btn-start').addEventListener('click', () => { Sound.init(); Sound.play('door'); start(); });
  $('btn-replay').addEventListener('click', () => { Sound.play('select'); start(); });
  $('btn-totitle').addEventListener('click', toTitle);
  $('btn-snd').addEventListener('click', e => { const v = !Sound.enabled; Sound.setEnabled(v); e.currentTarget.textContent = v ? '♪ON' : '♪OFF'; e.currentTarget.classList.toggle('on', !v); });
  $('btn-auto').addEventListener('click', e => { S.auto = !S.auto; e.currentTarget.classList.toggle('on', S.auto); if (S.auto && S.waiting) scheduleAuto(0); else clearTimeout(S.autoTimer); });
  $('btn-log').addEventListener('click', () => {
    $('log-body').innerHTML = S.log.map(l => `<div class="l"><div class="ln">${l.name || '―'}</div><div class="${l.choice ? 'lc' : ''}">${l.text.replace(/</g, '&lt;').replace(/\n/g, '<br>')}</div></div>`).join('');
    $('log').classList.remove('hidden'); $('log-body').scrollTop = 1e9;
  });
  $('btn-logclose').addEventListener('click', () => $('log').classList.add('hidden'));
  $('btn-menu').addEventListener('click', () => $('menu').classList.remove('hidden'));
  $('btn-resume').addEventListener('click', () => $('menu').classList.add('hidden'));
  $('btn-restart').addEventListener('click', () => start());
  $('btn-menutitle').addEventListener('click', toTitle);

  // テスト用フック（自動テストから状態を参照）
  window.__club = { get state() { return S; } };
})();
