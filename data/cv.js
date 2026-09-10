/* =============================================================
   data/cv.js — el contenido del CV
   -------------------------------------------------------------
   Todo lo que se ve en cv.html sale de acá. Para cambiar algo,
   se edita este archivo y se sube: no hay que tocar el diseño.

   Los campos vacíos ("") no se pintan: la página los saltea o
   muestra un «Por completar» discreto. Así nunca se publica un
   dato inventado.
   ============================================================= */
window.LSD_CV = {

  /* --- Identidad -------------------------------------------- */
  persona: {
    nombre: "Luciano",
    apellido: "Santo Domingo",
    rol: "Preparador Físico",
    club: "Club Agropecuario Argentino",
    liga: "Primera Nacional",
    pais: "🇦🇷",
    ciudad: "Carlos Casares, Buenos Aires",
    nacimiento: "",          /* "1990-05-14" */
    idiomas: "Español",
    /* Foto de la portada. `recorte: true` es para un PNG sin fondo, que se
       para entero sobre el degradado; con una foto normal se deja en false.
       `foco` corre el encuadre: 0% arriba del todo, 50% al medio. */
    portada: "assets/img/portada-cv-predio.jpg",
    recorte: false,
    foco: "4%",
    /* `avatar` es la foto redonda chica de la barra de arriba: tiene que ser
       un primer plano. `retrato` es el vertical grande del bloque BIO. */
    avatar: "assets/img/retrato-cv.jpg",
    retrato: "assets/img/retrato-cv-estadio.jpg",
    /* Enlaces del encabezado. Los que estén vacíos no aparecen. */
    instagram: "https://instagram.com/luchisd11",
    linkedin: "",
    mail: "",
    telefono: "+54 9 2395 43-9825",
    /* El botón de WhatsApp: un número propio, o `true` para usar el de
       arriba. Vacío o false y el botón no aparece. */
    whatsapp: true
  },

  /* --- El párrafo de arriba: quién es y cómo trabaja --------- */
  bio: "Preparador físico formado en el día a día del fútbol profesional: ocho años en el mismo club y nueve cuerpos técnicos distintos, siendo el punto fijo entre proyectos que cambian. Ese lugar exige más que planificar — pide comunicar, gestionar y resolver la logística de cada semana para que lo planificado llegue entero al campo.\n\nSu fuerte está en el desarrollo de la tarea en las dos mitades de la sesión, el campo y el gimnasio, con conocimiento profundo del desarrollo de la fuerza aplicada a los deportes de equipo y del control de la carga con GPS Catapult. Desde 2023 se ocupa además de la etapa final de la readaptación: la que devuelve al jugador a la competencia.\n\nY una forma de trabajar que no se aprende en un curso: años compartiendo el trabajo diario con nutricionistas, médicos y kinesiólogos del club, y decidiendo en conjunto.",

  /* --- Ficha de datos (columna derecha del bloque BIO) -------
     Cada entrada es una casilla. Se pintan en el orden que estén. */
  ficha: [
    { label: "Club actual",  valor: "Club Agropecuario Argentino", nota: "Primera Nacional" },
    { label: "Puesto",       valor: "Preparador Físico",           nota: "Primer equipo" },
    { label: "Ciudad",       valor: "Carlos Casares",              nota: "Buenos Aires, Argentina" },
    { label: "Formación",    valor: "Profesor de Educación Física", nota: "Instituto N.º 13 · Pehuajó" },
    { label: "Idiomas",      valor: "Español",                     nota: "" },
    { label: "Contacto",     valor: "+54 9 2395 43-9825",          nota: "Instagram · @luchisd11" }
  ],

  /* --- Áreas de trabajo: los chips del bloque MÉTODO ---------
     Sólo lo que está documentado en el sitio o dicho por él.    */
  areas: [
    "Fuerza", "Control de carga", "GPS Catapult", "Readaptación",
    "Trabajo en campo", "Gimnasio", "Juegos reducidos", "Velocidad",
    "Videoanálisis", "Trabajo interdisciplinario"
  ],

  /* --- Trayectoria ------------------------------------------
     Una entrada por etapa, de la más vieja a la más nueva.
     La página las ordena sola y arma la línea de tiempo.

       desde:   año de entrada          (número)
       hasta:   año de salida, o null si sigue
       etapa:   cuando hubo más de un cambio en el mismo año
       club:    nombre completo
       escudo:  "assets/img/escudos/<archivo>.png"  (opcional)
       liga:    categoría o división
       rol:     el cargo exacto
       cuerpo:  entrenador o cuerpo técnico
       tareas:  de qué estuvo a cargo
       datos:   hasta cinco casillas de números
       logros:  lista de líneas destacadas
       nota:    un párrafo corto, si hace falta

     Toda la carrera es en el mismo club, así que la línea de tiempo pone
     debajo de cada punto el cuerpo técnico y no el club: eso lo resuelve
     sola la página, no hace falta escribirlo acá.
  */
  trayectoria: [
    {
      desde: 2019, hasta: 2019, etapa: "",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Categorías inferiores",
      rol: "Preparador Físico · primer profe",
      cuerpo: "",
      tareas: [],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2020, hasta: 2020, etapa: "",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico institucional",
      cuerpo: "Cuerpo técnico de Manuel Fernández",
      tareas: ["Gimnasio", "Tareas alternas en campo", "Videoanálisis"],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2021, hasta: 2021, etapa: "",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico institucional",
      cuerpo: "Cuerpo técnico de Manuel Fernández",
      tareas: ["Gimnasio", "Tareas alternas en campo", "Videoanálisis"],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2022, hasta: 2022, etapa: "1ª etapa",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico institucional",
      cuerpo: "Cuerpo técnico de Federico Hernández",
      tareas: [],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2022, hasta: 2022, etapa: "2ª etapa · desde mayo",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico institucional",
      cuerpo: "Cuerpo técnico de Diego Osella",
      tareas: ["Gimnasio", "Tareas de campo", "Control de carga con GPS Catapult"],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2022, hasta: 2022, etapa: "3ª etapa · interinato",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico 2",
      cuerpo: "Cuerpo técnico de Andrés Zerillo",
      tareas: [],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2023, hasta: 2023, etapa: "",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico institucional",
      cuerpo: "Cuerpo técnico de Gabriel Gómez",
      tareas: ["Control de carga", "Gimnasio", "Readaptación · vuelta a la competencia"],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2024, hasta: 2024, etapa: "1ª etapa",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico institucional",
      cuerpo: "Cuerpo técnico de Gabriel Gómez",
      tareas: [
        "Control de carga con GPS Catapult",
        "Gimnasio",
        "Fuerza en sesiones previas al entrenamiento",
        "Fuerza durante el entrenamiento",
        "Readaptación · vuelta a la competencia"
      ],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2024, hasta: 2024, etapa: "2ª etapa · interinato",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico del plantel profesional",
      cuerpo: "Cuerpo técnico de Adrián Adrover",
      tareas: ["Readaptación · vuelta a la competencia"],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2024, hasta: 2024, etapa: "3ª etapa",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico institucional",
      cuerpo: "Cuerpo técnico de Pablo Vico",
      tareas: ["Control de carga", "Tareas de campo", "Gimnasio", "Readaptación · vuelta a la competencia"],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2025, hasta: 2025, etapa: "",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico 2",
      cuerpo: "Cuerpo técnico de Adrián Adrover",
      tareas: ["Readaptación · vuelta a la competencia"],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2026, hasta: 2026, etapa: "1ª etapa",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico 2",
      cuerpo: "Cuerpo técnico de Adrián Adrover",
      tareas: ["Readaptación · vuelta a la competencia"],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2026, hasta: 2026, etapa: "2ª etapa",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico",
      cuerpo: "Cuerpo técnico de Patricio Toranzo",
      tareas: [],
      datos: [], logros: [], nota: ""
    },
    {
      desde: 2026, hasta: null, etapa: "3ª etapa",
      club: "Club Agropecuario Argentino",
      escudo: "", liga: "Primera Nacional",
      rol: "Preparador Físico institucional",
      cuerpo: "Cuerpo técnico de Gabriel Gómez",
      actual: true,
      tareas: ["Control de carga con GPS", "Gimnasio"],
      datos: [], logros: [], nota: ""
    }
  ],

  /* --- Formación --------------------------------------------
     { titulo, casa, anio, tipo: "titulo" | "curso", detalle }
     `tipo` sólo cambia la etiqueta que se ve al costado.        */
  formacion: [
    {
      titulo: "Profesor de Educación Física",
      casa: "Instituto N.º 13 de Pehuajó",
      anio: "", tipo: "titulo", detalle: ""
    },
    {
      titulo: "Instructor en musculación",
      casa: "", anio: "", tipo: "curso", detalle: ""
    },
    {
      titulo: "Personal trainer",
      casa: "", anio: "", tipo: "curso", detalle: ""
    },
    {
      titulo: "GPS Catapult y control de cargas",
      casa: "Capacitaciones presenciales en Buenos Aires y online",
      anio: "", tipo: "curso",
      detalle: "Formación sostenida durante toda su etapa en el club, con profesionales de las mejores ligas del mundo."
    }
  ],

  /* --- Galería: si queda vacía, toma las fotos del sitio ----- */
  galeria: []
};
