// Construye las preguntas de cada mundo: mezcla preguntas del banco (con variables
// del proyecto) y preguntas calculadas con los datos numéricos de la partida.
(function () {
  const eur = (n) => Math.round(n).toLocaleString("es-ES") + " €";
  const dec = (n, d = 2) => n.toFixed(d).replace(".", ",");

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  // Completa con distractores únicos si alguno coincide con la respuesta correcta.
  function uniq(ok, ko, jitter) {
    const out = [];
    ko.forEach(k => { if (k !== ok && !out.includes(k)) out.push(k); });
    let i = 1;
    while (out.length < 3) {
      const k = jitter(i++);
      if (k !== ok && !out.includes(k)) out.push(k);
    }
    return out.slice(0, 3);
  }

  function evm(p, r) {
    const bac = p.budget;
    const pv = Math.round(bac * r.int(30, 60) / 100 / 1000) * 1000;
    const ev = Math.round(pv * r.int(75, 110) / 100 / 1000) * 1000;
    let ac = Math.round(ev * r.int(85, 125) / 100 / 1000) * 1000;
    if (ac === ev) ac += 5000;
    return { bac, pv, ev, ac, cpi: ev / ac, spi: ev / pv };
  }

  const DYNAMIC = {
    finanzas: [
      (p, r, m) => {
        const cpiMode = r.next() < 0.5;
        const v = cpiMode ? m.cpi : m.spi;
        const good = v >= 1;
        const meaning = cpiMode
          ? (good ? "el trabajo cuesta menos de lo previsto (ahorro)" : "el trabajo cuesta más de lo previsto (sobrecoste)")
          : (good ? "va adelantado respecto al plan" : "va retrasado respecto al plan");
        const wrongMeaning = cpiMode
          ? (good ? "el trabajo cuesta más de lo previsto (sobrecoste)" : "el trabajo cuesta menos de lo previsto (ahorro)")
          : (good ? "va retrasado respecto al plan" : "va adelantado respecto al plan");
        const label = cpiMode ? "CPI" : "SPI";
        const ok = `${label} = ${dec(v)}: ${meaning}`;
        const inv = 1 / v;
        return {
          q: `Informe de valor ganado de {{proyecto}}: PV = ${eur(m.pv)}, EV = ${eur(m.ev)}, AC = ${eur(m.ac)}. ¿Cuál es el ${label} y qué indica?`,
          ok,
          ko: uniq(ok, [
            `${label} = ${dec(v)}: ${wrongMeaning}`,
            `${label} = ${dec(inv)}: ${inv >= 1 ? (cpiMode ? "el trabajo cuesta menos de lo previsto (ahorro)" : "va adelantado respecto al plan") : (cpiMode ? "el trabajo cuesta más de lo previsto (sobrecoste)" : "va retrasado respecto al plan")}`,
            `${label} = ${dec(cpiMode ? m.spi : m.cpi)}: ${meaning}`
          ], i => `${label} = ${dec(v + i * 0.13)}: ${wrongMeaning}`),
          e: cpiMode
            ? `CPI = EV / AC = ${eur(m.ev)} / ${eur(m.ac)} = ${dec(m.cpi)}. Por debajo de 1 hay sobrecoste; por encima, ahorro.`
            : `SPI = EV / PV = ${eur(m.ev)} / ${eur(m.pv)} = ${dec(m.spi)}. Por debajo de 1 vas retrasado; por encima, adelantado.`
        };
      },
      (p, r, m) => {
        const cpi = Math.round(m.cpi * 100) / 100;
        const eac = m.bac / cpi;
        const ok = eur(eac);
        return {
          q: `Presupuesto total (BAC) de {{proyecto}}: ${eur(m.bac)}. A día de hoy EV = ${eur(m.ev)} y AC = ${eur(m.ac)}. Si el rendimiento de costes actual se mantiene, ¿cuál es la estimación a la conclusión (EAC)?`,
          ok,
          ko: uniq(ok, [eur(m.bac * cpi), eur(m.bac / m.spi), eur(m.bac)], i => eur(eac * (1 + i * 0.07))),
          e: `CPI = EV / AC = ${dec(cpi)}. EAC = BAC / CPI = ${eur(m.bac)} / ${dec(cpi)} ≈ ${ok}. Si es mayor que el BAC, habrá que avisar a {{sponsor}} y usar reservas o replanificar.`
        };
      }
    ],
    cronograma: [
      (p, r) => {
        const a = r.int(2, 6), d = r.int(2, 6);
        const b = r.int(2, 9);
        let c = r.int(2, 9);
        if (c === b) c = b + r.int(1, 3);
        const crit = b > c ? "A-B-D" : "A-C-D";
        const other = b > c ? "A-C-D" : "A-B-D";
        const dur = a + Math.max(b, c) + d;
        const ok = `${dur} semanas (ruta ${crit})`;
        return {
          q: `Red de {{proyecto}}: A (${a} sem.) va primero; B (${b} sem.) y C (${c} sem.) empiezan tras A en paralelo; D (${d} sem.) empieza cuando acaban B y C. ¿Duración mínima y ruta crítica?`,
          ok,
          ko: uniq(ok, [`${a + b + c + d} semanas (ruta A-B-C-D)`, `${a + Math.min(b, c) + d} semanas (ruta ${other})`, `${dur} semanas (ruta ${other})`], i => `${dur + i} semanas (ruta ${crit})`),
          e: `Ruta A-B-D = ${a + b + d} sem.; ruta A-C-D = ${a + c + d} sem. La más larga (${crit}) es la crítica y fija la duración: ${dur} semanas.`
        };
      },
      (p, r) => {
        const o = r.int(2, 5), mo = o + r.int(1, 3), pe = mo + r.int(4, 9);
        const e = (o + 4 * mo + pe) / 6;
        const ok = `${dec(e, 1)} semanas`;
        return {
          q: `Para '{{entregable1}}' el equipo estima: optimista ${o}, más probable ${mo} y pesimista ${pe} semanas. ¿Duración esperada según PERT (beta)?`,
          ok,
          ko: uniq(ok, [`${dec((o + mo + pe) / 3, 1)} semanas`, `${dec(mo, 1)} semanas`, `${dec((o + pe) / 2, 1)} semanas`], i => `${dec(e + i * 0.5, 1)} semanas`),
          e: `PERT = (O + 4M + P) / 6 = (${o} + 4×${mo} + ${pe}) / 6 = ${dec(e, 1)}. PERT pondera 4 veces el valor más probable; la media triangular (O+M+P)/3 no lo hace.`
        };
      }
    ],
    interesados: [
      (p, r) => {
        const s = r.pick(p.stakeholders);
        const map = {
          "alto-alto": "Gestionar de cerca (involucrar activamente)",
          "alto-bajo": "Mantener satisfecho",
          "bajo-alto": "Mantener informado",
          "bajo-bajo": "Monitorear con el mínimo esfuerzo"
        };
        const key = `${s.power}-${s.interest}`;
        return {
          q: `${s.name} (${s.role}) tiene poder ${s.power} e interés ${s.interest} en {{proyecto}}. Según la matriz poder/interés, ¿qué estrategia aplicas?`,
          ok: map[key],
          ko: Object.keys(map).filter(k => k !== key).map(k => map[k]),
          e: "Poder alto + interés alto: gestionar de cerca. Poder alto + interés bajo: mantener satisfecho. Poder bajo + interés alto: mantener informado. Ambos bajos: monitorear."
        };
      },
      (p) => {
        const n = p.team + 1;
        const ch = n * (n - 1) / 2;
        const ok = `${ch} canales`;
        return {
          q: `El equipo de {{proyecto}} tiene {{equipo}} personas, más tú como jefa de proyecto. ¿Cuántos canales de comunicación potenciales hay?`,
          ok,
          ko: uniq(ok, [`${n * (n - 1)} canales`, `${n} canales`, `${(n + 1) * n / 2} canales`], i => `${ch + i * 3} canales`),
          e: `Canales = n(n-1)/2 con n = ${n} personas → ${n}×${n - 1}/2 = ${ch}. Cada persona nueva aumenta mucho la complejidad de la comunicación.`
        };
      }
    ],
    riesgos: [
      (p) => {
        const t = p.risks[0], o = p.opportunity;
        const emv = -t.prob / 100 * t.impact + o.prob / 100 * o.impact;
        const fmt = (v) => (v > 0 ? "+" : "") + eur(v);
        const ok = fmt(emv);
        return {
          q: `Amenaza '${t.desc}': probabilidad ${t.prob}%, impacto −${eur(t.impact)}. Oportunidad '${o.desc}': probabilidad ${o.prob}%, impacto +${eur(o.impact)}. ¿Cuál es el valor monetario esperado (EMV) combinado?`,
          ok,
          ko: uniq(ok, [fmt(-t.prob / 100 * t.impact - o.prob / 100 * o.impact), fmt(-t.impact + o.impact), fmt(-t.prob / 100 * t.impact)], i => fmt(emv - i * 1500)),
          e: `EMV = Σ(probabilidad × impacto) = −${t.prob}% × ${eur(t.impact)} + ${o.prob}% × ${eur(o.impact)} = ${ok}. Las amenazas restan y las oportunidades suman.`
        };
      }
    ]
  };

  function vars(p, player) {
    return {
      proyecto: p.name, cliente: p.client, sponsor: p.sponsor, pm: player,
      presupuesto: eur(p.budget), duracion: `${p.months} meses`, equipo: String(p.team),
      entregable1: p.deliverables[0], entregable2: p.deliverables[1], entregable3: p.deliverables[2],
      interesado1: p.stakeholders[0].name, rol1: p.stakeholders[0].role,
      interesado2: p.stakeholders[1].name, rol2: p.stakeholders[1].role,
      riesgo1: p.risks[0].desc, riesgo2: p.risks[1].desc,
      oportunidad: p.opportunity.desc, sostenibilidad: p.sustainability
    };
  }

  window.Questions = {
    count: (zoneId) => (zoneId === "principios" ? 6 : 4),
    build(zoneId, project, player) {
      const r = RNG((project.seed ^ hash(zoneId)) >>> 0);
      const v = vars(project, player);
      const fill = (s) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in v ? v[k] : k));
      const m = evm(project, r);
      const dyn = (DYNAMIC[zoneId] || []).map(f => f(project, r, m));
      const n = this.count(zoneId);
      const bank = r.sample(PMBOK.questions[zoneId], Math.max(0, n - dyn.length));
      return r.shuffle(dyn.concat(bank)).map(q => {
        const opts = r.shuffle([q.ok].concat(q.ko));
        return { q: fill(q.q), options: opts.map(fill), answer: opts.indexOf(q.ok), e: fill(q.e) };
      });
    }
  };
})();
