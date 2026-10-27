(function () {
  const SAVE_KEY = "pt_save_v1";
  const REC_KEY = "pt_records_v1";
  const NAME_KEY = "pt_name";
  const HINTS = 3;
  const LETTERS = ["A", "B", "C", "D"];
  const WORLDS = PMBOK.domains;
  const FINALE = PMBOK.finale;
  const RANKS = [
    [0.9, "Leyenda del PMO"],
    [0.75, "Senior Project Manager"],
    [0.6, "Project Manager"],
    [0.4, "Coordinadora de proyectos"],
    [0, "Aprendiz de proyectos"]
  ];

  let S = null;
  let screen = "title";
  const app = document.getElementById("app");

  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const eur = (n) => Math.round(n).toLocaleString("es-ES") + " €";
  const zoneById = (id) => (id === FINALE.id ? FINALE : WORLDS.find(w => w.id === id));
  const doneCount = () => WORLDS.filter(w => S.zones[w.id].done).length;

  function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function save() { write(SAVE_KEY, S); }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  function show(name, html, focusSel) {
    screen = name;
    app.innerHTML = html;
    window.scrollTo(0, 0);
    const f = app.querySelector(focusSel || "[data-autofocus]") || app.querySelector("button, input, select");
    if (f) f.focus({ preventScroll: true });
  }

  function on(sel, fn) {
    app.querySelectorAll(sel).forEach(el => el.addEventListener("click", (ev) => { Sfx.play("click"); fn(ev, el); }));
  }

  function stars(n, size = 20) {
    let h = "";
    for (let i = 0; i < 3; i++) h += Sprites.html("star", size, i < n ? "" : "dim");
    return `<span class="stars" aria-label="${n} de 3 estrellas">${h}</span>`;
  }

  function hud() {
    const hints = Array.from({ length: HINTS }, (_, i) => `<span class="gem ${i < S.hints ? "" : "off"}"></span>`).join("");
    return `<header class="hud">
      <span class="hud-player">${Sprites.html("jefa", 40, "", S.avatar || 0)} ${esc(S.player)}</span>
      <span>PUNTOS <b>${S.score}</b></span>
      <span>RACHA <b>x${S.streak}</b></span>
      <span class="hud-hints" title="Pistas disponibles">PISTAS ${hints}</span>
    </header>`;
  }

  // ---------- Pantalla de título ----------
  function renderTitle() {
    const saved = read(SAVE_KEY);
    const lastName = read(NAME_KEY) || "";
    let avatar = Number(read("pt_avatar")) || 0;
    const options = SECTORS.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
    const avatars = Array.from({ length: Sprites.variants }, (_, i) =>
      `<button type="button" class="avatar ${i === avatar ? "on" : ""}" data-v="${i}" aria-pressed="${i === avatar}" aria-label="Jefa de proyecto ${i + 1}">${Sprites.html("jefa", 112, "", i)}</button>`).join("");
    show("title", `
      <section class="screen title-screen">
        <h1 class="logo neon-sign"><span>PROJECT</span><span>TUTOR</span></h1>
        <p class="tagline neon-text">La aventura del PMBOK® 8</p>
        <form class="panel form" id="start-form" autocomplete="off">
          <fieldset class="avatars">
            <legend>Elige a tu jefa de proyecto</legend>
            ${avatars}
          </fieldset>
          <label>Nombre de la jefa de proyecto
            <input id="name" maxlength="16" required value="${esc(lastName)}" placeholder="Escribe un nombre">
          </label>
          <label>Sector del proyecto
            <select id="sector"><option value="random">Aleatorio</option>${options}</select>
          </label>
          ${Generator.aiAvailable() ? `<label class="check"><input type="checkbox" id="ai" checked> Escenario generado con IA</label>` : ""}
          <button class="btn primary" type="submit" data-autofocus>▶ NUEVA PARTIDA</button>
          ${saved && !saved.finished ? `<button class="btn" type="button" id="continue">CONTINUAR (${esc(saved.player)})</button>` : ""}
          <div class="row">
            <button class="btn small" type="button" id="howto">CÓMO JUGAR</button>
            <button class="btn small" type="button" id="records">RÉCORDS</button>
          </div>
        </form>
        <p class="disclaimer">Juego educativo basado en la estructura del PMBOK® Guide 8ª ed. PMBOK es marca registrada del Project Management Institute. Contrasta siempre con la guía oficial.</p>
      </section>`, lastName ? "[data-autofocus]" : "#name");

    app.querySelector("#start-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const name = app.querySelector("#name").value.trim() || "PM";
      let sectorId = app.querySelector("#sector").value;
      if (sectorId === "random") sectorId = SECTORS[Math.floor(Math.random() * SECTORS.length)].id;
      const ai = app.querySelector("#ai");
      newGame(name, sectorId, ai ? ai.checked : false, avatar);
    });
    on(".avatar", (ev, el) => {
      avatar = Number(el.dataset.v);
      write("pt_avatar", avatar);
      app.querySelectorAll(".avatar").forEach(b => {
        const sel = b === el;
        b.classList.toggle("on", sel);
        b.setAttribute("aria-pressed", sel);
      });
    });
    on("#continue", () => {
      S = saved;
      if (!S.current) renderMap();
      else if (S.current.slot == null && !S.current.answered) renderBoard();
      else renderQuestion();
    });
    on("#howto", renderHowTo);
    on("#records", renderRecords);
  }

  async function newGame(player, sectorId, useAI, avatar) {
    write(NAME_KEY, player);
    Sfx.play("start");
    show("loading", `<section class="screen center"><div class="panel result">${Sprites.html("mentor", 112, "bob")}<p class="blink">GENERANDO TU PROYECTO...</p></div></section>`);
    const seed = Math.floor(Math.random() * 2 ** 31);
    const project = await Generator.create(sectorId, seed, useAI);
    const zones = {};
    WORLDS.concat(FINALE).forEach(z => { zones[z.id] = { done: false, correct: 0, total: 0, stars: 0, score: 0 }; });
    S = { v: 1, player, avatar, project, zones, current: null, score: 0, hints: HINTS, streak: 0, bestStreak: 0, finished: false };
    save();
    renderBriefing(true);
  }

  // ---------- Acta del proyecto ----------
  function charterHTML(p) {
    const li = (arr) => arr.map(x => `<li>${esc(x)}</li>`).join("");
    return `
      <dl class="charter">
        <dt>Proyecto</dt><dd><b>${esc(p.name)}</b></dd>
        <dt>Sector</dt><dd>${esc(p.sectorName)}</dd>
        <dt>Cliente</dt><dd>${esc(p.client)}</dd>
        <dt>Patrocinador/a</dt><dd>${esc(p.sponsor)}</dd>
        <dt>Jefa de proyecto</dt><dd>${esc(S.player)} (¡tú!)</dd>
        <dt>Objetivo</dt><dd>${esc(p.objective)}</dd>
        <dt>Presupuesto</dt><dd>${eur(p.budget)}</dd>
        <dt>Duración</dt><dd>${p.months} meses</dd>
        <dt>Equipo</dt><dd>${p.team} personas</dd>
        <dt>Enfoque sugerido</dt><dd>${esc(p.approach)}</dd>
      </dl>
      <h3>Entregables</h3><ul>${li(p.deliverables)}</ul>
      <h3>Interesados clave</h3>
      <ul>${p.stakeholders.map(s => `<li>${esc(s.name)} — ${esc(s.role)} <small>(poder ${s.power}, interés ${s.interest})</small></li>`).join("")}</ul>
      <h3>Riesgos identificados</h3>
      <ul>${p.risks.map(r => `<li>${esc(r.desc)} <small>(${r.prob}% · −${eur(r.impact)})</small></li>`).join("")}
      <li class="opp">Oportunidad: ${esc(p.opportunity.desc)} <small>(${p.opportunity.prob}% · +${eur(p.opportunity.impact)})</small></li></ul>
      <h3>Restricciones</h3><ul>${li(p.constraints)}</ul>
      <h3>Sostenibilidad</h3><p>${esc(p.sustainability)}</p>`;
  }

  function renderBriefing(first) {
    const p = S.project;
    show("briefing", `
      <section class="screen">
        ${hud()}
        <div class="panel parchment">
          <h2>ACTA DE CONSTITUCIÓN</h2>
          ${p.aiError ? `<p class="note">La IA no respondió: se ha generado un escenario procedural.</p>` : ""}
          ${p.ai ? `<p class="note">Escenario generado con IA.</p>` : ""}
          ${charterHTML(p)}
        </div>
        <div class="dialog">
          ${Sprites.html("mentor", 112)}
          <p>${first ? `¡Bienvenida, ${esc(S.player)}! ${esc(p.sponsor)} te ha nombrado jefa de este proyecto. Recorre los 7 mundos del PMBOK 8 y supera el Templo de los Principios.` : "Consulta el acta siempre que lo necesites: las preguntas usan estos datos."}</p>
        </div>
        <button class="btn primary" id="go" data-autofocus>${first ? "ACEPTAR LA MISIÓN ▶" : "VOLVER AL MAPA"}</button>
      </section>`);
    on("#go", renderMap);
  }

  // ---------- Mapa del mundo ----------
  function renderMap() {
    const done = doneCount();
    const building = (w, label, floors, status, cls, icon) => {
      const rows = Array.from({ length: floors }, () => `<span class="win-row"><i></i><i></i><i></i></span><span class="balcony"></span>`).join("");
      return `<span class="sign">${label ? `<span class="sign-n">${label}</span>` : ""}<span class="sign-t">${esc(w.name)}</span></span>
        <span class="facade">${rows}<span class="door">${Sprites.html(icon, 40)}</span></span>
        <span class="status">${status}</span>`;
    };
    const cards = WORLDS.map((w, i) => {
      const z = S.zones[w.id];
      const status = z.done ? `${stars(z.stars, 18)} <b>${z.correct}/${z.total}</b>` : "¡Entrar!";
      return `<button class="world ${z.done ? "done" : ""}" data-zone="${w.id}" style="--c:${w.color};--n:${w.neon}" ${z.done ? "disabled" : ""} aria-label="Mundo ${i + 1}: ${esc(w.name)}${z.done ? ", completado" : ""}">
        ${building(w, `MUNDO ${i + 1}`, 2 + (i % 3 === 1 ? 1 : 0), status, "", w.sprite)}
      </button>`;
    }).join("");
    const unlocked = done === WORLDS.length;
    const finaleStatus = unlocked ? "¡Enfréntate al Auditor!" : "Completa los 7 mundos";
    show("map", `
      <section class="screen">
        ${hud()}
        <h2 class="map-title neon-text">LA CALLE DEL PMBOK <small>${done}/${WORLDS.length} mundos completados</small></h2>
        <div class="progress"><span style="width:${(done / WORLDS.length) * 100}%"></span></div>
        <div class="worlds">${cards}</div>
        <div class="worlds finale-row">
          <button class="world finale ${unlocked ? "" : "locked"}" data-zone="${FINALE.id}" ${unlocked ? "" : "disabled"} style="--c:${FINALE.color};--n:${FINALE.neon}">
            ${building({ name: FINALE.world }, "DESAFÍO FINAL", 1, finaleStatus, "", unlocked ? FINALE.sprite : "lock")}
          </button>
        </div>
        <div class="row">
          <button class="btn small" id="charter">VER ACTA</button>
          <button class="btn small" id="menu">MENÚ</button>
        </div>
      </section>`, ".world:not([disabled])");
    on(".world", (ev, el) => enterZone(el.dataset.zone));
    on("#charter", () => renderBriefing(false));
    on("#menu", renderTitle);
  }

  function projectHook(id) {
    const p = S.project;
    switch (id) {
      case "gobernanza": return `Patrocinador/a: ${p.sponsor}. Enfoque sugerido: ${p.approach}.`;
      case "alcance": return `Entregables: ${p.deliverables.join(" · ")}.`;
      case "cronograma": return `Duración objetivo: ${p.months} meses.`;
      case "finanzas": return `Presupuesto (BAC): ${eur(p.budget)}.`;
      case "interesados": return `${p.stakeholders.length} interesados clave identificados en el acta.`;
      case "recursos": return `Equipo de ${p.team} personas.`;
      case "riesgos": return `Riesgo principal: ${p.risks[0].desc}.`;
      default: return "";
    }
  }

  // ---------- Introducción del mundo ----------
  function enterZone(id) {
    const z = zoneById(id);
    const boss = id === FINALE.id;
    show("intro", `
      <section class="screen">
        ${hud()}
        <h2 class="zone-title" style="--c:${z.color};--n:${z.neon}">${Sprites.html(z.sprite, 40)} ${esc(boss ? z.world : `${z.world}`)}</h2>
        <div class="dialog">
          ${Sprites.html(boss ? "boss" : "mentor", 112, "bob")}
          <div>
            ${boss ? "" : `<p class="label">DOMINIO DE DESEMPEÑO: ${esc(z.name.toUpperCase())}</p>`}
            <p>${esc(z.intro)}</p>
          </div>
        </div>
        ${z.outcomes.length ? `<div class="panel"><h3>Resultados que busca este dominio</h3><ul>${z.outcomes.map(o => `<li>${esc(o)}</li>`).join("")}</ul>
          <p class="hook">En tu proyecto: ${esc(projectHook(id))}</p></div>` : `<div class="panel"><h3>Los 6 principios</h3><ul>${PMBOK.principles.map(p => `<li><b>${esc(p.name)}</b>: ${esc(p.desc)}</li>`).join("")}</ul></div>`}
        <div class="row">
          <button class="btn primary" id="start" data-autofocus>${boss ? "¡LUCHAR! ⚔" : "EMPEZAR ▶"}</button>
          <button class="btn small" id="back">VOLVER</button>
        </div>
      </section>`);
    on("#start", () => {
      const questions = Questions.build(id, S.project, S.player);
      S.current = { zoneId: id, questions, i: 0, answered: false, chosen: -1, hinted: false, removed: [], pts: 0,
        board: Board.create(id, S.project.seed, questions.length), slot: null, results: {}, robber: null, lastSlot: null };
      save();
      renderBoard();
    });
    on("#back", renderMap);
  }

  // ---------- Tablero tipo Catan ----------
  function renderBoard() {
    const c = S.current;
    if (!c.board) c.board = Board.create(c.zoneId, S.project.seed, c.questions.length);
    if (!c.results) c.results = {};
    const z = zoneById(c.zoneId);
    const boss = c.zoneId === FINALE.id;
    const total = c.questions.length;
    const done = Object.keys(c.results).length;
    const built = Object.values(c.results).filter(Boolean).length;
    const complete = done >= total;
    const at = (idx, dx = 0) => { const p = Board.pos(c.board, idx); return `left:${p.left + dx}%;top:${p.top}%`; };
    const robberAt = c.robber != null ? c.robber : c.board.desert;

    const chips = c.board.qhex.map((idx, k) => {
      const n = c.board.nums[k];
      const res = c.results[idx];
      if (res === undefined) {
        return `<button class="chip ${n === 6 || n === 8 ? "hot" : ""}" data-slot="${idx}" style="${at(idx)}" aria-label="Ficha ${n}: responder una pregunta">${n}</button>`;
      }
      return res
        ? `<span class="piece" style="${at(idx)}" title="Poblado construido">${Sprites.html("house", 40, "", S.avatar || 0)}</span>`
        : idx === robberAt && !boss ? "" : `<span class="chip lost" style="${at(idx)}" title="Casilla perdida">✕</span>`;
    }).join("");
    const guard = boss
      ? `<span class="piece big" style="${at(c.board.desert)}">${Sprites.html("boss", 72, complete && built > total / 2 ? "defeated" : "bob")}</span>`
      : `<span class="piece" style="${at(robberAt, robberAt === c.lastSlot ? -3 : 0)}" title="El ladrón">${Sprites.html("robber", 40)}</span>`;
    const me = c.lastSlot != null ? `<span class="piece me" style="${at(c.lastSlot, 2)}">${Sprites.html("jefa", 64, "bob", S.avatar || 0)}</span>` : "";

    const msg = complete
      ? (built === total ? "¡Has construido un poblado en cada ficha! Mundo dominado." : `Has construido ${built} de ${total} poblados. Repasa las explicaciones y sigue adelante.`)
      : done === 0
        ? `Bienvenida al tablero de ${z.name}. Elige una ficha numerada: si aciertas, construyes un poblado; si fallas, el ladrón ocupa la casilla.`
        : "Elige la siguiente ficha.";

    show("board", `
      <section class="screen">
        ${hud()}
        <div class="qhead" style="--c:${z.color};--n:${z.neon}">
          <span>${Sprites.html(z.sprite, 28)} ${esc(boss ? "DESAFÍO FINAL" : z.world.toUpperCase())}</span>
          <span>POBLADOS ${built}/${total}</span>
        </div>
        ${boss ? `<div class="bossbar"><span>AUDITOR DEL PMO</span><div class="hp"><span style="width:${((total - built) / total) * 100}%"></span></div></div>` : ""}
        <div class="board-wrap">
          <div class="board" style="aspect-ratio:${Board.W}/${Board.H}">
            <canvas id="board-canvas" aria-label="Tablero hexagonal del mundo ${esc(z.name)}"></canvas>
            ${guard}${chips}${me}
          </div>
        </div>
        <div class="dialog">
          ${Sprites.html(boss ? "boss" : "mentor", 72)}
          <p>${esc(msg)}</p>
        </div>
        ${complete ? `<button class="btn primary" id="finish" data-autofocus>COMPLETAR MUNDO ▶</button>` : ""}
      </section>`, complete ? "#finish" : ".chip:not(.lost)");

    Board.draw(app.querySelector("#board-canvas"), c.board);
    on(".chip[data-slot]", (ev, el) => {
      c.slot = Number(el.dataset.slot);
      save();
      renderQuestion();
    });
    on("#finish", finishZone);
  }

  // ---------- Pregunta ----------
  function renderQuestion() {
    const c = S.current;
    const z = zoneById(c.zoneId);
    const boss = c.zoneId === FINALE.id;
    const q = c.questions[c.i];
    const total = c.questions.length;
    const zs = S.zones[c.zoneId];
    const hp = total - zs.correct;

    const opts = q.options.map((o, i) => {
      let cls = "opt";
      if (c.removed.includes(i)) cls += " removed";
      if (c.answered) {
        if (i === q.answer) cls += " right";
        else if (i === c.chosen) cls += " wrong";
      }
      const dis = c.answered || c.removed.includes(i) ? "disabled" : "";
      return `<button class="${cls}" data-i="${i}" ${dis}><span class="key">${LETTERS[i]}</span><span>${esc(o)}</span></button>`;
    }).join("");

    const ok = c.chosen === q.answer;
    const feedback = c.answered ? `
      <div class="feedback ${ok ? "good" : "bad"}" role="status">
        <p class="verdict">${ok ? `¡CORRECTO! +${c.pts} PUNTOS` : "¡INCORRECTO!"}</p>
        <p>${esc(q.e)}</p>
        <button class="btn primary" id="next" data-autofocus>VOLVER AL TABLERO ▶</button>
      </div>` : "";

    show("question", `
      <section class="screen">
        ${hud()}
        <div class="qhead" style="--c:${z.color};--n:${z.neon}">
          <span>${Sprites.html(z.sprite, 28)} ${esc(boss ? "DESAFÍO FINAL" : z.name.toUpperCase())}</span>
          <span>PREGUNTA ${c.i + 1}/${total}</span>
        </div>
        ${boss ? `<div class="bossbar"><span>AUDITOR DEL PMO</span><div class="hp"><span style="width:${(hp / total) * 100}%"></span></div></div>` : ""}
        <div class="dialog question">
          ${Sprites.html(boss ? "boss" : "mentor", 112, c.answered ? (ok && boss ? "shake" : "") : "bob")}
          <p>${esc(q.q)}</p>
        </div>
        <div class="options">${opts}</div>
        ${c.answered ? "" : `<button class="btn small hint" id="hint" ${S.hints > 0 && !c.hinted ? "" : "disabled"}>USAR PISTA 50/50 (${S.hints})</button>`}
        ${feedback}
      </section>`, c.answered ? "#next" : ".opt:not([disabled])");

    on(".opt", (ev, el) => answer(Number(el.dataset.i)));
    on("#hint", useHint);
    on("#next", next);
  }

  function answer(i) {
    const c = S.current;
    if (c.answered || c.removed.includes(i)) return;
    const q = c.questions[c.i];
    const z = S.zones[c.zoneId];
    c.answered = true;
    c.chosen = i;
    z.total++;
    if (c.slot != null) {
      if (!c.results) c.results = {};
      c.results[c.slot] = i === q.answer;
      if (i !== q.answer) c.robber = c.slot;
      c.lastSlot = c.slot;
    }
    if (i === q.answer) {
      S.streak++;
      S.bestStreak = Math.max(S.bestStreak, S.streak);
      let pts = 100 + Math.min(S.streak - 1, 5) * 20;
      if (c.hinted) pts = Math.round(pts / 2);
      c.pts = pts;
      z.correct++;
      z.score += pts;
      S.score += pts;
      Sfx.play(c.zoneId === FINALE.id ? "hit" : "ok");
    } else {
      S.streak = 0;
      c.pts = 0;
      Sfx.play("bad");
    }
    save();
    renderQuestion();
  }

  function useHint() {
    const c = S.current;
    if (S.hints <= 0 || c.hinted || c.answered) return;
    const q = c.questions[c.i];
    const wrong = q.options.map((_, i) => i).filter(i => i !== q.answer).sort(() => Math.random() - 0.5);
    c.removed = wrong.slice(0, 2);
    c.hinted = true;
    S.hints--;
    save();
    renderQuestion();
  }

  function next() {
    const c = S.current;
    if (!c.answered) return;
    if (c.i + 1 < c.questions.length) {
      Object.assign(c, { i: c.i + 1, answered: false, chosen: -1, hinted: false, removed: [], pts: 0, slot: null });
    } else {
      c.slot = null;
    }
    save();
    renderBoard();
  }

  function finishZone() {
    const id = S.current.zoneId;
    const z = S.zones[id];
    const ratio = z.correct / z.total;
    z.stars = ratio === 1 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;
    z.done = true;
    S.current = null;
    save();
    if (id === FINALE.id) return renderFinal();
    renderZoneEnd(id);
  }

  function renderZoneEnd(id) {
    const w = zoneById(id);
    const z = S.zones[id];
    Sfx.play(z.stars >= 2 ? "win" : "click");
    const left = WORLDS.length - doneCount();
    show("zoneEnd", `
      <section class="screen center">
        ${hud()}
        <div class="panel result">
          <div class="duo">${Sprites.html("jefa", 112, "bob", S.avatar || 0)}${Sprites.html(w.sprite, 56)}</div>
          <h2>¡MUNDO COMPLETADO!</h2>
          <p class="label">${esc(w.world.toUpperCase())}</p>
          ${stars(z.stars, 36)}
          <p>${z.correct} de ${z.total} correctas · +${z.score} puntos</p>
          ${z.stars < 3 ? `<p class="hook">Para repasar: ${esc(w.tip)}</p>` : `<p class="hook">¡Dominio perfecto!</p>`}
          <p>${left > 0 ? `Te quedan ${left} mundo${left > 1 ? "s" : ""}.` : "¡El Templo de los Principios se ha desbloqueado!"}</p>
          <button class="btn primary" id="map" data-autofocus>VOLVER AL MAPA ▶</button>
        </div>
      </section>`);
    on("#map", renderMap);
  }

  // ---------- Final ----------
  function renderFinal() {
    const all = WORLDS.concat(FINALE);
    const correct = all.reduce((a, w) => a + S.zones[w.id].correct, 0);
    const total = all.reduce((a, w) => a + S.zones[w.id].total, 0);
    const pct = total ? correct / total : 0;
    const rank = RANKS.find(r => pct >= r[0])[1];
    const weak = all.filter(w => S.zones[w.id].total && S.zones[w.id].correct / S.zones[w.id].total < 0.75);

    if (!S.finished) {
      S.finished = true;
      const recs = read(REC_KEY) || [];
      recs.push({ player: S.player, score: S.score, pct: Math.round(pct * 100), sector: S.project.sectorName, rank, date: new Date().toLocaleDateString("es-ES") });
      recs.sort((a, b) => b.score - a.score);
      write(REC_KEY, recs.slice(0, 10));
      clearSave();
    }
    Sfx.play("win");

    const bars = all.map(w => {
      const z = S.zones[w.id];
      const r = z.total ? z.correct / z.total : 0;
      return `<div class="bar-row"><span>${esc(w.name)}</span><div class="bar"><span style="width:${r * 100}%;background:${w.color}"></span></div><b>${z.correct}/${z.total}</b></div>`;
    }).join("");

    show("final", `
      <section class="screen">
        <div class="panel result">
          <div class="duo">${Sprites.html("jefa", 128, "bob", S.avatar || 0)}${Sprites.html("boss", 112, "defeated")}</div>
          <h2>¡PROYECTO CERRADO!</h2>
          <p class="big">${S.score} PUNTOS</p>
          <p>${correct} de ${total} correctas (${Math.round(pct * 100)}%) · Mejor racha: x${S.bestStreak}</p>
          <p class="rank">RANGO: ${esc(rank.toUpperCase())}</p>
        </div>
        <div class="panel"><h3>Tu dominio del PMBOK 8</h3>${bars}</div>
        ${weak.length ? `<div class="panel"><h3>Plan de estudio recomendado</h3><ul>${weak.map(w => `<li><b>${esc(w.name)}</b>: ${esc(w.tip)}</li>`).join("")}</ul></div>` : `<div class="panel"><p>¡Sin puntos débiles! Prueba otro sector para un nuevo reto.</p></div>`}
        <div class="row">
          <button class="btn primary" id="again" data-autofocus>NUEVA PARTIDA ▶</button>
          <button class="btn small" id="records">RÉCORDS</button>
        </div>
      </section>`);
    on("#again", renderTitle);
    on("#records", renderRecords);
  }

  function renderRecords() {
    const recs = read(REC_KEY) || [];
    const rows = recs.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.player)}</td><td>${r.score}</td><td>${r.pct}%</td><td>${esc(r.sector)}</td><td>${esc(r.date)}</td></tr>`).join("");
    show("records", `
      <section class="screen">
        <div class="panel">
          <h2>RÉCORDS</h2>
          ${recs.length ? `<div class="table-wrap"><table><thead><tr><th>#</th><th>PM</th><th>Puntos</th><th>Aciertos</th><th>Sector</th><th>Fecha</th></tr></thead><tbody>${rows}</tbody></table></div>` : "<p>Aún no hay récords en este navegador. ¡Juega una partida!</p>"}
        </div>
        <button class="btn primary" id="back" data-autofocus>VOLVER</button>
      </section>`);
    on("#back", renderTitle);
  }

  function renderHowTo() {
    show("howto", `
      <section class="screen">
        <div class="panel">
          <h2>CÓMO JUGAR</h2>
          <ol>
            <li>Elige tu nombre y un sector: se genera un proyecto distinto en cada partida.</li>
            <li>Lee el <b>acta de constitución</b>: las preguntas usan sus datos (presupuesto, riesgos, interesados...).</li>
            <li>Recorre los <b>7 mundos</b>, uno por cada dominio de desempeño del PMBOK 8, en el orden que quieras.</li>
            <li>Cada mundo es un <b>tablero hexagonal tipo Catan</b> con 4 fichas numeradas. Elige una ficha para responder su pregunta: si aciertas construyes un <b>poblado</b>; si fallas, el <b>ladrón</b> ocupa la casilla.</li>
            <li>Acierta seguido para sumar <b>racha</b> (hasta +100 por pregunta).</li>
            <li>Tienes <b>3 pistas 50/50</b> por partida; una respuesta con pista vale la mitad.</li>
            <li>Con los 7 mundos superados se abre el <b>Templo de los Principios</b>: derrota al Auditor del PMO.</li>
            <li>Al final verás tu rango y un plan de estudio con tus puntos débiles.</li>
          </ol>
          <p>Teclado: <b>1-4</b> o <b>A-D</b> para responder, <b>Enter</b> para continuar.</p>
        </div>
        <button class="btn primary" id="back" data-autofocus>VOLVER</button>
      </section>`);
    on("#back", renderTitle);
  }

  // ---------- Teclado y sonido ----------
  document.addEventListener("keydown", (ev) => {
    if (screen !== "question" || !S || !S.current) return;
    if (ev.target.tagName === "INPUT") return;
    const k = ev.key.toLowerCase();
    if (!S.current.answered) {
      const idx = ["1", "2", "3", "4"].indexOf(k) >= 0 ? Number(k) - 1 : ["a", "b", "c", "d"].indexOf(k);
      if (idx >= 0) { ev.preventDefault(); answer(idx); }
    } else if (k === "enter") {
      ev.preventDefault();
      next();
    }
  });

  const muteBtn = document.getElementById("mute");
  const syncMute = () => { muteBtn.classList.toggle("off", Sfx.muted); muteBtn.setAttribute("aria-label", Sfx.muted ? "Activar sonido" : "Silenciar sonido"); };
  muteBtn.addEventListener("click", () => { Sfx.toggle(); syncMute(); });
  syncMute();

  renderTitle();
})();
