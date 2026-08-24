/* =============================================================
   commands.js — comandos de la terminal de configuración
   ============================================================= */
(function (w, d) {
  "use strict";
  var LSD = w.LSD, T = LSD.term, S = LSD.store, esc = LSD.esc;
  var M = w.LSD_METHODOLOGY;
  var da = LSD.deaccent;

  /* ---------------------------------------------------------
     Traducción de valores castellano → esquema interno
     --------------------------------------------------------- */
  var VALUE_ALIAS = {
    "video.layout":    { mosaico: "mosaic", cuadricula: "grid", grilla: "grid", rejilla: "grid", lista: "list", carrusel: "carousel", cine: "cinema", cinema: "cinema", mamposteria: "masonry", ladrillo: "masonry" },
    "video.align":     { izquierda: "left", izq: "left", centro: "center", centrado: "center", derecha: "right", der: "right", completo: "stretch", estirado: "stretch", ancho: "stretch" },
    "video.size":      { mini: "xs", diminuto: "xs", chico: "sm", pequeno: "sm", mediano: "md", medio: "md", grande: "lg", enorme: "xl", gigante: "xl" },
    "video.hover":     { acercar: "zoom", elevar: "lift", levantar: "lift", ninguno: "none", nada: "none", off: "none" },
    "video.player":    { ventana: "modal", emergente: "modal", incrustado: "inline", enlinea: "inline", inline: "inline" },
    "video.ratio":     { cuadrado: "1:1", vertical: "9:16", horizontal: "16:9", panoramico: "21:9", clasico: "4:3", foto: "3:2" },
    "theme.mode":      { oscuro: "dark", claro: "light", negro: "dark", blanco: "light" },
    "theme.font":      { condensada: "condensed", estrecha: "condensed", moderna: "inter", monoespaciada: "mono", serifa: "serif", titular: "archivo" },
    "theme.density":   { compacta: "compact", compacto: "compact", normal: "normal", amplia: "wide", amplio: "wide", espaciosa: "wide" },
    "theme.titlecase": { mayusculas: "upper", mayuscula: "upper", normales: "normal", minusculas: "normal" },
    "layout.container": { caja: "boxed", cajon: "boxed", ancho: "wide", amplio: "wide", completo: "full", total: "full" },
    "layout.hero":     { completa: "full", grande: "full", dividida: "split", partida: "split", minima: "minimal", minimo: "minimal", apagada: "off", ninguna: "off", sin: "off" },
    "layout.nav":      { arriba: "top", superior: "top", lateral: "side", costado: "side", oculta: "hidden", ninguna: "hidden" },
    "layout.card":     { recta: "sharp", cuadrada: "sharp", suave: "soft", redondeada: "soft", contorno: "outline", linea: "outline", vidrio: "glass", cristal: "glass" },
    "terminal.dock":   { abajo: "bottom", inferior: "bottom", flotante: "float", lateral: "right", derecha: "right", completa: "full", pantalla: "full" }
  };

  function translate(path, val) {
    var map = VALUE_ALIAS[path];
    if (!map) return val;
    var k = da(String(val));
    return map[k] !== undefined ? map[k] : val;
  }

  /* --- Atajos de propiedad en castellano --- */
  var VIDEO_PROP = {
    formato: "video.layout", disposicion: "video.layout", layout: "video.layout",
    columnas: "video.cols", cols: "video.cols",
    proporcion: "video.ratio", relacion: "video.ratio", ratio: "video.ratio",
    tamano: "video.size", size: "video.size",
    alineacion: "video.align", alinear: "video.align", align: "video.align",
    separacion: "video.gap", espacio: "video.gap", gap: "video.gap",
    efecto: "video.hover", hover: "video.hover",
    reproductor: "video.player", player: "video.player",
    titulo: "video.title", titulos: "video.title",
    meta: "video.meta", datos: "video.meta",
    etiquetas: "video.tags", tags: "video.tags",
    descripcion: "video.desc", desc: "video.desc",
    autoplay: "video.autoplay", automatico: "video.autoplay",
    silencio: "video.muted", mudo: "video.muted",
    bucle: "video.loop", loop: "video.loop"
  };

  /* ---------------------------------------------------------
     Utilidades
     --------------------------------------------------------- */
  function download(filename, text, mime) {
    try {
      var blob = new Blob([text], { type: mime || "application/json;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = d.createElement("a");
      a.href = url; a.download = filename;
      d.body.appendChild(a); a.click(); d.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      return true;
    } catch (e) { return false; }
  }

  function blockIds() { return M.blocks.map(function (b) { return b.id; }); }
  function workIds(blockId) {
    var out = [];
    M.blocks.forEach(function (b) {
      if (blockId && b.id !== blockId) return;
      b.items.forEach(function (i) { out.push(i.id); });
    });
    return out;
  }
  function findBlock(q) {
    var k = da(q);
    return M.blocks.filter(function (b) {
      return da(b.id) === k || da(b.short) === k || b.code === q || da(b.title).indexOf(k) === 0;
    })[0] || null;
  }
  function findWork(q) {
    var k = da(q), found = null;
    M.blocks.forEach(function (b) {
      b.items.forEach(function (i) {
        if (!found && (da(i.id) === k || da(i.name) === k)) found = { block: b, item: i };
      });
    });
    return found;
  }
  function videoRef(ref) {
    var vids = S.config.media.videos;
    if (/^#?\d+$/.test(ref)) {
      var n = parseInt(ref.replace("#", ""), 10) - 1;
      return vids[n] ? { v: vids[n], i: n } : null;
    }
    for (var i = 0; i < vids.length; i++) if (vids[i].id === ref) return { v: vids[i], i: i };
    return null;
  }
  function uniqueId(base) {
    var vids = S.config.media.videos, id = base, n = 2;
    while (vids.some(function (v) { return v.id === id; })) id = base + "-" + (n++);
    return id;
  }
  function applied(path) {
    T.ok(path + " → " + JSON.stringify(S.get(path)));
  }

  /* =========================================================
     AYUDA
     ========================================================= */
  var GROUPS = [
    { g: "Básicos",       cmds: ["ayuda", "estado", "limpiar", "abrir", "salir", "acerca"] },
    { g: "Configuración", cmds: ["config", "set", "get", "reset", "texto"] },
    { g: "Aspecto",       cmds: ["tema", "color", "fuente", "densidad", "layout", "portada", "nav", "tarjeta"] },
    { g: "Vídeos",        cmds: ["video", "videos"] },
    { g: "Contenido",     cmds: ["bloques", "trabajos", "buscar", "seccion"] },
    { g: "Datos",         cmds: ["exportar", "importar", "publicar", "demo", "clave"] }
  ];

  T.register({
    name: "ayuda", alias: ["help", "?", "h"],
    desc: "Lista de comandos disponibles",
    usage: "ayuda [comando]",
    complete: function (prev, partial) {
      return T.commands().map(function (c) { return { name: c.name, desc: c.desc }; });
    },
    run: function (args) {
      if (args[0]) {
        var c = T.find(args[0]);
        if (!c) { T.err("No existe el comando «" + args[0] + "»."); return; }
        T.head(c.name.toUpperCase());
        T.print(c.desc);
        if (c.usage) T.html('<div class="t-line t-info">Uso: <span class="t-key">' + esc(c.usage) + "</span></div>");
        if (c.alias && c.alias.length) T.dim("Alias: " + c.alias.join(", "));
        if (c.help) c.help();
        return;
      }
      T.head("COMANDOS");
      GROUPS.forEach(function (grp) {
        T.html('<div class="t-line t-dim" style="margin-top:.5rem">' + esc(grp.g) + "</div>");
        var rows = grp.cmds.map(function (n) {
          var c = T.find(n);
          return c ? [c.usage || c.name, c.desc] : null;
        }).filter(Boolean);
        T.table(rows);
      });
      T.space();
      T.dim("Detalle de un comando:  ayuda <comando>        ·  Encadenar:  comando1 ; comando2");
      T.dim("Atajos:  Tab autocompleta  ·  ↑↓ historial  ·  Ctrl+L limpia  ·  ` abre y cierra la terminal");
    }
  });

  T.register({
    name: "limpiar", alias: ["clear", "cls"],
    desc: "Limpia la pantalla de la terminal",
    run: function () { T.clear(); T.banner(); }
  });

  T.register({
    name: "salir", alias: ["exit", "cerrar", "quit"],
    desc: "Cierra la terminal y vuelve a la página",
    run: function () { T.close(); }
  });

  T.register({
    name: "acerca", alias: ["about", "info"],
    desc: "Información del proyecto",
    run: function () {
      var s = S.config.site;
      T.head("ACERCA DE");
      T.table([
        ["Proyecto", s.title],
        ["Autor", s.author],
        ["Rol", s.role],
        ["Club", s.club],
        ["Bloques", String(M.blocks.length)],
        ["Unidades de trabajo", String(LSD.allWorks().length)],
        ["Vídeos cargados", String(S.config.media.videos.length)],
        ["Versión de datos", M.meta.version]
      ]);
      T.space();
      T.dim("Los cambios se guardan en este navegador. Usá `publicar` para dejarlos fijos en el sitio.");
    }
  });

  T.register({
    name: "estado", alias: ["status", "st"],
    desc: "Resumen de la configuración actual",
    run: function () {
      var c = S.config;
      T.head("ESTADO");
      T.table([
        ["tema", c.theme.preset + " · " + c.theme.mode + " · acento " + c.theme.accent],
        ["tipografía", c.theme.font + " · densidad " + c.theme.density + " · radio " + c.theme.radius + "px"],
        ["layout", "contenedor " + c.layout.container + " · portada " + c.layout.hero + " · nav " + c.layout.nav + " · tarjeta " + c.layout.card],
        ["secciones", c.layout.sections.join(" › ") + (c.layout.hidden.length ? "  (ocultas: " + c.layout.hidden.join(", ") + ")" : "")],
        ["vídeos", c.video.layout + " · " + c.video.cols + " col · " + c.video.ratio + " · " + c.video.size + " · " + c.video.align],
        ["reproductor", c.video.player + (c.video.autoplay ? " · autoplay" : "") + (c.video.muted ? " · sin sonido" : "")],
        ["archivo", c.media.videos.length + " vídeos"],
        ["terminal", c.terminal.dock + " · " + c.terminal.height + "vh" + (c.terminal.pass ? " · protegida" : "")]
      ]);
    }
  });

  /* =========================================================
     CONFIG / SET / GET / RESET
     ========================================================= */
  T.register({
    name: "config", alias: ["configuracion", "conf"],
    desc: "Lista todas las claves configurables",
    usage: "config [filtro]",
    complete: function () { return ["site", "theme", "layout", "video", "terminal"]; },
    run: function (args) {
      var filter = args[0] ? da(args[0]) : "";
      var keys = Object.keys(LSD.SCHEMA).filter(function (k) { return !filter || da(k).indexOf(filter) >= 0; });
      if (!keys.length) { T.err("Ningún ajuste coincide con «" + args[0] + "»."); return; }
      var group = "";
      keys.forEach(function (k) {
        var g = k.split(".")[0];
        if (g !== group) { group = g; T.html('<div class="t-line t-head">' + esc(g.toUpperCase()) + "</div>"); }
        var sc = LSD.SCHEMA[k], val = S.get(k);
        var opts = sc.type === "enum" ? "  [" + sc.values.join("|") + "]" :
                   sc.type === "bool" ? "  [on|off]" :
                   sc.type === "num" ? "  [" + sc.min + "-" + sc.max + "]" : "";
        T.html('<div class="t-line"><span class="t-key">' + esc(k) + "</span> " +
          '<span class="t-ok">= ' + esc(JSON.stringify(val)) + "</span>" +
          '<span class="t-dim">' + esc(opts) + "</span>" +
          '<div class="t-dim" style="padding-left:1.2rem">' + esc(sc.desc) + "</div></div>");
      });
      T.space();
      T.dim("Cambiar un valor:  set <clave> <valor>");
    }
  });

  T.register({
    name: "set", alias: ["poner", "cambiar"],
    desc: "Cambia cualquier ajuste por su clave",
    usage: "set <clave> <valor>",
    complete: function (prev, partial) {
      if (prev.length === 0) {
        return Object.keys(LSD.SCHEMA).map(function (k) { return { name: k, desc: LSD.SCHEMA[k].desc }; });
      }
      var sc = LSD.SCHEMA[prev[0]];
      if (!sc) return [];
      if (sc.type === "enum") return sc.values;
      if (sc.type === "bool") return ["on", "off"];
      if (sc.type === "cols") return ["1", "2", "3", "4", "5", "6", "auto"];
      return [];
    },
    run: function (args) {
      if (args.length < 2) { T.err("Uso: set <clave> <valor>   —  probá `config` para ver las claves."); return; }
      var path = args[0];
      if (!LSD.SCHEMA[path]) {
        var near = Object.keys(LSD.SCHEMA).filter(function (k) { return da(k).indexOf(da(path)) >= 0; });
        T.err("La clave «" + path + "» no existe.");
        if (near.length) { T.dim("Claves parecidas:"); T.chips(near.slice(0, 8), "set "); }
        return;
      }
      var value = args.slice(1).join(" ");
      var res = S.set(path, translate(path, value));
      if (!res.ok) { T.err(res.err); return; }
      applied(path);
    }
  });

  T.register({
    name: "get", alias: ["ver", "leer"],
    desc: "Muestra el valor actual de un ajuste",
    usage: "get <clave>",
    complete: function (prev) { return prev.length ? [] : Object.keys(LSD.SCHEMA); },
    run: function (args) {
      if (!args[0]) { T.err("Uso: get <clave>"); return; }
      var v = S.get(args[0]);
      if (v === undefined) { T.err("La clave «" + args[0] + "» no existe."); return; }
      T.html('<div class="t-line"><span class="t-key">' + esc(args[0]) + '</span> = <span class="t-ok">' + esc(JSON.stringify(v)) + "</span></div>");
    }
  });

  T.register({
    name: "reset", alias: ["reiniciar", "restablecer"],
    desc: "Restablece la configuración a los valores por defecto",
    usage: "reset [tema|layout|video|site|todo]",
    complete: function () { return ["tema", "layout", "video", "site", "terminal", "todo"]; },
    run: function (args) {
      var map = { tema: "theme", theme: "theme", layout: "layout", diseno: "layout", video: "video", videos: "video", site: "site", sitio: "site", terminal: "terminal", todo: "all", all: "all" };
      var scope = map[da(args[0] || "todo")];
      if (!scope) { T.err("Ámbito no válido. Opciones: tema · layout · video · site · terminal · todo"); return; }
      if (scope === "all") {
        S.reset("all");
        T.warn("Configuración completa restablecida (incluidos los vídeos).");
      } else {
        S.reset(scope);
        T.ok("Restablecido: " + scope);
      }
    }
  });

  T.register({
    name: "texto", alias: ["text", "titulo", "textos"],
    desc: "Edita los textos del sitio (título, portada, intro…)",
    usage: "texto <clave> <contenido>",
    complete: function (prev) {
      if (prev.length) return [];
      return Object.keys(LSD.SCHEMA).filter(function (k) { return k.indexOf("site.") === 0; })
        .map(function (k) { return { name: k.replace("site.", ""), desc: LSD.SCHEMA[k].desc }; });
    },
    run: function (args) {
      if (!args.length) {
        T.head("TEXTOS DEL SITIO");
        Object.keys(LSD.SCHEMA).filter(function (k) { return k.indexOf("site.") === 0; }).forEach(function (k) {
          T.html('<div class="t-line"><span class="t-key">' + esc(k.replace("site.", "")) + "</span> " +
            '<span class="t-dim">' + esc(LSD.SCHEMA[k].desc) + '</span><div class="v" style="padding-left:1.2rem;color:#b9cdc2">' +
            esc(S.get(k) || "—") + "</div></div>");
        });
        T.space();
        T.dim('Ejemplo:  texto tagline "Fútbol, método y trabajo diario"');
        return;
      }
      var key = "site." + args[0];
      if (!LSD.SCHEMA[key]) { T.err("No existe el texto «" + args[0] + "». Escribí `texto` para ver la lista."); return; }
      if (args.length < 2) { T.err('Uso: texto ' + args[0] + ' "contenido"'); return; }
      var res = S.set(key, args.slice(1).join(" "));
      if (!res.ok) { T.err(res.err); return; }
      applied(key);
    }
  });

  /* =========================================================
     ASPECTO
     ========================================================= */
  T.register({
    name: "tema", alias: ["theme", "paleta"],
    desc: "Aplica una paleta completa",
    usage: "tema <nombre|lista>",
    complete: function (prev) { return prev.length ? [] : Object.keys(LSD.PRESETS).concat(["lista"]); },
    run: function (args) {
      var n = da(args[0] || "");
      if (!n || n === "lista" || n === "list") {
        T.head("PALETAS DISPONIBLES");
        Object.keys(LSD.PRESETS).forEach(function (k) {
          var p = LSD.PRESETS[k];
          T.html('<div class="t-line"><span class="t-key">' + esc(k) + '</span> ' +
            '<span style="display:inline-block;width:11px;height:11px;background:' + esc(p.accent) + ';vertical-align:middle;margin:0 .4rem"></span>' +
            '<span class="t-dim">' + esc(p.label) + "</span></div>");
        });
        T.space();
        T.chips(Object.keys(LSD.PRESETS), "tema ");
        return;
      }
      if (!LSD.PRESETS[n]) { T.err("No existe la paleta «" + args[0] + "»."); T.chips(Object.keys(LSD.PRESETS), "tema "); return; }
      S.set("theme.preset", n);
      T.ok("Paleta aplicada: " + n + " — " + LSD.PRESETS[n].label);
    }
  });

  T.register({
    name: "color",
    desc: "Cambia un color concreto de la paleta",
    usage: "color <acento|fondo|texto|borde|…> <color>",
    complete: function (prev) {
      if (prev.length === 0) return ["acento", "fondo", "fondo2", "superficie", "superficie2", "texto", "suave", "borde"];
      return ["#d8ff3e", "#ff3b30", "#3d7bff", "#35e07a", "#f2c14b", "negro", "blanco", "rojo", "verde", "azul", "amarillo", "lima"];
    },
    run: function (args) {
      var map = {
        acento: "accent", accent: "accent", fondo: "bg", bg: "bg", fondo2: "bg2", bg2: "bg2",
        superficie: "surface", surface: "surface", superficie2: "surface2", surface2: "surface2",
        texto: "text", text: "text", suave: "muted", muted: "muted", secundario: "muted",
        borde: "border", border: "border"
      };
      var k = map[da(args[0] || "")];
      if (!k) { T.err("Token de color no válido."); T.chips(Object.keys(map).slice(0, 8), "color "); return; }
      if (!args[1]) { T.err("Falta el color. Ejemplo: color acento #d8ff3e"); return; }
      var res = S.set("theme." + k, args[1]);
      if (!res.ok) { T.err(res.err); return; }
      T.html('<div class="t-line t-ok">✔ theme.' + esc(k) + ' → ' + esc(res.value) +
        ' <span style="display:inline-block;width:11px;height:11px;background:' + esc(res.value) + ';vertical-align:middle"></span></div>');
    }
  });

  function simpleSetter(name, alias, path, desc) {
    T.register({
      name: name, alias: alias, desc: desc,
      usage: name + " <valor>",
      complete: function (prev) {
        if (prev.length) return [];
        var sc = LSD.SCHEMA[path];
        var vals = sc.type === "enum" ? sc.values.slice() : [];
        var al = VALUE_ALIAS[path];
        if (al) vals = vals.concat(Object.keys(al));
        return vals;
      },
      run: function (args) {
        var sc = LSD.SCHEMA[path];
        if (!args[0]) {
          T.html('<div class="t-line"><span class="t-key">' + esc(path) + '</span> = <span class="t-ok">' + esc(String(S.get(path))) + "</span></div>");
          if (sc.type === "enum") { T.dim("Opciones:"); T.chips(sc.values, name + " "); }
          return;
        }
        var res = S.set(path, translate(path, args.join(" ")));
        if (!res.ok) { T.err(res.err); return; }
        applied(path);
      }
    });
  }
  simpleSetter("fuente", ["font", "tipografia"], "theme.font", "Cambia la familia tipográfica");
  simpleSetter("densidad", ["density", "espaciado"], "theme.density", "Ajusta el espaciado general");
  simpleSetter("layout", ["diseno", "ancho", "contenedor"], "layout.container", "Ancho del contenedor de la página");
  simpleSetter("portada", ["hero"], "layout.hero", "Estilo de la portada");
  simpleSetter("nav", ["menu", "navegacion"], "layout.nav", "Posición del menú de navegación");
  simpleSetter("tarjeta", ["card", "tarjetas"], "layout.card", "Estilo visual de las tarjetas");

  /* =========================================================
     VÍDEOS — configuración de visualización
     ========================================================= */
  T.register({
    name: "videos", alias: ["vista", "galeria"],
    desc: "Configura cómo se ven los vídeos en la página",
    usage: "videos <propiedad> <valor>",
    complete: function (prev, partial) {
      if (prev.length === 0) {
        return ["formato", "columnas", "proporcion", "tamano", "alineacion", "separacion", "efecto", "reproductor", "titulo", "meta", "etiquetas", "descripcion", "autoplay", "silencio", "bucle"];
      }
      var path = VIDEO_PROP[da(prev[0])];
      if (!path) return [];
      var sc = LSD.SCHEMA[path];
      if (sc.type === "enum") return sc.values.concat(Object.keys(VALUE_ALIAS[path] || {}));
      if (sc.type === "bool") return ["on", "off"];
      if (sc.type === "cols") return ["1", "2", "3", "4", "5", "6", "auto"];
      return [];
    },
    help: function () {
      T.dim("Propiedades: formato · columnas · proporcion · tamano · alineacion · separacion · efecto ·");
      T.dim("             reproductor · titulo · meta · etiquetas · descripcion · autoplay · silencio · bucle");
      T.dim('Ejemplos:  videos formato mosaico   ·   videos tamano grande   ·   videos alineacion centro');
    },
    run: function (args) {
      if (!args.length) {
        T.head("VISUALIZACIÓN DE VÍDEOS");
        var seen = {};
        Object.keys(VIDEO_PROP).forEach(function (p) {
          var path = VIDEO_PROP[p];
          if (seen[path]) return; seen[path] = 1;
          T.html('<div class="t-line"><span class="t-key">' + esc(p) + '</span> = <span class="t-ok">' +
            esc(String(S.get(path))) + '</span> <span class="t-dim">' + esc(LSD.SCHEMA[path].desc) + "</span></div>");
        });
        T.space();
        T.dim("Ejemplo:  videos formato mosaico");
        return;
      }
      var path = VIDEO_PROP[da(args[0])];
      if (!path) {
        T.err("Propiedad desconocida: «" + args[0] + "»");
        T.chips(["formato", "columnas", "proporcion", "tamano", "alineacion", "separacion", "efecto", "reproductor"], "videos ");
        return;
      }
      if (args.length < 2) {
        var sc = LSD.SCHEMA[path];
        T.html('<div class="t-line"><span class="t-key">' + esc(path) + '</span> = <span class="t-ok">' + esc(String(S.get(path))) + "</span></div>");
        if (sc.type === "enum") T.chips(sc.values, "videos " + args[0] + " ");
        if (sc.type === "bool") T.chips(["on", "off"], "videos " + args[0] + " ");
        return;
      }
      var res = S.set(path, translate(path, args.slice(1).join(" ")));
      if (!res.ok) { T.err(res.err); return; }
      applied(path);
    }
  });

  /* =========================================================
     VÍDEOS — gestión del archivo
     ========================================================= */
  var VIDEO_FIELDS = {
    titulo: "title", title: "title", nombre: "title",
    url: "url", enlace: "url", link: "url",
    bloque: "block", block: "block", categoria: "block",
    trabajo: "work", unidad: "work", work: "work",
    tags: "tags", etiquetas: "tags",
    dur: "duration", duracion: "duration", duration: "duration",
    desc: "desc", descripcion: "desc",
    poster: "poster", miniatura: "poster", portada: "poster",
    destacado: "featured", featured: "featured"
  };

  T.register({
    name: "video", alias: ["v", "clip"],
    desc: "Gestiona el archivo de vídeos (añadir, listar, editar, borrar)",
    usage: "video <add|list|rm|edit|mover|destacar|orden|export|import>",
    complete: function (prev, partial) {
      if (prev.length === 0) return [
        { name: "add", desc: "añadir un vídeo" },
        { name: "list", desc: "listar los vídeos" },
        { name: "rm", desc: "borrar un vídeo" },
        { name: "edit", desc: "editar un campo" },
        { name: "mover", desc: "cambiar de bloque" },
        { name: "destacar", desc: "marcar como destacado" },
        { name: "orden", desc: "reordenar" },
        { name: "export", desc: "descargar el archivo" },
        { name: "import", desc: "cargar desde JSON" },
        { name: "vaciar", desc: "borrar todos" }
      ];
      var sub = da(prev[0]);
      if (sub === "rm" || sub === "edit" || sub === "mover" || sub === "destacar" || sub === "orden") {
        if (prev.length === 1) return S.config.media.videos.map(function (v, i) { return { name: v.id, desc: "#" + (i + 1) + " " + v.title }; });
        if (sub === "edit" && prev.length === 2) return Object.keys(VIDEO_FIELDS);
        if (sub === "mover" && prev.length === 2) return blockIds();
      }
      if (sub === "list" && prev.length === 1) return blockIds();
      return [];
    },
    help: function () {
      T.space();
      T.dim('AÑADIR   video add "Título" <url> --bloque <id> [--trabajo <id>] [--tags a,b] [--dur 2:30]');
      T.dim('                                  [--desc "…"] [--poster <url>] [--destacado]');
      T.dim("LISTAR   video list [bloque]");
      T.dim("EDITAR   video edit <id|#n> <campo> <valor>      campos: " + Object.keys(VIDEO_FIELDS).slice(0, 9).join(", "));
      T.dim("BORRAR   video rm <id|#n>        ·      video vaciar");
      T.dim("MOVER    video mover <id|#n> <bloque>   ·   video orden <id|#n> <posición>");
      T.dim("DATOS    video export   ·   video import (abre un cuadro para pegar el JSON)");
      T.space();
      T.dim("Admite YouTube, Vimeo, Google Drive, Dailymotion, Streamable y archivos .mp4/.webm.");
    },
    run: function (args, flags) {
      var sub = da(args[0] || "list");
      var rest = args.slice(1);

      /* ---------- LIST ---------- */
      if (sub === "list" || sub === "listar" || sub === "ls") {
        var vids = S.config.media.videos;
        if (rest[0]) {
          var b = findBlock(rest[0]);
          if (!b) { T.err("Bloque no encontrado: «" + rest[0] + "»"); T.chips(blockIds(), "video list "); return; }
          vids = vids.filter(function (v) { return v.block === b.id; });
        }
        if (!vids.length) {
          T.warn("No hay vídeos cargados todavía.");
          T.dim('Añadí el primero:  video add "Rondo 4v2" https://youtu.be/XXXX --bloque posesion');
          T.dim("O cargá ejemplos de prueba con:  demo");
          return;
        }
        T.head("ARCHIVO DE VÍDEOS (" + vids.length + ")");
        vids.forEach(function (v) {
          var idx = S.config.media.videos.indexOf(v) + 1;
          var b = LSD.blockById(v.block);
          T.html('<div class="t-line">' +
            '<span class="t-dim">#' + idx + "</span>  " +
            '<span class="t-key">' + esc(v.id) + "</span>  " +
            '<span class="t-ok">' + esc(v.title) + "</span>" +
            (v.featured ? ' <span class="t-warn">★</span>' : "") +
            '<div class="t-dim" style="padding-left:2.2rem">' +
              esc((b ? b.code + " " + b.short : "sin bloque")) +
              (v.work ? " › " + esc(v.work) : "") +
              "  ·  " + esc(LSD.providerLabel(v.provider)) +
              (v.duration ? "  ·  " + esc(v.duration) : "") +
              ((v.tags && v.tags.length) ? "  ·  " + esc(v.tags.join(", ")) : "") +
            "</div></div>");
        });
        return;
      }

      /* ---------- ADD ---------- */
      if (sub === "add" || sub === "anadir" || sub === "agregar" || sub === "nuevo") {
        var title = rest[0];
        var url = rest[1];
        if (!title || !url) {
          T.err('Uso: video add "Título del vídeo" <url> --bloque <id>');
          T.dim("Bloques disponibles:");
          T.chips(blockIds());
          return;
        }
        var parsed = LSD.parseMedia(url);
        if (!parsed) { T.err("No se pudo interpretar la URL."); return; }

        var blockId = null, workId = null;
        if (flags.trabajo || flags.work || flags.unidad) {
          var wq = String(flags.trabajo || flags.work || flags.unidad);
          var fw = findWork(wq);
          if (!fw) { T.err("Unidad de trabajo no encontrada: «" + wq + "»"); T.dim("Listá las unidades con:  trabajos"); return; }
          workId = fw.item.id; blockId = fw.block.id;
        }
        if (flags.bloque || flags.block || flags.categoria) {
          var bq = String(flags.bloque || flags.block || flags.categoria);
          var fb = findBlock(bq);
          if (!fb) { T.err("Bloque no encontrado: «" + bq + "»"); T.chips(blockIds()); return; }
          blockId = fb.id;
        }
        if (!blockId) {
          T.err("Falta indicar el bloque. Añadí  --bloque <id>  al comando.");
          T.dim("Bloques disponibles (clic para copiar al cuadro de entrada):");
          T.chips(blockIds());
          return;
        }

        var tags = flags.tags ? String(flags.tags).split(/[,;]+/).map(function (t) { return t.trim(); }).filter(Boolean) : [];
        var rec = {
          id: uniqueId(LSD.slug(title)),
          title: title,
          url: parsed.url,
          provider: parsed.provider,
          vid: parsed.vid,
          block: blockId,
          work: workId,
          tags: tags,
          duration: LSD.normDuration(flags.dur || flags.duracion || ""),
          desc: flags.desc || flags.descripcion || "",
          poster: flags.poster || flags.miniatura || "",
          featured: !!(flags.destacado || flags.featured),
          added: new Date().toISOString().slice(0, 10)
        };
        S.write(function (st) { st.media.videos.push(rec); });
        T.ok('Vídeo añadido: "' + rec.title + '"  ·  id ' + rec.id);
        T.dim("  " + LSD.providerLabel(rec.provider) + "  ·  bloque " + blockId + (workId ? "  ·  unidad " + workId : ""));
        return;
      }

      /* ---------- RM ---------- */
      if (sub === "rm" || sub === "borrar" || sub === "eliminar" || sub === "del") {
        if (!rest[0]) { T.err("Uso: video rm <id|#n>"); return; }
        var ref = videoRef(rest[0]);
        if (!ref) { T.err("No encontré el vídeo «" + rest[0] + "». Listá con:  video list"); return; }
        S.write(function (st) { st.media.videos.splice(ref.i, 1); });
        T.ok('Vídeo eliminado: "' + ref.v.title + '"');
        return;
      }

      if (sub === "vaciar" || sub === "limpiar") {
        var n = S.config.media.videos.length;
        if (!n) { T.warn("El archivo ya está vacío."); return; }
        if (!flags.si && !flags.confirmar && !flags.f) {
          T.warn("Esto borra los " + n + " vídeos del archivo.");
          T.dim("Confirmá con:  video vaciar --si");
          return;
        }
        S.write(function (st) { st.media.videos = []; });
        T.ok("Archivo vaciado (" + n + " vídeos eliminados).");
        return;
      }

      /* ---------- EDIT ---------- */
      if (sub === "edit" || sub === "editar") {
        if (rest.length < 3) { T.err("Uso: video edit <id|#n> <campo> <valor>"); T.dim("Campos: " + Object.keys(VIDEO_FIELDS).join(", ")); return; }
        var r2 = videoRef(rest[0]);
        if (!r2) { T.err("No encontré el vídeo «" + rest[0] + "»."); return; }
        var field = VIDEO_FIELDS[da(rest[1])];
        if (!field) { T.err("Campo desconocido: «" + rest[1] + "»"); T.chips(Object.keys(VIDEO_FIELDS).slice(0, 10)); return; }
        var val = rest.slice(2).join(" ");

        if (field === "tags") val = val.split(/[,;]+/).map(function (t) { return t.trim(); }).filter(Boolean);
        if (field === "featured") val = ["1", "true", "si", "sí", "on", "yes"].indexOf(da(val)) >= 0;
        if (field === "duration") val = LSD.normDuration(val);
        if (field === "block") {
          var nb = findBlock(val);
          if (!nb) { T.err("Bloque no encontrado."); T.chips(blockIds()); return; }
          val = nb.id;
        }
        if (field === "work") {
          var nw = findWork(val);
          if (!nw) { T.err("Unidad no encontrada."); return; }
          val = nw.item.id;
        }
        if (field === "url") {
          var p2 = LSD.parseMedia(val);
          if (!p2) { T.err("URL no válida."); return; }
          S.write(function (st) {
            st.media.videos[r2.i].url = p2.url;
            st.media.videos[r2.i].provider = p2.provider;
            st.media.videos[r2.i].vid = p2.vid;
          });
          T.ok("URL actualizada (" + LSD.providerLabel(p2.provider) + ").");
          return;
        }
        S.write(function (st) { st.media.videos[r2.i][field] = val; });
        T.ok(r2.v.id + " · " + field + " → " + JSON.stringify(val));
        return;
      }

      /* ---------- MOVER ---------- */
      if (sub === "mover" || sub === "move") {
        if (rest.length < 2) { T.err("Uso: video mover <id|#n> <bloque>"); T.chips(blockIds()); return; }
        var r3 = videoRef(rest[0]);
        if (!r3) { T.err("No encontré el vídeo."); return; }
        var b3 = findBlock(rest[1]);
        if (!b3) { T.err("Bloque no encontrado."); T.chips(blockIds()); return; }
        S.write(function (st) { st.media.videos[r3.i].block = b3.id; st.media.videos[r3.i].work = null; });
        T.ok('"' + r3.v.title + '" movido a ' + b3.code + " · " + b3.title);
        return;
      }

      /* ---------- DESTACAR ---------- */
      if (sub === "destacar" || sub === "feature") {
        if (!rest[0]) { T.err("Uso: video destacar <id|#n>"); return; }
        var r4 = videoRef(rest[0]);
        if (!r4) { T.err("No encontré el vídeo."); return; }
        S.write(function (st) { st.media.videos[r4.i].featured = !st.media.videos[r4.i].featured; });
        T.ok('"' + r4.v.title + '" ' + (S.config.media.videos[r4.i].featured ? "marcado como destacado ★" : "ya no está destacado"));
        return;
      }

      /* ---------- ORDEN ---------- */
      if (sub === "orden" || sub === "order" || sub === "mover-a") {
        if (rest.length < 2) { T.err("Uso: video orden <id|#n> <posición>"); return; }
        var r5 = videoRef(rest[0]);
        if (!r5) { T.err("No encontré el vídeo."); return; }
        var pos = parseInt(rest[1], 10) - 1;
        if (isNaN(pos)) { T.err("La posición debe ser un número."); return; }
        S.write(function (st) {
          var arr = st.media.videos;
          pos = Math.max(0, Math.min(arr.length - 1, pos));
          arr.splice(pos, 0, arr.splice(r5.i, 1)[0]);
        });
        T.ok('"' + r5.v.title + '" movido a la posición ' + (pos + 1) + ".");
        return;
      }

      /* ---------- EXPORT / IMPORT ---------- */
      if (sub === "export" || sub === "exportar") {
        var json = JSON.stringify(S.config.media.videos, null, 2);
        download("lsd-videos.json", json);
        T.ok("Descargado lsd-videos.json (" + S.config.media.videos.length + " vídeos).");
        return;
      }
      if (sub === "import" || sub === "importar") {
        var raw = rest.join(" ");
        if (raw) { importVideos(raw); return; }
        openPasteBox("Pegá aquí el JSON con los vídeos", function (txt) { importVideos(txt); });
        return;
      }

      T.err("Subcomando desconocido: «" + args[0] + "»");
      T.chips(["add", "list", "rm", "edit", "mover", "destacar", "orden", "export", "import", "vaciar"], "video ");
    }
  });

  function importVideos(raw) {
    var data;
    try { data = JSON.parse(raw); } catch (e) { T.err("El JSON no es válido: " + e.message); return; }
    var arr = Array.isArray(data) ? data : (data.media && data.media.videos) || (data.videos || null);
    if (!Array.isArray(arr)) { T.err("Esperaba una lista de vídeos."); return; }
    var added = 0;
    S.write(function (st) {
      arr.forEach(function (v) {
        if (!v || !v.url) return;
        var p = LSD.parseMedia(v.url);
        st.media.videos.push({
          id: uniqueId(v.id || LSD.slug(v.title || "video")),
          title: v.title || "Sin título",
          url: p.url, provider: p.provider, vid: p.vid,
          block: (findBlock(v.block || "") || {}).id || M.blocks[0].id,
          work: v.work || null,
          tags: Array.isArray(v.tags) ? v.tags : (v.tags ? String(v.tags).split(/[,;]+/) : []),
          duration: LSD.normDuration(v.duration || ""),
          desc: v.desc || "", poster: v.poster || "",
          featured: !!v.featured,
          added: v.added || new Date().toISOString().slice(0, 10)
        });
        added++;
      });
    });
    T.ok(added + " vídeos importados.");
  }

  /* =========================================================
     CONTENIDO
     ========================================================= */
  T.register({
    name: "bloques", alias: ["blocks", "secciones-contenido"],
    desc: "Lista los bloques metodológicos y sus identificadores",
    run: function () {
      T.head("BLOQUES METODOLÓGICOS");
      M.blocks.forEach(function (b) {
        var nv = LSD.videosOf(b.id).length;
        T.html('<div class="t-line"><span class="t-dim">' + esc(b.code) + "</span>  " +
          '<span class="t-key">' + esc(b.id) + "</span>  " +
          '<span class="t-ok">' + esc(b.title) + "</span>" +
          '<div class="t-dim" style="padding-left:2.2rem">' + b.items.length + " unidades · " + nv + " vídeos</div></div>");
      });
      T.space();
      T.dim("Usá el id al añadir vídeos:  video add \"…\" <url> --bloque <id>");
    }
  });

  T.register({
    name: "trabajos", alias: ["works", "unidades"],
    desc: "Lista las unidades de trabajo de un bloque",
    usage: "trabajos [bloque]",
    complete: function (prev) { return prev.length ? [] : blockIds(); },
    run: function (args) {
      var list = M.blocks;
      if (args[0]) {
        var b = findBlock(args[0]);
        if (!b) { T.err("Bloque no encontrado."); T.chips(blockIds(), "trabajos "); return; }
        list = [b];
      }
      list.forEach(function (b) {
        T.head(b.code + " · " + b.title);
        b.items.forEach(function (i) {
          var nv = S.config.media.videos.filter(function (v) { return v.work === i.id; }).length;
          T.html('<div class="t-line"><span class="t-key">' + esc(i.id) + "</span>  " +
            '<span class="t-ok">' + esc(i.name) + "</span>" + (nv ? ' <span class="t-dim">(' + nv + " vídeos)</span>" : "") + "</div>");
        });
      });
      T.space();
      T.dim('Asociar un vídeo a una unidad:  video add "…" <url> --trabajo <id>');
    }
  });

  T.register({
    name: "buscar", alias: ["search", "find"],
    desc: "Busca en bloques, unidades de trabajo y vídeos",
    usage: "buscar <texto>",
    run: function (args) {
      var q = da(args.join(" "));
      if (!q) { T.err("Uso: buscar <texto>"); return; }
      var hits = 0;
      M.blocks.forEach(function (b) {
        if (da(b.title + " " + b.desc).indexOf(q) >= 0) {
          T.html('<div class="t-line"><span class="t-dim">bloque</span> <span class="t-key">' + esc(b.id) + "</span> " + esc(b.title) + "</div>");
          hits++;
        }
        b.items.forEach(function (i) {
          var hay = da([i.name, i.objetivo, (i.tags || []).join(" "), (i.claves || []).join(" ")].join(" "));
          if (hay.indexOf(q) >= 0) {
            T.html('<div class="t-line"><span class="t-dim">unidad</span> <span class="t-key">' + esc(i.id) + "</span> " +
              esc(i.name) + ' <span class="t-dim">· ' + esc(b.short) + "</span></div>");
            hits++;
          }
        });
      });
      S.config.media.videos.forEach(function (v) {
        if (da([v.title, v.desc, (v.tags || []).join(" ")].join(" ")).indexOf(q) >= 0) {
          T.html('<div class="t-line"><span class="t-dim">vídeo</span> <span class="t-key">' + esc(v.id) + "</span> " + esc(v.title) + "</div>");
          hits++;
        }
      });
      T.space();
      (hits ? T.ok : T.warn)(hits + " resultado" + (hits === 1 ? "" : "s") + " para «" + args.join(" ") + "».");
    }
  });

  T.register({
    name: "seccion", alias: ["section", "secciones"],
    desc: "Muestra, oculta o reordena las secciones de la página",
    usage: "seccion <listar|ocultar|mostrar|orden> [ids]",
    complete: function (prev) {
      if (prev.length === 0) return ["listar", "ocultar", "mostrar", "orden"];
      return Object.keys(LSD.SECTION_LABEL);
    },
    run: function (args) {
      var all = Object.keys(LSD.SECTION_LABEL);
      var sub = da(args[0] || "listar");
      var cfg = S.config.layout;

      if (sub === "listar" || sub === "list" || sub === "ls") {
        T.head("SECCIONES");
        cfg.sections.forEach(function (id, i) {
          var off = cfg.hidden.indexOf(id) >= 0;
          T.html('<div class="t-line"><span class="t-dim">' + (i + 1) + ".</span> " +
            '<span class="t-key">' + esc(id) + "</span> " +
            '<span class="' + (off ? "t-err" : "t-ok") + '">' + (off ? "oculta" : "visible") + "</span> " +
            '<span class="t-dim">' + esc(LSD.SECTION_LABEL[id] || "") + "</span></div>");
        });
        T.space();
        T.dim("seccion ocultar <id>   ·   seccion mostrar <id>   ·   seccion orden id1 id2 id3");
        return;
      }
      if (sub === "ocultar" || sub === "hide") {
        if (!args[1]) { T.err("Uso: seccion ocultar <id>"); T.chips(all, "seccion ocultar "); return; }
        var id = da(args[1]);
        if (all.indexOf(id) < 0) { T.err("Sección desconocida."); T.chips(all, "seccion ocultar "); return; }
        S.write(function (st) { if (st.layout.hidden.indexOf(id) < 0) st.layout.hidden.push(id); });
        T.ok("Sección oculta: " + id);
        return;
      }
      if (sub === "mostrar" || sub === "show") {
        if (!args[1]) { T.err("Uso: seccion mostrar <id>"); T.chips(all, "seccion mostrar "); return; }
        var id2 = da(args[1]);
        S.write(function (st) { st.layout.hidden = st.layout.hidden.filter(function (x) { return x !== id2; }); });
        T.ok("Sección visible: " + id2);
        return;
      }
      if (sub === "orden" || sub === "order") {
        var order = args.slice(1).map(da).filter(function (x) { return all.indexOf(x) >= 0; });
        if (!order.length) { T.err("Uso: seccion orden " + all.join(" ")); return; }
        all.forEach(function (x) { if (order.indexOf(x) < 0) order.push(x); });
        S.write(function (st) { st.layout.sections = order; });
        T.ok("Nuevo orden: " + order.join(" › "));
        return;
      }
      T.err("Subcomando desconocido.");
      T.chips(["listar", "ocultar", "mostrar", "orden"], "seccion ");
    }
  });

  T.register({
    name: "abrir", alias: ["ir", "goto"],
    desc: "Desplaza la página hasta una sección",
    usage: "abrir <inicio|bloques|trabajos|videos|microciclo>",
    complete: function (prev) { return prev.length ? [] : ["inicio"].concat(Object.keys(LSD.SECTION_LABEL)); },
    run: function (args) {
      var id = da(args[0] || "inicio");
      var el = d.getElementById(id);
      if (!el) { T.err("No existe la sección «" + args[0] + "»."); return; }
      el.scrollIntoView({ behavior: S.config.theme.motion ? "smooth" : "auto", block: "start" });
      T.ok("Vista en: " + id);
    }
  });

  /* =========================================================
     DATOS
     ========================================================= */
  T.register({
    name: "exportar", alias: ["export", "descargar"],
    desc: "Descarga la configuración completa en un archivo JSON",
    usage: "exportar [config|videos]",
    complete: function (prev) { return prev.length ? [] : ["config", "videos"]; },
    run: function (args) {
      if (da(args[0] || "") === "videos") {
        download("lsd-videos.json", JSON.stringify(S.config.media.videos, null, 2));
        T.ok("Descargado lsd-videos.json");
        return;
      }
      download("lsd-config.json", S.export());
      T.ok("Descargado lsd-config.json — guardá este archivo como copia de seguridad.");
    }
  });

  T.register({
    name: "importar", alias: ["import", "cargar"],
    desc: "Carga una configuración desde JSON",
    usage: "importar [json]",
    run: function (args) {
      var raw = args.join(" ");
      var apply = function (txt) {
        var data;
        try { data = JSON.parse(txt); } catch (e) { T.err("JSON no válido: " + e.message); return; }
        if (Array.isArray(data)) { importVideos(txt); return; }
        S.replace(data);
        T.ok("Configuración importada y aplicada.");
      };
      if (raw) { apply(raw); return; }
      openPasteBox("Pegá aquí el JSON de configuración", apply);
    }
  });

  T.register({
    name: "publicar", alias: ["publish", "fijar"],
    desc: "Genera data/config.js para dejar estos ajustes fijos en el sitio",
    run: function () {
      var body = "/* Configuración publicada del sitio.\n" +
        "   Generada desde la terminal el " + new Date().toISOString().slice(0, 16).replace("T", " ") + ".\n" +
        "   Sustituí este archivo en el repositorio para que estos ajustes\n" +
        "   sean los que vean todos los visitantes. */\n" +
        "window.LSD_CONFIG = " + S.export() + ";\n";
      download("config.js", body, "application/javascript;charset=utf-8");
      T.ok("Descargado config.js");
      T.space();
      T.head("CÓMO DEJARLO FIJO");
      T.print("1. Se descargó el archivo config.js con todos tus ajustes actuales.");
      T.print("2. Reemplazá con él el archivo data/config.js del repositorio.");
      T.print("3. Subí el cambio (commit + push). A partir de ahí, cualquiera que entre");
      T.print("   verá el sitio con esta configuración por defecto.");
      T.space();
      T.dim("Sin este paso los cambios sólo viven en este navegador.");
    }
  });

  T.register({
    name: "demo", alias: ["ejemplos"],
    desc: "Carga vídeos de ejemplo para ver los formatos en acción",
    run: function (args, flags) {
      if (S.config.media.videos.length && !flags.forzar && !flags.f) {
        T.warn("Ya hay " + S.config.media.videos.length + " vídeos cargados.");
        T.dim("Para añadir igualmente los ejemplos:  demo --forzar");
        return;
      }
      var samples = [
        ["Rondo 4v2 · circulación de balón", "posesion", "rondo-base", "rondo,técnico,activación"],
        ["Juego de posición 4v4+3", "posesion", "juego-posicion-443", "posesión,estructura"],
        ["SSG 4v4 con cuatro mini-arcos", "ssg", "ssg-3v3", "SSG,orientación"],
        ["SSG 3v3 alta densidad", "ssg", "ssg-1v1", "SSG,duelo"],
        ["Nordic curl · progresión", "fuerza", "prevencion", "prevención,isquiosurales"],
        ["Trineo pesado · aceleración", "fuerza", "fuerza-especifica", "fuerza,campo"],
        ["Salida de balón 6v4 + arqueros", "tactico", "salida-balon", "ofensivo,construcción"],
        ["Presión alta con activación por señal", "tactico", "presion-alta", "defensivo,presión"],
        ["Córner ofensivo · rutina de bloqueo", "abp", "corner-of", "ABP,gol"],
        ["Circuito de finalización con arquero", "finalizacion", "circuitos-finalizacion", "finalización,técnico"]
      ];
      S.write(function (st) {
        samples.forEach(function (s, i) {
          st.media.videos.push({
            id: uniqueId("demo-" + LSD.slug(s[0])),
            title: s[0],
            url: "", provider: "demo", vid: "",
            block: s[1], work: s[2],
            tags: s[3].split(","),
            duration: ["1:20", "2:05", "3:40", "0:55", "1:10", "2:30", "4:15", "3:05", "1:45", "2:50"][i],
            desc: "Vídeo de ejemplo. Reemplazalo con:  video edit " + "demo-" + LSD.slug(s[0]) + " url <tu-enlace>",
            poster: "", featured: i === 0,
            added: new Date().toISOString().slice(0, 10)
          });
        });
      });
      T.ok("10 vídeos de ejemplo cargados.");
      T.dim("Probá ahora:  videos formato mosaico  ·  videos formato cine  ·  videos tamano grande");
      T.dim("Para borrarlos todos:  video vaciar --si");
    }
  });

  T.register({
    name: "clave", alias: ["pass", "password"],
    desc: "Protege la terminal con una clave de acceso",
    usage: "clave <nueva|quitar>",
    run: function (args) {
      if (!args[0]) {
        T.print(S.config.terminal.pass ? "La terminal está protegida con clave." : "La terminal no tiene clave.");
        T.dim("Poner clave:  clave miClave123    ·    Quitar:  clave quitar");
        return;
      }
      if (da(args[0]) === "quitar" || da(args[0]) === "off") {
        S.set("terminal.pass", "");
        T.ok("Clave eliminada.");
        return;
      }
      S.set("terminal.pass", args[0]);
      T.ok("Clave establecida. Se pedirá la próxima vez que se abra la terminal.");
      T.warn("Es una protección visual, no una barrera de seguridad real.");
    }
  });

  /* ---------------------------------------------------------
     Cuadro para pegar JSON
     --------------------------------------------------------- */
  function openPasteBox(title, cb) {
    var ov = d.getElementById("overlay");
    ov.innerHTML =
      '<div class="modal" style="max-width:760px">' +
        '<div class="modal-head"><h3 class="modal-title" style="font-size:1.1rem">' + esc(title) + "</h3>" +
        '<button class="modal-close" aria-label="Cerrar">✕</button></div>' +
        '<div class="modal-body">' +
          '<textarea id="pasteBox" spellcheck="false" style="width:100%;min-height:280px;background:var(--surface);' +
          'border:1px solid var(--border);color:var(--text);font-family:var(--font-mono);font-size:.78rem;padding:1rem;line-height:1.5"></textarea>' +
          '<div style="display:flex;gap:.6rem;margin-top:1rem">' +
            '<button id="pasteOk" class="chip" style="background:var(--accent);color:var(--accent-ink);border-color:var(--accent)">Cargar</button>' +
            '<button id="pasteCancel" class="chip">Cancelar</button>' +
          "</div></div></div>";
    ov.classList.add("is-open");
    d.documentElement.classList.add("is-locked");
    var box = d.getElementById("pasteBox");
    box.focus();
    d.getElementById("pasteCancel").addEventListener("click", LSD.closeOverlay);
    ov.querySelector(".modal-close").addEventListener("click", LSD.closeOverlay);
    d.getElementById("pasteOk").addEventListener("click", function () {
      var txt = box.value.trim();
      LSD.closeOverlay();
      T.open();
      if (txt) cb(txt); else T.warn("No se pegó nada.");
    });
  }
})(window, document);
