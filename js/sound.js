// Efectos chiptune con WebAudio (sin archivos de audio).
(function () {
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem("pt_mute") === "1"; } catch (e) {}

  function tone(freq, start, dur, type = "square", vol = 0.06) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + start);
    o.stop(ctx.currentTime + start + dur + 0.02);
  }

  const SONGS = {
    click: [[660, 0, 0.05]],
    ok: [[523, 0, 0.08], [659, 0.08, 0.08], [784, 0.16, 0.14]],
    bad: [[220, 0, 0.12, "sawtooth"], [165, 0.12, 0.2, "sawtooth"]],
    hit: [[110, 0, 0.08, "sawtooth", 0.09], [880, 0.05, 0.06]],
    win: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.3]],
    start: [[392, 0, 0.08], [523, 0.1, 0.08], [659, 0.2, 0.08], [784, 0.3, 0.2]]
  };

  window.Sfx = {
    play(name) {
      if (muted) return;
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        (SONGS[name] || []).forEach(n => tone(n[0], n[1], n[2], n[3], n[4]));
      } catch (e) {}
    },
    toggle() {
      muted = !muted;
      try { localStorage.setItem("pt_mute", muted ? "1" : "0"); } catch (e) {}
      return muted;
    },
    get muted() { return muted; }
  };
})();
