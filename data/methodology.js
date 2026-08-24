/* =============================================================
   data/methodology.js
   Cuerpo de conocimiento — METODOLOGÍA DE TRABAJO
   Luciano Santo Domingo · Club Atlético Europeo (Argentina)

   Cada BLOQUE agrupa UNIDADES DE TRABAJO. Cada unidad se
   describe con la misma ficha para mantener un lenguaje común:
     objetivo · formato · espacio · duracion · claves · variantes · tags
   Editable desde la terminal (comando `bloque` y `trabajo`).
   ============================================================= */
window.LSD_METHODOLOGY = {
  meta: {
    autor: "Luciano Santo Domingo",
    rol: "Preparador Físico · Metodología de Entrenamiento",
    club: "Club Atlético Europeo — Argentina",
    version: "1.0",
    actualizado: "2026"
  },

  blocks: [
    /* ================================================== 01 */
    {
      id: "marco",
      code: "01",
      title: "Marco Metodológico",
      short: "Marco",
      desc: "El punto de partida: idea de juego, principios que ordenan la conducta del equipo y el criterio con el que se diseña cada tarea. Sin marco no hay metodología, hay ejercicios sueltos.",
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
          tags: ["conceptual", "planificación", "modelo"]
        },
        {
          id: "periodizacion-tactica",
          name: "Periodización Táctica",
          objetivo: "Organizar la semana en torno al juego, alternando los patrones de contracción muscular y la complejidad táctica para llegar al partido en estado óptimo.",
          formato: "Morfociclo patrón semanal",
          espacio: "Campo completo y espacios fraccionados",
          duracion: "Ciclo de 6 a 7 días",
          claves: [
            "Principio de alternancia horizontal: tensión (MD-4), duración (MD-3) y velocidad (MD-2).",
            "Principio de progresión compleja: la carga táctica sube a mitad de semana y baja hacia el partido.",
            "Principio de las propensiones: repetir el patrón hasta que aparezca sin ser nombrado.",
            "El balón es el medio, no un adorno: casi todo se entrena jugando."
          ],
          variantes: [
            "Microciclo de 5 días (miércoles-domingo)",
            "Semana de doble competencia: se sacrifica MD-3",
            "Semana larga (8-10 días) con doble pico de carga"
          ],
          tags: ["planificación", "carga", "conceptual"]
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
          tags: ["conceptual", "individualización"]
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
          tags: ["organización", "documentación"]
        },
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
          tags: ["organización", "sesión"]
        }
      ]
    },

    /* ================================================== 02 */
    {
      id: "fuerza",
      code: "02",
      title: "Fuerza y Rendimiento Físico",
      short: "Fuerza",
      desc: "Trabajo de gimnasio y de campo orientado a producir fuerza aplicable al juego: acelerar, frenar, cambiar de dirección, saltar, duelar y repetirlo durante noventa minutos.",
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
          tags: ["gimnasio", "fuerza", "MD-4"]
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
            "Se corta la serie cuando cae la velocidad, no cuando se acaban las repeticiones."
          ],
          variantes: [
            "Contrastes (complex training): fuerza pesada + gesto explosivo",
            "Clusters intra-serie",
            "Trabajo balístico sin implemento para jugadores en carga alta"
          ],
          tags: ["gimnasio", "potencia", "RFD"]
        },
        {
          id: "pliometria",
          name: "Pliometría y Capacidad Reactiva",
          objetivo: "Optimizar el ciclo estiramiento-acortamiento y la rigidez del complejo músculo-tendinoso para saltar, frenar y reaccionar.",
          formato: "4-6 series × 4-8 contactos",
          espacio: "Superficie firme / césped",
          duracion: "15-25 min",
          claves: [
            "Progresión: extensivo (multisaltos) → intensivo (drop jump, saltos con caída).",
            "Calidad de aterrizaje antes que altura: rodilla alineada, tronco estable.",
            "Contactos totales controlados por semana según historial de carga.",
            "Muy sensible a la fatiga: nunca al final de una sesión exigente."
          ],
          variantes: [
            "Horizontal (bounds, saltos de longitud) para transferencia a la aceleración",
            "Vertical (CMJ, drop jump) para el juego aéreo",
            "Lateral y con rotación para el cambio de dirección"
          ],
          tags: ["campo", "neuromuscular", "prevención"]
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
          tags: ["campo", "fuerza", "aceleración"]
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
            "Ubicación semanal preferente: MD-3 o MD-2, con el jugador fresco."
          ],
          variantes: [
            "Salidas desde distintas posiciones y estímulos (visual, auditivo, con balón)",
            "Sprints curvos (más frecuentes en el juego real que los rectos)",
            "Persecuciones y duelos de velocidad"
          ],
          tags: ["campo", "velocidad", "prevención"]
        },
        {
          id: "cod",
          name: "Cambio de Dirección y Agilidad",
          objetivo: "Mejorar la capacidad de desacelerar, reorientar el cuerpo y reacelerar, con y sin estímulo externo.",
          formato: "6-10 series × 15-25 s",
          espacio: "Cuadrado de 20 × 20 m",
          duracion: "15-25 min",
          claves: [
            "Primero se entrena frenar: la desaceleración es la acción de mayor coste mecánico.",
            "Ángulos: 45°, 90°, 180° — cada uno pide una técnica distinta.",
            "Agilidad = COD + toma de decisión: se añade estímulo (compañero, balón, señal).",
            "El trabajo cerrado con conos prepara el patrón; el juego reducido lo valida."
          ],
          variantes: [
            "Programado (circuito cerrado) vs. reactivo (espejo, 1v1)",
            "Con balón conducido",
            "Integrado dentro de la activación del MD-4"
          ],
          tags: ["campo", "neuromuscular", "COD"]
        },
        {
          id: "core",
          name: "Core y Control Lumbopélvico",
          objetivo: "Sostener y transmitir fuerza entre tren inferior y superior, resistiendo la extensión, la flexión lateral y la rotación.",
          formato: "3-4 series × 20-40 s por patrón",
          espacio: "Gimnasio / campo",
          duracion: "12-18 min",
          claves: [
            "Anti-extensión, anti-rotación, anti-flexión lateral y anti-flexión: los cuatro patrones siempre.",
            "Se prioriza la estabilidad dinámica sobre el número de repeticiones.",
            "Respiración controlada: sin apnea sostenida.",
            "Trabajo diario de baja dosis mejor que una sesión larga semanal."
          ],
          variantes: [
            "Pallof press, dead bug, plancha con desplazamiento, rueda abdominal",
            "Integrado en pausas activas del gimnasio",
            "Progresión a patrones de fuerza rotacional (lanzamientos)"
          ],
          tags: ["gimnasio", "core", "prevención"]
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
            "La mejor prevención sigue siendo exponer al jugador a alta velocidad de forma progresiva."
          ],
          variantes: [
            "Programa individual para jugadores con antecedentes",
            "Versión de campo integrada en la activación",
            "Bloque de refuerzo en día post-partido para no participantes"
          ],
          tags: ["prevención", "salud", "gimnasio"]
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
          tags: ["campo", "resistencia", "carga"]
        },
        {
          id: "readaptacion",
          name: "Readaptación y Retorno al Juego",
          objetivo: "Conducir al jugador lesionado desde el alta médica hasta la disponibilidad competitiva real, sin saltos de carga.",
          formato: "Progresión por fases con criterios de paso",
          espacio: "Gimnasio y campo",
          duracion: "Variable",
          claves: [
            "Criterios de progresión objetivos, no calendario: fuerza, simetría, tolerancia a velocidad.",
            "Reexposición progresiva a sprint y a cambios de dirección antes de volver al grupo.",
            "Reintegración parcial: primero tareas de baja densidad, después juego reducido.",
            "El último escalón siempre es competir: minutos controlados antes de titularidad."
          ],
          variantes: [
            "Protocolo específico por tipo de lesión",
            "Trabajo compartido con área médica y kinesiología",
            "Programa de mantenimiento post-alta durante 6-8 semanas"
          ],
          tags: ["prevención", "individualización", "salud"]
        }
      ]
    },

    /* ================================================== 03 */
    {
      id: "ssg",
      code: "03",
      title: "Juegos Reducidos · Small-Sided Games",
      short: "Reducidos",
      desc: "Situaciones de juego con menos jugadores y menos espacio que el partido real. Permiten entrenar simultáneamente lo técnico-táctico y lo condicional, y son la herramienta central del microciclo.",
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
          tags: ["SSG", "duelo", "MD-4"]
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
          tags: ["SSG", "posesión", "MD-3"]
        },
        {
          id: "ssg-5v5",
          name: "SSG 5v5 a 7v7 · Estructura Intermedia",
          objetivo: "Introducir estructura posicional reconocible (líneas, alturas, amplitud) manteniendo alta participación.",
          formato: "5v5 / 6v6 / 7v7 · 3-5 series de 4-6'",
          espacio: "50×35 a 68×45 m",
          duracion: "20-30 min efectivos",
          claves: [
            "Se puede pedir ocupación racional de espacios sin caer en un 11v11.",
            "Formato ideal para trabajar principios de presión y de salida a escala.",
            "Con arqueros el juego se vuelve más real y aparecen las alturas de bloque.",
            "Buen compromiso entre carga aeróbica y transferencia táctica."
          ],
          variantes: [
            "Con zonas prohibidas o zonas de valor doble",
            "Con condicionante de toques por zona (libre atrás, 2 toques adelante)",
            "Con arqueros y fuera de juego activo"
          ],
          tags: ["SSG", "táctico", "MD-3"]
        },
        {
          id: "ssg-8v8",
          name: "SSG 8v8 a 9v9 · Gran Formato",
          objetivo: "Máxima transferencia al modelo de juego con demanda de carrera cercana a la competitiva.",
          formato: "8v8 / 9v9 · 2-4 series de 6-10'",
          espacio: "70×50 a campo completo reducido",
          duracion: "24-36 min efectivos",
          claves: [
            "Aumenta la distancia recorrida y el volumen de alta velocidad; baja la frecuencia de contactos.",
            "Permite ensayar el plan de partido con estructura casi real.",
            "Ubicación típica: MD-3 (duración) o MD-4 según objetivo.",
            "Cuidado con el volumen total: es el formato que más distancia acumula."
          ],
          variantes: [
            "Campo completo con reglas de provocación",
            "Con equipo en inferioridad para entrenar bloque bajo",
            "Con transición forzada tras pérdida (balón de reposición inmediato)"
          ],
          tags: ["SSG", "táctico", "carga"]
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
          tags: ["SSG", "posesión", "superioridad"]
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
            "Bonificación por recuperación en menos de 5 segundos"
          ],
          tags: ["SSG", "condicionantes", "táctico"]
        },
        {
          id: "ssg-porterias",
          name: "SSG con Porterías Múltiples",
          objetivo: "Modificar la orientación del juego y la toma de decisión mediante el número y la posición de los objetivos.",
          formato: "2, 3, 4 o 6 mini-arcos",
          espacio: "30×25 a 60×40 m",
          duracion: "12-24 min efectivos",
          claves: [
            "Dos arcos enfrentados: juego lineal, más profundidad.",
            "Cuatro arcos (dos por línea de fondo): obliga al cambio de orientación.",
            "Arcos laterales: entrena la finalización tras juego interior.",
            "Seis arcos: máxima dispersión, útil para provocar amplitud."
          ],
          variantes: [
            "Arcos con altura variable (con y sin arquero)",
            "Líneas de conducción en vez de arcos",
            "Arcos de valor diferenciado según zona de origen del ataque"
          ],
          tags: ["SSG", "orientación", "finalización"]
        },
        {
          id: "ssg-fase",
          name: "SSG Orientados a Fase de Juego",
          objetivo: "Aislar una fase concreta del juego (salida, presión, transición) dentro de un formato reducido y competitivo.",
          formato: "Formato desigual con objetivos asimétricos",
          espacio: "Media cancha o tres cuartos",
          duracion: "16-26 min efectivos",
          claves: [
            "Equipo A tiene un objetivo (salir jugando) y equipo B otro (recuperar y finalizar rápido).",
            "El marcador y el reglamento premian el principio que se quiere entrenar.",
            "Se rotan los roles para que ambos equipos entrenen ambas fases.",
            "Es el puente natural entre el juego reducido y el trabajo táctico de 11v11."
          ],
          variantes: [
            "Salida de balón 6v4 + arqueros",
            "Presión alta 7v7 con zona de activación",
            "Transición 4v3 con reposición continua"
          ],
          tags: ["SSG", "táctico", "fases"]
        },
        {
          id: "ssg-carga",
          name: "Control de la Carga en SSG",
          objetivo: "Predecir y regular la exigencia del juego reducido para que encaje en el lugar del microciclo que le corresponde.",
          formato: "Matriz de variables",
          espacio: "—",
          duracion: "—",
          claves: [
            "Área relativa por jugador: la variable que más determina la demanda.",
            "Menos jugadores + menos espacio = más frecuencia cardíaca, más acciones, menos distancia.",
            "Más espacio = más distancia total y más alta velocidad, menos contactos.",
            "Presencia de arqueros baja la intensidad relativa; el aliento del entrenador la sube.",
            "Series largas → carga aeróbica. Series cortas con pausa amplia → carga neuromuscular."
          ],
          variantes: [
            "Registro por sRPE al cierre de la tarea",
            "Control con GPS: distancia, HSR, aceleraciones",
            "Ajuste en vivo del espacio para corregir la intensidad"
          ],
          tags: ["SSG", "carga", "monitoreo"]
        }
      ]
    },

    /* ================================================== 04 */
    {
      id: "posesion",
      code: "04",
      title: "Posesión y Juegos de Posición",
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
            "Es activación, no relleno: se compite y se cuenta."
          ],
          variantes: [
            "Con toques limitados (2 y 1 toque)",
            "Con comodín central que obliga al apoyo interior",
            "Rondo de castigo: el que pierde pasa al medio"
          ],
          tags: ["rondo", "técnico", "activación"]
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
          tags: ["rondo", "progresión", "táctico"]
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
            "Con contraataque del equipo que recupera"
          ],
          tags: ["posesión", "juego de posición", "estructura"]
        },
        {
          id: "juego-posicion-6v3",
          name: "Juego de Posición 6v3 / 7v3",
          objetivo: "Circulación amplia con superioridad clara para entrenar el cambio de orientación y el ritmo de balón.",
          formato: "6v3 o 7v3 · series de 3-5'",
          espacio: "Rectángulo de 25×18 a 35×25 m",
          duracion: "12-20 min",
          claves: [
            "Los tres defensores deben coordinar presión, cobertura y cierre de línea interior.",
            "El equipo con balón cuenta pases; los defensores cuentan recuperaciones.",
            "Se exige un toque en zona de presión y libre en zona segura.",
            "El cambio de orientación cuenta como dos pases: se premia."
          ],
          variantes: [
            "Con zonas divididas para forzar ocupación",
            "Con obligación de circular por todas las zonas antes de puntuar",
            "Con relevo continuo de defensores cada 45\""
          ],
          tags: ["posesión", "circulación", "orientación"]
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
          tags: ["posesión", "progresión", "táctico"]
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
          tags: ["posesión", "orientación", "estructura"]
        },
        {
          id: "mantenimiento",
          name: "Mantenimiento en Espacio Amplio",
          objetivo: "Sostener la posesión con distancias reales de partido, exigiendo lectura de espacio y calidad de pase largo.",
          formato: "8v8 / 10v10 sin arcos",
          espacio: "70×50 m o campo completo",
          duracion: "12-20 min",
          claves: [
            "Alta demanda aeróbica: el espacio amplio multiplica la distancia recorrida.",
            "Aparece el pase de más de 25 m y el control orientado a espacio libre.",
            "Buen recurso para MD-3 cuando se busca duración.",
            "Se puede combinar con condición de presión tras pérdida."
          ],
          variantes: [
            "Con toque libre y sólo condición de no perder",
            "Con equipos de tres colores (dos atacan, uno defiende)",
            "Con rotación de equipo defensor cada recuperación"
          ],
          tags: ["posesión", "carga", "MD-3"]
        }
      ]
    },

    /* ================================================== 05 */
    {
      id: "tactico",
      code: "05",
      title: "Trabajos Tácticos",
      short: "Táctico",
      desc: "Organización colectiva por momentos del juego: construir, progresar, finalizar, defender en bloque, presionar y reaccionar en las transiciones.",
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
          tags: ["ofensivo", "construcción", "11v11"]
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
          tags: ["ofensivo", "progresión", "11v11"]
        },
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
            "Con contragolpe habilitado para el equipo defensor"
          ],
          tags: ["ofensivo", "11v11", "estructura"]
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
          tags: ["defensivo", "presión", "11v11"]
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
          tags: ["defensivo", "bloque", "11v11"]
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
          tags: ["defensivo", "área", "11v11"]
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
          tags: ["defensivo", "sectorial", "línea"]
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
          tags: ["transición", "contraataque", "velocidad"]
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
          tags: ["transición", "presión", "reacción"]
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
            "Ubicación: MD-2 y MD-1, con volumen bajo y alta claridad."
          ],
          variantes: [
            "Ensayo sólo de fase ofensiva o sólo defensiva",
            "Trabajo por sectores con vídeo previo",
            "Simulación de escenarios de resultado (ganando, perdiendo, con uno menos)"
          ],
          tags: ["11v11", "competencia", "MD-2"]
        }
      ]
    },

    /* ================================================== 06 */
    {
      id: "finalizacion",
      code: "06",
      title: "Finalización",
      short: "Finalización",
      desc: "El último tercio: llegar, decidir y definir. Volumen alto de remates en contextos que se parecen a los del partido.",
      items: [
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
            "El pase previo debe ser de calidad de partido, no de conveniencia."
          ],
          variantes: [
            "Con pase de espalda y giro",
            "Con conducción previa y remate en carrera",
            "Con dos toques máximo dentro del área"
          ],
          tags: ["finalización", "técnico", "MD-2"]
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
          tags: ["finalización", "ataque", "área"]
        },
        {
          id: "uno-v-arquero",
          name: "1v1 con Arquero",
          objetivo: "Resolver la situación de mayor valor del juego: mano a mano y definición bajo presión temporal.",
          formato: "Series de 6-10 repeticiones por jugador",
          espacio: "Desde 30 m hasta el área",
          duracion: "12-18 min",
          claves: [
            "Leer la salida del arquero antes de decidir el recurso.",
            "Definir al palo lejano cuando el arquero achica de frente.",
            "Controlar el primer toque hacia el espacio libre, no hacia el arquero.",
            "Recurso técnico variado: cruzado, por encima, al primer palo, amague."
          ],
          variantes: [
            "Con defensor persiguiendo desde atrás",
            "Con inicio desde pase filtrado",
            "Con arquero que sale a destiempo (provocado)"
          ],
          tags: ["finalización", "duelo", "individual"]
        },
        {
          id: "finalizacion-oposicion",
          name: "Finalización con Oposición Real",
          objetivo: "Trasladar el remate a un contexto de juego con defensores activos y decisión colectiva.",
          formato: "5v4, 6v5 + arquero en último tercio",
          espacio: "Último tercio completo",
          duracion: "18-26 min",
          claves: [
            "Límite de tiempo para finalizar: entre 10 y 15 segundos por ataque.",
            "Se puntúa el remate de calidad, no cualquier remate.",
            "El equilibrio defensivo del atacante se exige incluso en tarea ofensiva.",
            "Se rota rápido para mantener la intensidad alta."
          ],
          variantes: [
            "Con reposición inmediata desde el fondo",
            "Con contraataque del equipo defensor si recupera",
            "Con condicionante de finalizar tras entrada al área por fuera"
          ],
          tags: ["finalización", "táctico", "oposición"]
        },
        {
          id: "segunda-linea",
          name: "Llegada de Segunda Línea",
          objetivo: "Aprovechar la zona de frontal que queda libre cuando el bloque rival se repliega sobre el área.",
          formato: "8v8 con zona de frontal habilitada",
          espacio: "Último tercio",
          duracion: "12-20 min",
          claves: [
            "El volante llega desde atrás, no espera dentro del área.",
            "El centro atrás es el pase que activa la segunda línea.",
            "El remate de frontal se ensaya con balón en movimiento, nunca parado.",
            "Puntuación doble al gol desde fuera del área tras centro atrás."
          ],
          variantes: [
            "Con rechace provocado por el arquero",
            "Con obligación de llegada de dos jugadores distintos",
            "Con defensa que puede salir a achicar la frontal"
          ],
          tags: ["finalización", "ataque", "segunda línea"]
        }
      ]
    },

    /* ================================================== 07 */
    {
      id: "abp",
      code: "07",
      title: "Balón Parado · ABP",
      short: "ABP",
      desc: "Acciones a balón parado: una porción decisiva de los goles de cada temporada, entrenada con el mismo rigor que el juego dinámico.",
      items: [
        {
          id: "corner-of",
          name: "Córner Ofensivo",
          objetivo: "Generar situación de remate franco mediante rutinas ensayadas, bloqueos legales y ataque coordinado de zonas.",
          formato: "Rutinas con 6-8 atacantes",
          espacio: "Área grande",
          duracion: "10-15 min",
          claves: [
            "Zonas de ataque definidas: primer palo, punto de penal, segundo palo y frontal.",
            "Movimientos en bloque para arrastrar marcas antes del envío.",
            "Siempre un jugador en el rechace y dos en equilibrio defensivo.",
            "Se ensayan tres o cuatro rutinas por temporada, no diez.",
            "El ejecutante fija la señal: sin señal clara la rutina no funciona."
          ],
          variantes: [
            "Córner cerrado / abierto / corto",
            "Rutina con bloqueo y liberación",
            "Segunda jugada tras rechace ensayada"
          ],
          tags: ["ABP", "ofensivo", "gol"]
        },
        {
          id: "corner-def",
          name: "Córner Defensivo",
          objetivo: "Neutralizar el ataque rival controlando zonas críticas y asegurando la segunda pelota.",
          formato: "Mixto zona + marca individual",
          espacio: "Área grande",
          duracion: "10-15 min",
          claves: [
            "Sistema mixto: zona en primer palo y área chica, marca individual a los mejores rematadores.",
            "Un jugador en cada palo según criterio del arquero.",
            "Uno o dos en el rechace, en la frontal.",
            "Un jugador adelantado para amenazar el contraataque.",
            "Despeje: alto, lejos y a banda."
          ],
          variantes: [
            "Zona pura para bloques más altos",
            "Marca individual completa ante rivales muy fuertes de cabeza",
            "Salida rápida ensayada tras el despeje"
          ],
          tags: ["ABP", "defensivo", "área"]
        },
        {
          id: "tiro-libre",
          name: "Tiros Libres",
          objetivo: "Convertir la falta en ocasión: envío directo, envío al área o jugada ensayada según zona.",
          formato: "Trabajo por zonas del campo",
          espacio: "Tres cuartos y frontal",
          duracion: "10-15 min",
          claves: [
            "Mapa de zonas: directo, lateral al área, lateral lejano, frontal.",
            "Barrera defensiva: número según distancia y perfil del ejecutante.",
            "Ejecutantes definidos por perfil y por zona, no por jerarquía.",
            "Equilibrio defensivo obligatorio también en la falta ofensiva."
          ],
          variantes: [
            "Falta lateral con envío al primer palo",
            "Jugada ensayada de dos toques",
            "Falta frontal directa con y sin barrera móvil"
          ],
          tags: ["ABP", "ofensivo", "ejecución"]
        },
        {
          id: "lateral",
          name: "Saques Laterales",
          objetivo: "Transformar el saque de banda en una acción con intención, sobre todo en el último tercio.",
          formato: "Rutinas por zona de campo",
          espacio: "Bandas, tres alturas",
          duracion: "8-12 min",
          claves: [
            "Campo propio: seguridad, apoyo y salida del balón.",
            "Campo intermedio: progresión con apoyo de espalda y tercer hombre.",
            "Campo rival: rutina ensayada, saque largo al área o pared por fuera.",
            "Movimiento previo obligatorio: sin desmarque no hay saque."
          ],
          variantes: [
            "Saque largo directo al área",
            "Rutina de bloqueo y apertura de línea",
            "Saque rápido para sorprender al bloque"
          ],
          tags: ["ABP", "transición", "banda"]
        },
        {
          id: "penales",
          name: "Penales y Rutinas de Presión",
          objetivo: "Preparar la ejecución bajo presión psicológica, no sólo el gesto técnico.",
          formato: "Series al final de sesiones exigentes",
          espacio: "Área grande",
          duracion: "8-12 min",
          claves: [
            "Se ejecutan con fatiga y con público simulado: el contexto es parte de la tarea.",
            "Cada jugador define su recurso y lo repite: no se cambia de idea en la carrera.",
            "Lista de ejecutantes cerrada y ordenada antes de cada partido de eliminación.",
            "El arquero estudia y ensaya lectura de apoyo y de cadera."
          ],
          variantes: [
            "Tanda completa simulada con orden real",
            "Penal tras esfuerzo máximo",
            "Sesión específica en semana de eliminación directa"
          ],
          tags: ["ABP", "mental", "ejecución"]
        },
        {
          id: "saque-arco",
          name: "Saque de Arco e Inicio",
          objetivo: "Definir las salidas desde el saque de arco según la presión rival, incluyendo la disputa de la segunda pelota.",
          formato: "Ensayo con estructura completa",
          espacio: "Campo propio hasta media cancha",
          duracion: "10-15 min",
          claves: [
            "Tres opciones ensayadas: corta, media al pivote y larga a zona de disputa.",
            "En la larga, la estructura de segunda pelota se coloca antes del envío.",
            "El arquero decide y comunica; el resto ejecuta sin dudar.",
            "Si el rival presiona alto y hombre a hombre, se prioriza el juego directo."
          ],
          variantes: [
            "Salida con superioridad creada por el arquero",
            "Saque rápido para atacar el desorden",
            "Envío largo a banda para ganar campo"
          ],
          tags: ["ABP", "construcción", "arquero"]
        }
      ]
    },

    /* ================================================== 08 */
    {
      id: "carga",
      code: "08",
      title: "Control de Carga y Monitoreo",
      short: "Carga",
      desc: "Medir para decidir. Carga interna y externa, estado del jugador y criterios objetivos para ajustar la semana antes de que aparezca el problema.",
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
          tags: ["monitoreo", "carga interna"]
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
            "El dato sirve si cambia una decisión; si no, es sólo un número."
          ],
          variantes: [
            "Análisis por tarea para calibrar juegos reducidos",
            "Informe semanal por puesto",
            "Seguimiento específico en readaptación"
          ],
          tags: ["monitoreo", "carga externa", "tecnología"]
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
          tags: ["monitoreo", "recuperación", "salud"]
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
          tags: ["monitoreo", "neuromuscular", "test"]
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
            "Planificación de descargas cada 4-6 semanas"
          ],
          tags: ["monitoreo", "carga", "planificación"]
        }
      ]
    },

    /* ================================================== 09 */
    {
      id: "microciclo",
      code: "09",
      title: "Planificación y Microciclo",
      short: "Microciclo",
      desc: "Cómo se ordena la semana: qué se entrena cada día, con qué carga y por qué. El microciclo es donde la metodología deja de ser teoría.",
      items: [
        {
          id: "morfociclo",
          name: "Morfociclo Patrón",
          objetivo: "Distribuir la semana entre partido y partido alternando patrones de esfuerzo y complejidad táctica.",
          formato: "MD+1 → MD-1 (6-7 días)",
          espacio: "—",
          duracion: "Semana completa",
          claves: [
            "MD+1: recuperación para titulares, carga compensatoria para suplentes.",
            "MD-4: tensión — fuerza, espacios reducidos, alta densidad de acciones.",
            "MD-3: duración — espacios amplios, mayor volumen, formatos grandes.",
            "MD-2: velocidad — espacios medios, alta intensidad y volumen bajo.",
            "MD-1: activación, plan de partido y balón parado. Sin carga.",
            "La curva sube a mitad de semana y baja hacia el partido, siempre."
          ],
          variantes: [
            "Microciclo de 5 días",
            "Semana con partido entre semana (doble competencia)",
            "Semana sin competencia: doble pico de carga"
          ],
          tags: ["planificación", "microciclo", "carga"]
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
          tags: ["planificación", "competencia", "rotación"]
        },
        {
          id: "pretemporada",
          name: "Pretemporada por Fases",
          objetivo: "Construir la base física y la identidad de juego antes de la competencia.",
          formato: "3 fases · 4 a 6 semanas",
          espacio: "—",
          duracion: "Bloque completo",
          claves: [
            "Fase 1 — Acumulación: volumen aeróbico, base de fuerza, principios simples.",
            "Fase 2 — Transformación: intensidad creciente, formatos medios, plan de juego completo.",
            "Fase 3 — Realización: velocidad, competencia, ajuste fino y descarga previa al debut.",
            "La exposición a alta velocidad empieza en la primera semana, no en la última.",
            "Cada amistoso tiene un objetivo declarado, no es sólo minutos."
          ],
          variantes: [
            "Pretemporada corta (3 semanas) por calendario",
            "Con concentración y doble turno",
            "Reincorporación escalonada por grupos"
          ],
          tags: ["planificación", "pretemporada", "carga"]
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
          tags: ["planificación", "gestión", "sesión"]
        }
      ]
    }
  ],

  /* ---------- Tabla del microciclo tipo ---------- */
  microcycle: [
    { day: "MD+1", tipo: "Recuperación", foco: "Regeneración",       contenidos: "Titulares: regenerativo y movilidad. No titulares: carga compensatoria (fuerza + juego reducido).", carga: 25, dur: "45-60'" },
    { day: "MD+2", tipo: "Descanso",     foco: "Libre",              contenidos: "Descanso total o activación voluntaria opcional. Trabajo individual de readaptación.",              carga: 5,  dur: "—" },
    { day: "MD-4", tipo: "Tensión",      foco: "Fuerza",             contenidos: "Fuerza en gimnasio, pliometría, COD. Espacios reducidos, alta densidad de acciones (1v1 a 4v4).",   carga: 90, dur: "80-95'" },
    { day: "MD-3", tipo: "Duración",     foco: "Resistencia",        contenidos: "Espacios amplios, formatos grandes (8v8 a 11v11). Mayor volumen y distancia recorrida.",            carga: 100, dur: "85-95'" },
    { day: "MD-2", tipo: "Velocidad",    foco: "Alta intensidad",    contenidos: "Sprints, transiciones, finalización. Espacios medios, series cortas y pausas largas.",              carga: 65, dur: "70-80'" },
    { day: "MD-1", tipo: "Activación",   foco: "Plan de partido",    contenidos: "Activación, balón parado, ensayo del plan de partido. Volumen bajo, claridad alta.",                carga: 30, dur: "55-65'" },
    { day: "MD",   tipo: "Competencia",  foco: "Partido",            contenidos: "Partido oficial. Referencia máxima de carga del ciclo.",                                           carga: 100, dur: "90'+" }
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
