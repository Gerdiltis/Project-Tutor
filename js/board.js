// Tablero hexagonal tipo Catan visto desde arriba, rasterizado píxel a píxel.
// 19 casillas de tierra (filas 3-4-5-4-3) rodeadas de un anillo de mar.
(function () {
  const R = 14;
  const SQ3 = Math.sqrt(3);
  const RINGS = 3;
  const W = Math.ceil(SQ3 * R * (RINGS * 2 + 1)) + 2;
  const H = Math.ceil(R * (1.5 * RINGS * 2 + 2)) + 2;
  const CX = W / 2, CY = H / 2;

  // Reparto de terrenos (18 casillas + 1 desierto) según el tema de cada mundo
  const THEMES = {
    gobernanza: { mountains: 4, pasture: 4, fields: 4, forest: 3, hills: 3 },
    alcance: { forest: 9, pasture: 4, fields: 2, hills: 2, mountains: 1 },
    cronograma: { fields: 9, pasture: 4, forest: 3, hills: 1, mountains: 1 },
    finanzas: { gold: 6, mountains: 4, hills: 3, fields: 3, pasture: 2 },
    interesados: { pasture: 9, fields: 4, forest: 3, hills: 1, mountains: 1 },
    recursos: { hills: 7, forest: 6, mountains: 3, pasture: 2 },
    riesgos: { lava: 6, mountains: 5, hills: 4, forest: 3 },
    principios: { forest: 4, fields: 4, pasture: 4, hills: 3, mountains: 3 }
  };
  const NUMBERS = [6, 8, 5, 9, 4, 10, 3, 11];

  const hash = (x, y) => {
    let h = Math.imul(x, 73856093) ^ Math.imul(y, 19349663);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  };

  // Colores por píxel de cada terreno (x, y absolutos; lx, ly relativos al centro de la casilla)
  const PAINT = {
    forest(x, y, h) {
      const tx = ((x % 5) + 5) % 5, ty = ((y + (Math.floor(x / 5) % 2) * 2) % 5 + 5) % 5;
      if (tx >= 1 && tx <= 3 && ty <= 2) return ty === 0 && tx === 2 ? "#a7f070" : (tx === 3 ? "#1d5a38" : "#38b764");
      if (tx === 2 && ty === 3) return "#5a3a1e";
      return h % 9 === 0 ? "#257145" : "#2f8f5b";
    },
    fields(x, y, h) {
      if (y % 3 === 0) return "#b8862a";
      if (h % 13 === 0) return "#ffe9a8";
      return (x + y) % 4 === 0 ? "#f0be52" : "#e0a43a";
    },
    pasture(x, y, h) {
      if (h % 41 === 0) return "#f4f4f4";
      if (h % 7 === 0) return "#a7f070";
      return "#6fbf4f";
    },
    hills(x, y) {
      const row = Math.floor(y / 3);
      if (y % 3 === 0 || (x + (row % 2) * 3) % 6 === 0) return "#7a2f20";
      return "#c9573a";
    },
    mountains(x, y, h, lx, ly) {
      const peak = (((x + 64) % 9) - 4);
      const py = ((y + 64) % 7);
      if (Math.abs(peak) <= py - 2 && py >= 2) return py <= 3 ? "#f4f4f4" : (peak < 0 ? "#cfd6e6" : "#6d7390");
      return h % 11 === 0 ? "#6d7390" : "#8a8fa8";
    },
    gold(x, y, h, lx, ly) {
      const c = PAINT.mountains(x, y, h, lx, ly);
      if (h % 17 === 0) return "#ffcd75";
      if (h % 29 === 0) return "#fff1b8";
      return c === "#8a8fa8" ? "#7d7a8f" : c;
    },
    lava(x, y, h) {
      const v = (x * 3 + y * 5 + (h % 3)) % 11;
      if (v === 0) return "#ff6b4f";
      if (v === 1) return "#ffcd75";
      return h % 5 === 0 ? "#2a1418" : "#3a1d24";
    },
    desert(x, y, h) {
      if (h % 23 === 0) return "#c9b06a";
      return (x + y * 2) % 7 === 0 ? "#f2dc9a" : "#e8d08a";
    },
    sea(x, y, h) {
      if ((x + y * 3) % 13 === 0 || (h % 53 === 0)) return "#7fc0f0";
      return (x + y * 2) % 9 < 1 ? "#3b74c4" : "#2b5fae";
    }
  };

  function cubeRound(fq, fr) {
    const fs = -fq - fr;
    let q = Math.round(fq), r = Math.round(fr), s = Math.round(fs);
    const dq = Math.abs(q - fq), dr = Math.abs(r - fr), ds = Math.abs(s - fs);
    if (dq > dr && dq > ds) q = -r - s; else if (dr > ds) r = -q - s;
    return [q, r];
  }
  const dist = (q, r) => Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
  const center = (q, r) => ({ x: CX + R * SQ3 * (q + r / 2), y: CY + R * 1.5 * r });
  const hexAt = (x, y) => {
    const px = x + 0.5 - CX, py = y + 0.5 - CY;
    return cubeRound((SQ3 / 3 * px - py / 3) / R, (2 / 3 * py) / R);
  };

  window.Board = {
    W, H,
    create(zoneId, seed, nQuestions) {
      let h = 2166136261;
      for (let i = 0; i < zoneId.length; i++) h = Math.imul(h ^ zoneId.charCodeAt(i), 16777619);
      const r = RNG((seed ^ h ^ 0x9e3779b9) >>> 0);
      const pool = [];
      Object.entries(THEMES[zoneId] || THEMES.principios).forEach(([t, n]) => { for (let i = 0; i < n; i++) pool.push(t); });
      const terrains = r.shuffle(pool);
      const cells = [];
      for (let q = -2; q <= 2; q++) for (let rr = -2; rr <= 2; rr++) if (dist(q, rr) <= 2) cells.push([q, rr]);
      const desert = r.int(0, cells.length - 1);
      let k = 0;
      const tiles = cells.map((c, i) => ({ q: c[0], r: c[1], t: i === desert ? "desert" : terrains[k++] }));
      const land = tiles.map((_, i) => i).filter(i => i !== desert);
      const qhex = r.sample(land, nQuestions);
      const nums = r.shuffle(NUMBERS).slice(0, nQuestions);
      return { tiles, desert, qhex, nums };
    },

    draw(canvas, board) {
      canvas.width = W; canvas.height = H;
      const g = canvas.getContext("2d");
      const img = g.createImageData(W, H);
      const index = {};
      board.tiles.forEach(t => { index[t.q + "," + t.r] = t.t; });
      const terrainAt = (x, y) => {
        const [q, r] = hexAt(x, y);
        const d = dist(q, r);
        if (d > RINGS) return null;
        return { key: q + "," + r, t: index[q + "," + r] || "sea", q, r };
      };
      const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const a = terrainAt(x, y);
          if (!a) continue;
          let col;
          const right = terrainAt(x + 1, y), down = terrainAt(x, y + 1);
          const inner = (right && right.key !== a.key) || (down && down.key !== a.key);
          const outer = !right || !down || !terrainAt(x - 1, y) || !terrainAt(x, y - 1);
          const landEdge = inner && (a.t !== "sea" || (right && right.t !== "sea") || (down && down.t !== "sea"));
          if (outer) col = "#140f22";
          else if (landEdge) col = "#f2dfa4";
          else {
            const c = center(a.q, a.r);
            col = PAINT[a.t](x, y, hash(x, y), x - c.x, y - c.y);
          }
          const [rr, gg, bb] = hex(col);
          const i = (y * W + x) * 4;
          img.data[i] = rr; img.data[i + 1] = gg; img.data[i + 2] = bb; img.data[i + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
    },

    // Posición del centro de una casilla en % del tablero (para superponer fichas HTML)
    pos(board, idx) {
      const t = board.tiles[idx];
      const c = center(t.q, t.r);
      return { left: (c.x / W) * 100, top: (c.y / H) * 100 };
    }
  };
})();
