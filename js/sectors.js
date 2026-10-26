// Plantillas por sector para el generador procedural. budget en euros, months en meses.
window.SECTORS = [
  {
    id: "tecnologia", name: "Tecnología y software", budget: [150000, 1200000], months: [6, 18],
    templates: [
      { name: "Implantación de un ERP", objective: "Unificar finanzas, compras y almacén en un único sistema", deliverables: ["Módulo financiero configurado", "Migración de datos históricos", "Plan de formación a usuarios"], approach: "híbrido" },
      { name: "App móvil de atención al cliente", objective: "Reducir un 30% las llamadas al centro de soporte", deliverables: ["App iOS y Android publicada", "API de integración con el CRM", "Panel de analítica de uso"], approach: "adaptativo" },
      { name: "Migración a la nube", objective: "Trasladar los servidores locales a la nube y reducir costes de operación", deliverables: ["Arquitectura cloud validada", "Aplicaciones migradas", "Plan de continuidad de negocio"], approach: "híbrido" }
    ],
    clients: ["Logística Iberia", "Seguros Atalaya", "Retail Mediterráneo", "Grupo Nexo"],
    roles: ["Responsable de TI", "Usuarios clave de finanzas", "Proveedor de software", "Delegado de protección de datos", "Comité de dirección", "Equipo de soporte"],
    risks: ["Retrasos en la migración de datos", "Rotación de desarrolladores clave", "Incompatibilidad con sistemas heredados", "Brecha de ciberseguridad", "Baja adopción por parte de los usuarios"],
    opportunities: ["Reutilizar componentes de otro proyecto", "Nueva subvención para la digitalización"],
    constraints: ["Fecha de salida fijada antes del cierre fiscal", "Cumplimiento del RGPD"],
    sustainability: "elegir un proveedor cloud con energía renovable y reducir el consumo de servidores"
  },
  {
    id: "construccion", name: "Construcción e infraestructuras", budget: [800000, 6000000], months: [12, 30],
    templates: [
      { name: "Construcción de un centro logístico", objective: "Ampliar la capacidad de almacenaje regional un 40%", deliverables: ["Proyecto de ejecución aprobado", "Nave y muelles de carga terminados", "Certificado de fin de obra"], approach: "predictivo" },
      { name: "Rehabilitación de un edificio histórico", objective: "Recuperar el edificio como centro cultural accesible", deliverables: ["Estudio patrimonial", "Estructura consolidada", "Instalaciones accesibles"], approach: "predictivo" },
      { name: "Carril bici metropolitano", objective: "Conectar tres municipios con 12 km de vía ciclista segura", deliverables: ["Trazado aprobado", "Tramos pavimentados y señalizados", "Campaña de lanzamiento"], approach: "predictivo" }
    ],
    clients: ["Ayuntamiento de Valdemora", "Inmobiliaria Horizonte", "Consorcio de Transportes", "Fundación Patrimonio Vivo"],
    roles: ["Dirección facultativa", "Vecinos afectados", "Constructora principal", "Técnico municipal de licencias", "Coordinador de seguridad y salud", "Asociación ecologista local"],
    risks: ["Hallazgo arqueológico durante la excavación", "Subida del precio del acero", "Retraso en la licencia de obra", "Lluvias intensas en la fase de cimentación", "Accidente laboral"],
    opportunities: ["Compra conjunta de materiales con otra obra", "Fondos europeos de eficiencia energética"],
    constraints: ["Horario de obra limitado por normativa de ruido", "Licencia municipal obligatoria antes de empezar"],
    sustainability: "reciclar los residuos de obra y usar materiales de baja huella de carbono"
  },
  {
    id: "salud", name: "Salud y hospitales", budget: [200000, 2500000], months: [8, 24],
    templates: [
      { name: "Historia clínica electrónica", objective: "Digitalizar el 100% de las historias clínicas del hospital", deliverables: ["Sistema de historia clínica en producción", "Digitalización del archivo en papel", "Formación del personal sanitario"], approach: "híbrido" },
      { name: "Nueva unidad de telemedicina", objective: "Atender a pacientes rurales sin desplazamientos", deliverables: ["Plataforma de videoconsulta", "Protocolos clínicos", "Kits de monitorización domiciliaria"], approach: "adaptativo" },
      { name: "Reforma del área de urgencias", objective: "Reducir el tiempo de espera en urgencias un 25%", deliverables: ["Nuevo circuito de triaje", "Boxes reformados", "Sistema de gestión de colas"], approach: "predictivo" }
    ],
    clients: ["Hospital San Rafael", "Servicio Regional de Salud", "Clínica Vitalia", "Red de Centros Salud Norte"],
    roles: ["Dirección médica", "Personal de enfermería", "Pacientes y asociaciones", "Agencia de protección de datos", "Proveedor tecnológico", "Servicio de mantenimiento"],
    risks: ["Resistencia del personal sanitario al cambio", "Interrupción de la atención durante la implantación", "Fuga de datos de pacientes", "Retraso en la homologación del equipamiento", "Pico de demanda asistencial"],
    opportunities: ["Acuerdo con una universidad para la formación", "Programa nacional de salud digital"],
    constraints: ["La atención a pacientes no puede detenerse", "Normativa estricta de datos sanitarios"],
    sustainability: "reducir desplazamientos de pacientes y el consumo de papel"
  },
  {
    id: "energia", name: "Energía renovable", budget: [1000000, 8000000], months: [12, 28],
    templates: [
      { name: "Parque solar fotovoltaico", objective: "Generar 20 MW de energía limpia para la red", deliverables: ["Evaluación de impacto ambiental", "Instalación de paneles e inversores", "Conexión a la red eléctrica"], approach: "predictivo" },
      { name: "Comunidad energética local", objective: "Que 300 hogares compartan autoconsumo solar", deliverables: ["Estatutos de la comunidad", "Instalaciones en tejados públicos", "Plataforma de reparto de energía"], approach: "híbrido" },
      { name: "Repotenciación de un parque eólico", objective: "Aumentar un 35% la producción con menos aerogeneradores", deliverables: ["Desmantelamiento de turbinas antiguas", "Nuevos aerogeneradores", "Plan de reciclaje de palas"], approach: "predictivo" }
    ],
    clients: ["Energías del Sur", "Cooperativa Sol Común", "Eólica Cantábrica", "Diputación Provincial"],
    roles: ["Operador de la red eléctrica", "Propietarios de los terrenos", "Autoridad ambiental", "Fabricante de equipos", "Vecinos del municipio", "Entidad financiadora"],
    risks: ["Retraso en el permiso de conexión a red", "Rotura de la cadena de suministro de paneles", "Oposición vecinal", "Afección a especies protegidas", "Caída del precio de la energía"],
    opportunities: ["Nueva línea de ayudas a renovables", "Venta de energía con contrato a largo plazo (PPA)"],
    constraints: ["Declaración de impacto ambiental favorable obligatoria", "Ventana de obra limitada por la época de cría de aves"],
    sustainability: "proteger la biodiversidad local y reciclar los equipos al final de su vida útil"
  },
  {
    id: "educacion", name: "Educación y formación", budget: [60000, 600000], months: [4, 14],
    templates: [
      { name: "Campus virtual universitario", objective: "Ofrecer 20 titulaciones en formato online", deliverables: ["Plataforma de aprendizaje configurada", "Cursos virtualizados", "Servicio de soporte al estudiante"], approach: "adaptativo" },
      { name: "Programa de competencias digitales", objective: "Formar a 2.000 personas desempleadas en competencias digitales", deliverables: ["Itinerarios formativos", "Red de aulas equipadas", "Sistema de certificación"], approach: "híbrido" },
      { name: "Nuevo colegio bilingüe", objective: "Abrir un centro para 600 alumnos el próximo curso", deliverables: ["Proyecto educativo aprobado", "Claustro contratado", "Instalaciones equipadas"], approach: "predictivo" }
    ],
    clients: ["Universidad del Atlántico", "Consejería de Educación", "Fundación Aprende", "Grupo Educativo Alba"],
    roles: ["Profesorado", "Estudiantes", "Familias", "Inspección educativa", "Equipo de TI", "Agencia de calidad"],
    risks: ["Baja matrícula inicial", "Falta de profesorado cualificado", "Caídas de la plataforma en exámenes", "Cambio normativo educativo", "Brecha digital del alumnado"],
    opportunities: ["Alianza con empresas para prácticas", "Reutilizar contenidos en abierto"],
    constraints: ["El curso académico empieza en septiembre", "Accesibilidad obligatoria de los contenidos"],
    sustainability: "garantizar la accesibilidad y reducir la brecha digital"
  },
  {
    id: "eventos", name: "Marketing y eventos", budget: [80000, 900000], months: [3, 10],
    templates: [
      { name: "Festival de música sostenible", objective: "Reunir a 15.000 asistentes con residuo cero", deliverables: ["Cartel de artistas cerrado", "Recinto montado", "Plan de seguridad"], approach: "predictivo" },
      { name: "Lanzamiento de una nueva marca", objective: "Alcanzar un 20% de notoriedad en 6 meses", deliverables: ["Identidad de marca", "Campaña digital", "Evento de presentación"], approach: "adaptativo" },
      { name: "Congreso internacional", objective: "Organizar un congreso para 1.200 profesionales de 30 países", deliverables: ["Programa científico", "Plataforma de inscripción", "Logística de ponentes"], approach: "híbrido" }
    ],
    clients: ["Ayuntamiento de Brisamar", "Bebidas Aurora", "Asociación Europea de Innovación", "Agencia Kinetik"],
    roles: ["Patrocinadores comerciales", "Asistentes", "Servicios de emergencia", "Proveedores de catering", "Medios de comunicación", "Vecinos del recinto"],
    risks: ["Previsión de lluvia el día del evento", "Cancelación de un artista principal", "Venta de entradas por debajo de lo previsto", "Fallo del sistema de acceso", "Crisis en redes sociales"],
    opportunities: ["Retransmisión en streaming de pago", "Nuevo patrocinador interesado"],
    constraints: ["Fecha del evento inamovible", "Aforo máximo fijado por la autoridad"],
    sustainability: "lograr residuo cero y promover el transporte público"
  },
  {
    id: "manufactura", name: "Industria y manufactura", budget: [300000, 4000000], months: [8, 20],
    templates: [
      { name: "Nueva línea de producción automatizada", objective: "Aumentar la capacidad un 50% con robótica", deliverables: ["Línea robotizada instalada", "Personal formado", "Producción en serie validada"], approach: "predictivo" },
      { name: "Lanzamiento de un vehículo eléctrico ligero", objective: "Llevar un nuevo modelo al mercado en 18 meses", deliverables: ["Prototipo homologado", "Cadena de suministro de baterías", "Primera serie fabricada"], approach: "híbrido" },
      { name: "Implantación de Lean Manufacturing", objective: "Reducir un 20% los desperdicios de la planta", deliverables: ["Mapa de flujo de valor", "Células de trabajo rediseñadas", "Indicadores de mejora continua"], approach: "adaptativo" }
    ],
    clients: ["Metalúrgica Ebro", "MoviElec", "Componentes Levante", "Industrias Norte"],
    roles: ["Jefes de planta", "Comité de empresa", "Proveedor de robótica", "Organismo de homologación", "Departamento de calidad", "Clientes industriales"],
    risks: ["Retraso en la entrega de robots", "Defectos en la primera serie", "Huelga del personal", "Escasez de semiconductores", "Fallo en la homologación"],
    opportunities: ["Exportar a un nuevo mercado", "Deducción fiscal por I+D"],
    constraints: ["La producción actual no puede parar más de 2 semanas", "Normativa de seguridad de máquinas"],
    sustainability: "reducir residuos y consumo energético por unidad producida"
  },
  {
    id: "finanzas", name: "Banca y fintech", budget: [250000, 3000000], months: [6, 18],
    templates: [
      { name: "Banca móvil de nueva generación", objective: "Que el 70% de las operaciones se hagan desde el móvil", deliverables: ["App de banca móvil", "Onboarding digital con verificación de identidad", "Sistema antifraude"], approach: "adaptativo" },
      { name: "Adaptación a nueva normativa europea", objective: "Cumplir la nueva regulación antes de la fecha límite", deliverables: ["Análisis de brechas normativas", "Procesos adaptados", "Informe de auditoría"], approach: "predictivo" },
      { name: "Plataforma de pagos instantáneos", objective: "Procesar pagos en menos de 10 segundos", deliverables: ["Pasarela de pagos", "Integración con comercios", "Panel de conciliación"], approach: "híbrido" }
    ],
    clients: ["Banco Meridiano", "Caja Rural del Valle", "PayFlux", "Neobank Arista"],
    roles: ["Supervisor bancario", "Departamento de cumplimiento", "Clientes particulares", "Comercios adheridos", "Equipo de ciberseguridad", "Auditoría interna"],
    risks: ["Sanción regulatoria por incumplimiento", "Ataque de fraude en el lanzamiento", "Caída del sistema en horas punta", "Retraso del proveedor de identidad digital", "Desconfianza de los clientes mayores"],
    opportunities: ["Alianza con un gran comercio electrónico", "Reutilizar el motor antifraude en otros productos"],
    constraints: ["Fecha límite regulatoria fija", "Disponibilidad del servicio del 99,9%"],
    sustainability: "promover la inclusión financiera y la accesibilidad"
  },
  {
    id: "publico", name: "Administración pública", budget: [100000, 2000000], months: [6, 24],
    templates: [
      { name: "Sede electrónica ciudadana", objective: "Que el 90% de los trámites se puedan hacer online", deliverables: ["Catálogo de trámites digitalizados", "Sede electrónica accesible", "Oficina de ayuda al ciudadano"], approach: "híbrido" },
      { name: "Plan de movilidad urbana", objective: "Reducir un 15% el tráfico en el centro", deliverables: ["Estudio de movilidad", "Zona de bajas emisiones", "Campaña de concienciación"], approach: "predictivo" },
      { name: "Censo digital de vivienda", objective: "Conocer el estado del parque de vivienda municipal", deliverables: ["Inventario georreferenciado", "Visor de datos abierto", "Informe de necesidades"], approach: "adaptativo" }
    ],
    clients: ["Ayuntamiento de Ríoclaro", "Gobierno Regional", "Diputación de Sierra Alta", "Ministerio de Transformación Digital"],
    roles: ["Ciudadanía", "Grupos políticos de la oposición", "Funcionariado", "Intervención (control del gasto)", "Asociaciones vecinales", "Empresa adjudicataria"],
    risks: ["Recurso a la licitación pública", "Cambio de gobierno tras elecciones", "Retraso en la tramitación administrativa", "Baja participación ciudadana", "Recorte presupuestario"],
    opportunities: ["Fondos europeos de recuperación", "Colaboración con la universidad pública"],
    constraints: ["Ley de contratos del sector público", "Presupuesto anual cerrado"],
    sustainability: "mejorar la transparencia y reducir emisiones urbanas"
  },
  {
    id: "ong", name: "ONG y cooperación", budget: [40000, 500000], months: [6, 24],
    templates: [
      { name: "Acceso a agua potable en zonas rurales", objective: "Dar acceso a agua segura a 5.000 personas", deliverables: ["Pozos y depósitos construidos", "Comités locales de agua formados", "Informe de impacto"], approach: "híbrido" },
      { name: "Banco de alimentos digital", objective: "Reducir un 30% el desperdicio de alimentos de la ciudad", deliverables: ["Plataforma de donaciones", "Red de voluntariado", "Logística de reparto"], approach: "adaptativo" },
      { name: "Programa de alfabetización de adultos", objective: "Alfabetizar a 800 personas adultas en dos años", deliverables: ["Materiales didácticos", "Red de aulas comunitarias", "Sistema de seguimiento"], approach: "predictivo" }
    ],
    clients: ["Fundación Manos Unidas por el Agua", "ONG Comparte", "Asociación Letras Libres", "Red Solidaria"],
    roles: ["Comunidades beneficiarias", "Donantes", "Voluntariado", "Autoridades locales", "ONG socias en terreno", "Agencia de cooperación"],
    risks: ["Inestabilidad política en la zona", "Retraso de la financiación del donante", "Baja implicación de la comunidad", "Problemas logísticos de transporte", "Rotación del voluntariado"],
    opportunities: ["Campaña viral de crowdfunding", "Alianza con una empresa con programa de RSC"],
    constraints: ["Justificación de gastos ante el donante", "Respeto a la cultura local"],
    sustainability: "asegurar que la comunidad pueda mantener el proyecto cuando termine"
  }
];
