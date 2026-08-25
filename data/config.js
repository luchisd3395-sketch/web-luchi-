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
    heroImage: "assets/img/portada-entrada-en-calor.jpg"
  },

  media: {
    /* Foto de cada bloque. Para cambiarlas:
         imagen bloque <id> assets/img/<archivo>.jpg
       Sin foto todavía: posesion · finalizacion · abp */
    images: {
      marco:      "assets/img/cuerpo-tecnico.jpg",
      fuerza:     "assets/img/coordinacion.jpg",
      ssg:        "assets/img/grupo-entrenamiento.jpg",
      tactico:    "assets/img/direccion-de-sesion.jpg",
      carga:      "assets/img/control-de-carga.jpg",
      microciclo: "assets/img/plantel.jpg"
    },

    /* Sección «Momentos en el club»: las fotos que no ilustran un
       bloque. Para sumar más:  momentos add assets/img/<archivo>.jpg */
    gallery: [
      { src: "assets/img/cuerpo-tecnico-cancha.jpg", pie: "Cuerpo técnico en el campo de entrenamiento" },
      { src: "assets/img/estadio-del-club.jpg",      pie: "Estadio del club" },
      { src: "assets/img/cancha-visitante.jpg",      pie: "De visitante" }
    ]
  }
};
