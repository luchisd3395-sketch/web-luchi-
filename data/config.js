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
    /* Foto de cada bloque. Para cambiarlas:
         imagen bloque <id> assets/img/<archivo>.jpg
       Sin foto todavía: posesion · finalizacion · abp */
    images: {
      marco:      "assets/img/cuerpo-tecnico-trabajo.jpg",
      fuerza:     "assets/img/fuerza-barra.jpg",
      ssg:        "assets/img/grupo-entrenamiento.jpg",
      tactico:    "assets/img/direccion-tactica.jpg",
      carga:      "assets/img/control-de-carga.jpg",
      microciclo: "assets/img/plantel.jpg"
    },

    /* Sección «Momentos en el club». Para sumar más:
         momentos add assets/img/<archivo>.jpg --pie "Texto" */
    gallery: [
      { src: "assets/img/portada-entrada-en-calor.jpg", pie: "Entrada en calor antes del partido" },
      { src: "assets/img/arena-bolsas.jpg",            pie: "Fuerza específica en arena" },
      { src: "assets/img/arena-sprints.jpg",           pie: "Sprints en arena" },
      { src: "assets/img/gps-en-vivo.jpg",             pie: "Datos de GPS en vivo durante la sesión" },
      { src: "assets/img/atardecer-movilidad.jpg",     pie: "Movilidad al atardecer" },
      { src: "assets/img/cuerpo-tecnico.jpg",          pie: "Cuerpo técnico" },
      { src: "assets/img/planilla-entrenamiento.jpg",  pie: "Planilla de sesión" },
      { src: "assets/img/coordinacion.jpg",            pie: "Coordinación en la activación" },
      { src: "assets/img/direccion-de-sesion.jpg",     pie: "Dirigiendo la sesión" },
      { src: "assets/img/carrera-continua.jpg",        pie: "Trabajo en el predio" },
      { src: "assets/img/retrato-profe.jpg",           pie: "En el predio" },
      { src: "assets/img/cuerpo-tecnico-cancha.jpg",   pie: "Cuerpo técnico en el campo de entrenamiento" },
      { src: "assets/img/estadio-del-club.jpg",        pie: "Estadio del club" },
      { src: "assets/img/cancha-visitante.jpg",        pie: "De visitante" }
    ]
  }
};
