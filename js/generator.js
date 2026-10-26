// Genera el proyecto de cada partida. Por defecto 100% procedural (0 tokens).
// Si hay endpoint de IA configurado y el jugador lo activa, una sola llamada
// reescribe los textos del escenario; los números siguen siendo procedurales
// para que las preguntas calculadas (EVM, ruta crítica, EMV) sean coherentes.
(function () {
  const FIRST = ["Lucía", "Mateo", "Sofía", "Hugo", "Valeria", "Daniel", "Martina", "Pablo", "Julia", "Álex", "Noa", "Iker", "Carmen", "Andrés", "Irene", "Omar", "Nerea", "Samuel", "Aitana", "Leo"];
  const LAST = ["García", "Martín", "López", "Sánchez", "Romero", "Navarro", "Torres", "Ruiz", "Vidal", "Castro", "Ortega", "Delgado", "Molina", "Serrano", "Ibarra", "Prieto"];
  const CODENAMES = ["Fénix", "Atlas", "Orión", "Aurora", "Quimera", "Pegaso", "Nébula", "Titán", "Halcón", "Zafiro", "Brújula", "Faro"];
  const QUADRANTS = [
    { power: "alto", interest: "alto" },
    { power: "alto", interest: "bajo" },
    { power: "bajo", interest: "alto" },
    { power: "bajo", interest: "bajo" }
  ];

  const person = (r) => `${r.pick(FIRST)} ${r.pick(LAST)}`;
  const round = (n, step) => Math.round(n / step) * step;

  function procedural(sectorId, seed) {
    const r = RNG(seed);
    const sector = SECTORS.find(s => s.id === sectorId) || r.pick(SECTORS);
    const t = r.pick(sector.templates);
    const budget = round(r.int(sector.budget[0], sector.budget[1]), 10000);
    const quads = r.shuffle(QUADRANTS);
    const roles = r.sample(sector.roles, 4);
    const pct = () => r.int(2, 10) * 5;

    return {
      seed,
      sectorId: sector.id,
      sectorName: sector.name,
      name: `${t.name} · Proyecto ${r.pick(CODENAMES)}`,
      client: r.pick(sector.clients),
      sponsor: person(r),
      objective: t.objective,
      deliverables: t.deliverables.slice(),
      approach: t.approach,
      budget,
      months: r.int(sector.months[0], sector.months[1]),
      team: r.int(5, 12),
      stakeholders: roles.map((role, i) => ({ name: person(r), role, ...quads[i] })),
      risks: r.sample(sector.risks, 3).map(desc => ({ desc, prob: pct(), impact: round(budget * r.int(3, 15) / 100, 1000) })),
      opportunity: { desc: r.pick(sector.opportunities), prob: pct(), impact: round(budget * r.int(3, 10) / 100, 1000) },
      constraints: sector.constraints.slice(),
      sustainability: sector.sustainability,
      ai: false
    };
  }

  function clean(s, max = 140) {
    return typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, max) : "";
  }

  function mergeAI(p, ai) {
    const name = clean(ai.name, 90);
    if (name) p.name = name;
    if (clean(ai.client, 60)) p.client = clean(ai.client, 60);
    if (clean(ai.objective)) p.objective = clean(ai.objective);
    if (Array.isArray(ai.deliverables) && ai.deliverables.length >= 3) p.deliverables = ai.deliverables.slice(0, 3).map(d => clean(d, 80));
    if (Array.isArray(ai.stakeholder_roles)) ai.stakeholder_roles.slice(0, 4).forEach((role, i) => { if (clean(role, 60)) p.stakeholders[i].role = clean(role, 60); });
    if (Array.isArray(ai.risks)) ai.risks.slice(0, 3).forEach((d, i) => { if (clean(d, 100)) p.risks[i].desc = clean(d, 100); });
    if (clean(ai.opportunity, 100)) p.opportunity.desc = clean(ai.opportunity, 100);
    if (Array.isArray(ai.constraints) && ai.constraints.length >= 2) p.constraints = ai.constraints.slice(0, 2).map(c => clean(c, 100));
    if (clean(ai.sustainability)) p.sustainability = clean(ai.sustainability);
    p.ai = true;
    return p;
  }

  async function fetchAI(sectorId, seed) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(PT_CONFIG.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector: sectorId, seed }),
        signal: ctrl.signal
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  window.Generator = {
    aiAvailable: () => Boolean(window.PT_CONFIG && PT_CONFIG.aiEndpoint),
    async create(sectorId, seed, useAI) {
      const p = procedural(sectorId, seed);
      if (useAI && this.aiAvailable()) {
        try { mergeAI(p, await fetchAI(p.sectorId, seed)); }
        catch (e) { p.aiError = true; }
      }
      return p;
    }
  };
})();
