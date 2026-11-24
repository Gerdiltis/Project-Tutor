# Project Tutor · La aventura PMBOK® 8

Videojuego web en pixel art para que el alumnado de gestión de proyectos aprenda el **PMBOK® Guide 8ª edición** jugando.

En cada partida se genera un proyecto distinto (según el sector elegido) con su acta de constitución: cliente, patrocinador, presupuesto, plazo, entregables, interesados, riesgos y restricciones. El jugador recorre **7 mundos**, uno por cada dominio de desempeño, y responde preguntas que usan los datos de *su* proyecto.

| Mundo | Dominio de desempeño |
|---|---|
| 1 · Castillo de la Gobernanza | Gobernanza |
| 2 · Bosque del Alcance | Alcance |
| 3 · Torre del Reloj | Cronograma |
| 4 · Minas de Finanzas | Finanzas (integración continua, no solo presupuesto inicial) |
| 5 · Aldea de los Interesados | Interesados |
| 6 · Forja de Recursos | Recursos |
| 7 · Volcán de los Riesgos | Riesgos |
| Desafío final · Templo de los Principios | Los 6 principios (desafío final: convencer a la PMO) |

Cada mundo es un tablero hexagonal tipo Catan, visto desde arriba, con terrenos según su tema (bosques en Alcance, trigales en Cronograma, minas de oro en Finanzas, lava en Riesgos...). Las preguntas son fichas numeradas: si aciertas construyes un poblado; si fallas, el ladrón ocupa la casilla.

Al terminar: puntuación, rango, aciertos por dominio y un plan de estudio con los puntos débiles.

## Jugar en local

No necesita instalación ni compilación. Desde la carpeta del proyecto:

```bash
python3 -m http.server 8765
```

y abre `http://localhost:8765`.

## Arquitectura (la más sencilla y barata)

- **Web estática**: HTML + CSS + JavaScript sin frameworks ni build. Se publica gratis en GitHub Pages.
- **Contenido sin IA (0 tokens)**: el proyecto de cada partida se genera con plantillas por sector y números aleatorios con semilla (`js/generator.js`, `js/sectors.js`).
- **Preguntas calculadas**: valor ganado (CPI/SPI/EAC), ruta crítica, PERT, canales de comunicación y EMV se calculan con los números de la partida, así que nunca se repiten (`js/questions.js`).
- **Banco de preguntas** con explicaciones, rellenado con los datos del proyecto (`js/pmbok.js`).
- **Progreso y récords** en `localStorage` del navegador (sin servidor ni base de datos).
- **IA opcional**: un Cloudflare Worker (`worker/`) hace **una sola llamada** por partida a Claude Haiku 5.5 para redactar los textos del escenario. Los números siguen siendo procedurales. Si falla o no está configurado, el juego usa el generador procedural.

```
Navegador (GitHub Pages) ──(opcional, 1 petición/partida)──▶ Cloudflare Worker ──▶ Claude Haiku 5.5
```

### Coste de la IA

Cada partida con IA usa unos ~250 tokens de entrada y ~400–600 de salida (salida JSON estructurada, esfuerzo bajo). Con Haiku 5.5 ($0,10 / $0,50 por millón de tokens) son **unos 0,0003 $ por partida (≈ 0,30 $ por cada 1.000 partidas)**. Sin IA, el coste es 0. Consulta los precios vigentes de Anthropic antes de presupuestar.

## Publicar en GitHub Pages

1. Sube el código a la rama `main`.
2. En GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
3. El juego quedará en `https://gerdiltis.github.io/Project-Tutor/`.

## Activar la IA (opcional)

Requiere una cuenta gratuita de Cloudflare y una API key de Anthropic.

```bash
cd worker
npm install
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

1. Ajusta `ALLOWED_ORIGINS` en `worker/wrangler.toml` con el dominio donde publiques el juego.
2. Copia la URL que muestra `wrangler deploy` en `js/config.js` → `aiEndpoint`.
3. Añade el origen del Worker a `connect-src` en la política de seguridad de `index.html` (por ejemplo `connect-src 'self' https://project-tutor-ai.TU-CUENTA.workers.dev`); si no, el navegador bloqueará la llamada.
4. En la pantalla de título aparecerá la casilla **"Escenario generado con IA"**.

## Seguridad y privacidad

- **Los datos se quedan en el navegador.** El nombre, la partida y los récords se guardan en `localStorage` y no se envían a ningún servidor. Sin IA, el juego no hace ninguna petición fuera de su propio sitio.
- **Sin terceros.** Las fuentes (licencia OFL, en `fonts/`) se sirven desde el propio sitio: ni Google Fonts ni analítica ni CDNs.
- **Política de seguridad de contenido (CSP)** en `index.html`: solo se ejecutan los scripts del propio sitio y no se cargan recursos externos. GitHub Pages no permite cabeceras, por eso va como `<meta>`.
- **Datos guardados validados.** Todos los proyectos de `usuario.github.io` comparten `localStorage`, así que la partida y los récords se validan campo a campo al cargarlos, y las preguntas se regeneran desde la semilla en vez de confiar en lo guardado. Si algo no cuadra, la partida se descarta.
- **Worker de IA:** la API key solo vive como secreto en Cloudflare. El Worker acepta únicamente los sectores del juego, rechaza cuerpos de más de 1 KB, limita a 30 peticiones por minuto por IP y tiene las dependencias fijadas con `package-lock.json`. La comprobación de origen solo frena a otras webs; no es una autenticación.

Para reportar una vulnerabilidad, consulta [SECURITY.md](SECURITY.md).

## Estructura

```
index.html          Página única del juego
css/style.css       Estilo pixel art
js/config.js        URL del Worker de IA (opcional)
js/pmbok.js         Principios, dominios y banco de preguntas
js/sectors.js       Plantillas de proyectos por sector
js/generator.js     Generador de proyectos (procedural + IA opcional)
js/questions.js     Preguntas calculadas y montaje de cada mundo
js/board.js         Tablero hexagonal tipo Catan de cada mundo
js/game.js          Pantallas, puntuación y guardado
js/scene.js         Fondo pixel art: calle nocturna con fachadas, balcones y neones
js/sprites.js       Sprites pixel art (jefa de proyecto, mentor, PMO e iconos)
js/sound.js         Efectos de sonido chiptune (WebAudio)
fonts/              Fuentes pixel alojadas en el sitio (licencias OFL)
worker/             Cloudflare Worker para la IA opcional
```

## Aviso

Juego educativo basado en la estructura pública del PMBOK® Guide 8ª ed. (6 principios, 7 dominios de desempeño y 5 áreas de enfoque). PMBOK es marca registrada del Project Management Institute, Inc. Contrasta siempre los contenidos con la guía oficial.
