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
    instagram: "",
    linkedin: "",
    mail: "",
    telefono: ""
  },

  /* --- El párrafo de arriba: quién es y cómo trabaja --------- */
  bio: "",

  /* --- Ficha de datos (columna derecha del bloque BIO) -------
     Cada entrada es una casilla. Se pintan en el orden que estén. */
  ficha: [
    { label: "Club actual",  valor: "Club Agropecuario Argentino", nota: "Primera Nacional" },
    { label: "Puesto",       valor: "Preparador Físico",           nota: "Primer equipo" },
    { label: "Ciudad",       valor: "Carlos Casares",              nota: "Buenos Aires, Argentina" },
    { label: "Formación",    valor: "",                            nota: "" },
    { label: "Idiomas",      valor: "Español",                     nota: "" },
    { label: "Contacto",     valor: "",                            nota: "" }
  ],

  /* --- Áreas de trabajo: los chips del bloque MÉTODO --------- */
  areas: [
    "Fuerza", "Control de carga", "GPS", "Readaptación",
    "Velocidad", "Juegos reducidos", "Periodización"
  ],

  /* --- Trayectoria ------------------------------------------
     Una entrada por etapa, de la más vieja a la más nueva.
     La página las ordena sola y arma la línea de tiempo.

       desde:   año de entrada          (número)
       hasta:   año de salida, o null si sigue
       club:    nombre completo
       escudo:  "assets/img/escudos/<archivo>.png"  (opcional)
       liga:    categoría o división
       rol:     el cargo exacto
       cuerpo:  entrenador o cuerpo técnico
       datos:   hasta cinco casillas de números
       logros:  lista de líneas destacadas
       nota:    un párrafo corto, si hace falta
  */
  trayectoria: [
    {
      desde: null, hasta: null,
      club: "Club Agropecuario Argentino",
      escudo: "",
      liga: "Primera Nacional",
      rol: "Preparador Físico",
      cuerpo: "",
      actual: true,
      datos: [],
      logros: [],
      nota: ""
    }
  ],

  /* --- Formación --------------------------------------------
     { titulo, casa, anio, tipo: "titulo" | "curso" }            */
  formacion: [],

  /* --- Galería: si queda vacía, toma las fotos del sitio ----- */
  galeria: []
};
