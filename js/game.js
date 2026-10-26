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
    [0.4, "Coordinador/a de proyectos"],
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
      <span class="hud-player">${Sprites.html("hero", 28)} ${esc(S.player)}</span>
      <span>PUNTOS <b>${S.score}</b></span>
      <span>RACHA <b>x${S.streak}</b></span>
      <span class="hud-hints" title="Pistas disponibles">PISTAS ${hints}</span>
    </header>`;
  }

  // ---------- Pantalla de título ----------
  function renderTitle() {
    const saved = read(SAVE_KEY);
    const lastName = read(NAME_KEY) || "";
    const options = SECTORS.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
    show("title", `
      <section class="screen title-screen">
        <div class="title-sprites">${Sprites.html("castle", 48)}${Sprites.html("tree", 48)}${Sprites.html("clock", 48)}${Sprites.html("coin", 48)}${Sprites.html("people", 48)}${Sprites.html("anvil", 48)}${Sprites.html("volcano", 48)}</div>
        <h1 class="logo">PROJECT<br>TUTOR</h1>
        <p class="tagline">La aventura del PMBOK® 8</p>
        <div class="hero-row">${Sprites.html("hero", 72, "bob")}</div>
        <form class="panel form" id="start-form" autocomplete="off">
          <label>Tu nombre de Project Manager
            <input id="name" maxlength="16" required value="${esc(lastName)}" placeholder="Escribe tu nombre">
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
      newGame(name, sectorId, ai ? ai.checked : false);
    });
    on("#continue", () => { S = saved; S.current ? renderQuestion() : renderMap(); });
    on("#howto", renderHowTo);
    on("#records", renderRecords);
  }

  async function newGame(player, sectorId, useAI) {
    write(NAME_KEY, player);
    Sfx.play("start");
    show("loading", `<section class="screen center"><div class="panel">${Sprites.html("mentor", 64, "bob")}<p class="blink">GENERANDO TU PROYECTO...</p></div></section>`);
    const seed = Math.floor(Math.random() * 2 ** 31);
    const project = await Generator.create(sectorId, seed, useAI);
    const zones = {};
    WORLDS.concat(FINALE).forEach(z => { zones[z.id] = { done: false, correct: 0, total: 0, stars: 0, score: 0 }; });
    S = { v: 1, player, project, zones, current: null, score: 0, hints: HINTS, streak: 0, bestStreak: 0, finished: false };
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
        <dt>Director/a</dt><dd>${esc(S.player)} (¡tú!)</dd>
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
          ${Sprites.html("mentor", 56)}
          <p>${first ? `¡Bienvenido/a, ${esc(S.player)}! ${esc(p.sponsor)} te ha nombrado director/a de este proyecto. Recorre los 7 mundos del PMBOK 8 y supera el Templo de los Principios.` : "Consulta el acta siempre que lo necesites: las preguntas usan estos datos."}</p>
        </div>
        <button class="btn primary" id="go" data-autofocus>${first ? "ACEPTAR LA MISIÓN ▶" : "VOLVER AL MAPA"}</button>
      </section>`);
    on("#go", renderMap);
  }

  // ---------- Mapa del mundo ----------
  function renderMap() {
    const done = doneCount();
    const cards = WORLDS.map((w, i) => {
      const z = S.zones[w.id];
      return `<button class="world ${z.done ? "done" : ""}" data-zone="${w.id}" style="--c:${w.color}" ${z.done ? "disabled" : ""}>
        ${Sprites.html(w.sprite, 56)}
        <span class="world-n">MUNDO ${i + 1}</span>
        <span class="world-name">${esc(w.name)}</span>
        ${z.done ? stars(z.stars, 16) + `<span class="world-s">${z.correct}/${z.total}</span>` : `<span class="world-s">¡Explorar!</span>`}
      </button>`;
    }).join("");
    const unlocked = done === WORLDS.length;
    show("map", `
      <section class="screen">
        ${hud()}
        <h2 class="map-title">MAPA DEL MUNDO <small>${done}/${WORLDS.length} mundos</small></h2>
        <div class="progress"><span style="width:${(done / WORLDS.length) * 100}%"></span></div>
        <div class="worlds">${cards}
          <button class="world finale ${unlocked ? "" : "locked"}" data-zone="${FINALE.id}" ${unlocked ? "" : "disabled"} style="--c:${FINALE.color}">
            ${Sprites.html(unlocked ? FINALE.sprite : "lock", 56)}
            <span class="world-n">DESAFÍO FINAL</span>
            <span class="world-name">${esc(FINALE.world)}</span>
            <span class="world-s">${unlocked ? "¡Enfréntate al Auditor!" : "Completa los 7 mundos"}</span>
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
        <h2 class="zone-title" style="--c:${z.color}">${Sprites.html(z.sprite, 40)} ${esc(boss ? z.world : `${z.world}`)}</h2>
        <div class="dialog">
          ${Sprites.html(boss ? "boss" : "mentor", 64, "bob")}
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
      S.current = { zoneId: id, questions: Questions.build(id, S.project, S.player), i: 0, answered: false, chosen: -1, hinted: false, removed: [], pts: 0 };
      save();
      renderQuestion();
    });
    on("#back", renderMap);
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
        <button class="btn primary" id="next" data-autofocus>${c.i + 1 < total ? "SIGUIENTE ▶" : "TERMINAR ▶"}</button>
      </div>` : "";

    show("question", `
      <section class="screen">
        ${hud()}
        <div class="qhead" style="--c:${z.color}">
          <span>${Sprites.html(z.sprite, 28)} ${esc(boss ? "DESAFÍO FINAL" : z.name.toUpperCase())}</span>
          <span>PREGUNTA ${c.i + 1}/${total}</span>
        </div>
        ${boss ? `<div class="bossbar"><span>AUDITOR DEL PMO</span><div class="hp"><span style="width:${(hp / total) * 100}%"></span></div></div>` : ""}
        <div class="dialog question">
          ${Sprites.html(boss ? "boss" : "mentor", 64, c.answered ? (ok && boss ? "shake" : "") : "bob")}
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
      Object.assign(c, { i: c.i + 1, answered: false, chosen: -1, hinted: false, removed: [], pts: 0 });
      save();
      renderQuestion();
    } else {
      finishZone();
    }
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
          ${Sprites.html(w.sprite, 72)}
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
          ${Sprites.html("boss", 48, "defeated")}${Sprites.html("hero", 72, "bob")}
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
            <li>Cada mundo tiene 4 preguntas. Acierta seguido para sumar <b>racha</b> (hasta +100 por pregunta).</li>
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
