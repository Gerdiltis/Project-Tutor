// Cloudflare Worker: genera los textos del escenario de una partida con UNA llamada
// a Claude Haiku 5.5 (~250 tokens de entrada, ~400 de salida). La API key vive
// solo aquí (secreto ANTHROPIC_API_KEY), nunca en el navegador.
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const SECTORS = {
  tecnologia: "Tecnología y software",
  construccion: "Construcción e infraestructuras",
  salud: "Salud y hospitales",
  energia: "Energía renovable",
  educacion: "Educación y formación",
  eventos: "Marketing y eventos",
  manufactura: "Industria y manufactura",
  finanzas: "Banca y fintech",
  publico: "Administración pública",
  ong: "ONG y cooperación"
};

const Scenario = z.object({
  name: z.string(),
  client: z.string(),
  objective: z.string(),
  deliverables: z.array(z.string()),
  stakeholder_roles: z.array(z.string()),
  risks: z.array(z.string()),
  opportunity: z.string(),
  constraints: z.array(z.string()),
  sustainability: z.string()
});

const SYSTEM = "Eres diseñador de casos prácticos de gestión de proyectos (PMBOK 8) para un juego educativo en español. " +
  "Inventa un proyecto ficticio y realista del sector indicado. Empresas y organizaciones ficticias. Textos breves (máx. 15 palabras cada uno). " +
  "Exactamente: 3 entregables, 4 roles de interesados (solo el rol, sin nombres de persona), 3 amenazas concretas, 1 oportunidad, 2 restricciones. " +
  "objective: medible. sustainability: una acción de sostenibilidad concreta para este proyecto.";

function json(body, status, cors) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : (allowed[0] || ""),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, cors);
    if (!allowed.includes(origin)) return json({ error: "origin_not_allowed" }, 403, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: "bad_json" }, 400, cors); }
    const sector = SECTORS[body && body.sector];
    if (!sector) return json({ error: "bad_sector" }, 400, cors);
    const variant = Number.isInteger(body.seed) ? Math.abs(body.seed) % 100000 : 0;

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 20000 });
    try {
      const msg = await client.messages.parse({
        model: env.MODEL || "claude-haiku-5-5",
        max_tokens: 2000,
        system: SYSTEM,
        output_config: { effort: "low", format: zodOutputFormat(Scenario) },
        messages: [{ role: "user", content: `Sector: ${sector}. Variante nº ${variant}.` }]
      });
      if (msg.stop_reason !== "end_turn" || !msg.parsed_output) {
        return json({ error: "no_output", stop_reason: msg.stop_reason }, 502, cors);
      }
      return json(msg.parsed_output, 200, cors);
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) return json({ error: "rate_limited" }, 429, cors);
      if (err instanceof Anthropic.APIError) return json({ error: "upstream", status: err.status }, 502, cors);
      return json({ error: "internal" }, 500, cors);
    }
  }
};
