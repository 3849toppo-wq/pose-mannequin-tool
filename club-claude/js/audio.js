/* 倶楽部Claude — WebAudioによる簡易シンセ効果音とBGM（外部素材なし） */
const Sound = (() => {
  let ctx = null, master = null, sfxBus = null, bgmBus = null, noiseBuf = null;
  let enabled = true, bgmName = null, bgmTimer = null, nextTime = 0, step = 0;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = enabled ? 0.9 : 0; master.connect(ctx.destination);
      sfxBus = ctx.createGain(); sfxBus.gain.value = 0.7; sfxBus.connect(master);
      bgmBus = ctx.createGain(); bgmBus.gain.value = 0.0; bgmBus.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ctx = null; }
  }

  function tone(freq, t, dur, { type = 'sine', vol = 0.2, bus = sfxBus, attack = 0.005, slide = 0, release } = {}) {
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (release || dur));
    o.connect(g); g.connect(bus);
    o.start(t); o.stop(t + (release || dur) + 0.05);
  }
  function noise(t, dur, { vol = 0.3, type = 'bandpass', freq = 1000, q = 1, freqEnd, bus = sfxBus, attack = 0.005 } = {}) {
    if (!ctx) return;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  const N = n => 440 * Math.pow(2, (n - 69) / 12);

  const sfx = {
    blip(voice) { const t = ctx.currentTime; tone(voice || 820, t, 0.03, { type: 'triangle', vol: 0.035 }); },
    select() { const t = ctx.currentTime; tone(N(84), t, .12, { type: 'sine', vol: .18 }); tone(N(91), t + .06, .25, { vol: .14 }); },
    door() { const t = ctx.currentTime; noise(t, .35, { freq: 180, q: .7, vol: .4, type: 'lowpass' });
      [76, 81, 84, 88].forEach((n, i) => tone(N(n), t + .25 + i * .09, .9, { vol: .1 })); },
    hey() { const t = ctx.currentTime; tone(520, t, .12, { type: 'square', vol: .06, slide: 1.6 }); tone(700, t + .13, .16, { type: 'square', vol: .06, slide: 1.4 }); },
    pop() { const t = ctx.currentTime; noise(t, .09, { freq: 3000, q: .8, vol: .6, type: 'highpass' }); tone(900, t, .08, { vol: .25, slide: .4 });
      for (let i = 0; i < 10; i++) tone(2000 + Math.random() * 3000, t + .1 + Math.random() * .6, .04, { vol: .03 }); },
    splash() { const t = ctx.currentTime; noise(t, 1.0, { freq: 2500, freqEnd: 400, q: .6, vol: .5 }); noise(t + .05, .6, { freq: 6000, q: 1, vol: .15, type: 'highpass' }); },
    thud() { const t = ctx.currentTime; tone(110, t, .3, { vol: .4, slide: .5 }); noise(t, .2, { freq: 200, type: 'lowpass', vol: .3 }); },
    panic() { const t = ctx.currentTime; for (let i = 0; i < 6; i++) tone(i % 2 ? 660 : 880, t + i * .08, .07, { type: 'square', vol: .05 }); },
    harp() { const t = ctx.currentTime; [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96].forEach((n, i) => tone(N(n), t + i * .07, 1.6, { vol: .07, type: 'sine' })); },
    sparkle() { const t = ctx.currentTime; for (let i = 0; i < 8; i++) tone(N(96 + (i % 4) * 3), t + i * .05, .4, { vol: .05 }); },
    cheer() { const t = ctx.currentTime; noise(t, 2.2, { freq: 1300, q: .5, vol: .22, attack: .4 }); noise(t, 1.8, { freq: 2600, q: 1.5, vol: .1, attack: .3 });
      for (let i = 0; i < 14; i++) tone(700 + Math.random() * 600, t + .2 + Math.random() * 1.3, .15, { vol: .025, type: 'triangle', slide: 1.3 }); },
    tower() { const t = ctx.currentTime; [79, 83, 86, 91, 95].forEach((n, i) => tone(N(n), t + i * .08, .6, { vol: .09, type: 'triangle' })); noise(t + .4, .5, { freq: 7000, type: 'highpass', vol: .06 }); },
    drain() { const t = ctx.currentTime; for (let i = 0; i < 8; i++) tone(1200 - i * 110, t + i * .06, .06, { type: 'square', vol: .04 }); },
    fall() { const t = ctx.currentTime; tone(600, t, 1.4, { type: 'sawtooth', vol: .05, slide: .15 }); },
    build() { const t = ctx.currentTime; [0, 1, 2].forEach(i => tone(N(84 + i * 4), t + i * .07, .1, { type: 'square', vol: .045 })); },
    rumble() { const t = ctx.currentTime; noise(t, 2.5, { freq: 90, type: 'lowpass', vol: .35, attack: .6 }); tone(55, t, 2.5, { vol: .12, attack: .5 }); },
    song() { const t = ctx.currentTime; const m = [76, 79, 81, 79, 76, 74, 76, 0, 79, 81, 84, 81, 79, 76, 79];
      m.forEach((n, i) => n && tone(N(n), t + i * .15, .14, { type: 'square', vol: .045 })); },
    chant() { const t = ctx.currentTime; for (let i = 0; i < 4; i++) { noise(t + i * .4, .12, { freq: 1500, vol: .25, q: 2 }); tone(N(i % 2 ? 72 : 76), t + i * .4, .12, { type: 'square', vol: .06 }); } },
    stamp() { const t = ctx.currentTime; tone(160, t, .15, { vol: .3, slide: .6 }); noise(t, .1, { freq: 800, vol: .2 }); },
    lighter() { const t = ctx.currentTime; noise(t, .06, { freq: 4000, vol: .3, type: 'highpass' }); noise(t + .08, .7, { freq: 900, vol: .08, attack: .1 }); },
  };

  /* ---- BGM: シンプルな自動演奏 ---- */
  const BGMS = {
    title: { bpm: 72, chords: [[60, 64, 67, 71], [57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65]], arp: true, vol: .5 },
    lounge: { bpm: 96, chords: [[60, 64, 67, 71], [57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65]], bass: true, swing: true, vol: .55 },
    party: { bpm: 128, chords: [[60, 64, 67, 72], [65, 69, 72, 77], [67, 71, 74, 79], [65, 69, 72, 77]], bass: true, beat: true, vol: .5 },
    dream: { bpm: 60, chords: [[65, 69, 72, 76, 79], [62, 65, 69, 72, 76], [64, 67, 71, 74, 78], [60, 64, 67, 71, 74]], arp: true, pad: true, vol: .6 },
    noir: { bpm: 52, chords: [[45, 48, 52, 55], [41, 45, 48, 52], [44, 47, 50, 53], [45, 48, 52, 55]], noir: true, vol: .65 },
    hum: { hum: true, vol: .25 },
  };

  function schedule() {
    const b = BGMS[bgmName]; if (!b || !ctx) return;
    if (b.hum) return;
    const spb = 60 / b.bpm / 2; // 8分音符
    while (nextTime < ctx.currentTime + 0.4) {
      const bar = Math.floor(step / 8) % b.chords.length, s = step % 8, ch = b.chords[bar];
      const t = nextTime + (b.swing && s % 2 ? spb * 0.18 : 0);
      if (s === 0) {
        if (b.pad || b.noir) ch.forEach(n => tone(N(n), t, spb * 8, { type: b.noir ? 'sawtooth' : 'sine', vol: b.noir ? .012 : .025, bus: bgmBus, attack: .8, release: spb * 8 }));
        else ch.forEach(n => tone(N(n), t, spb * 3, { type: 'triangle', vol: .03, bus: bgmBus, attack: .02, release: spb * 3.5 }));
      }
      if (b.swing && (s === 3 || s === 6)) ch.forEach(n => tone(N(n), t, spb, { type: 'triangle', vol: .022, bus: bgmBus }));
      if (b.bass && s % 2 === 0) { const bn = ch[0] - 24 + (s === 4 ? 7 : 0) + (s === 6 ? 5 : 0); tone(N(bn), t, spb * 1.6, { type: 'triangle', vol: .09, bus: bgmBus }); }
      if (b.beat) {
        if (s % 2 === 0) tone(s % 4 === 0 ? 120 : 140, t, .12, { vol: s % 4 === 0 ? .18 : .05, bus: bgmBus, slide: .4 });
        noise(t, .04, { freq: 8000, type: 'highpass', vol: s % 2 ? .05 : .025, bus: bgmBus });
        if (s === 4) noise(t, .15, { freq: 1800, vol: .12, bus: bgmBus });
      }
      if (b.arp) { const n = ch[(s * 2 + bar) % ch.length] + 12; tone(N(n), t, spb * 2, { type: 'sine', vol: .03, bus: bgmBus, release: spb * 4 }); }
      if (b.noir && (s === 0 || s === 5) && Math.random() < .7) tone(N(ch[Math.floor(Math.random() * ch.length)] + 24), t, 2, { type: 'sine', vol: .04, bus: bgmBus, release: 2.5 });
      if (b.noir && s === 0) tone(N(ch[0] - 12), t, spb * 8, { type: 'sine', vol: .08, bus: bgmBus, attack: .4, release: spb * 8 });
      nextTime += spb; step++;
    }
  }
  let humNodes = null;
  function stopHum() { if (humNodes) { humNodes.forEach(n => { try { n.stop(); } catch (e) {} }); humNodes = null; } }
  function bgm(name) {
    if (!ctx) { bgmName = name; return; }
    if (name === bgmName && bgmTimer) return;
    const t = ctx.currentTime;
    bgmBus.gain.cancelScheduledValues(t);
    bgmBus.gain.setValueAtTime(bgmBus.gain.value, t);
    bgmBus.gain.linearRampToValueAtTime(0, t + 0.6);
    clearInterval(bgmTimer); bgmTimer = null; stopHum();
    bgmName = name;
    if (!name || !BGMS[name]) return;
    const b = BGMS[name];
    setTimeout(() => {
      if (bgmName !== name) return;
      const now = ctx.currentTime;
      bgmBus.gain.cancelScheduledValues(now);
      bgmBus.gain.setValueAtTime(0, now);
      bgmBus.gain.linearRampToValueAtTime(b.vol, now + 1.2);
      if (b.hum) {
        const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.value = 100; o2.type = 'sine'; o2.frequency.value = 50; g.gain.value = .015;
        o.connect(g); o2.connect(g); g.connect(bgmBus); o.start(); o2.start(); humNodes = [o, o2];
        return;
      }
      nextTime = ctx.currentTime + 0.1; step = 0;
      schedule(); bgmTimer = setInterval(schedule, 120);
    }, 650);
  }

  function play(name, arg) { if (!ctx || !enabled || !sfx[name]) return; try { sfx[name](arg); } catch (e) {} }
  function setEnabled(v) { enabled = v; if (master) master.gain.setTargetAtTime(v ? 0.9 : 0, ctx.currentTime, 0.05); }
  document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else ctx.resume(); });
  return { init, play, bgm, setEnabled, get enabled() { return enabled; } };
})();
