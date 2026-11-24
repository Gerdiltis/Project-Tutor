# Política de seguridad

## Cómo reportar una vulnerabilidad

Si encuentras un fallo de seguridad en Project Tutor, **no abras un issue público**. Repórtalo de forma privada desde la pestaña **Security → Report a vulnerability** de este repositorio (GitHub Security Advisories).

Incluye, si puedes:
- qué has encontrado y dónde (archivo o pantalla);
- los pasos para reproducirlo;
- el impacto que crees que tiene.

Intentaré responder en un plazo de 7 días y avisaré cuando esté corregido.

## Alcance

- El juego web publicado en GitHub Pages (`index.html`, `css/`, `js/`, `fonts/`).
- El Cloudflare Worker opcional de `worker/`.

Fuera de alcance: la infraestructura de GitHub Pages, Cloudflare o Anthropic, y los ataques que requieren acceso físico al dispositivo del jugador.

## Versión soportada

Solo se mantiene la versión de la rama `main`, que es la que está publicada.
