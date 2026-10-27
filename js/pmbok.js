// Contenido didáctico basado en la estructura del PMBOK® Guide 8ª ed. (PMI):
// 6 principios, 7 dominios de desempeño y 5 áreas de enfoque.
// Las preguntas usan variables {{...}} que se rellenan con el proyecto generado.
window.PMBOK = {
  focusAreas: ["Inicio", "Planificación", "Ejecución", "Monitoreo y control", "Cierre"],

  principles: [
    { name: "Adoptar una visión holística", desc: "Entender el proyecto como un sistema: cada decisión afecta al resto de dominios, a la organización y a su entorno." },
    { name: "Enfocarse en el valor", desc: "El éxito se mide por los resultados y beneficios que el proyecto aporta, no solo por producir entregables." },
    { name: "Integrar la calidad en procesos y entregables", desc: "La calidad se construye desde el principio, no se inspecciona al final." },
    { name: "Ser un líder responsable", desc: "Liderar con ética, transparencia y asumiendo la rendición de cuentas." },
    { name: "Integrar la sostenibilidad", desc: "Considerar el impacto económico, social y ambiental en todas las áreas y en todo el ciclo de vida." },
    { name: "Construir una cultura empoderada", desc: "Crear un entorno de confianza y colaboración donde el equipo decide y aporta." }
  ],

  domains: [
    {
      id: "gobernanza", name: "Gobernanza", world: "Castillo de la Gobernanza", sprite: "castle", color: "#2b5fae", neon: "#4fe3ff",
      intro: "Aquí se decide quién decide. La gobernanza alinea el proyecto con la estrategia de la organización, define roles, autoridad, comités y cómo se aprueban los cambios. También integra el resto de dominios: es el 'pegamento' del proyecto.",
      outcomes: ["Proyecto autorizado y alineado con la estrategia", "Roles, autoridad y escalados claros", "Cambios evaluados y aprobados de forma controlada", "Enfoque (predictivo, adaptativo o híbrido) adaptado al contexto"],
      tip: "Repasa el acta de constitución, el control integrado de cambios, el rol del patrocinador y la adaptación (tailoring)."
    },
    {
      id: "alcance", name: "Alcance", world: "Bosque del Alcance", sprite: "tree", color: "#2f8f5b", neon: "#a7f070",
      intro: "En este bosque es fácil perderse. El dominio de Alcance define y controla qué trabajo SÍ y qué trabajo NO forma parte del proyecto: requisitos, EDT/WBS, backlog y aceptación de entregables.",
      outcomes: ["Requisitos claros y trazables", "Entregables definidos y descompuestos", "Aceptación formal de entregables", "Cambios de alcance controlados (sin scope creep)"],
      tip: "Repasa la EDT/WBS, la línea base del alcance, la matriz de trazabilidad y la diferencia entre validar alcance y controlar calidad."
    },
    {
      id: "cronograma", name: "Cronograma", world: "Torre del Reloj", sprite: "clock", color: "#e0a43a", neon: "#ff4fa3",
      intro: "Cada engranaje cuenta. El dominio de Cronograma planifica y controla CUÁNDO se hace el trabajo: secuencias, duraciones, ruta crítica, hitos, iteraciones y técnicas de compresión.",
      outcomes: ["Secuencia y duración realistas", "Ruta crítica identificada", "Hitos y cadencias acordados", "Desviaciones detectadas y corregidas a tiempo"],
      tip: "Repasa ruta crítica y holgura, estimación PERT, fast tracking vs. crashing y el uso de timeboxes."
    },
    {
      id: "finanzas", name: "Finanzas", world: "Minas de Finanzas", sprite: "coin", color: "#c9573a", neon: "#ffcd75",
      intro: "Bajo tierra se esconde el oro... y los sobrecostes. Finanzas va más allá del presupuesto inicial: es una integración continua de costes, reservas, financiación y valor obtenido durante todo el proyecto.",
      outcomes: ["Caso de negocio que justifica la inversión", "Presupuesto y reservas adecuados", "Rendimiento de costes medido (valor ganado)", "Previsiones actualizadas para decidir a tiempo"],
      tip: "Repasa valor ganado (PV, EV, AC, CPI, SPI, EAC), reservas de contingencia vs. de gestión y el caso de negocio."
    },
    {
      id: "interesados", name: "Interesados", world: "Aldea de los Interesados", sprite: "people", color: "#2a8fa8", neon: "#ff4fa3",
      intro: "En la aldea todos opinan. El dominio de Interesados identifica, analiza e involucra a las personas y grupos que afectan o son afectados por el proyecto, e incluye la comunicación con ellos.",
      outcomes: ["Interesados identificados y analizados", "Involucramiento planificado y activo", "Comunicación adecuada a cada audiencia", "Expectativas gestionadas y apoyo al proyecto"],
      tip: "Repasa la matriz poder/interés, la matriz de evaluación del involucramiento y los métodos de comunicación."
    },
    {
      id: "recursos", name: "Recursos", world: "Forja de Recursos", sprite: "anvil", color: "#7a3fa0", neon: "#4fe3ff",
      intro: "Sin herramientas ni equipo no hay proyecto. Recursos cubre personas, equipos, materiales y adquisiciones: formar y liderar equipos, asignar responsabilidades y contratar proveedores.",
      outcomes: ["Equipo con roles y responsabilidades claros", "Recursos disponibles cuando se necesitan", "Conflictos gestionados de forma constructiva", "Adquisiciones y contratos bien elegidos"],
      tip: "Repasa la matriz RACI, el modelo de Tuckman, la gestión de conflictos y los tipos de contrato."
    },
    {
      id: "riesgos", name: "Riesgos", world: "Volcán de los Riesgos", sprite: "volcano", color: "#b8323f", neon: "#a7f070",
      intro: "El suelo tiembla. El dominio de Riesgos identifica, analiza y responde a la incertidumbre: amenazas que hay que reducir y oportunidades que hay que aprovechar.",
      outcomes: ["Riesgos identificados de forma continua", "Riesgos priorizados por probabilidad e impacto", "Respuestas con propietario asignado", "Exposición al riesgo dentro del umbral aceptado"],
      tip: "Repasa el valor monetario esperado (EMV), las estrategias para amenazas y oportunidades y los riesgos secundarios/residuales."
    }
  ],

  finale: {
    id: "principios", name: "Principios", world: "Templo de los Principios", sprite: "temple", color: "#d97a2b", neon: "#ffcd75",
    intro: "Has recorrido los siete mundos. En el templo te espera el Auditor del PMO, que pondrá a prueba los 6 principios que guían todo el PMBOK 8. Cada respuesta correcta le resta vida.",
    outcomes: [],
    tip: "Repasa los 6 principios del PMBOK 8 y cómo se reflejan en decisiones del día a día."
  },

  // ok = respuesta correcta; ko = distractores; e = explicación
  questions: {
    gobernanza: [
      { q: "Al arrancar {{proyecto}}, ¿qué documento autoriza formalmente el proyecto y da autoridad a {{pm}} para usar recursos?", ok: "El acta de constitución del proyecto", ko: ["El plan de gestión del alcance", "El registro de interesados", "El informe de desempeño del trabajo"], e: "El acta de constitución, emitida por el patrocinador ({{sponsor}}), formaliza la existencia del proyecto y la autoridad del director." },
      { q: "{{interesado1}} ({{rol1}}) pide modificar un entregable que ya estaba aprobado. ¿Qué haces?", ok: "Registrar la solicitud y evaluarla en el proceso de control de cambios", ko: ["Implementarlo ya para mantener contento al interesado", "Rechazarlo siempre: la línea base no se toca", "Pedir al equipo que lo haga en horas extra sin registrarlo"], e: "Todo cambio a una línea base se registra, se analiza su impacto (alcance, plazo, coste, riesgo) y lo aprueba quien tenga autoridad." },
      { q: "¿Cuál es el papel principal de {{sponsor}} como patrocinador de {{proyecto}}?", ok: "Aportar recursos y apoyo, y tomar decisiones que superan la autoridad del director", ko: ["Asignar las tareas diarias del equipo", "Elaborar el cronograma detallado", "Ejecutar las pruebas de calidad"], e: "El patrocinador financia, defiende el proyecto ante la organización y resuelve escalados." },
      { q: "{{proyecto}} debe elegir entre un enfoque predictivo, adaptativo o híbrido. ¿Qué debe guiar la decisión?", ok: "Las características del proyecto, la incertidumbre de requisitos y el entorno", ko: ["Usar siempre predictivo porque es el estándar", "Usar siempre ágil porque es más moderno", "La preferencia personal del equipo técnico"], e: "La adaptación (tailoring) consiste en elegir y ajustar el enfoque según el contexto, no aplicar una receta fija." },
      { q: "¿Qué es la 'adaptación' (tailoring) en el PMBOK?", ok: "Ajustar deliberadamente enfoque, procesos y herramientas al contexto del proyecto", ko: ["Copiar las plantillas de un proyecto anterior", "Eliminar los procesos de control para ir más rápido", "Cambiar el alcance sin aprobación"], e: "El PMBOK no es una receta: cada proyecto adapta lo necesario para aportar valor sin burocracia innecesaria." },
      { q: "¿Qué es un comité de control de cambios (CCB)?", ok: "Un grupo formal que revisa, evalúa y aprueba o rechaza cambios", ko: ["Los usuarios finales que prueban el producto", "La reunión diaria del equipo de desarrollo", "Una auditoría financiera externa"], e: "El CCB forma parte de la estructura de gobernanza y protege las líneas base." },
      { q: "{{proyecto}} forma parte de un programa estratégico de {{cliente}}. ¿Por qué debe {{pm}} conocer ese contexto?", ok: "Para alinear el proyecto con los objetivos estratégicos y gestionar dependencias", ko: ["No es necesario: el proyecto es independiente", "Solo para justificar más presupuesto", "Para delegar la responsabilidad en el director del programa"], e: "La gobernanza conecta el proyecto con programas y portafolios; es la visión holística en acción." },
      { q: "Al cerrar una fase de {{proyecto}}, ¿qué práctica aporta más valor a la organización?", ok: "Documentar lecciones aprendidas y transferir ese conocimiento", ko: ["Archivar los correos sin revisarlos", "Liberar al equipo sin reunión de cierre", "Cerrar contratos sin verificar entregables"], e: "Las lecciones aprendidas convierten la experiencia en activos de la organización para futuros proyectos." }
    ],
    alcance: [
      { q: "¿Qué es la EDT (WBS) de {{proyecto}}?", ok: "La descomposición jerárquica del trabajo total en entregables más pequeños", ko: ["Una lista de tareas ordenada por fechas", "El diagrama de red de actividades", "El organigrama del equipo"], e: "La EDT organiza el 100% del trabajo; lo que no está en la EDT no forma parte del proyecto." },
      { q: "Un técnico añade a '{{entregable1}}' una función que nadie pidió 'porque quedará mejor'. ¿Cómo se llama esto?", ok: "Gold plating (chapado en oro)", ko: ["Validación del alcance", "Ejecución rápida (fast tracking)", "Mejora continua aprobada"], e: "Añadir extras no solicitados consume recursos, genera riesgos y no aporta valor acordado." },
      { q: "¿Qué diferencia hay entre validar el alcance y controlar la calidad?", ok: "Validar es la aceptación formal del cliente; controlar calidad verifica que el entregable cumple requisitos", ko: ["Son exactamente lo mismo", "Validar lo hace el equipo; controlar calidad lo hace el cliente", "Validar se hace al inicio; controlar calidad al cierre"], e: "Normalmente primero se controla la calidad (internamente) y después {{cliente}} acepta formalmente." },
      { q: "¿Qué compone la línea base del alcance?", ok: "El enunciado del alcance, la EDT y el diccionario de la EDT", ko: ["El cronograma y el presupuesto", "El registro de riesgos y de incidentes", "El acta de constitución y el plan de comunicaciones"], e: "La línea base del alcance solo cambia mediante control de cambios." },
      { q: "En un enfoque adaptativo, ¿dónde se gestionan los requisitos de {{proyecto}}?", ok: "En un backlog priorizado por valor y refinado continuamente", ko: ["En un documento firmado al inicio que no cambia", "En el registro de riesgos", "En el acta de constitución"], e: "El backlog permite incorporar aprendizaje y reordenar según el valor para {{cliente}}." },
      { q: "¿Qué es un paquete de trabajo?", ok: "El nivel más bajo de la EDT, que se puede estimar, asignar y controlar", ko: ["Un conjunto de contratos con proveedores", "Un informe de avance semanal", "Cada fase del ciclo de vida"], e: "Los paquetes de trabajo son la base para estimar coste y duración." },
      { q: "¿Qué herramienta vincula cada requisito con su origen y con el entregable que lo cumple?", ok: "La matriz de trazabilidad de requisitos", ko: ["La matriz RACI", "La matriz de probabilidad e impacto", "El diagrama de Gantt"], e: "La trazabilidad asegura que cada requisito aporta valor y se entrega." },
      { q: "{{cliente}} va añadiendo pequeños requisitos sin pasar por control de cambios. ¿Qué está ocurriendo?", ok: "Corrupción del alcance (scope creep)", ko: ["Elaboración progresiva aprobada", "Nivelación de recursos", "Gestión del valor ganado"], e: "El scope creep son cambios no controlados que erosionan plazo, coste y calidad." }
    ],
    cronograma: [
      { q: "¿Qué es la ruta crítica?", ok: "La secuencia más larga de actividades, que fija la duración mínima del proyecto", ko: ["La secuencia de actividades con más recursos", "Las actividades más caras del proyecto", "La secuencia más corta de actividades"], e: "Las actividades de la ruta crítica tienen holgura cero: si se retrasan, se retrasa el proyecto." },
      { q: "{{proyecto}} va con retraso y decides solapar actividades que iban en secuencia. ¿Qué técnica usas?", ok: "Ejecución rápida (fast tracking)", ko: ["Intensificación (crashing)", "Nivelación de recursos", "Simulación Monte Carlo"], e: "El fast tracking acorta plazos sin coste directo, pero aumenta el riesgo de retrabajo." },
      { q: "Añades personal con coste extra a actividades de la ruta crítica para acortar la duración. ¿Qué técnica es?", ok: "Intensificación (crashing)", ko: ["Ejecución rápida (fast tracking)", "Suavizado de recursos", "Descomposición"], e: "El crashing compra tiempo con dinero; conviene aplicarlo a las actividades críticas más baratas de acortar." },
      { q: "En un enfoque adaptativo, ¿qué es un timebox (por ejemplo, un sprint)?", ok: "Un periodo fijo en el que el equipo entrega un incremento de valor", ko: ["Una reserva de tiempo para riesgos", "La fecha límite final del contrato", "El tiempo que dura cada reunión de seguimiento"], e: "El tiempo es fijo y lo que se ajusta es el alcance de cada iteración." },
      { q: "¿Qué es la holgura total de una actividad?", ok: "El tiempo que puede retrasarse sin retrasar la fecha de fin del proyecto", ko: ["El tiempo extra que el cliente concede", "La diferencia entre coste real y planificado", "El tiempo de descanso del equipo"], e: "En la ruta crítica la holgura total es cero." },
      { q: "En el cronograma de {{proyecto}}, un hito es:", ok: "Un punto o evento significativo con duración cero", ko: ["La actividad más larga", "Una tarea con holgura negativa", "Un entregable intermedio con presupuesto propio"], e: "Los hitos sirven para comunicar avance a {{sponsor}} y a la dirección." },
      { q: "Nivelar recursos en {{proyecto}} porque una persona clave está sobreasignada puede provocar...", ok: "Que la ruta crítica se alargue", ko: ["Que el presupuesto se reduzca automáticamente", "Que desaparezcan las dependencias", "Que el alcance aumente"], e: "La nivelación ajusta fechas a la disponibilidad real; a menudo retrasa la fecha final." }
    ],
    finanzas: [
      { q: "¿Qué es la reserva para contingencias de {{proyecto}}?", ok: "Presupuesto dentro de la línea base para riesgos identificados", ko: ["Dinero para riesgos desconocidos fuera de la línea base", "El beneficio esperado del proveedor", "El coste ya gastado que no se puede recuperar"], e: "La contingencia cubre los 'desconocidos conocidos' y suele gestionarla el director del proyecto." },
      { q: "La reserva de gestión de {{proyecto}}...", ok: "No forma parte de la línea base de costes y requiere autorización de la dirección", ko: ["Se reparte entre los paquetes de trabajo", "La gestiona libremente el equipo", "Cubre solo riesgos ya identificados"], e: "Cubre los 'desconocidos desconocidos'. Línea base de costes + reserva de gestión = presupuesto del proyecto." },
      { q: "¿Qué es el valor ganado (EV)?", ok: "El valor presupuestado del trabajo realmente completado", ko: ["El dinero realmente gastado", "El valor del trabajo que debía estar hecho a hoy", "El beneficio final del proyecto"], e: "EV se compara con PV (plan) y AC (coste real) para medir rendimiento." },
      { q: "Para justificar la inversión de {{presupuesto}} ante {{cliente}}, ¿qué documento analizas?", ok: "El caso de negocio", ko: ["El registro de incidentes", "La matriz RACI", "El diccionario de la EDT"], e: "El caso de negocio compara beneficios, costes y riesgos, y se revisa durante el proyecto." },
      { q: "{{proyecto}} ya ha gastado mucho y se duda si continuar. ¿Cómo tratar el dinero ya gastado?", ok: "Es un coste hundido: no debe influir en la decisión de continuar", ko: ["Es el factor principal para decidir continuar", "Debe recuperarse aumentando el alcance", "Se suma a la reserva de gestión"], e: "Se decide mirando el valor futuro y el coste pendiente, no lo ya gastado." },
      { q: "¿Por qué el PMBOK 8 trata Finanzas como una integración continua y no solo como el presupuesto inicial?", ok: "Porque costes, financiación y valor se revisan durante todo el proyecto para decidir a tiempo", ko: ["Porque el presupuesto inicial no es necesario", "Porque solo importa el cierre contable", "Porque el control de costes lo hace solo el departamento financiero"], e: "Las previsiones (EAC, ETC) y el seguimiento del valor permiten corregir el rumbo antes de que sea tarde." }
    ],
    interesados: [
      { q: "¿Cuándo hay que identificar a los interesados de {{proyecto}}?", ok: "Lo antes posible y de forma continua durante todo el proyecto", ko: ["Solo en la fase de cierre", "Únicamente al firmar el contrato", "Cuando aparezca un conflicto"], e: "Aparecen nuevos interesados y cambia la influencia de otros: el análisis se repite." },
      { q: "¿Qué es el registro de interesados?", ok: "Un documento con su identificación, evaluación y clasificación", ko: ["La lista de proveedores homologados", "El listado de tareas por persona", "El acta de cada reunión"], e: "Incluye rol, expectativas, influencia, interés y nivel de involucramiento." },
      { q: "En la matriz de involucramiento, {{interesado2}} está 'reticente' y lo deseado es 'de apoyo'. ¿Qué haces?", ok: "Planificar acciones de involucramiento para moverlo hacia el apoyo", ko: ["Excluirlo de las comunicaciones", "Esperar a que cambie de opinión solo", "Escalarlo directamente al patrocinador"], e: "La matriz compara el estado actual con el deseado y guía las acciones." },
      { q: "Debes tratar con {{sponsor}} un tema complejo y delicado de {{proyecto}}. ¿Qué método de comunicación eliges?", ok: "Comunicación interactiva (reunión o videollamada)", ko: ["Comunicación push (correo masivo)", "Comunicación pull (dejarlo en la intranet)", "Esperar al informe trimestral"], e: "Los temas complejos o sensibles requieren diálogo en tiempo real." },
      { q: "Un interesado clave se resiste a {{proyecto}}. ¿Cuál es el primer paso?", ok: "Entender sus intereses y preocupaciones con escucha activa", ko: ["Ignorarlo y seguir con el plan", "Pedir al patrocinador que lo obligue", "Reducir la información que recibe"], e: "Comprender sus motivos permite diseñar acciones de involucramiento eficaces." },
      { q: "¿Qué es un interesado (stakeholder)?", ok: "Persona, grupo u organización que afecta o puede verse afectada por el proyecto", ko: ["Solo quien financia el proyecto", "Solo los miembros del equipo", "Solo el cliente final"], e: "Incluye equipo, cliente, usuarios, reguladores, proveedores, comunidad..." }
    ],
    recursos: [
      { q: "En una matriz RACI, ¿qué significa la 'A'?", ok: "Quien rinde cuentas y aprueba (solo una por actividad)", ko: ["Quien ayuda en la ejecución", "Quien debe ser avisado", "Quien audita la actividad"], e: "R = realiza, A = rinde cuentas, C = consultado, I = informado." },
      { q: "El equipo de {{proyecto}} discute sobre roles y hay roces frecuentes. Según Tuckman, ¿en qué fase está?", ok: "Conflicto (storming)", ko: ["Formación (forming)", "Desempeño (performing)", "Disolución (adjourning)"], e: "Es normal; el director facilita para pasar a normalización (norming)." },
      { q: "¿Qué técnica de resolución de conflictos busca una solución ganar-ganar?", ok: "Colaborar / resolver el problema", ko: ["Retirarse / evitar", "Forzar / imponer", "Suavizar / acomodar"], e: "Colaborar integra varios puntos de vista y genera compromiso duradero." },
      { q: "{{proyecto}} contrata a un proveedor a precio fijo. ¿Quién asume más riesgo de costes?", ok: "El proveedor (vendedor)", ko: ["El comprador ({{cliente}})", "Ambos por igual", "El patrocinador personalmente"], e: "En precio fijo el vendedor absorbe los sobrecostes; exige un alcance bien definido." },
      { q: "¿Cuándo encaja un contrato por tiempo y materiales (T&M)?", ok: "Cuando el alcance no está claro o se necesita personal de forma rápida", ko: ["Cuando el alcance está totalmente cerrado", "Cuando se quiere trasladar todo el riesgo al proveedor", "Nunca: está prohibido en el PMBOK"], e: "T&M es flexible, pero el comprador debe controlar horas y tarifas." },
      { q: "Para '{{entregable2}}', ¿qué análisis ayuda a decidir si se produce internamente o se compra?", ok: "El análisis hacer o comprar (make-or-buy)", ko: ["El análisis de Pareto", "La matriz poder/interés", "El análisis de reservas"], e: "Compara costes, capacidades, riesgos y estrategia." },
      { q: "En un equipo adaptativo, el liderazgo de servicio (servant leadership) implica...", ok: "Eliminar impedimentos y facilitar la autonomía del equipo", ko: ["Dar órdenes detalladas a cada persona", "Hacer el trabajo técnico del equipo", "Controlar las horas de cada miembro"], e: "El líder sirve al equipo para que aporte el máximo valor." }
    ],
    riesgos: [
      { q: "Para el riesgo '{{riesgo1}}', contratas un seguro con un tercero. ¿Qué estrategia es?", ok: "Transferir", ko: ["Mitigar", "Evitar", "Explotar"], e: "Transferir traslada el impacto (no el riesgo en sí) a un tercero, normalmente con un coste." },
      { q: "Ante la oportunidad '{{oportunidad}}', ¿qué estrategia asegura que ocurra?", ok: "Explotar", ko: ["Mejorar", "Aceptar", "Transferir"], e: "Explotar elimina la incertidumbre para que la oportunidad se materialice seguro." },
      { q: "Si un riesgo de {{proyecto}} llega a ocurrir, pasa a ser...", ok: "Un incidente (issue) que se gestiona en el registro de incidentes", ko: ["Un riesgo residual", "Una oportunidad", "Un supuesto"], e: "Los riesgos son inciertos y futuros; los incidentes ya están ocurriendo." },
      { q: "Un riesgo que aparece como consecuencia directa de aplicar una respuesta a otro riesgo es...", ok: "Un riesgo secundario", ko: ["Un riesgo residual", "Un disparador", "Un riesgo general"], e: "El riesgo residual es el que queda tras la respuesta; el secundario lo crea la respuesta." },
      { q: "Una señal de advertencia de que '{{riesgo2}}' está a punto de ocurrir se llama...", ok: "Disparador (trigger)", ko: ["Supuesto", "Restricción", "Hito"], e: "Vigilar los disparadores permite activar las respuestas a tiempo." },
      { q: "¿Para qué sirve el análisis cualitativo de riesgos?", ok: "Para priorizar riesgos según su probabilidad e impacto", ko: ["Para calcular el impacto exacto en euros", "Para eliminar todos los riesgos", "Para firmar los contratos"], e: "La matriz de probabilidad e impacto ordena qué riesgos atender primero." },
      { q: "¿Quién es el 'propietario' del riesgo '{{riesgo1}}'?", ok: "La persona responsable de vigilarlo y ejecutar su respuesta", ko: ["El patrocinador, siempre", "Quien detectó el riesgo", "El proveedor de seguros"], e: "Asignar propietario garantiza que alguien actúe a tiempo." },
      { q: "El umbral de riesgo de {{cliente}} es...", ok: "El nivel de exposición a partir del cual la organización ya no lo acepta", ko: ["El número máximo de riesgos del registro", "El presupuesto total del proyecto", "La fecha límite para identificar riesgos"], e: "Refleja el apetito al riesgo y orienta qué respuestas son necesarias." }
    ],
    principios: [
      { q: "{{pm}} analiza cómo un retraso afecta a la vez al presupuesto, al equipo, a {{cliente}} y a la estrategia. ¿Qué principio aplica?", ok: "Adoptar una visión holística", ko: ["Enfocarse en el valor", "Construir una cultura empoderada", "Ser un líder responsable"], e: "Ver el proyecto como un sistema interconectado." },
      { q: "El equipo reordena el trabajo para entregar primero lo que genera beneficios tempranos a {{cliente}}. ¿Qué principio es?", ok: "Enfocarse en el valor", ko: ["Integrar la sostenibilidad", "Adoptar una visión holística", "Integrar la calidad"], e: "El éxito se mide por los beneficios, no por cumplir tareas." },
      { q: "{{proyecto}} define criterios de aceptación y revisiones desde el inicio en lugar de inspeccionar al final. ¿Qué principio es?", ok: "Integrar la calidad en procesos y entregables", ko: ["Enfocarse en el valor", "Ser un líder responsable", "Construir una cultura empoderada"], e: "Prevenir es más barato que corregir." },
      { q: "{{pm}} reconoce un error ante {{sponsor}}, explica su impacto y propone soluciones con transparencia. ¿Qué principio es?", ok: "Ser un líder responsable", ko: ["Construir una cultura empoderada", "Adoptar una visión holística", "Integrar la calidad"], e: "Ética, transparencia y rendición de cuentas." },
      { q: "Se evalúa el impacto ambiental, social y económico de {{proyecto}} en todo su ciclo de vida. ¿Qué principio es?", ok: "Integrar la sostenibilidad", ko: ["Enfocarse en el valor", "Integrar la calidad", "Adoptar una visión holística"], e: "Ejemplo en este proyecto: {{sostenibilidad}}." },
      { q: "{{pm}} delega decisiones técnicas al equipo y fomenta la seguridad psicológica. ¿Qué principio es?", ok: "Construir una cultura empoderada", ko: ["Ser un líder responsable", "Enfocarse en el valor", "Integrar la sostenibilidad"], e: "Un equipo con confianza y autonomía aporta más y mejor." },
      { q: "¿Cuál es la estructura principal del PMBOK 8?", ok: "6 principios y 7 dominios de desempeño", ko: ["12 principios y 8 dominios de desempeño", "10 áreas de conocimiento y 49 procesos", "5 principios y 10 dominios"], e: "Dominios: Gobernanza, Alcance, Cronograma, Finanzas, Interesados, Recursos y Riesgos." },
      { q: "¿Cuáles son las 5 áreas de enfoque del PMBOK 8?", ok: "Inicio, Planificación, Ejecución, Monitoreo y control, Cierre", ko: ["Valor, Calidad, Riesgo, Equipo, Cliente", "Visión, Misión, Estrategia, Táctica, Operación", "Análisis, Diseño, Desarrollo, Pruebas, Despliegue"], e: "Las áreas de enfoque organizan los procesos a lo largo del ciclo de vida." }
    ]
  }
};
