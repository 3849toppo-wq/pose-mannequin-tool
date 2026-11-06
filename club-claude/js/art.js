/* 倶楽部Claude — すべてのビジュアルはオリジナルのSVGで生成 */
const Art = (() => {
  let uid = 0;
  const SKIN = '#f8e0cd', SKIN_SH = '#e7bea4', LINE = '#3a2420';

  const CH = {
    sonnet: { hair: '#1e2a40', hairHi: '#4a5f8a', eye: '#3570b5', suit: '#1b2a4c', suitHi: '#2e4577', shirt: '#f5f6fa', tie: '#2a64b0', style: 'part', glasses: true, badge: true },
    haiku: { hair: '#f2a03a', hairHi: '#ffd78a', eye: '#1d9b8e', suit: '#14a39a', suitHi: '#3fd0c4', shirt: '#ffffff', tie: null, style: 'spiky', chain: true, earring: true, blush: true },
    opus: { hair: '#7d7570', hairHi: '#c9c1b8', eye: '#7a4b2a', suit: '#3a302b', suitHi: '#584a42', shirt: '#efe6da', tie: '#8a2a1f', style: 'swept', stubble: true, vest: '#2a221e', pocket: '#d9b46a', brow: 3.4 },
    fable: { hair: '#e7defa', hairHi: '#ffffff', hairSh: '#b5a6dd', eye: '#8d68d8', suit: '#f6f2ec', suitHi: '#ffffff', suitSh: '#d6cfc4', shirt: '#cdb8f0', tie: null, style: 'long', rose: true, trim: '#d9b46a', lashes: true, open: true, aura: true },
    mythos: { hair: '#14111a', hairHi: '#4b4060', eye: '#d9a43a', suit: '#121014', suitHi: '#2b2630', shirt: '#5a0f22', tie: '#0b0a0c', style: 'slick', lashes: true, cigar: true, tiepin: true },
  };

  function eye(c, face, side, id) {
    // side: -1 左, 1 右（ミラー）
    const cx = side < 0 ? 86 : 114, cy = 113;
    const tr = `translate(${cx},${cy}) scale(${side < 0 ? 1 : -1},1)`;
    const lw = c.lashes ? 3 : 2.4;
    let s = '';
    const shape = {
      normal: 'M-9,0 Q-2,-7.5 9.5,-3 Q6,4.5 -5,4.5 Q-8,3 -9,0 Z',
      soft: 'M-9,0.5 Q-1,-4 9.5,-1 Q6,4.5 -5,4.5 Q-8,3 -9,0.5 Z',
      sly: 'M-9,0.5 Q-1,-3.5 9.5,-1.5 Q6,2.8 -5,3 Q-8,2.2 -9,0.5 Z',
      shock: 'M-9,0 Q-2,-9.5 9.5,-4 Q7,6.5 -4,6.5 Q-8.5,4 -9,0 Z',
    };
    if (face === 'smile' || face === 'grin' || face === 'laugh') {
      s = `<path d="M-8,2 Q0,-6 8.5,1.5" fill="none" stroke="${LINE}" stroke-width="${lw}" stroke-linecap="round"/>`;
    } else if (face === 'closed' || face === 'dream') {
      s = `<path d="M-8,0 Q0,4 8.5,-0.5" fill="none" stroke="${LINE}" stroke-width="${lw - .4}" stroke-linecap="round"/>` +
        (c.lashes ? `<path d="M-6,2.2 l-1.5,2.5 M-1,3.4 l-.6,2.8 M4,2.6 l.6,2.6" stroke="${LINE}" stroke-width="1"/>` : '');
    } else {
      const k = face === 'soft' || face === 'gentle' ? 'soft' : face === 'sly' || face === 'cold' ? 'sly' : (face === 'shock' || face === 'panic' || face === 'cry') ? 'shock' : 'normal';
      const d = shape[k];
      const ir = k === 'shock' ? [3.2, 3.8] : [4.8, 6.2];
      const iy = k === 'soft' ? 1.5 : k === 'sly' ? 1 : 0.5;
      s = `<defs><clipPath id="e${id}${side}"><path d="${d}"/></clipPath></defs>
        <path d="${d}" fill="#fff"/>
        <g clip-path="url(#e${id}${side})">
          <ellipse cx="0.5" cy="${iy}" rx="${ir[0]}" ry="${ir[1]}" fill="${c.eye}"/>
          <ellipse cx="0.5" cy="${iy + 1.5}" rx="${ir[0] * .75}" ry="${ir[1] * .5}" fill="#fff" opacity=".18"/>
          <ellipse cx="0.5" cy="${iy}" rx="${ir[0] * .45}" ry="${ir[1] * .5}" fill="#1a1020"/>
          <circle cx="-1.2" cy="${iy - 2.2}" r="1.6" fill="#fff"/>
          <circle cx="2" cy="${iy + 2}" r=".8" fill="#fff" opacity=".8"/>
        </g>
        <path d="${d.split(' Q').slice(0, 2).join(' Q')}" fill="none" stroke="${LINE}" stroke-width="${lw}" stroke-linecap="round"/>` +
        (c.lashes ? `<path d="M-9,0 l-2.8,-1.2 M-8,-2.2 l-2.2,-2.4" stroke="${LINE}" stroke-width="1.2" stroke-linecap="round"/>` : '');
    }
    return `<g transform="${tr}">${s}</g>`;
  }

  function brows(c, face) {
    const w = c.brow || 2.2, col = c.style === 'long' ? '#b6a3d8' : c.hair === '#f2a03a' ? '#c8782a' : LINE;
    let l;
    switch (face) {
      case 'panic': case 'cry': case 'worry': l = 'M77,99 Q84,96 94,100'; break; // 困り眉（内側上がり）
      case 'serious': case 'angry': case 'cold': l = 'M76,99 Q86,100 94,104'; break;
      case 'shock': l = 'M76,95 Q85,90 94,95'; break;
      case 'soft': case 'gentle': case 'dream': l = 'M77,98 Q85,95 93,98.5'; break;
      default: l = 'M76,100 Q85,96 94,99';
    }
    return `<path d="${l}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>
      <path d="${l}" transform="translate(200,0) scale(-1,1)" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  }

  function mouth(c, face) {
    const mx = 100, my = 145;
    const g = d => `<g transform="translate(${mx},${my})">${d}</g>`;
    switch (face) {
      case 'smile': case 'gentle': return g(`<path d="M-7,-1 Q0,5 7,-1" fill="none" stroke="${LINE}" stroke-width="1.8" stroke-linecap="round"/>`);
      case 'grin': case 'laugh': return g(`<path d="M-10,-3 Q0,13 10,-3 Z" fill="#7a2230" stroke="${LINE}" stroke-width="1.4"/><path d="M-9,-2.4 L9,-2.4 L7.5,0 L-7.5,0Z" fill="#fff"/>`);
      case 'shout': return g(`<path d="M-11,-5 Q0,18 11,-5 Q0,-1 -11,-5 Z" fill="#6e1b28" stroke="${LINE}" stroke-width="1.4"/><ellipse cx="0" cy="6" rx="5" ry="2.6" fill="#e2727f"/>`);
      case 'shock': case 'panic': case 'cry': return g(`<ellipse cx="0" cy="1" rx="4.5" ry="5.5" fill="#6e1b28" stroke="${LINE}" stroke-width="1.3"/>`);
      case 'open': return g(`<path d="M-6,-1 Q0,8 6,-1 Q0,1 -6,-1Z" fill="#7a2230" stroke="${LINE}" stroke-width="1.2"/>`);
      case 'sly': case 'smirk': return g(`<path d="M-6,1 Q1,3.5 8,-3" fill="none" stroke="${LINE}" stroke-width="1.8" stroke-linecap="round"/>`);
      case 'worry': return g(`<path d="M-8,0 q2.5,-2.5 5,0 q2.5,2.5 5,0 q2.5,-2.5 5,0" fill="none" stroke="${LINE}" stroke-width="1.6" stroke-linecap="round"/>`);
      case 'serious': case 'angry': case 'cold': return g(`<path d="M-6,0 L6,0" stroke="${LINE}" stroke-width="1.8" stroke-linecap="round"/>`);
      case 'soft': case 'dream': return g(`<path d="M-5,0 Q0,3 5,0" fill="none" stroke="${LINE}" stroke-width="1.6" stroke-linecap="round"/>`);
      default: return g(`<path d="M-5,0 Q0,2 5,0" fill="none" stroke="${LINE}" stroke-width="1.6" stroke-linecap="round"/>`);
    }
  }

  function hairBack(c) {
    switch (c.style) {
      case 'spiky': return `<path d="M60,116 L52,74 L70,80 L66,50 L86,62 L98,34 L110,58 L130,42 L130,70 L150,64 L140,116 Z" fill="${c.hair}"/>`;
      case 'long': return `<path d="M58,104 C52,56 80,38 100,38 C124,38 148,56 142,104 C146,160 152,212 160,244 C144,240 130,228 126,206 L74,206 C70,228 56,240 40,244 C48,212 54,160 58,104 Z" fill="${c.hairSh || c.hair}"/>
        <path d="M62,110 C60,160 58,200 52,232 M138,110 C140,160 142,200 148,232" stroke="${c.hair}" stroke-width="6" fill="none" opacity=".8"/>`;
      default: return `<path d="M62,112 C56,62 80,42 100,42 C124,42 146,62 138,112 L132,104 L68,104 Z" fill="${c.hair}"/>`;
    }
  }
  function hairFront(c) {
    const hi = c.hairHi;
    switch (c.style) {
      case 'part': return `<path d="M65,106 C62,70 80,52 104,52 C126,52 138,68 136,102 C132,88 126,80 120,76 C112,86 96,92 80,94 C74,97 69,101 65,106 Z" fill="${c.hair}"/>
        <path d="M84,62 C96,56 112,56 122,62" stroke="${hi}" stroke-width="2.5" fill="none" opacity=".7" stroke-linecap="round"/>
        <path d="M120,76 C124,82 130,90 134,100" stroke="${c.hair}" stroke-width="3" fill="none"/>`;
      case 'spiky': return `<path d="M64,108 L66,76 C74,58 90,50 104,50 C122,50 134,62 136,78 L138,108 L130,88 L125,100 L117,82 L108,98 L100,78 L91,97 L85,82 L77,99 L72,86 Z" fill="${c.hair}"/>
        <path d="M80,64 L92,58 M108,56 L120,60" stroke="${hi}" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>`;
      case 'swept': return `<path d="M65,102 C64,70 80,50 100,50 C122,50 136,68 135,100 C130,78 118,64 100,64 C84,64 72,76 69,94 Z" fill="${c.hair}"/>
        <path d="M76,72 C88,58 110,56 126,70 M80,66 C92,56 108,55 120,60" stroke="${hi}" stroke-width="2" fill="none" opacity=".8"/>
        <path d="M70,92 C66,100 66,108 67,114 M130,92 C134,100 134,108 133,114" stroke="${c.hair}" stroke-width="4" fill="none"/>`;
      case 'long': return `<path d="M63,124 C58,72 78,48 102,48 C128,48 140,72 137,118 C133,98 127,86 120,78 C116,94 104,106 88,112 C95,100 98,90 96,80 C88,94 76,108 63,124 Z" fill="${c.hair}"/>
        <path d="M84,58 C98,52 114,54 126,64" stroke="${hi}" stroke-width="3" fill="none" opacity=".9" stroke-linecap="round"/>
        <path d="M66,104 C62,142 64,176 56,210 C72,194 76,152 73,110 Z" fill="${c.hair}"/>
        <path d="M134,104 C138,142 136,176 144,210 C128,194 124,152 127,110 Z" fill="${c.hair}"/>`;
      case 'slick': return `<path d="M65,100 C65,66 82,48 102,48 C124,48 137,66 135,98 C129,72 114,58 100,58 C88,58 78,64 72,74 C70,82 67,90 65,100 Z" fill="${c.hair}"/>
        <path d="M80,62 C94,54 112,54 126,66 M84,56 C96,50 110,50 120,56" stroke="${hi}" stroke-width="1.8" fill="none" opacity=".8"/>
        <path d="M98,60 C92,74 96,86 88,98" stroke="${c.hair}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
    return '';
  }

  function body(c) {
    const sh = c.suitSh || 'rgba(0,0,0,.25)';
    let s = `<path d="M22,320 L24,250 C26,214 50,198 78,190 L100,210 L122,190 C150,198 174,214 176,250 L178,320 Z" fill="${c.suit}"/>
      <path d="M24,250 C26,226 40,210 60,200 L56,320 L22,320 Z" fill="${sh}" opacity=".5"/>
      <path d="M176,250 C174,226 160,210 140,200 L144,320 L178,320 Z" fill="${sh}" opacity=".35"/>`;
    // シャツ
    s += `<path d="M80,186 L100,${c.open ? 262 : 252} L120,186 L111,180 Q100,190 89,180 Z" fill="${c.shirt}"/>`;
    if (c.vest) s += `<path d="M84,214 L100,252 L116,214 L124,320 L76,320 Z" fill="${c.vest}"/><circle cx="100" cy="270" r="1.8" fill="${c.pocket}"/><circle cx="100" cy="288" r="1.8" fill="${c.pocket}"/>`;
    if (c.tie) s += `<path d="M95.5,200 L104.5,200 L106.5,210 L102,252 L100,257 L98,252 L93.5,210 Z" fill="${c.tie}"/><path d="M95.5,200 L104.5,200 L103,206 L97,206Z" fill="rgba(0,0,0,.25)"/>`;
    if (c.tiepin) s += `<rect x="94" y="226" width="12" height="2" fill="#d9b46a"/>`;
    if (c.open) s += `<path d="M92,190 L100,214 L108,190" fill="${SKIN}" opacity=".95"/><path d="M96,206 Q100,212 104,206" stroke="${SKIN_SH}" fill="none"/>`;
    // 襟
    s += `<path d="M89,180 L79,197 L97,208 Z" fill="${c.shirt}" stroke="rgba(0,0,0,.15)" stroke-width=".6"/>
      <path d="M111,180 L121,197 L103,208 Z" fill="${c.shirt}" stroke="rgba(0,0,0,.15)" stroke-width=".6"/>`;
    // ラペル
    const lap = c.suitHi;
    s += `<path d="M78,190 L100,${c.open ? 262 : 252} L93,266 L62,206 L70,200 L76,206 Z" fill="${lap}"/>
      <path d="M122,190 L100,${c.open ? 262 : 252} L107,266 L138,206 L130,200 L124,206 Z" fill="${lap}"/>`;
    if (c.trim) s += `<path d="M78,190 L100,262 M122,190 L100,262" stroke="${c.trim}" stroke-width="1.6"/><path d="M62,206 L93,266 M138,206 L107,266" stroke="${c.trim}" stroke-width="1.2" opacity=".8"/>`;
    s += `<path d="M100,262 L100,320" stroke="rgba(0,0,0,.25)" stroke-width="1"/>`;
    if (c.pocket && !c.vest) s += '';
    if (c.pocket) s += `<path d="M136,236 L150,232 L148,240 L142,236 L138,240 Z" fill="${c.pocket}"/>`;
    if (c.badge) s += `<rect x="128" y="232" width="26" height="12" rx="2" fill="#f3e3b5" stroke="#b8934a"/><text x="141" y="241.5" font-size="7.5" text-anchor="middle" fill="#2a2a3a" font-weight="700">受付</text>`;
    if (c.chain) s += `<path d="M90,194 Q100,222 110,194" stroke="#e3c27a" stroke-width="1.6" fill="none"/><circle cx="100" cy="214" r="2.5" fill="#e3c27a"/>`;
    if (c.rose) s += `<g transform="translate(136,226)"><path d="M-2,4 L-10,16" stroke="#3d7a3a" stroke-width="1.5"/><path d="M-6,10 q-6,-1 -8,3 q5,1 8,-3z" fill="#4a8a46"/>
      <circle r="7" fill="#b3122e"/><path d="M-4,-2 Q0,-6 4,-2 Q2,3 -2,2 Q-4,0 0,-1" fill="none" stroke="#7a0a1e" stroke-width="1.2"/><path d="M-6,1 Q-1,6 5,2" fill="none" stroke="#e04a5f" stroke-width="1"/></g>`;
    return s;
  }

  function head(c, face, id) {
    let s = '';
    s += `<path d="M89,148 L89,188 Q100,196 111,188 L111,148 Z" fill="${SKIN_SH}"/>`;
    s += `<ellipse cx="68" cy="114" rx="5" ry="9" fill="${SKIN}"/><ellipse cx="132" cy="114" rx="5" ry="9" fill="${SKIN}"/>`;
    s += `<path d="M68,100 C68,80 80,60 100,60 C120,60 132,80 132,100 C132,128 122,150 100,166 C78,150 68,128 68,100 Z" fill="${SKIN}"/>`;
    s += `<path d="M76,140 C84,154 92,160 100,166 C108,160 116,154 124,140 C118,152 110,158 100,160 C90,158 82,152 76,140Z" fill="${SKIN_SH}" opacity=".6"/>`;
    if (c.stubble) s += `<path d="M78,138 C86,156 94,162 100,164 C106,162 114,156 122,138 C116,150 108,156 100,157 C92,156 84,150 78,138Z" fill="#8a7a70" opacity=".35"/>
      <path d="M90,141 Q100,137 110,141" stroke="#8a7a70" stroke-width="2.5" opacity=".35" fill="none"/>`;
    if (c.earring) s += `<circle cx="131" cy="124" r="2.2" fill="#e3c27a"/>`;
    s += brows(c, face);
    s += eye(c, face, -1, id) + eye(c, face, 1, id);
    s += `<path d="M101,121 L98.5,131 L102,132" fill="none" stroke="${SKIN_SH}" stroke-width="1.4" stroke-linecap="round"/>`;
    s += mouth(c, face);
    if (c.blush || face === 'blush' || face === 'cry') s += `<ellipse cx="80" cy="129" rx="6" ry="2.6" fill="#ff7c9a" opacity=".35"/><ellipse cx="120" cy="129" rx="6" ry="2.6" fill="#ff7c9a" opacity=".35"/>`;
    if (c.glasses) s += `<g fill="rgba(200,230,255,.12)" stroke="#9aa6b8" stroke-width="1.6"><rect x="73" y="104" width="25" height="17" rx="4"/><rect x="102" y="104" width="25" height="17" rx="4"/></g>
      <path d="M98,111 Q100,109 102,111 M73,109 L68,107 M127,109 L132,107" stroke="#9aa6b8" stroke-width="1.6" fill="none"/>
      <path d="M77,107 L84,107" stroke="#fff" stroke-width="1.2" opacity=".7"/>`;
    if (face === 'panic' || face === 'worry') s += `<path d="M138,88 q-4,8 0,11 q4,-3 0,-11z" fill="#9fd8ff" stroke="#5aa6d6" stroke-width=".8"/>`;
    if (face === 'cry') s += `<path d="M82,120 q-2,10 0,14 q2,-4 0,-14z M118,120 q-2,10 0,14 q2,-4 0,-14z" fill="#9fd8ff" opacity=".9"/>`;
    if (c.opus && face === 'serious') s += '';
    if (c.style === 'swept') s += `<path d="M80,96 Q86,94 92,96" stroke="${SKIN_SH}" stroke-width=".8" fill="none"/>`;
    if (c.cigar) s += `<g transform="translate(110,148) rotate(12)"><rect x="0" y="-2.2" width="22" height="4.4" rx="1.5" fill="#6b3f22"/><rect x="5" y="-2.3" width="3" height="4.6" fill="#c9a23e"/><circle cx="22.5" cy="0" r="2.4" fill="#ff7a2a" class="ember"/></g>`;
    return s;
  }

  function character(name, face = 'normal') {
    const c = CH[name]; const id = ++uid;
    let s = `<svg viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg">`;
    if (c.aura) s += `<defs><radialGradient id="au${id}"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#d9c8ff" stop-opacity=".25"/><stop offset="1" stop-color="#b9a0ff" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="100" cy="150" rx="105" ry="150" fill="url(#au${id})"/>`;
    s += hairBack(c) + body(c) + head(c, face, id) + hairFront(c);
    if (c.aura) s += `<g fill="#fff"><path d="M40,80 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2 l6,-2z" opacity=".9"/><path d="M162,60 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 l4,-1.5z" opacity=".8"/><path d="M170,170 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 l4,-1.5z" opacity=".6"/></g>`;
    s += `</svg>`;
    return s;
  }

  /* ---- Claude Code隊（オリジナルのミニマスコット） ---- */
  const CHIBI_PROPS = ['hat', 'bow', 'stick', 'wrench', 'mega', 'bow'];
  function chibi(i = 0) {
    const p = CHIBI_PROPS[i % CHIBI_PROPS.length];
    const glow = ['#ff6fa5', '#7cffb2', '#7ec8ff', '#ffe066'][i % 4];
    let s = `<svg viewBox="0 0 60 72" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="69" rx="16" ry="2.5" fill="rgba(0,0,0,.35)"/>
      <rect x="18" y="54" width="8" height="13" rx="3" fill="#b85c40"/><rect x="34" y="54" width="8" height="13" rx="3" fill="#b85c40"/>
      <rect x="9" y="14" width="42" height="44" rx="12" fill="#e07a5f"/>
      <rect x="9" y="14" width="42" height="12" rx="10" fill="#f0957a" opacity=".6"/>
      <rect x="15" y="21" width="30" height="20" rx="5" fill="#16161f"/>
      <path d="M20,27 L25.5,31 L20,35" fill="none" stroke="#7cffb2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="29" y="33.5" width="9" height="2.6" fill="#7cffb2"><animate attributeName="opacity" values="1;1;0;0" dur="1s" repeatCount="indefinite"/></rect>
      <path d="M24,47 L30,50 L36,47 L36,53 L30,50 L24,53 Z" fill="#1a0a10"/><circle cx="30" cy="50" r="1.6" fill="#e3c27a"/>
      <path d="M9,38 L2,${p === 'stick' || p === 'mega' ? 26 : 44}" stroke="#e07a5f" stroke-width="5" stroke-linecap="round"/>
      <path d="M51,38 L58,${p === 'wrench' ? 30 : 44}" stroke="#e07a5f" stroke-width="5" stroke-linecap="round"/>`;
    if (p === 'hat') s += `<path d="M12,16 Q30,-2 48,16 Z" fill="#ffd23f"/><rect x="8" y="14" width="44" height="4" rx="2" fill="#f2b705"/>`;
    if (p === 'bow') s += `<path d="M22,8 L30,13 L38,8 L38,18 L30,13 L22,18Z" fill="#b3122e"/>`;
    if (p === 'stick') s += `<rect x="-1" y="10" width="5" height="18" rx="2.5" fill="${glow}" transform="rotate(-15 2 26)" style="filter:drop-shadow(0 0 3px ${glow})"/>`;
    if (p === 'wrench') s += `<path d="M58,30 L58,18 M54,16 a4,4 0 1,1 8,0" stroke="#c9ced6" stroke-width="3" fill="none"/>`;
    if (p === 'mega') s += `<path d="M2,26 L-6,18 L-10,26 L-6,32 Z" fill="#e3c27a"/>`;
    s += `<path d="M30,14 L30,6" stroke="#b85c40" stroke-width="2"/><circle cx="30" cy="5" r="2.6" fill="${glow}"/></svg>`;
    return s;
  }

  /* ---- シャンパンタワー ---- */
  function tower() {
    const id = ++uid;
    let s = `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="cg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset="1" stop-color="#e3b54a"/></linearGradient></defs>`;
    const rows = [5, 4, 3, 2, 1];
    rows.forEach((n, r) => {
      const y = 118 - r * 18, w = 17;
      for (let i = 0; i < n; i++) {
        const x = 50 - (n * w) / 2 + i * w + w / 2;
        s += `<path d="M${x - 8},${y - 12} L${x + 8},${y - 12} L${x + 2},${y - 3} L${x + 1},${y + 4} L${x + 5},${y + 6} L${x - 5},${y + 6} L${x - 1},${y + 4} L${x - 2},${y - 3}Z" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.75)" stroke-width=".8"/>
          <path d="M${x - 6.5},${y - 10} L${x + 6.5},${y - 10} L${x + 2},${y - 4} L${x - 2},${y - 4}Z" fill="url(#cg${id})"/>`;
      }
    });
    s += `<g transform="translate(58,6) rotate(35)"><rect x="-5" y="-4" width="10" height="26" rx="4" fill="#123a24"/><rect x="-2.5" y="-14" width="5" height="11" fill="#123a24"/><rect x="-5" y="4" width="10" height="8" fill="#e3c27a"/></g>
      <path d="M52,18 Q50,22 50,30" stroke="#ffe7a0" stroke-width="2" fill="none" opacity=".9"/></svg>`;
    return s;
  }

  function chandelier() {
    let s = `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="cl"><stop offset="0" stop-color="#fff8dd" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="100" cy="66" rx="90" ry="50" fill="url(#cl)" opacity=".5"/>
      <line x1="100" y1="0" x2="100" y2="30" stroke="#b8934a" stroke-width="1.5"/>
      <path d="M40,58 Q100,94 160,58" stroke="#e3c27a" stroke-width="2.4" fill="none"/>
      <path d="M58,46 Q100,72 142,46" stroke="#e3c27a" stroke-width="2" fill="none"/>
      <path d="M100,30 L40,58 M100,30 L160,58 M100,30 L58,46 M100,30 L142,46 M100,30 L100,80" stroke="#b8934a" stroke-width="1"/>`;
    [[40, 58], [62, 70], [84, 76], [100, 78], [116, 76], [138, 70], [160, 58], [58, 46], [78, 56], [122, 56], [142, 46]].forEach(([x, y], i) => {
      s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 10 + (i % 3) * 5}" stroke="#e3c27a" stroke-width=".6"/>
        <path d="M${x},${y + 10 + (i % 3) * 5} l3,5 l-3,6 l-3,-6z" fill="#fff" opacity=".9"><animate attributeName="opacity" values=".5;1;.5" dur="${1.5 + (i % 4) * .4}s" repeatCount="indefinite"/></path>
        <ellipse cx="${x}" cy="${y - 4}" rx="2.2" ry="4" fill="#fff6d0"/>`;
    });
    s += `<circle cx="100" cy="86" r="5" fill="#fff" opacity=".9"/></svg>`;
    return s;
  }

  /* ---- 背景 ---- */
  function bg(scene) {
    const V = 'viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"';
    const marble = (y, base = '#e9e2d6') => `<rect x="0" y="${y}" width="360" height="${640 - y}" fill="${base}"/>
      <path d="M0,${y + 30} C60,${y + 10} 90,${y + 70} 160,${y + 50} S280,${y + 90} 360,${y + 60}" stroke="#bfb3a0" stroke-width="1.2" fill="none" opacity=".7"/>
      <path d="M20,${y + 120} C80,${y + 90} 140,${y + 150} 220,${y + 120} S320,${y + 170} 360,${y + 140}" stroke="#a89a85" stroke-width=".9" fill="none" opacity=".6"/>
      <path d="M180,${y} L-60,640 M180,${y} L60,640 M180,${y} L180,640 M180,${y} L300,640 M180,${y} L420,640" stroke="#b8934a" stroke-width="1" opacity=".45"/>
      <rect x="0" y="${y}" width="360" height="${640 - y}" fill="url(#floorShade)"/>`;
    const defs = `<defs>
      <linearGradient id="floorShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".4" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
      <linearGradient id="velvet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a0714"/><stop offset=".5" stop-color="#6b1228"/><stop offset="1" stop-color="#3a0714"/></linearGradient>
      <linearGradient id="goldv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c8"/><stop offset=".5" stop-color="#e3c27a"/><stop offset="1" stop-color="#8f6a2c"/></linearGradient>
      <radialGradient id="glowc"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".8"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient>
      <pattern id="drape" width="24" height="400" patternUnits="userSpaceOnUse"><rect width="24" height="400" fill="#4a0b1b"/><rect x="0" width="10" height="400" fill="#5e1024"/><rect x="10" width="4" height="400" fill="#6f1730"/></pattern>
      </defs>`;
    if (scene === 'entrance') return `<svg ${V}>${defs}
      <rect width="360" height="640" fill="#140a0c"/>
      <rect x="0" y="0" width="360" height="420" fill="#1c0e12"/>
      ${[20, 300].map(x => `<rect x="${x}" y="40" width="40" height="380" fill="#241418"/><rect x="${x + 4}" y="40" width="3" height="380" fill="url(#goldv)"/><rect x="${x + 33}" y="40" width="3" height="380" fill="url(#goldv)"/>
        <circle cx="${x + 20}" cy="180" r="18" fill="url(#glowc)"/><rect x="${x + 15}" y="166" width="10" height="22" rx="3" fill="#fff3cf"/>`).join('')}
      <rect x="85" y="150" width="190" height="270" fill="url(#goldv)"/>
      <rect x="93" y="158" width="174" height="262" fill="#0b0608"/>
      <rect x="99" y="164" width="79" height="256" fill="#120a0e" stroke="#b8934a" stroke-width="1"/><rect x="182" y="164" width="79" height="256" fill="#120a0e" stroke="#b8934a" stroke-width="1"/>
      <path d="M110,176 L166,176 L166,400 L110,400Z M194,176 L250,176 L250,400 L194,400Z" fill="none" stroke="#e3c27a" stroke-width=".8" opacity=".6"/>
      <circle cx="172" cy="280" r="4" fill="#e3c27a"/><circle cx="188" cy="280" r="4" fill="#e3c27a"/>
      <path d="M120,206 Q138,186 156,206 Q138,226 120,206Z M204,206 Q222,186 240,206 Q222,226 204,206Z" fill="none" stroke="#e3c27a" stroke-width="1" opacity=".7"/>
      <rect x="0" y="420" width="360" height="220" fill="#2a2522"/>
      ${marble(420, '#d9d0c2')}
      <path d="M130,420 L230,420 L300,640 L60,640Z" fill="#6b0f24"/><path d="M130,420 L230,420 L300,640 L60,640Z" fill="url(#floorShade)" opacity=".6"/>
      <path d="M134,420 L64,640 M226,420 L296,640" stroke="#e3c27a" stroke-width="2"/>
      <g transform="translate(180,116)"><rect x="-108" y="-26" width="216" height="52" rx="6" fill="#0b0608" stroke="url(#goldv)" stroke-width="2.5"/>
      <text x="0" y="10" text-anchor="middle" font-family="serif" font-size="30" font-weight="700" fill="#ffe7a8" style="filter:drop-shadow(0 0 6px #e3c27a)">倶楽部 Claude</text></g>
      <ellipse cx="180" cy="116" rx="150" ry="60" fill="url(#glowc)" opacity=".35"/>
      </svg>`;
    if (scene === 'floor') return `<svg ${V}>${defs}
      <rect width="360" height="640" fill="#1a0509"/>
      <rect x="0" y="0" width="360" height="400" fill="url(#drape)"/>
      <rect x="0" y="0" width="360" height="400" fill="url(#floorShade)" opacity=".6"/>
      <rect x="0" y="300" width="360" height="100" fill="#14060a"/>
      <rect x="0" y="296" width="360" height="5" fill="url(#goldv)"/>
      ${[30, 90, 150, 210, 270, 330].map(x => `<rect x="${x - 18}" y="312" width="36" height="76" rx="2" fill="none" stroke="#b8934a" stroke-width="1" opacity=".55"/>`).join('')}
      <g opacity=".85">${[60, 120, 240, 300].map((x, i) => `<rect x="${x - 26}" y="180" width="52" height="100" fill="#0e0406" stroke="#b8934a" stroke-width="1"/>
        ${[0, 1, 2].map(r => [0, 1, 2, 3].map(k => `<rect x="${x - 22 + k * 12}" y="${188 + r * 32}" width="7" height="24" rx="2" fill="${['#2f6b3a', '#7a1f2e', '#d9b46a', '#1d3b6b'][(k + r + i) % 4]}" opacity=".9"/><rect x="${x - 20.5 + k * 12}" y="${181 + r * 32}" width="4" height="8" fill="#222"/>`).join('')).join('')}`).join('')}</g>
      <rect x="0" y="400" width="360" height="240" fill="#2b2420"/>
      ${marble(400, '#cfc5b5')}
      <path d="M-10,470 C20,420 80,430 110,452 C130,430 230,430 250,452 C280,430 340,420 370,470 L370,540 L-10,540Z" fill="#5a0f22"/>
      <path d="M-10,470 C20,420 80,430 110,452 C130,430 230,430 250,452 C280,430 340,420 370,470" stroke="#e3c27a" stroke-width="2.5" fill="none"/>
      ${[40, 110, 180, 250, 320].map(x => `<circle cx="${x}" cy="480" r="3" fill="#e3c27a" opacity=".8"/>`).join('')}
      <rect x="-10" y="520" width="380" height="30" fill="#3a0714"/>
      <g transform="translate(70,0) scale(.6)">${chandelierInner()}</g>
      <g transform="translate(230,10) scale(.5)">${chandelierInner()}</g>
      </svg>`;
    if (scene === 'backyard') return `<svg ${V}>${defs}
      <rect width="360" height="640" fill="#9aa3a0"/>
      <rect width="360" height="420" fill="#b8c0bc"/>
      <rect x="0" y="400" width="360" height="240" fill="#7c817e"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M0,${420 + i * 40} L360,${420 + i * 40}" stroke="#6b706d" stroke-width="1"/>`).join('')}
      <rect x="60" y="30" width="240" height="10" rx="5" fill="#f2fff9"/><rect x="60" y="30" width="240" height="10" rx="5" fill="#fff" opacity=".9" style="filter:drop-shadow(0 0 10px #e6fff5)"/>
      <rect x="40" y="90" width="280" height="190" fill="#f8faf9" stroke="#8a9196" stroke-width="8"/>
      <text x="60" y="130" font-size="26" fill="#1a3b8a" font-weight="700" font-family="sans-serif">UXとは何か!?</text>
      <path d="M60,138 L230,138" stroke="#c21f3a" stroke-width="3"/>
      <circle cx="90" cy="190" r="26" fill="none" stroke="#1a3b8a" stroke-width="2.5"/><text x="90" y="196" font-size="14" text-anchor="middle" fill="#1a3b8a">姫</text>
      <path d="M120,190 L180,190" stroke="#1a3b8a" stroke-width="2.5" marker-end="url(#a)"/><path d="M172,184 L182,190 L172,196" stroke="#1a3b8a" stroke-width="2.5" fill="none"/>
      <text x="230" y="186" font-size="14" text-anchor="middle" fill="#1a3b8a">感動</text><text x="230" y="206" font-size="12" text-anchor="middle" fill="#c21f3a">(体験!)</text>
      <text x="60" y="256" font-size="12" fill="#1a3b8a" font-family="sans-serif">第1章／全47章　※質問は第48章で</text>
      <rect x="10" y="420" width="70" height="56" fill="#b48a5a"/><rect x="10" y="420" width="70" height="8" fill="#9a7449"/><text x="45" y="456" text-anchor="middle" font-size="10" fill="#5a3f20">グラス</text>
      <rect x="290" y="400" width="60" height="76" fill="#b48a5a"/><text x="320" y="444" text-anchor="middle" font-size="10" fill="#5a3f20">おしぼり</text>
      <rect x="250" y="320" width="96" height="40" fill="#fff"/><text x="298" y="336" text-anchor="middle" font-size="10" fill="#c21f3a" font-weight="700">関係者以外</text><text x="298" y="352" text-anchor="middle" font-size="10" fill="#c21f3a" font-weight="700">立入禁止</text>
      </svg>`;
    if (scene === 'owner') return `<svg ${V}>${defs}
      <rect width="360" height="640" fill="#0a0605"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${i * 46}" y="0" width="44" height="430" fill="#1a0f0a"/><rect x="${i * 46 + 6}" y="20" width="32" height="160" fill="none" stroke="#2c1c12" stroke-width="2"/><rect x="${i * 46 + 6}" y="200" width="32" height="200" fill="none" stroke="#2c1c12" stroke-width="2"/>`).join('')}
      <rect x="40" y="60" width="120" height="170" fill="#05070f" stroke="#3a2a1a" stroke-width="6"/>
      ${Array.from({ length: 40 }, (_, i) => `<rect x="${48 + (i * 37) % 104}" y="${130 + (i * 53) % 90}" width="${2 + i % 3}" height="${2 + i % 2}" fill="${i % 5 ? '#e3c27a' : '#ff9ab8'}" opacity="${.3 + (i % 4) * .15}"/>`).join('')}
      <path d="M100,60 L100,230 M40,145 L160,145" stroke="#3a2a1a" stroke-width="4"/>
      <path d="M90,250 C90,170 120,150 180,150 C240,150 270,170 270,250 L270,470 L90,470Z" fill="#2a1410"/>
      <path d="M100,250 C100,180 126,164 180,164 C234,164 260,180 260,250" fill="none" stroke="#3d2018" stroke-width="3"/>
      ${[0, 1, 2, 3, 4].map(i => `<circle cx="${110 + i * 35}" cy="190" r="2.5" fill="#6b4a2a"/>`).join('')}
      <rect x="0" y="470" width="360" height="170" fill="#140b07"/>
      <path d="M-10,470 L370,470 L370,640 L-10,640Z" fill="#2a170d"/>
      <rect x="-10" y="466" width="380" height="8" fill="#3d2414"/>
      <g transform="translate(290,400)"><rect x="-4" y="40" width="8" height="30" fill="#c9a23e"/><path d="M-26,40 L26,40 L16,10 L-16,10Z" fill="#1d5a3a"/><ellipse cx="0" cy="44" rx="40" ry="16" fill="#ffc46b" opacity=".25"/></g>
      <rect x="40" y="488" width="70" height="46" fill="#efe6cf" transform="rotate(-6 75 510)"/>
      <path d="M50,500 L96,496 M50,508 L92,504 M50,516 L98,511" stroke="#6b5a3a" stroke-width="1.2" transform="rotate(-6 75 510)"/>
      <g transform="translate(150,500)"><rect x="-14" y="0" width="28" height="18" rx="3" fill="#8a6a3a"/><ellipse cx="0" cy="0" rx="14" ry="4" fill="#b8934a"/></g>
      </svg>`;
    if (scene === 'dressing') return `<svg ${V}>${defs}
      <rect width="360" height="640" fill="#1a0a12"/>
      <rect width="360" height="640" fill="url(#drape)" opacity=".7"/>
      <ellipse cx="180" cy="260" rx="70" ry="110" fill="none" stroke="url(#goldv)" stroke-width="8"/>
      <ellipse cx="180" cy="260" rx="62" ry="102" fill="#2a2440" opacity=".8"/>
      <ellipse cx="160" cy="210" rx="16" ry="40" fill="#fff" opacity=".12"/>
      </svg>`;
    return `<svg ${V}><rect width="360" height="640" fill="#000"/></svg>`;
  }
  function chandelierInner() {
    return chandelier().replace(/<svg[^>]*>/, '').replace('</svg>', '').replace(/id="cl"/, 'id="cl2"').replace('url(#cl)', 'url(#cl2)');
  }

  /* お姫様抱っこ時の前景（一人称：シルクのガウンと彼の腕） */
  function carryFg() {
    return `<svg viewBox="0 0 360 640" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;width:100%;bottom:20cqh;height:100%">
      <defs><linearGradient id="silk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#ece4ff"/><stop offset=".7" stop-color="#cdbff0"/><stop offset="1" stop-color="#f6f0ff"/></linearGradient></defs>
      <path d="M-20,560 C40,520 120,530 180,560 C240,590 300,560 380,520 L380,660 L-20,660Z" fill="url(#silk)"/>
      <path d="M-20,590 C60,560 140,575 200,600 C260,625 320,600 380,575" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>
      <path d="M20,640 C60,600 90,600 120,640 M220,640 C250,610 300,600 340,620" stroke="#bfb0e8" stroke-width="2" fill="none" opacity=".7"/>
      <path d="M260,640 C270,560 300,500 360,470 L380,480 L380,660Z" fill="#f6f2ec"/>
      <path d="M268,640 C278,566 306,508 360,478" stroke="#d9b46a" stroke-width="2" fill="none"/>
      </svg>`;
  }

  return { character, chibi, tower, bg, chandelier, carryFg };
})();
