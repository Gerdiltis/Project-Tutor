// Sprites pixel art dibujados como texto. Cada carácter es un color de la paleta.
(function () {
  const PAL = {
    k: "#1a1c2c", w: "#f4f4f4", g: "#94b0c2", G: "#566c86", r: "#b13e53",
    o: "#ef7d57", y: "#ffcd75", l: "#a7f070", e: "#38b764", E: "#257179",
    b: "#41a6f6", B: "#3b5dc9", p: "#5d275d", n: "#8b5a2b", s: "#f2c6a0", c: "#73eff7",
    S: "#d9a27c", x: "#1a1c2c", h: "#3b2219", H: "#22130d", j: "#2b3f8f", J: "#1d2b63",
    t: "#3a3f55", q: "#2a2238", P: "#120c1c", f: "#2a2238", v: "#7d2a4a", d: "#2a2238", K: "#120c1c"
  };

  // Variantes de la jefa de proyecto (pelo, piel, blazer)
  const VARIANTS = {
    0: { h: "#3b2219", H: "#22130d", s: "#f2c6a0", S: "#d9a27c", j: "#2b3f8f", J: "#1d2b63" },
    1: { h: "#15131c", H: "#0a090e", s: "#8d5a3b", S: "#6e4329", j: "#b0306a", J: "#7d1f4b" },
    2: { h: "#c45a2a", H: "#8f3d19", s: "#f5d0b5", S: "#e0ad8a", j: "#1f8a7a", J: "#14605a" }
  };

  const S = {
    jefa: [
      "......kkkk......",
      ".....khhhhk.....",
      ".....kHhhhk.....",
      "....kkkhhkkk....",
      "...khhhhhhhhk...",
      "..khhhhhhhhhhk..",
      "..khhsssssshhk..",
      "..khsssssssshk..",
      "..khssxssxsshk..",
      "..khsssssssshk..",
      "..khsssrrssshk..",
      "..khhsssssshhk..",
      "..khhkSSSSkhhk..",
      ".kjjjjwwwwjjjjk.",
      "kjjjjjwyywjjjjjk",
      "kjJjjjwwywjjjJjk",
      "kjJjjjjwwjjjjJjk",
      "kjJjjjjjjtttttk.",
      "kjJjjjjjjtccctk.",
      "kjJjjjjjstccctk.",
      ".ksjjjjjjtttttk.",
      "...kJJJJJJJJk...",
      "...kqqqqqqqqk...",
      "...kqqqkkqqqk...",
      "...kqqk..kqqk...",
      "...kssk..kssk...",
      "...kPPk..kPPk...",
      "..kkPPk..kPPkk.."
    ],
    mentor: [
      "................",
      ".....kkkkkk.....",
      "....kffffffk....",
      "....kyyyyyyk....",
      "..kkffffffffkk..",
      "...kssssssssk...",
      "...kssxssxssk...",
      "...kssssssssk...",
      "...kgssssssgk...",
      "...kgggkkgggk...",
      "....kggggggk....",
      ".....kssssk.....",
      "..kkvvwwwwvvkk..",
      ".kvvvvwrrwvvvvk.",
      ".kvvvvwrrwvvvvk.",
      ".kvvvvvrrvvvvvk.",
      ".kvvvvvvvvvvvvk.",
      ".ksyyyyyyyyyyyyy",
      ".kvvvvvvvvvvyyyy",
      ".kvvvvvvvvvvvvk.",
      "..kddddddddddk..",
      "..kddddkkddddk..",
      "..kdddk..kdddk..",
      "..kdddk..kdddk..",
      "..kdddk..kdddk..",
      "..kdddk..kdddk..",
      "..kKKKk..kKKKk..",
      ".kkKKKk..kKKKkk."
    ],
    boss: [
      "................",
      "....kkkkkkkk....",
      "...kHHHHHHHHk...",
      "...kHHHHHHHHk...",
      "...kHssssssHk...",
      "...kssssssssk...",
      "...kkkkkkkkkk...",
      "...kwxksskxwk...",
      "...kssssssssk...",
      "...ksskkkkssk...",
      "....kssssssk....",
      ".....kSSSSk.....",
      "..kkGGwrrwGGkk..",
      ".kGGGGwrrwGGGGk.",
      ".kGGGGGrrGGGGGk.",
      ".kGgGGGrrGGGgGk.",
      ".kGgGGGGGGGGgGk.",
      ".kGgGGGGGGGGgGk.",
      ".ksGGGGGGGGkrrrk",
      ".kGGGGGGGGGkrwrk",
      "..kGGGGGGGGkrrrk",
      "..kGGGGkkGGGGk..",
      "..kGGGk..kGGGk..",
      "..kGGGk..kGGGk..",
      "..kGGGk..kGGGk..",
      "..kGGGk..kGGGk..",
      "..kkkkk..kkkkk..",
      ".kkkkkk..kkkkkk."
    ],
    castle: [
      "k.k.k..k.k.k",
      "kkkkk..kkkkk",
      "kgggk..kgggk",
      "kgggkkkkgggk",
      "kggggggggggk",
      "kgBggggggBgk",
      "kgBggggggBgk",
      "kggggggggggk",
      "kgggkkkkgggk",
      "kgggknnkgggk",
      "kgggknnkgggk",
      "kkkkkkkkkkkk"
    ],
    tree: [
      "....kkkk....",
      "..kkeeeekk..",
      ".keeleeeeek.",
      ".keeeeeleek.",
      "keleeeeeeeek",
      "keeeeeleeeek",
      ".keeeeeeeek.",
      "..kkeeeekk..",
      "....knnk....",
      "....knnk....",
      "...knnnnk...",
      "..kkkkkkkk.."
    ],
    clock: [
      "...kkkkkk...",
      "..kyyyyyyk..",
      ".kywwkwwwyk.",
      "kywwwkwwwwyk",
      "kywwwkwwwwyk",
      "kywwwkkkkwyk",
      "kywwwwwwwwyk",
      "kywwwwwwwwyk",
      ".kywwwwwwyk.",
      "..kyyyyyyk..",
      "...kkkkkk...",
      "............"
    ],
    coin: [
      "...kkkkkk...",
      "..kyyyyyyk..",
      ".kywyyyyyok.",
      "kywyyooyyyok",
      "kyyyoyyyyyok",
      "kyyyooooyyok",
      "kyyyoyyyyyok",
      "kyyyooooyyok",
      "kyyyoyyoyyok",
      ".kyyyooyyok.",
      "..koooooook.",
      "...kkkkkk..."
    ],
    people: [
      "..kk....kk..",
      ".knnk..kyyk.",
      ".kssk..kssk.",
      ".kssk..kssk.",
      "..kk....kk..",
      ".kbbk..krrk.",
      "kbbbbkkrrrrk",
      "kbbbbkkrrrrk",
      "kbbbbkkrrrrk",
      ".kBBk..kppk.",
      ".kBBk..kppk.",
      ".kkkk..kkkk."
    ],
    anvil: [
      "............",
      ".kkkkkk.....",
      ".kGGGGGk....",
      ".kGggGGk....",
      ".kkkknkk....",
      "....knk.....",
      "....knk.....",
      "....knk.....",
      ".kkkkkkkkkk.",
      ".kGGgGGGGGk.",
      "...kGGGGk...",
      "..kkkkkkkk.."
    ],
    volcano: [
      ".....r......",
      "....oyr.....",
      "...r.o.r....",
      "....kkkk....",
      "...krrrrk...",
      "...knrrnk...",
      "..knnrnnnk..",
      "..knnnnnnk..",
      ".knnnnnnnnk.",
      ".knnnnnrnnk.",
      "knnnnnnnnnnk",
      "kkkkkkkkkkkk"
    ],
    temple: [
      "....kkkk....",
      "..kkyyyykk..",
      "kkyyyyyyyykk",
      "kkkkkkkkkkkk",
      ".kwk.kwk.kwk",
      ".kwk.kwk.kwk",
      ".kwk.kwk.kwk",
      ".kwk.kwk.kwk",
      ".kwk.kwk.kwk",
      "kkkkkkkkkkkk",
      "kggggggggggk",
      "kkkkkkkkkkkk"
    ],
    star: [
      ".....kk.....",
      ".....yk.....",
      "....kyyk....",
      "kkkkkyykkkkk",
      ".kyyyyyyyyk.",
      "..kyyyyyyk..",
      "...kyyyyk...",
      "..kyyykyyk..",
      "..kyk..kyk..",
      ".kk......kk.",
      "............",
      "............"
    ],
    house: [
      "............",
      ".....kk.....",
      "....kJJk....",
      "...kJJJJk...",
      "..kJJJJJJk..",
      ".kJJJJJJJJk.",
      "kkkkkkkkkkkk",
      ".kjjjjjjjjk.",
      ".kjyjjjkkjk.",
      ".kjjjjjkkjk.",
      ".kjjjjjkkjk.",
      ".kkkkkkkkkk."
    ],
    robber: [
      "....kkkk....",
      "...kGGGGk...",
      "...kGggGk...",
      "...kGGGGk...",
      "....kGGk....",
      "...kGGGGk...",
      "..kGGGGGGk..",
      "..kGGgGGGk..",
      ".kGGGGGGGGk.",
      ".kGGGGGGGGk.",
      "kGGGGGGGGGGk",
      "kkkkkkkkkkkk"
    ],
    lock: [
      "....kkkk....",
      "...kGGGGk...",
      "..kGk..kGk..",
      "..kGk..kGk..",
      ".kkkkkkkkkk.",
      ".kyyyyyyyyk.",
      ".kyyykkyyyk.",
      ".kyyykkyyyk.",
      ".kyyyykyyyk.",
      ".kyyyyyyyyk.",
      ".kkkkkkkkkk.",
      "............"
    ]
  };

  const cache = {};
  function url(name, variant) {
    const key = name + ":" + variant;
    if (cache[key]) return cache[key];
    const rows = S[name];
    const w = rows[0].length, h = rows.length;
    const pal = Object.assign({}, PAL, VARIANTS[variant] || {});
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    rows.forEach((row, y) => {
      for (let x = 0; x < w; x++) {
        const col = pal[row[x]];
        if (col) { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); }
      }
    });
    cache[key] = c.toDataURL();
    return cache[key];
  }

  window.Sprites = {
    variants: Object.keys(VARIANTS).length,
    // size = alto en píxeles de pantalla; el ancho se calcula con la proporción del sprite
    html(name, size = 48, extra = "", variant = 0) {
      const rows = S[name];
      const width = Math.round(size * rows[0].length / rows.length);
      return `<img class="sprite ${extra}" src="${url(name, variant)}" width="${width}" height="${size}" alt="" aria-hidden="true">`;
    }
  };
})();
