/* =============================================================
   data/methodology.js
   Cuerpo de conocimiento — METODOLOGÍA DE TRABAJO
   Luciano Santo Domingo · Club Agropecuario Argentino (Carlos Casares, Argentina)

   Cada BLOQUE agrupa UNIDADES DE TRABAJO. Cada unidad se
   describe con la misma ficha para mantener un lenguaje común:
     objetivo · formato · espacio · duracion · claves · variantes · tags
   Editable desde la terminal (comando `bloque` y `trabajo`).
   ============================================================= */
window.LSD_METHODOLOGY = {
  meta: {
    autor: "Luciano Santo Domingo",
    rol: "Preparador Físico · Metodología de Entrenamiento",
    club: "Club Agropecuario Argentino · Carlos Casares, Argentina",
    version: "1.0",
    actualizado: "2026"
  },

  blocks: [
    /* ================================================== 01 */
    {
      id: "modelo",
      code: "01",
      title: "Modelo de Juego",
      short: "Modelo",
      desc: "La idea de juego escrita y la lógica con la que se reparte la semana: de qué manera el club quiere jugar y cómo se ordena el trabajo para llegar así al partido.",
      items: [
        {
          id: "modelo-juego",
          name: "Modelo de Juego",
          objetivo: "Definir la idea de juego en principios, subprincipios y sub-subprincipios para que cada tarea del microciclo tenga una razón de ser.",
          formato: "Documento vivo + pizarra + vídeo",
          espacio: "Aula / campo completo",
          duracion: "Transversal a la temporada",
          claves: [
            "Cuatro momentos: organización ofensiva, transición ofensiva, organización defensiva, transición defensiva.",
            "Cada momento se descompone en principios (qué), subprincipios (cómo) y sub-subprincipios (detalle individual/sectorial).",
            "El modelo condiciona la tarea: si no se puede leer el principio dentro del ejercicio, la tarea está mal diseñada.",
            "Se revisa por bloques de competencia, no cada semana."
          ],
          variantes: [
            "Versión reducida para categorías formativas",
            "Adaptación al perfil del plantel disponible",
            "Plan de partido: ajustes puntuales sobre el modelo sin romperlo"
          ],
          tags: [
            "conceptual",
            "planificación",
            "modelo"
          ]
        },
        {
          id: "periodizacion-tactica",
          name: "Periodización Táctica",
          objetivo: "Organizar la semana en torno al juego, alternando los patrones de contracción muscular y la complejidad táctica para llegar al partido en estado óptimo.",
          formato: "Morfociclo patrón semanal",
          espacio: "Campo completo y espacios fraccionados",
          duracion: "Ciclo de 6 a 7 días",
          claves: [
            "Principio de alternancia horizontal: tensión (MD-4), velocidad y duración (MD-3), táctico (MD-2).",
            "Principio de progresión compleja: la carga táctica sube a mitad de semana y baja hacia el partido.",
            "Principio de las propensiones: repetir el patrón hasta que aparezca sin ser nombrado.",
            "El balón es el medio, no un adorno: casi todo se entrena jugando."
          ],
          variantes: [
            "Microciclo de 5 días (miércoles-domingo)",
            "Semana de doble competencia: se sacrifica MD-3",
            "Semana larga (8-10 días) con doble pico de carga"
          ],
          tags: [
            "planificación",
            "carga",
            "conceptual"
          ]
        },
        {
          id: "morfociclo",
          name: "Morfociclo Patrón",
          objetivo: "Distribuir la semana entre partido y partido alternando patrones de esfuerzo y complejidad táctica.",
          formato: "MD+1 → MD-1 (6-7 días)",
          espacio: "—",
          duracion: "Semana completa",
          claves: [
            "MD+1: regenerativo para los titulares; los que no jugaron compensan con fútbol de 60' y fuerza.",
            "MD-4: tensión — fuerza, espacios reducidos, alta densidad de acciones.",
            "MD-3: velocidad y duración — sprints con el jugador fresco y después espacios amplios.",
            "MD-2: táctico sin oposición, definiciones, posesiones de activación y balón parado. 60'.",
            "MD-1: driles de aceleración, activación, balón parado y repaso táctico. 60'.",
            "La curva sube a mitad de semana y baja hacia el partido, siempre."
          ],
          variantes: [
            "Microciclo de 5 días",
            "Semana con partido entre semana (doble competencia)",
            "Semana sin competencia: doble pico de carga",
            "Pretemporada por fases: acumulación, transformación y puesta a punto antes del primer partido"
          ],
          tags: [
            "planificación",
            "microciclo",
            "carga"
          ]
        },
        {
          id: "doble-competencia",
          name: "Semana de Doble Competencia",
          objetivo: "Sostener el rendimiento con dos partidos en menos de cinco días sin acumular fatiga peligrosa.",
          formato: "Partido → +1 → -1 → Partido",
          espacio: "—",
          duracion: "3-4 días",
          claves: [
            "Se elimina el día de duración: no hay espacio para volumen.",
            "Prioridad absoluta a la recuperación de los que jugaron.",
            "Sesión táctica breve y clara: información antes que carga.",
            "Rotación planificada, decidida antes del primer partido y no después.",
            "Los que no jugaron entrenan la carga que el partido no les dio."
          ],
          variantes: [
            "Con viaje de por medio",
            "Con tres partidos en ocho días",
            "Semana de eliminación directa"
          ],
          tags: [
            "planificación",
            "competencia",
            "rotación"
          ]
        }
      ]
    },

    /* ================================================== 02 */
    {
      id: "sesion",
      code: "02",
      title: "Estructura de la Sesión",
      short: "Sesión",
      desc: "Cómo se arma cada entrenamiento por dentro: el orden de los bloques, la ficha con la que se escribe cada tarea y la gestión del día a día.",
      items: [
        {
          id: "sesion-tipo",
          name: "Estructura de la Sesión",
          objetivo: "Ordenar internamente cada entrenamiento para que la carga y la complejidad se distribuyan con lógica.",
          formato: "Activación → Núcleo 1 → Núcleo 2 → Aplicación → Vuelta a la calma",
          espacio: "Campo completo",
          duracion: "70 a 95 min",
          claves: [
            "Activación integrada con balón y patrón del día (10-15').",
            "Núcleo 1: tarea de menor escala (rondo, posesión, analítico).",
            "Núcleo 2: tarea de mayor escala orientada al principio semanal.",
            "Aplicación: formato más cercano al juego real.",
            "La densidad (trabajo/pausa) es la variable que define la sesión, no el volumen."
          ],
          variantes: [
            "Sesión doble turno (gimnasio + campo)",
            "Sesión de recuperación regenerativa",
            "Sesión pre-competitiva de activación"
          ],
          tags: [
            "organización",
            "sesión"
          ]
        },
        {
          id: "diseno-tarea",
          name: "Diseño y Codificación de Tareas",
          objetivo: "Estandarizar cómo se escribe, se nombra y se archiva cada tarea para que cualquier miembro del cuerpo técnico la ejecute igual.",
          formato: "Ficha de tarea + código alfanumérico",
          espacio: "—",
          duracion: "—",
          claves: [
            "Toda tarea lleva: objetivo, espacio, número de jugadores, tiempo, reglas y criterio de éxito.",
            "Código: BLOQUE-SUBTIPO-Nº (ej. SSG-COMOD-04).",
            "Las reglas provocadoras se declaran antes de la tarea, no se improvisan.",
            "Se registra siempre la carga estimada para poder comparar sesiones."
          ],
          variantes: [
            "Ficha corta para pizarra de vestuario",
            "Ficha extendida para el archivo metodológico",
            "Versión con vídeo asociado para el jugador"
          ],
          tags: [
            "organización",
            "documentación"
          ]
        },
        {
          id: "entrenamiento-estructurado",
          name: "Entrenamiento Estructurado",
          objetivo: "Trabajar al jugador como sistema de estructuras (condicional, coordinativa, cognitiva, socio-afectiva, emotivo-volitiva, creativo-expresiva, mental) en situaciones simuladoras preferenciales.",
          formato: "Situaciones simuladoras preferenciales y competitivas",
          espacio: "Variable según estructura dominante",
          duracion: "Bloques de 15 a 30 min",
          claves: [
            "Nunca se entrena una sola estructura: se elige cuál domina la tarea.",
            "La especificidad la define el contexto competitivo, no el gesto aislado.",
            "Se individualiza dentro de la tarea colectiva mediante roles y condicionantes.",
            "Complementario a la periodización táctica, no opuesto."
          ],
          variantes: [
            "Situación simuladora preferencial (SSP): estructura condicional dominante",
            "Situación simuladora competitiva (SSC): reglamento y marcador",
            "Trabajo optimizador individual previo a la sesión colectiva"
          ],
          tags: [
            "conceptual",
            "individualización"
          ]
        },
        {
          id: "sesion-diaria",
          name: "Gestión Diaria de la Sesión",
          objetivo: "Ajustar en el día lo que la planificación no puede prever: estado real del plantel, clima, campo y contexto.",
          formato: "Check-in previo + ajuste en vivo",
          espacio: "—",
          duracion: "Diario",
          claves: [
            "El plan es una hipótesis; el estado del plantel es el dato.",
            "Ajustar espacio y densidad antes que eliminar tareas.",
            "El jugador en riesgo entrena distinto, no entrena menos por defecto.",
            "Todo ajuste se registra: sin registro no hay aprendizaje metodológico."
          ],
          variantes: [
            "Sesión reducida por clima o estado del campo",
            "Plan alternativo bajo techo",
            "Sesión individualizada por grupos de carga"
          ],
          tags: [
            "planificación",
            "gestión",
            "sesión"
          ]
        }
      ]
    },

    /* ================================================== 03 */
    {
      id: "warmup",
      code: "03",
      title: "Warm Up · Activaciones",
      short: "Warm Up",
      desc: "La entrada en calor como parte del entrenamiento y no como trámite: movilidad, balón, salidas cortas y la rutina fija del día de partido.",
      items: [
        {
          id: "activacion-general",
          name: "Activación General · Movilidad y Core",
          objetivo: "Preparar el cuerpo para la sesión: movilidad de las articulaciones que van a trabajar y estabilidad del centro para transmitir fuerza.",
          formato: "Circuito de 6-8 estaciones · 2 vueltas",
          espacio: "Media cancha o gimnasio",
          duracion: "12-18 min",
          claves: [
            "Movilidad activa, no estiramiento sostenido: se mueve la articulación, no se cuelga de ella.",
            "Core en sus cuatro patrones: anti-extensión, anti-rotación, anti-flexión lateral y anti-flexión.",
            "Se prioriza la estabilidad dinámica sobre el número de repeticiones.",
            "Dosis baja y diaria antes que una sesión larga una vez por semana."
          ],
          variantes: [
            "Pallof press, dead bug, plancha con desplazamiento, rueda abdominal",
            "Versión corta de 8 minutos para los días de volumen alto",
            "Progresión a patrones de fuerza rotacional (lanzamientos)"
          ],
          tags: [
            "warm up",
            "movilidad",
            "core"
          ]
        },
        {
          id: "activacion-balon",
          name: "Activación con Balón · Rondo de Entrada",
          objetivo: "Entrar en la sesión compitiendo con el balón: subir pulsaciones, despertar la percepción y poner el pie fino desde el primer minuto.",
          formato: "Rondo 4v2 o 5v2 · 3-4 series de 2-3'",
          espacio: "Cuadrado de 8×8 a 12×12 m",
          duracion: "10-14 min",
          claves: [
            "Es activación, no relleno: se compite, se cuenta y se corrige.",
            "Perfil abierto antes de recibir: el cuerpo decide el pase, no el pie.",
            "Los defensores entran en pareja, nunca sueltos.",
            "En el MD-2 es la posesión de activación previa al táctico sin oposición."
          ],
          variantes: [
            "Con toques limitados (2 y 1 toque)",
            "Con comodín central que obliga al apoyo interior",
            "Circulación en cuadrado con dos balones para subir el ritmo"
          ],
          tags: [
            "warm up",
            "rondo",
            "activación",
            "MD-2"
          ]
        },
        {
          id: "driles-aceleracion",
          name: "Driles de Aceleración",
          objetivo: "Despertar el sistema neuromuscular con salidas cortas y de calidad, sin dejar fatiga: es activación, no entrenamiento de velocidad.",
          formato: "4-6 salidas de 10-20 m · pausa completa",
          espacio: "Recta de 30 m",
          duracion: "8-12 min",
          claves: [
            "Volumen mínimo y pausa completa: si aparece fatiga, dejó de ser activación.",
            "Técnica de aceleración: proyección del cuerpo, ángulos de empuje y brazos.",
            "Salidas desde distintas posiciones y con estímulo visual o auditivo.",
            "Es el contenido del MD-1: el cuerpo llega despierto al partido."
          ],
          variantes: [
            "Con balón en el último tramo de la salida",
            "En parejas, con persecución corta",
            "Integrados dentro de la activación pre-competitiva"
          ],
          tags: [
            "warm up",
            "velocidad",
            "MD-1"
          ]
        },
        {
          id: "activacion-pre",
          name: "Activación Pre-competitiva",
          objetivo: "Llegar al pitazo inicial activado y con la cabeza en el plan, sin gastar nada de lo que hace falta para competir.",
          formato: "Bloque de 15-20 min en el campo de juego",
          espacio: "Media cancha",
          duracion: "15-20 min",
          claves: [
            "Secuencia fija: movilidad, circulación con balón, salidas cortas y acciones del plan.",
            "La rutina se repite igual todas las semanas: la previsibilidad calma.",
            "Sin novedades técnicas ni correcciones nuevas: lo que no se entrenó no se improvisa.",
            "Se cierra con el balón parado ya ensayado, no con una charla larga."
          ],
          variantes: [
            "Versión de vestuario cuando el campo no está disponible",
            "Rutina individual para el arquero y los suplentes",
            "Reactivación en el entretiempo para quien va a entrar"
          ],
          tags: [
            "warm up",
            "competencia",
            "rutina"
          ]
        }
      ]
    },

    /* ================================================== 04 */
    {
      id: "fuerza",
      code: "04",
      title: "Fuerza y Rendimiento Físico",
      short: "Fuerza",
      desc: "El trabajo de fuerza en todas sus manifestaciones, del gimnasio al campo: la estructura que sostiene todo lo demás.",
      items: [
        {
          id: "fuerza-maxima",
          name: "Fuerza Máxima / Base Estructural",
          objetivo: "Elevar el techo de producción de fuerza y la robustez del tejido para sostener el resto de las manifestaciones.",
          formato: "3-5 series × 3-6 rep · 80-90% 1RM",
          espacio: "Gimnasio",
          duracion: "40-55 min",
          claves: [
            "Ejercicios eje: sentadilla, peso muerto rumano, hip thrust, empuje y tracción de tren superior.",
            "Velocidad de ejecución controlada en excéntrico, intención máxima en concéntrico.",
            "Control por velocidad de ejecución (VBT) cuando hay encoder disponible.",
            "Ubicación semanal: MD-4, tras el entrenamiento de campo o en turno separado."
          ],
          variantes: [
            "Unilateral (split squat búlgaro, peso muerto a una pierna)",
            "Bloque de acumulación en pretemporada (6-10 rep)",
            "Mantenimiento en competencia: 2 series de calidad"
          ],
          tags: [
            "gimnasio",
            "fuerza",
            "MD-4"
          ]
        },
        {
          id: "potencia",
          name: "Fuerza Explosiva y Potencia",
          objetivo: "Mejorar la tasa de desarrollo de fuerza (RFD) en el rango de tiempo real del fútbol: acciones por debajo de 250 ms.",
          formato: "4-6 series × 3-5 rep · 30-60% 1RM · máxima intención",
          espacio: "Gimnasio / campo",
          duracion: "25-35 min",
          claves: [
            "Derivados de los olímpicos (cargada desde alto, arranque colgante) si la técnica lo permite.",
            "Saltos con carga, empujes balísticos, lanzamientos de balón medicinal.",
            "Pausas completas (2-3'): la fatiga arruina el estímulo.",
            "Se corta la serie cuando cae la velocidad, no cuando se acaban las repeticiones.",
            "La pliometría entra acá: extensivo (multisaltos) antes que intensivo (drop jump), y calidad de aterrizaje antes que altura."
          ],
          variantes: [
            "Contrastes (complex training): fuerza pesada + gesto explosivo",
            "Clusters intra-serie",
            "Trabajo balístico sin implemento para jugadores en carga alta",
            "Pliometría horizontal (bounds, saltos de longitud) para transferir a la aceleración",
            "Pliometría vertical (CMJ, drop jump) para el juego aéreo",
            "Contactos totales controlados por semana: es muy sensible a la fatiga"
          ],
          tags: [
            "gimnasio",
            "potencia",
            "RFD"
          ]
        },
        {
          id: "fuerza-especifica",
          name: "Fuerza Específica en Campo",
          objetivo: "Trasladar la fuerza del gimnasio al gesto competitivo con resistencias que respetan el patrón de carrera y de duelo.",
          formato: "6-10 repeticiones de 10-20 m",
          espacio: "Pasillo de 30 m",
          duracion: "20-30 min",
          claves: [
            "Trineo pesado (>40% masa corporal) para la fase de aceleración inicial.",
            "Trineo ligero y gomas para la fase de transición.",
            "Duelos de hombro y trabajo de apoyo con oposición real.",
            "Se integra con balón siempre que sea posible para no perder especificidad."
          ],
          variantes: [
            "Resistido + liberado (contraste)",
            "Arrastres con cambio de dirección",
            "Cuestas de 6-10% de pendiente"
          ],
          tags: [
            "campo",
            "fuerza",
            "aceleración"
          ]
        },
        {
          id: "velocidad",
          name: "Aceleración y Velocidad Máxima",
          objetivo: "Exponer al jugador a velocidades cercanas al máximo de forma regular: es el mejor estímulo de rendimiento y el mejor seguro contra la lesión de isquiosurales.",
          formato: "6-10 sprints de 20-40 m · pausa 3-5'",
          espacio: "Recta de 60 m",
          duracion: "20-30 min",
          claves: [
            "Al menos una exposición semanal por encima del 90-95% de la velocidad máxima individual.",
            "Técnica de aceleración: proyección, ángulos de empuje, brazos.",
            "Velocidad máxima: mecánica de ciclo, contacto breve, cadera alta.",
            "Ubicación semanal: MD-3, al inicio de la sesión y con el jugador fresco.",
            "El cambio de dirección va en el mismo día: primero se entrena frenar, que es la acción de mayor coste mecánico."
          ],
          variantes: [
            "Driles de aceleración en el MD-1: dos o tres salidas cortas dentro de la activación",
            "Salidas desde distintas posiciones y estímulos (visual, auditivo, con balón)",
            "Sprints curvos (más frecuentes en el juego real que los rectos)",
            "Persecuciones y duelos de velocidad",
            "COD por ángulos: 45°, 90° y 180°, cada uno con su técnica",
            "Agilidad reactiva: espejo, 1v1 o señal, para sumar decisión al patrón"
          ],
          tags: [
            "campo",
            "velocidad",
            "prevención",
            "MD-3"
          ]
        },
        {
          id: "resistencia",
          name: "Resistencia Intermitente y HIIT",
          objetivo: "Sostener la capacidad de repetir esfuerzos de alta intensidad y acelerar la recuperación entre acciones.",
          formato: "Series cortas 15\"/15\" · largas 3-4' · repetidas 6×30 m",
          espacio: "Campo completo o media cancha",
          duracion: "18-30 min",
          claves: [
            "Referencia individual: velocidad aeróbica máxima (VAM) o test 30-15 IFT.",
            "HIIT corto para carga cardiovascular con bajo coste mecánico.",
            "HIIT largo para potencia aeróbica en pretemporada.",
            "RSA (sprints repetidos) muy exigente: dosis mínima efectiva, lejos del partido.",
            "En competencia, gran parte de esta carga llega dentro de los juegos reducidos."
          ],
          variantes: [
            "Integrado con balón (circuitos técnicos a intensidad controlada)",
            "Compensatorio para jugadores con menos minutos",
            "Formato de carrera continua sólo en reintegración"
          ],
          tags: [
            "campo",
            "resistencia",
            "carga"
          ]
        },
        {
          id: "prevencion",
          name: "Prevención Lesional",
          objetivo: "Reducir la incidencia y la gravedad de las lesiones más frecuentes: isquiosurales, aductores, tobillo y rodilla.",
          formato: "2-3 sesiones semanales de 12-20 min",
          espacio: "Gimnasio / campo",
          duracion: "12-20 min",
          claves: [
            "Isquiosurales: Nordic curl y trabajo excéntrico en longitudes largas.",
            "Aductores: Copenhagen adduction, progresión por palanca.",
            "Tobillo y rodilla: propiocepción, control de aterrizaje y fortalecimiento de gemelo/sóleo.",
            "El protocolo FIFA 11+ como base estandarizada del calentamiento.",
            "La mejor prevención sigue siendo exponer al jugador a alta velocidad de forma progresiva.",
            "La readaptación cuelga de acá: se progresa por criterios objetivos —fuerza, simetría, tolerancia a la velocidad—, no por calendario."
          ],
          variantes: [
            "Programa individual para jugadores con antecedentes",
            "Versión de campo integrada en la activación",
            "Bloque de refuerzo en día post-partido para no participantes",
            "Reexposición progresiva al sprint y al cambio de dirección antes de volver al grupo",
            "Reintegración parcial: primero tareas de baja densidad, después juego reducido",
            "Programa de mantenimiento post-alta durante 6-8 semanas"
          ],
          tags: [
            "prevención",
            "salud",
            "gimnasio"
          ]
        }
      ]
    },

    /* ================================================== 05 */
    {
      id: "ssg",
      code: "05",
      title: "Juegos Reducidos · Small-Sided Games",
      short: "Reducidos",
      desc: "El formato madre del entrenamiento: jugar con menos jugadores y menos espacio para multiplicar las acciones y decidir el tipo de carga con las reglas.",
      items: [
        {
          id: "ssg-1v1",
          name: "SSG 1v1 y 2v2 · Duelo",
          objetivo: "Máxima frecuencia de duelo, conducción, regate y definición. Altísima densidad de acciones por jugador.",
          formato: "1v1 / 2v2 · series de 20-45\" · pausa 1:3 a 1:5",
          espacio: "12×10 a 25×20 m",
          duracion: "8-14 min efectivos",
          claves: [
            "Carga neuromuscular muy alta: frenadas, cambios de dirección y aceleraciones constantes.",
            "Pausas amplias o el formato pierde intensidad y se vuelve resistencia mal disfrazada.",
            "Se ubica lejos del partido (MD-4/MD-3) por el coste mecánico.",
            "Ideal para trabajar coraje competitivo y conducta ante el error."
          ],
          variantes: [
            "Con porterías pequeñas o línea de gol",
            "Con arquero para orientar la definición",
            "Con reposición inmediata de balón (juego continuo)"
          ],
          tags: [
            "SSG",
            "duelo",
            "MD-4"
          ]
        },
        {
          id: "ssg-3v3",
          name: "SSG 3v3 y 4v4 · Formato Madre",
          objetivo: "El equilibrio clásico entre participación individual y estructura colectiva mínima: apoyo, ayuda y tercer hombre.",
          formato: "3v3 / 4v4 · 4-6 series de 2-4' · pausa 1:1 a 1:2",
          espacio: "30×20 a 40×30 m",
          duracion: "16-24 min efectivos",
          claves: [
            "Aparecen los tres roles básicos: portador, apoyo y tercer hombre.",
            "Área por jugador entre 60 y 150 m²: por debajo se vuelve técnico, por encima se vuelve físico.",
            "El número de porterías define el comportamiento tanto como el número de jugadores.",
            "Carga cardiovascular alta con coste mecánico moderado."
          ],
          variantes: [
            "4 mini-arcos: obliga al cambio de orientación",
            "Con comodines exteriores: garantiza superioridad y circulación",
            "Con línea de pase en profundidad en vez de arco"
          ],
          tags: [
            "SSG",
            "posesión",
            "MD-3"
          ]
        },
        {
          id: "ssg-5v5",
          name: "SSG 5v5 a 9v9 · Estructura Intermedia y Gran Formato",
          objetivo: "Introducir estructura posicional reconocible (líneas, alturas, amplitud) manteniendo alta participación.",
          formato: "5v5 / 6v6 / 7v7 · 3-5 series de 4-6'",
          espacio: "50×35 a 68×45 m",
          duracion: "20-30 min efectivos",
          claves: [
            "Se puede pedir ocupación racional de espacios sin caer en un 11v11.",
            "Formato ideal para trabajar principios de presión y de salida a escala.",
            "Con arqueros el juego se vuelve más real y aparecen las alturas de bloque.",
            "Buen compromiso entre carga aeróbica y transferencia táctica.",
            "Del 8v8 en adelante sube la distancia recorrida y el volumen de alta velocidad, y baja la frecuencia de contactos: es el formato que más kilómetros acumula."
          ],
          variantes: [
            "Con zonas prohibidas o zonas de valor doble",
            "Con condicionante de toques por zona (libre atrás, 2 toques adelante)",
            "Con arqueros y fuera de juego activo",
            "8v8 o 9v9 en 70×50 para acercarse a la estructura real del partido",
            "Con un equipo en inferioridad para entrenar el bloque bajo"
          ],
          tags: [
            "SSG",
            "táctico",
            "MD-3"
          ]
        },
        {
          id: "ssg-comodines",
          name: "SSG con Comodines y Superioridad",
          objetivo: "Garantizar la circulación y facilitar el principio ofensivo mediante superioridad numérica estable.",
          formato: "4v4+2 / 6v6+3 · 4-6 series de 3-5'",
          espacio: "35×30 a 55×40 m",
          duracion: "18-28 min efectivos",
          claves: [
            "Comodín interior: favorece el juego entre líneas y el tercer hombre.",
            "Comodín exterior: favorece la amplitud y el cambio de orientación.",
            "Los comodines se rotan para que nadie descanse siempre en el mismo rol.",
            "Superioridad permanente = menos duelo; se compensa con reglas de presión."
          ],
          variantes: [
            "Comodines fijos por banda",
            "Comodín flotante único de alta exigencia",
            "Superioridad temporal: se pierde tras 6 pases"
          ],
          tags: [
            "SSG",
            "posesión",
            "superioridad"
          ]
        },
        {
          id: "ssg-reglas",
          name: "SSG con Reglas Provocadoras",
          objetivo: "Condicionar el comportamiento del jugador sin darle la instrucción explícita: que el problema del juego genere la solución buscada.",
          formato: "Cualquier formato + regla condicional",
          espacio: "Variable",
          duracion: "Variable",
          claves: [
            "Toques limitados: acelera el ritmo de circulación y obliga a preorientarse.",
            "Zonas de finalización: obliga a atacar por dónde el modelo pide.",
            "Gol de valor doble tras cambio de orientación o tras recuperación en campo rival.",
            "Tiempo límite para finalizar: fuerza la verticalidad.",
            "Una regla por tarea. Dos ya confunden; tres desvirtúan el juego."
          ],
          variantes: [
            "Restricción por zona (libre en propio campo, 2 toques en campo rival)",
            "Obligación de pase a un perfil o línea concreta",
            "Bonificación por recuperación en menos de 5 segundos",
            "Con porterías múltiples o desplazadas para orientar la circulación",
            "Orientado a una fase concreta: salida, progresión, presión o repliegue"
          ],
          tags: [
            "SSG",
            "condicionantes",
            "táctico"
          ]
        }
      ]
    },

    /* ================================================== 06 */
    {
      id: "posesion",
      code: "06",
      title: "Juegos de Posesión",
      short: "Posesión",
      desc: "Del rondo al juego de posición: la familia de tareas que educa la circulación, la orientación corporal, el tercer hombre y la ocupación racional del espacio.",
      items: [
        {
          id: "rondo-base",
          name: "Rondo 4v2 / 5v2",
          objetivo: "Velocidad de circulación, calidad de pase y orientación corporal bajo presión inmediata.",
          formato: "4v2 o 5v2 · series de 2-4'",
          espacio: "Cuadrado de 8×8 a 12×12 m",
          duracion: "8-14 min",
          claves: [
            "El pase que rompe la línea de los dos defensores vale doble: buscar el pase interior.",
            "Perfil abierto antes de recibir: el cuerpo decide el pase, no el pie.",
            "Los defensores entran a presionar en pareja, nunca sueltos.",
            "Es activación, no relleno: se compite y se cuenta.",
            "Como posesión de activación entra en el MD-2, antes del táctico sin oposición."
          ],
          variantes: [
            "Con toques limitados (2 y 1 toque)",
            "Con comodín central que obliga al apoyo interior",
            "Rondo de castigo: el que pierde pasa al medio"
          ],
          tags: [
            "rondo",
            "técnico",
            "activación",
            "MD-2"
          ]
        },
        {
          id: "rondo-dinamico",
          name: "Rondo Dinámico con Salida",
          objetivo: "Añadir intención al rondo: conservar para progresar, no para conservar.",
          formato: "5v2 + salida a zona / 6v3 con dos cuadrados",
          espacio: "Dos cuadrados de 10×10 m separados 8 m",
          duracion: "10-16 min",
          claves: [
            "Tras N pases se habilita la salida al segundo espacio.",
            "El que da el pase de salida acompaña: se entrena la ocupación tras el pase.",
            "Los defensores persiguen al espacio nuevo: aparece la transición.",
            "Se penaliza el pase de salida forzado sin condición cumplida."
          ],
          variantes: [
            "Con dos zonas de salida (elección)",
            "Con oposición que puede robar y atacar arco",
            "Con límite de tiempo para salir"
          ],
          tags: [
            "rondo",
            "progresión",
            "táctico"
          ]
        },
        {
          id: "juego-posicion-443",
          name: "Juego de Posición 4v4+3",
          objetivo: "El formato clásico de juego posicional: superioridad estable, líneas de pase permanentes y ocupación de las cuatro esquinas.",
          formato: "4v4 + 3 comodines · series de 4-6'",
          espacio: "Cuadrado de 20×20 a 30×30 m",
          duracion: "18-26 min",
          claves: [
            "Los comodines juegan siempre con quien tiene el balón: superioridad 7v4.",
            "Objetivo: N pases consecutivos o pase al comodín contrario del campo.",
            "Ocupar las cuatro esquinas y el centro: nunca dos jugadores en la misma línea de pase.",
            "El pase interior al comodín central es el que se busca; el exterior es la salida segura."
          ],
          variantes: [
            "Comodines sólo exteriores (amplitud)",
            "Comodín central único (juego interior)",
            "Con contraataque del equipo que recupera",
            "6v3 o 7v3 cuando se busca más circulación y menos densidad defensiva",
            "Mantenimiento en espacio amplio, sin objetivo de progresión, para bajar la exigencia"
          ],
          tags: [
            "posesión",
            "juego de posición",
            "estructura"
          ]
        },
        {
          id: "posesion-orientada",
          name: "Posesión Orientada",
          objetivo: "Convertir la posesión en progresión: conservar el balón con una dirección y un objetivo definidos.",
          formato: "6v6, 8v8 con zonas de finalización",
          espacio: "Media cancha con dos zonas de gol",
          duracion: "18-28 min",
          claves: [
            "El gol es conducir/controlar en la zona objetivo, no rematar.",
            "Se entrena el cuándo: circular hasta encontrar la línea de progresión.",
            "Se prohíbe el pase largo directo a la zona: hay que construir.",
            "Los apoyos de espalda y el tercer hombre son la vía natural de entrada."
          ],
          variantes: [
            "Con porterías y arqueros para cerrar la acción",
            "Con zona intermedia prohibida (juego directo forzado)",
            "Con puntuación por entrada en zona interior"
          ],
          tags: [
            "posesión",
            "progresión",
            "táctico"
          ]
        },
        {
          id: "posesion-lineas",
          name: "Posesión por Líneas y Cambio de Orientación",
          objetivo: "Educar la circulación entre líneas y el cambio de lado como recurso para desequilibrar bloques cerrados.",
          formato: "Campo dividido en 3 zonas verticales · 8v8",
          espacio: "60×45 m dividido en pasillos",
          duracion: "16-26 min",
          claves: [
            "Cada zona tiene un número máximo de jugadores: obliga a ocupar racionalmente.",
            "El cambio de orientación completo (de pasillo a pasillo) puntúa.",
            "Se busca fijar en un lado antes de cambiar: sin fijación, el cambio no sirve.",
            "El pase entre líneas cambia el ritmo de la circulación: se marca con voz."
          ],
          variantes: [
            "Con pasillos horizontales en vez de verticales",
            "Con jugadores fijos por zona (roles posicionales reales)",
            "Con liberación progresiva de las restricciones"
          ],
          tags: [
            "posesión",
            "orientación",
            "estructura"
          ]
        }
      ]
    },

    /* ================================================== 07 */
    {
      id: "circuitos",
      code: "07",
      title: "Circuitos de Pase",
      short: "Circuitos",
      desc: "Trabajo sin oposición o con oposición pasiva: recorridos, ruedas de pase y circuitos que fijan los patrones del modelo sin coste físico ni riesgo.",
      items: [
        {
          id: "rueda-pases",
          name: "Rueda de Pases y Control Orientado",
          objetivo: "Automatizar la calidad del pase y la recepción orientada a velocidad de partido, con el circuito como medio y no como fin.",
          formato: "Rueda de 8-12 jugadores · series de 3-4'",
          espacio: "Cuadrado o rombo de 20×20 m",
          duracion: "12-18 min",
          claves: [
            "La recepción se orienta hacia donde sigue el juego: el control ya es el primer pase.",
            "Velocidad de balón de partido: si se hace lento, no transfiere.",
            "Se cambia de sentido a mitad de la serie para trabajar los dos perfiles.",
            "Dos o tres circuitos como máximo, repetidos hasta que salgan sin indicación."
          ],
          variantes: [
            "Con pared y tercer hombre incorporados al recorrido",
            "Con dos balones simultáneos para forzar la percepción",
            "Terminando en centro o en definición"
          ],
          tags: [
            "circuito",
            "técnico",
            "pase"
          ]
        },
        {
          id: "circulacion-sin-oposicion",
          name: "Circulación sin Oposición",
          objetivo: "Recorrer los movimientos del modelo a velocidad de partido y sin rival, para fijar los recorridos sin coste físico ni riesgo.",
          formato: "11v0 o 11v11 con rival pasivo",
          espacio: "Campo completo",
          duracion: "15-20 min",
          claves: [
            "La velocidad del balón es la del partido, aunque no haya presión: si se hace lento no sirve.",
            "Se corrigen posiciones y recorridos, no decisiones: para decidir hace falta un rival.",
            "Dos o tres circuitos como máximo, repetidos hasta que salgan sin indicación.",
            "Es memoria motriz, no táctica nueva: nada que no se haya entrenado antes con oposición."
          ],
          variantes: [
            "Con rival pasivo que sólo ocupa espacios, sin disputar",
            "Sólo la salida desde el arquero, o sólo el último tercio",
            "Con señales del entrenador para cambiar de circuito en marcha"
          ],
          tags: [
            "táctico",
            "MD-2",
            "sin oposición"
          ]
        },
        {
          id: "circuitos-finalizacion",
          name: "Circuitos de Finalización",
          objetivo: "Acumular volumen de remate con calidad técnica y sin fatiga acumulada.",
          formato: "Estaciones con arquero · 8-12 remates por jugador",
          espacio: "Último tercio, dos arcos",
          duracion: "15-20 min",
          claves: [
            "Siempre con arquero: sin arquero no hay decisión.",
            "Pausas suficientes: el remate se entrena fresco.",
            "Variar el pie, la altura del balón y la distancia.",
            "El pase previo debe ser de calidad de partido, no de conveniencia.",
            "El circuito termina siempre en definición: el último gesto es el que se busca automatizar."
          ],
          variantes: [
            "Con pase de espalda y giro",
            "Con conducción previa y remate en carrera",
            "Con dos toques máximo dentro del área",
            "Terminación en 1v1 con arquero, trabajando la decisión y el perfil de salida",
            "Llegada de segunda línea al remate desde fuera del área"
          ],
          tags: [
            "finalización",
            "técnico",
            "MD-2"
          ]
        },
        {
          id: "centro-remate",
          name: "Centro y Remate",
          objetivo: "Coordinar el ataque del área: quién va al primer palo, quién al segundo, quién al punto de penal y quién a la frontal.",
          formato: "Centros desde ambos costados · 3-5 atacantes",
          espacio: "Área grande + carriles exteriores",
          duracion: "15-25 min",
          claves: [
            "Cuatro zonas de ataque del área siempre cubiertas.",
            "Los tiempos de la carrera importan más que la velocidad de la carrera.",
            "El centro raso al primer palo y el centro atrás son las opciones de mayor rendimiento.",
            "La segunda jugada (rechace) se ensaya igual que la primera."
          ],
          variantes: [
            "Con oposición defensiva pasiva y luego real",
            "Con centro tras conducción, tras pared o tras cambio de orientación",
            "Con obligación de rematar de primera"
          ],
          tags: [
            "finalización",
            "ataque",
            "área"
          ]
        }
      ]
    },

    /* ================================================== 08 */
    {
      id: "tactico-analitico",
      code: "08",
      title: "Tareas Tácticas Analíticas",
      short: "Analíticas",
      desc: "Táctica por sectores y por fases, con oposición parcial: se aísla una parte del juego para corregirla antes de devolverla al todo.",
      items: [
        {
          id: "salida-balon",
          name: "Salida de Balón · Primera Fase",
          objetivo: "Construir desde el arquero y la línea defensiva superando la primera línea de presión rival.",
          formato: "6v4, 7v5 + arqueros · series de 4-6'",
          espacio: "Desde línea de fondo hasta media cancha",
          duracion: "20-30 min",
          claves: [
            "Primera decisión: salida corta, media o directa según la altura de la presión rival.",
            "Amplitud máxima de los centrales y altura de los laterales según estructura elegida.",
            "El pivote se ofrece en la línea de pase interior, no detrás del rival.",
            "Si el rival presiona con superioridad, se juega directo y se disputa la segunda pelota.",
            "Superada la primera línea, el pase siguiente debe ser hacia adelante."
          ],
          variantes: [
            "Salida con tres centrales / con pivote descolgado",
            "Contra presión hombre a hombre",
            "Con activación de la presión sólo tras el primer pase"
          ],
          tags: [
            "ofensivo",
            "construcción",
            "11v11"
          ]
        },
        {
          id: "progresion",
          name: "Progresión y Juego Interior",
          objetivo: "Avanzar del medio campo al último tercio con control, atacando los espacios entre líneas.",
          formato: "8v8 zonificado · series de 5-8'",
          espacio: "Tres cuartos de campo",
          duracion: "20-30 min",
          claves: [
            "Buscar al hombre libre entre líneas antes que al hombre más adelantado.",
            "El apoyo de espalda necesita un tercer hombre preparado para el rebote.",
            "Conducción para fijar y liberar: el que conduce debe atraer a un rival.",
            "Los interiores atacan el espacio cuando el balón está controlado, no antes."
          ],
          variantes: [
            "Con zona interior de valor doble",
            "Con obligación de recibir de frente en zona intermedia",
            "Con presión rival de bloque medio real"
          ],
          tags: [
            "ofensivo",
            "progresión",
            "11v11"
          ]
        },
        {
          id: "linea-defensiva",
          name: "Línea Defensiva · Coberturas y Fuera de Juego",
          objetivo: "Coordinar la última línea: subir, bajar, cubrir, permutar y aplicar el fuera de juego con criterio.",
          formato: "Trabajo sectorial 4v2, 4v4 + arquero",
          espacio: "Último tercio",
          duracion: "12-20 min",
          claves: [
            "La línea sube cuando el portador no puede jugar hacia adelante.",
            "Cobertura al lado del balón, permuta si el compañero es superado.",
            "El fuera de juego se aplica en conjunto y con voz única.",
            "El arquero es el quinto defensor: su altura acompaña la de la línea.",
            "Ante pase a la espalda: girar y perseguir, nunca quedarse reclamando."
          ],
          variantes: [
            "Con tres centrales y carrileros",
            "Con estímulo visual del entrenador para subir/bajar",
            "Integrado en el trabajo de bloque completo"
          ],
          tags: [
            "defensivo",
            "sectorial",
            "línea"
          ]
        },
        {
          id: "bloque-medio",
          name: "Bloque Medio y Basculación",
          objetivo: "Sostener una estructura compacta en campo propio, orientar al rival y recuperar en zonas definidas.",
          formato: "10v10 con zonas de recuperación",
          espacio: "Dos tercios de campo",
          duracion: "18-28 min",
          claves: [
            "Distancias: 8-12 m entre líneas, 6-10 m entre compañeros de línea.",
            "Se defiende el centro; se concede el costado.",
            "Basculación con referencia al balón, no al rival directo.",
            "El delantero define el lado de la basculación con su posición.",
            "Recuperar y salir: la recuperación sin primer pase útil no cuenta."
          ],
          variantes: [
            "Con altura de bloque variable por señal",
            "Con superioridad rival para exigir compactación",
            "Con puntuación por recuperación en zona objetivo"
          ],
          tags: [
            "defensivo",
            "bloque",
            "11v11"
          ]
        },
        {
          id: "bloque-bajo",
          name: "Bloque Bajo y Defensa del Área",
          objetivo: "Proteger el arco con el bloque replegado: control de área, marca de rematadores y despeje orientado.",
          formato: "11v11 con inferioridad defensiva",
          espacio: "Último tercio y área",
          duracion: "15-25 min",
          claves: [
            "Nadie entra al área sin referencia: hombre y espacio a la vez.",
            "Segunda pelota: el volante de contención vive en la frontal.",
            "Despeje orientado a banda y arriba: nunca al centro.",
            "Tras el despeje, subir la línea de forma inmediata y coordinada.",
            "Defender el centro del área es innegociable; el remate lejano se concede."
          ],
          variantes: [
            "Con centros continuos desde ambos costados",
            "Con superioridad rival 11v8",
            "Con salida rápida obligatoria tras recuperar"
          ],
          tags: [
            "defensivo",
            "área",
            "11v11"
          ]
        }
      ]
    },

    /* ================================================== 09 */
    {
      id: "tactico-global",
      code: "09",
      title: "Tareas Tácticas Globales",
      short: "Globales",
      desc: "El juego completo: gran formato, transiciones, plan de partido y balón parado, donde todo lo entrenado por partes vuelve a aparecer junto.",
      items: [
        {
          id: "ataque-posicional",
          name: "Ataque Posicional 11v11",
          objetivo: "Ordenar el ataque contra bloque medio-bajo con ocupación racional y ataque coordinado de espacios.",
          formato: "11v11 o 11v10 zonificado",
          espacio: "Campo completo",
          duracion: "20-35 min",
          claves: [
            "Ocupación de los cinco pasillos y de las tres alturas.",
            "Fijar en un costado, cambiar y atacar el lado débil.",
            "Movimientos coordinados: uno al espacio, otro al pie, un tercero de rebote.",
            "Equilibrio permanente: dos o tres jugadores preparando la transición defensiva."
          ],
          variantes: [
            "Contra bloque bajo con 10 jugadores dentro del área grande",
            "Con límite de tiempo para finalizar",
            "Con contragolpe habilitado para el equipo defensor",
            "Con finalización obligada dentro de un tiempo, para que la posesión termine en remate"
          ],
          tags: [
            "ofensivo",
            "11v11",
            "estructura"
          ]
        },
        {
          id: "presion-alta",
          name: "Presión Alta y Trampas de Presión",
          objetivo: "Recuperar el balón cerca del arco rival mediante activación coordinada y orientación de la presión.",
          formato: "10v10 / 11v11 con activación por señal",
          espacio: "Campo completo, foco en campo rival",
          duracion: "20-30 min",
          claves: [
            "El disparador de la presión se define antes: pase a un perfil, control malo, pase al lateral.",
            "El primer presionador orienta con su carrera; el resto cierra las líneas interiores.",
            "Basculación conjunta: la línea defensiva sube y comprime el bloque a 30-35 m.",
            "Si se rompe la primera presión, repliegue inmediato y ordenado, no persecución individual.",
            "La trampa de presión es voluntaria: se deja libre una zona para robar allí."
          ],
          variantes: [
            "Presión hombre a hombre en toda la cancha",
            "Presión con arquero rival incluido",
            "Activación sólo en saques de arco"
          ],
          tags: [
            "defensivo",
            "presión",
            "11v11"
          ]
        },
        {
          id: "transicion-ofensiva",
          name: "Transición Ofensiva · Contraataque",
          objetivo: "Aprovechar el desorden rival en los segundos posteriores a la recuperación.",
          formato: "4v3, 5v4, 6v5 con reposición continua",
          espacio: "Media cancha a campo completo",
          duracion: "15-25 min",
          claves: [
            "Primer pase hacia adelante si existe; si no, controlar y volver a construir.",
            "Tres carreras simultáneas: profundidad, ancho y apoyo.",
            "Ventana de oportunidad de 6 a 10 segundos: después el rival ya está ordenado.",
            "Decidir rápido no es apurarse: la última acción se ejecuta con calma."
          ],
          variantes: [
            "Con inicio desde recuperación en juego reducido",
            "Con contraataque largo (más de 60 m)",
            "Con límite de toques o de tiempo para finalizar"
          ],
          tags: [
            "transición",
            "contraataque",
            "velocidad"
          ]
        },
        {
          id: "transicion-defensiva",
          name: "Transición Defensiva · Contrapresión",
          objetivo: "Reaccionar de forma inmediata tras la pérdida: recuperar en los primeros segundos o replegar ordenado.",
          formato: "Juego con pérdida provocada · 8v8",
          espacio: "Media cancha",
          duracion: "15-25 min",
          claves: [
            "Regla de los 5 segundos: presión inmediata del más cercano y de los dos apoyos.",
            "El equilibrio previo decide la transición: se prepara antes de perder.",
            "Si la contrapresión no es posible, repliegue al eje y reconstrucción del bloque.",
            "Prohibido el reproche: primero se corre, después se habla."
          ],
          variantes: [
            "Con pérdida forzada por el entrenador (balón al rival)",
            "Con puntuación por recuperación antes de 5\"",
            "Con repliegue obligatorio a línea marcada"
          ],
          tags: [
            "transición",
            "presión",
            "reacción"
          ]
        },
        {
          id: "plan-partido",
          name: "Ensayo del Plan de Partido",
          objetivo: "Ajustar el modelo propio a las particularidades del rival de la fecha, sin cambiar la identidad.",
          formato: "11v11 con equipo sparring imitando al rival",
          espacio: "Campo completo",
          duracion: "20-30 min",
          claves: [
            "Se eligen dos o tres ajustes como máximo: más ajustes que eso no se retienen.",
            "El sparring reproduce la estructura y los hábitos del rival, no improvisa.",
            "Se ensaya lo que va a pasar seguro, no lo excepcional.",
            "Ubicación: MD-2 en versión sin oposición; MD-1 con sparring. Siempre con volumen bajo."
          ],
          variantes: [
            "Ensayo sólo de fase ofensiva o sólo defensiva",
            "Trabajo por sectores con vídeo previo",
            "Simulación de escenarios de resultado (ganando, perdiendo, con uno menos)"
          ],
          tags: [
            "11v11",
            "competencia",
            "MD-2"
          ]
        },
        {
          id: "abp-ofensivo",
          name: "ABP Ofensivo · Córner, Tiro Libre y Lateral",
          objetivo: "Convertir las acciones a balón parado en una fuente estable de gol mediante rutinas ensayadas y repartidas por zonas.",
          formato: "Rutinas con 6-8 atacantes",
          espacio: "Área grande",
          duracion: "12-18 min",
          claves: [
            "Zonas definidas: primer palo, punto de penal, segundo palo y frontal.",
            "Movimientos en bloque para arrastrar marcas antes del envío, con bloqueos legales.",
            "Siempre un jugador al rechace y dos en equilibrio defensivo.",
            "Tres o cuatro rutinas por temporada, no diez: el ejecutante fija la señal.",
            "Los penales se entrenan como rutina, no como lotería: ejecutante decidido antes del partido."
          ],
          variantes: [
            "Córner cerrado, abierto o corto, y segunda jugada tras rechace",
            "Tiro libre directo, con barrera y con envío al área",
            "Saque lateral largo al área y rutina corta para conservar"
          ],
          tags: [
            "ABP",
            "ofensivo",
            "gol",
            "MD-2"
          ]
        },
        {
          id: "abp-defensivo",
          name: "ABP Defensivo · Córner, Barrera y Saque de Arco",
          objetivo: "Neutralizar el balón parado rival controlando las zonas críticas y asegurando la segunda pelota.",
          formato: "Mixto zona + marca individual",
          espacio: "Área grande",
          duracion: "12-18 min",
          claves: [
            "Reparto claro: quién va a zona, quién a marca y quién a la segunda pelota.",
            "El primer palo y la zona del arquero no se negocian nunca.",
            "La barrera se arma rápido y con un jugador que la ordena, no entre todos.",
            "El saque de arco es una salida más: se decide antes si es corta o larga y a qué lado."
          ],
          variantes: [
            "Zona pura, marca pura o mixto según el rival de la fecha",
            "Con salida al contraataque tras el rechace",
            "Saque de arco largo con estructura para la segunda pelota"
          ],
          tags: [
            "ABP",
            "defensivo",
            "MD-2"
          ]
        }
      ]
    },

    /* ================================================== 10 */
    {
      id: "carga",
      code: "10",
      title: "Control de Carga y Monitoreo",
      short: "Carga",
      desc: "Lo que se mide para decidir: carga interna y externa, wellness y control neuromuscular, para que la semana siguiente se ajuste con datos y no con intuición.",
      items: [
        {
          id: "srpe",
          name: "Carga Interna · sRPE",
          objetivo: "Cuantificar la percepción de esfuerzo de cada jugador y compararla con la carga planificada.",
          formato: "RPE (0-10) × duración de la sesión en minutos",
          espacio: "—",
          duracion: "2 min post-sesión",
          claves: [
            "Se registra entre 15 y 30 minutos después de terminar, siempre individual.",
            "La diferencia entre la carga planificada y la percibida es la información valiosa.",
            "Permite calcular monotonía y tensión semanal.",
            "Es la herramienta más barata y más consistente que existe: no requiere tecnología."
          ],
          variantes: [
            "Registro digital en planilla compartida",
            "RPE diferenciado (respiratorio vs. muscular)",
            "Comparación con carga externa de GPS"
          ],
          tags: [
            "monitoreo",
            "carga interna"
          ]
        },
        {
          id: "gps",
          name: "Carga Externa · GPS",
          objetivo: "Registrar lo que el jugador hizo realmente: distancia, intensidad, aceleraciones y exposición a alta velocidad.",
          formato: "Registro por sesión y por tarea",
          espacio: "—",
          duracion: "—",
          claves: [
            "Métricas núcleo: distancia total, distancia a alta intensidad (>19,8 km/h), sprints (>25 km/h), aceleraciones y desaceleraciones >3 m/s².",
            "Comparar siempre contra la demanda del partido, no contra un valor absoluto.",
            "Cada jugador tiene su propio umbral de alta velocidad: individualizar o el dato engaña.",
            "El dato sirve si cambia una decisión; si no, es sólo un número.",
            "Los juegos reducidos también se miden: el área por jugador y el número de jugadores cambian la demanda mucho más que la duración."
          ],
          variantes: [
            "Análisis por tarea para calibrar juegos reducidos",
            "Informe semanal por puesto",
            "Seguimiento específico en readaptación"
          ],
          tags: [
            "monitoreo",
            "carga externa",
            "tecnología"
          ]
        },
        {
          id: "wellness",
          name: "Wellness y Recuperación",
          objetivo: "Detectar de forma temprana el desequilibrio entre carga y recuperación.",
          formato: "Cuestionario diario de 5 ítems",
          espacio: "—",
          duracion: "1 min",
          claves: [
            "Ítems: sueño, fatiga, dolor muscular, estrés y ánimo.",
            "Interesa la variación respecto de la línea de base individual, no el valor puntual.",
            "Dos días consecutivos de caída marcada obligan a revisar la carga de ese jugador.",
            "Sueño y alimentación son las dos palancas de recuperación con mayor efecto real."
          ],
          variantes: [
            "Versión corta en día de partido",
            "Complemento con control de peso matinal",
            "Entrevista individual cuando el dato se desvía"
          ],
          tags: [
            "monitoreo",
            "recuperación",
            "salud"
          ]
        },
        {
          id: "cmj",
          name: "Control Neuromuscular · Salto",
          objetivo: "Estimar el estado neuromuscular con una prueba rápida y no invasiva.",
          formato: "CMJ · 3 intentos, se registra el mejor",
          espacio: "Gimnasio o campo",
          duracion: "5-8 min por grupo",
          claves: [
            "Se mide en el mismo momento del día y con el mismo protocolo, siempre.",
            "Caídas superiores al 8-10% respecto de la línea de base indican fatiga relevante.",
            "Útil especialmente en MD+1 y MD-4.",
            "Complementa el wellness: dato objetivo frente a dato subjetivo."
          ],
          variantes: [
            "Squat jump para comparar contribución elástica",
            "Salto unilateral para asimetrías",
            "Test de fuerza isométrica de isquiosurales cuando hay equipamiento"
          ],
          tags: [
            "monitoreo",
            "neuromuscular",
            "test"
          ]
        },
        {
          id: "ratio-carga",
          name: "Densidad Semanal y Ratio de Carga",
          objetivo: "Evitar picos y valles bruscos en la carga acumulada, principal factor de riesgo modificable.",
          formato: "Relación carga aguda (7 días) / crónica (28 días)",
          espacio: "—",
          duracion: "—",
          claves: [
            "Rango de trabajo razonable: entre 0,8 y 1,3 respecto de la carga crónica.",
            "Subidas semanales superiores al 15% requieren justificación.",
            "La carga crónica alta protege: el jugador poco expuesto es el más frágil.",
            "El ratio orienta la conversación; no reemplaza el criterio del cuerpo técnico."
          ],
          variantes: [
            "Cálculo con sRPE y con distancia de GPS por separado",
            "Seguimiento individual para jugadores con poca participación",
            "Planificación de descargas cada 4-6 semanas",
            "Ajuste del área por jugador en los reducidos para subir o bajar la carga sin cambiar la tarea"
          ],
          tags: [
            "monitoreo",
            "carga",
            "planificación"
          ]
        }
      ]
    }
  ],

  /* ---------- Morfociclos del club ----------
     Los dos que usa Luciano, tal como los tiene armados: la semana de
     6 días (domingo a domingo) y la de 5 (domingo a sábado). En la de
     5 se dan vuelta el descanso y la compensación, y no hay MD-2.

     fase: el arco que agrupa varios días, como en sus láminas.
     acentuacion: el acento táctico del día, además del condicional. */
  morfociclos: [
    {
      id: "seis",
      nombre: "Morfociclo de 6 días",
      sub: "Domingo → domingo",
      temporada: "2026",
      dias: [
        { day: "MD",   tipo: "Competencia",  acentuacion: "Partido",            fase: "",              contenidos: "Partido oficial. Referencia máxima de carga del ciclo.", carga: 100, nivel: "muy-intenso", dur: "90'+",
          claves: ["Todo lo entrenado se mide acá.", "Los minutos de cada uno deciden la carga de los días siguientes."] },
        { day: "MD+1", tipo: "Compensación", acentuacion: "Grupo compensatorio", fase: "Compensación",  contenidos: "Los que no jugaron: fútbol de 60' más trabajo de fuerza. Los titulares, regenerativo y movilidad.", carga: 60, nivel: "intenso", dur: "60'",
          claves: ["El día se declara por lo que hace el grupo que compensa, que es el que trabaja.", "Los titulares no entran en la parte de fútbol.", "La compensación es fútbol, no carrera suelta."] },
        { day: "MD+2", tipo: "Descanso",     acentuacion: "Libre",              fase: "Compensación",  contenidos: "Descanso total. Trabajo individual de readaptación para quien lo necesite.", carga: 5, nivel: "bajo", dur: "—",
          claves: ["Descansar también se planifica.", "Sólo entrena el que está en proceso de readaptación."] },
        { day: "MD-4", tipo: "Tensión",      acentuacion: "Acentuación ofensiva", fase: "Incorporación", contenidos: "Fuerza, espacios reducidos y alta densidad de acciones (1v1 a 4v4), con el acento en la fase ofensiva.", carga: 90, nivel: "intenso", dur: "80-95'",
          claves: ["Espacios reducidos: muchas acciones, mucho freno y mucho cambio de dirección.", "Es el día de mayor tensión muscular de la semana.", "El acento táctico va sobre lo ofensivo: salida, progresión y ataque posicional."] },
        { day: "MD-3", tipo: "Velocidad y duración", acentuacion: "Acentuación defensiva", fase: "Incorporación", contenidos: "Sprints y aceleraciones con el jugador fresco. Después, espacios amplios y formatos grandes (8v8 a 11v11), con el acento defensivo.", carga: 100, nivel: "intenso", dur: "85-95'",
          claves: ["La velocidad va primero, con el jugador entero.", "Después el volumen: es el día que más distancia acumula.", "El acento táctico va sobre lo defensivo: presión, bloque y repliegue."] },
        { day: "MD-2", tipo: "Táctico y ABP", acentuacion: "Balón parado",      fase: "Descarga + ajuste táctico", contenidos: "Táctico sin oposición, definiciones, posesiones de activación y balón parado. Volumen bajo: el partido ya está cerca.", carga: 45, nivel: "moderado", dur: "60'",
          claves: ["Acá entra el balón parado, ofensivo y defensivo.", "Sin oposición: se corrigen recorridos, no decisiones.", "Sesión corta y clara, de 60 minutos."] },
        { day: "MD-1", tipo: "Activación",   acentuacion: "Plan de juego",      fase: "Descarga + ajuste táctico", contenidos: "Driles de aceleración, activación, repaso del balón parado y del plan de partido.", carga: 55, nivel: "moderado-alto", dur: "60'",
          claves: ["Driles de aceleración: despertar sin fatigar.", "Repaso del plan y del balón parado, ya sin novedades.", "Lo que no se entrenó en la semana no se improvisa hoy."] }
      ]
    },
    {
      id: "cinco",
      nombre: "Morfociclo de 5 días",
      sub: "Domingo → sábado",
      temporada: "2025",
      dias: [
        { day: "MD",   tipo: "Competencia",  acentuacion: "Partido",            fase: "",              contenidos: "Partido oficial.", carga: 100, nivel: "muy-intenso", dur: "90'+",
          claves: ["Con un día menos, todo lo que sigue se comprime."] },
        { day: "MD+1", tipo: "Descanso",     acentuacion: "Descanso",           fase: "",              contenidos: "Descanso. En la semana corta el descanso va pegado al partido.", carga: 5, nivel: "bajo", dur: "—",
          claves: ["Al revés que en la semana de 6: primero se descansa y después se compensa."] },
        { day: "MD+2", tipo: "Compensación", acentuacion: "Grupo compensatorio · G2 recovery", fase: "", contenidos: "Grupo compensatorio para los que no jugaron. Los titulares hacen G2 de recuperación.", carga: 55, nivel: "moderado-alto", dur: "60'",
          claves: ["Dos grupos en el mismo campo: el que compensa y el que recupera.", "Es la última ventana de carga antes de empezar a bajar."] },
        { day: "MD-4", tipo: "Tensión",      acentuacion: "Acentuación ofensiva", fase: "Incorporación + optimización", contenidos: "Espacios reducidos y alta densidad de acciones, con el acento en la fase ofensiva.", carga: 90, nivel: "intenso", dur: "80-90'",
          claves: ["El espacio se va agrandando a lo largo de la semana: acá es el más chico.", "Acento ofensivo."] },
        { day: "MD-3", tipo: "Duración",     acentuacion: "Acentuación defensiva", fase: "Incorporación + optimización", contenidos: "Espacios amplios y formatos grandes, con el acento en la fase defensiva.", carga: 95, nivel: "intenso", dur: "85-95'",
          claves: ["El campo ya es grande: volumen y distancia.", "Acento defensivo."] },
        { day: "MD-1", tipo: "Plan de juego + ABP", acentuacion: "PDJ + ABP",   fase: "",              contenidos: "Plan de juego y balón parado, con volumen bajo. En la semana de 5 días no hay MD-2: el ajuste táctico y el balón parado se juntan acá.", carga: 45, nivel: "moderado", dur: "60'",
          claves: ["Sin MD-2, este día carga con el ajuste táctico y el balón parado.", "Volumen bajo y claridad alta."] }
      ]
    }
  ],

  /* ---------- Principios rectores (marquesina + footer) ---------- */
  principios: [
    "Entrenar como se compite",
    "El balón como medio, no como adorno",
    "La tarea enseña más que la charla",
    "Medir para decidir",
    "Individualizar dentro de lo colectivo",
    "Repetir sin repetirse",
    "Primero disponible, después rendidor"
  ]
};
