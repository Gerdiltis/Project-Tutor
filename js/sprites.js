// Sprites pixel art 12x12 dibujados como texto. Cada carácter es un color de la paleta.
(function () {
  const PAL = {
    k: "#1a1c2c", w: "#f4f4f4", g: "#94b0c2", G: "#566c86", r: "#b13e53",
    o: "#ef7d57", y: "#ffcd75", l: "#a7f070", e: "#38b764", E: "#257179",
    b: "#41a6f6", B: "#3b5dc9", p: "#5d275d", n: "#8b5a2b", s: "#f2c6a0", c: "#73eff7"
  };

  const S = {
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
    hero: [
      "...kkkkkk...",
      "..knnnnnnk..",
      "..kskssksk..",
      "..kssssssk..",
      "...kssssk...",
      "..kbbbbbbk..",
      ".kbbwbbbbbk.",
      ".ksbbbbbbsk.",
      "..kbbbbbbk..",
      "..kBBkkBBk..",
      "..kBk..kBk..",
      "..kkk..kkk.."
    ],
    mentor: [
      ".....kk.....",
      "....kppk....",
      "...kppypk...",
      "..kppppppk..",
      ".kkkkkkkkkk.",
      "..kssssssk..",
      "..kskssksk..",
      "..kwwwwwwk..",
      ".kpwwwwwwpk.",
      ".kppwwwwppk.",
      ".kppppppppk.",
      ".kkkkkkkkkk."
    ],
    boss: [
      "..kkkkkkkk..",
      ".krrrrrrrrk.",
      "krrwwrrwwrrk",
      "krrwkrrwkrrk",
      "krrrrrrrrrrk",
      "krrkkkkkkrrk",
      "krrkwkkwkrrk",
      ".krrrrrrrrk.",
      "..kGGGGGGk..",
      ".kGGkGGkGGk.",
      ".kGGGGGGGGk.",
      "..kk....kk.."
    ],
    heart: [
      "............",
      ".kkk...kkk..",
      "krrrk.krrrk.",
      "krwrrkrrrrk.",
      "krrrrrrrrrk.",
      "krrrrrrrrrk.",
      ".krrrrrrrk..",
      "..krrrrrk...",
      "...krrrk....",
      "....krk.....",
      ".....k......",
      "............"
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
  function url(name) {
    if (cache[name]) return cache[name];
    const rows = S[name];
    const c = document.createElement("canvas");
    c.width = 12; c.height = 12;
    const ctx = c.getContext("2d");
    rows.forEach((row, y) => {
      for (let x = 0; x < 12; x++) {
        const col = PAL[row[x]];
        if (col) { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); }
      }
    });
    cache[name] = c.toDataURL();
    return cache[name];
  }

  window.Sprites = {
    html: (name, size = 48, extra = "") =>
      `<img class="sprite ${extra}" src="${url(name)}" width="${size}" height="${size}" alt="" aria-hidden="true">`
  };
})();
