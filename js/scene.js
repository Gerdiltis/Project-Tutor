// Fondo pixel art: calle nocturna con fachadas de colores, balcones de hierro,
// ventanas iluminadas, guirnaldas, farolas y letreros de neón. Se dibuja a baja
// resolución y se escala con image-rendering: pixelated.
(function () {
  const PX = 4;
  const SKY = ["#0b0820", "#110c2c", "#181039", "#211447", "#2c1856", "#3a1d64", "#4a2370", "#5c2a7a", "#702f80"];
  const FACADES = ["#2b5fae", "#e0a43a", "#c9573a", "#2f8f5b", "#2a8fa8", "#b8323f", "#3a6bc4", "#d97a2b", "#7a3fa0"];
  const NEON = ["#ff4fa3", "#4fe3ff", "#a7f070", "#ffcd75", "#ff6b4f"];
  const IRON = "#140f22";

  const cv = document.createElement("canvas");
  cv.id = "scene";
  cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);

  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const ch = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
    return "#" + [n >> 16, (n >> 8) & 255, n & 255].map(v => ch(v).toString(16).padStart(2, "0")).join("");
  }

  function draw() {
    const W = Math.ceil(innerWidth / PX), H = Math.ceil(innerHeight / PX);
    cv.width = W; cv.height = H;
    const g = cv.getContext("2d");
    const r = RNG(20261027);
    const px = (x, y, c, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(x, y, w, h); };

    // Cielo en bandas con tramado entre ellas
    const band = Math.ceil(H * 0.75 / SKY.length);
    SKY.forEach((c, i) => {
      px(0, i * band, c, W, band);
      if (i > 0) for (let x = 0; x < W; x += 2) px(x + (i % 2), i * band, SKY[i - 1]);
    });
    px(0, SKY.length * band, SKY[SKY.length - 1], W, H);

    // Estrellas
    for (let i = 0; i < W * H / 400; i++) {
      const x = r.int(0, W), y = r.int(0, Math.floor(H * 0.45));
      px(x, y, r.next() < 0.2 ? "#ffcd75" : "#dfe8ff");
      if (r.next() < 0.08) { px(x - 1, y, "#8fa3ff"); px(x + 1, y, "#8fa3ff"); px(x, y - 1, "#8fa3ff"); px(x, y + 1, "#8fa3ff"); }
    }

    // Nubes
    for (let i = 0; i < Math.max(3, W / 90); i++) {
      const cx = r.int(0, W), cy = r.int(Math.floor(H * 0.08), Math.floor(H * 0.35)), len = r.int(20, 50);
      px(cx, cy, "#3d2f78", len, 3);
      px(cx + 4, cy - 2, "#4a3a8a", len - 10, 2);
      px(cx + 8, cy - 4, "#5a4a9e", Math.max(4, len - 22), 2);
    }

    // Skyline lejano
    const far = Math.floor(H * 0.5);
    for (let x = 0; x < W;) {
      const w = r.int(6, 14), h = r.int(8, Math.max(10, Math.floor(H * 0.2)));
      px(x, far - h, "#22184a", w, H);
      for (let wy = far - h + 2; wy < far + 20; wy += 3)
        for (let wx = x + 1; wx < x + w - 1; wx += 2)
          if (r.next() < 0.18) px(wx, wy, "#c99a4a");
      x += w + r.int(0, 3);
    }

    // Fachadas en primer plano
    const ground = H - 6;
    for (let x = -r.int(0, 20); x < W;) {
      const bw = r.int(36, 58);
      const floors = r.int(2, 4);
      const fh = 17;
      const bh = floors * fh + 6;
      const top = ground - bh;
      const col = r.pick(FACADES);
      const shutter = col === "#2f8f5b" ? "#1d5a38" : "#2f8f5b";

      px(x, top, col, bw, bh);
      px(x + bw - 3, top, shade(col, 0.7), 3, bh);
      px(x, top, IRON, bw, 2);
      px(x - 1, top + 2, shade(col, 0.6), bw + 2, 1);

      for (let f = 0; f < floors; f++) {
        const fy = top + 4 + f * fh;
        for (let wx = x + 5; wx + 6 < x + bw - 3; wx += 11) {
          const lit = r.next() < 0.8;
          px(wx - 2, fy, shutter, 2, 9);
          px(wx + 5, fy, shutter, 2, 9);
          px(wx, fy, IRON, 5, 9);
          px(wx + 1, fy + 1, lit ? "#ffc85a" : "#2a2350", 3, 7);
          if (lit) px(wx + 1, fy + 1, "#ffe9a8", 3, 2);
          if (lit && r.next() < 0.35) px(wx + 2, fy + 4, "#1a1c2c", 1, 4);
        }
        // Balcón de hierro con guirnalda
        const by = fy + 10;
        px(x - 2, by + 5, IRON, bw + 4, 1);
        px(x - 2, by, IRON, bw + 4, 1);
        for (let bx = x - 2; bx < x + bw + 2; bx += 2) px(bx, by, IRON, 1, 5);
        for (let lx = x; lx < x + bw; lx += 3) px(lx, by - 1 + (lx % 2), (lx / 3) % 2 ? "#ffcd75" : "#a7f070");
      }

      // Letrero de neón
      if (r.next() < 0.55) {
        const nc = r.pick(NEON);
        const sw = r.int(14, 22), sx = x + r.int(3, Math.max(4, bw - sw - 4)), sy = top + 4 + r.int(0, floors - 1) * fh + 2;
        px(sx - 1, sy - 1, shade(nc, 0.45), sw + 2, 9);
        px(sx, sy, "#140b26", sw, 7);
        px(sx, sy, nc, sw, 1); px(sx, sy + 6, nc, sw, 1); px(sx, sy, nc, 1, 7); px(sx + sw - 1, sy, nc, 1, 7);
        for (let i = sx + 2; i < sx + sw - 2; i += 2) if (r.next() < 0.7) px(i, sy + 2 + r.int(0, 2), nc);
      }

      // Puerta iluminada
      const dx = x + Math.floor(bw / 2) - 3;
      px(dx, ground - 10, IRON, 7, 10);
      px(dx + 1, ground - 9, "#e08a2a", 5, 9);
      px(dx + 1, ground - 9, "#ffcf7a", 5, 3);

      // Farola
      const lx = x + bw;
      px(lx, ground - 22, IRON, 1, 22);
      px(lx - 1, ground - 25, IRON, 3, 3);
      px(lx, ground - 24, "#ffe9a8");
      px(lx - 3, ground - 27, "#ffcd7522", 7, 7);

      x += bw;
    }

    // Calle adoquinada con reflejos
    px(0, ground, "#241d3d", W, 6);
    for (let x = 0; x < W; x += 4) px(x + (x % 8 ? 2 : 0), ground + 2, "#2f2750", 2, 1);
    for (let i = 0; i < W / 6; i++) px(r.int(0, W), ground + r.int(1, 5), r.pick(["#ffc85a55", "#ff4fa355", "#4fe3ff44"]), r.int(2, 5), 1);
  }

  let t;
  addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 120); });
  draw();
})();
