/* =============================================================
   data/config.js — configuración PUBLICADA del sitio
   -------------------------------------------------------------
   Todo lo que se define aquí es lo que ve cualquier visitante.
   Se genera desde la terminal con el comando `publicar`:
     1. Abrí la terminal (tecla ` o botón TERMINAL).
     2. Ajustá el sitio a gusto.
     3. Escribí `publicar` — se descarga un config.js.
     4. Reemplazá este archivo con el descargado y subí el cambio.
   ============================================================= */
window.LSD_CONFIG = {

  /* Foto de fondo de la portada.
     Para poner un vídeo en su lugar:  portada video <url> */
  site: {
    heroImage: "assets/img/portada-cuerpo-tecnico.jpg",
    /* La foto es vertical y la portada apaisada: el foco decide qué franja
       se ve. Con 12 quedan las cuatro caras completas.  portada foco <n> */
    heroFocus: 12
  },

  media: {
    videos: [
      {
        id: "fuerza-en-cancha",
        title: "Fuerza en cancha",
        url: "https://youtube.com/watch?v=tH5lOo9OFPE",
        provider: "youtube",
        vid: "tH5lOo9OFPE",
        start: 0,
        end: 30,
        block: "fuerza",
        work: "fuerza-especifica",
        dia: "",
        tags: ["fuerza", "campo"],
        duration: "0:30",
        desc: "", poster: "", featured: false,
        added: "2026-09-01"
      },
      {
        id: "smg-4v4-mas-4",
        title: "SMG · Reducido 4v4+4",
        /* Grabación del club, servida desde el propio repositorio. Está en
           HEVC, que Safari reproduce y otros navegadores no: la página lo
           detecta y ofrece abrir o descargar el archivo. */
        url: "assets/video/smg-side-medium-game.mov",
        provider: "file",
        vid: "",
        start: null,
        end: null,
        block: "ssg",
        work: "ssg-comodines",
        dia: "",
        tags: ["SMG", "side medium game", "4v4+4", "comodines"],
        duration: "0:09",
        desc: "", poster: "", featured: false,
        added: "2026-09-08"
      },
      {
        id: "ssg-rondo-11v4",
        title: "SSG · Rondo 11v4",
        /* Side Small Game, con el nombre que usa el club. */
        url: "https://youtu.be/8qhsf9m6MZw",
        provider: "youtube",
        vid: "8qhsf9m6MZw",
        start: null,
        end: null,
        block: "ssg",
        work: null,
        dia: "",
        tags: ["SSG", "side small game", "rondo", "11v4"],
        duration: "",
        desc: "", poster: "", featured: true,
        added: "2026-09-08"
      },
      {
        id: "reducido-6v6",
        title: "Reducido 6v6",
        url: "https://youtu.be/p5jfB8Cwvnw",
        provider: "youtube",
        vid: "p5jfB8Cwvnw",
        start: null,
        end: null,
        block: "ssg",
        work: "ssg-5v5",
        dia: "",
        tags: ["reducido", "6v6"],
        duration: "",
        desc: "", poster: "", featured: false,
        added: "2026-09-08"
      },
      {
        id: "cruces-de-pases",
        title: "Cruces de pases",
        url: "https://youtu.be/0iNPYxEud2Y",
        provider: "youtube",
        vid: "0iNPYxEud2Y",
        start: null,
        end: null,
        block: "warmup",
        work: null,
        dia: "",
        tags: ["activación", "pase", "warm up"],
        duration: "",
        desc: "", poster: "", featured: false,
        added: "2026-09-08"
      },
      {
        id: "circuito-pases-sprint",
        title: "Circuito de pases · desarrollo del sprint",
        url: "https://youtu.be/b6yWNbihtaQ",
        provider: "youtube",
        vid: "b6yWNbihtaQ",
        start: null,
        end: null,
        block: "circuitos",
        work: "rueda-pases",
        dia: "MD-3",
        tags: ["circuito", "pase", "sprint"],
        duration: "",
        desc: "", poster: "", featured: false,
        added: "2026-09-08"
      }
    ],

    /* Foto de cada bloque: las diez carpetas tienen la suya. Para cambiarlas,
       desde el panel (pestaña «Archivos») o con el comando:
         imagen bloque <id> assets/img/<archivo>.jpg */
    images: {
      modelo:            "assets/img/cuerpo-tecnico-trabajo.jpg",
      sesion:            "assets/img/planilla-entrenamiento.jpg",
      warmup:            "assets/img/portada-entrada-en-calor.jpg",
      fuerza:            "assets/img/fuerza-barra.jpg",
      ssg:               "assets/img/grupo-entrenamiento.jpg",
      posesion:          "assets/img/coordinacion.jpg",
      circuitos:         "assets/img/carrera-continua.jpg",
      "tactico-analitico": "assets/img/direccion-de-sesion.jpg",
      "tactico-global":  "assets/img/direccion-tactica.jpg",
      carga:             "assets/img/control-de-carga.jpg"
    },

    /* Sección «Momentos en el club». Para sumar más:
         momentos add assets/img/<archivo>.jpg --pie "Texto" */
    gallery: [
      { src: "assets/img/arena-bolsas.jpg",            pie: "Fuerza específica en arena" },
      { src: "assets/img/arena-sprints.jpg",           pie: "Sprints en arena" },
      { src: "assets/img/gps-en-vivo.jpg",             pie: "Datos de GPS en vivo durante la sesión" },
      { src: "assets/img/atardecer-movilidad.jpg",     pie: "Movilidad al atardecer" },
      { src: "assets/img/cuerpo-tecnico.jpg",          pie: "Cuerpo técnico" },
      { src: "assets/img/plantel.jpg",                 pie: "El plantel" },
      { src: "assets/img/retrato-profe.jpg",           pie: "En el predio" },
      { src: "assets/img/cuerpo-tecnico-cancha.jpg",   pie: "Cuerpo técnico en el campo de entrenamiento" },
      { src: "assets/img/estadio-del-club.jpg",        pie: "Estadio del club" },
      { src: "assets/img/cancha-visitante.jpg",        pie: "De visitante" }
    ]
  }
};
