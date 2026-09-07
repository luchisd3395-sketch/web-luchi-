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
    bucle: "video.loop", loop: "video.loop",
    previsualizar: "video.hoverPlay", preview: "video.hoverPlay"
  };

  /* ---------------------------------------------------------
     Utilidades
     --------------------------------------------------------- */
  /** Descarga un archivo. Devuelve false si el entorno no lo permite:
     en la vista previa publicada las descargas están bloqueadas, y
     fallar en silencio dejaría al autor esperando un archivo que nunca
     llega. Quien llama debe comprobar el resultado. */
  function download(filename, text, mime) {
    if (w.LSD_PREVIEW) {
      T.err("Acá no se puede descargar: esta es la vista previa publicada.");
      T.dim("El navegador no permite descargas dentro de ella. Para bajar el archivo,");
      T.dim("abrí el sitio desde el repositorio (o desde GitHub Pages) y repetí el comando.");
      T.dim("Lo que sí funciona acá: cambiar el sitio y ver cómo queda.");
      return false;
    }
    try {
      var blob = new Blob([text], { type: mime || "application/json;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = d.createElement("a");
      a.href = url; a.download = filename;
      d.body.appendChild(a); a.click(); d.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      return true;
    } catch (e) {
      T.err("El navegador rechazó la descarga.");
      return false;
    }
  }

  /** Acorta una ruta para mostrarla: una imagen incrustada en base64
     ocupa cientos de miles de caracteres y taparía toda la terminal. */
  function corto(u) {
    var v = String(u || "");
    if (!v) return "";
    var m = v.match(/^data:([^;,]+)/);
    if (m) return "[" + m[1] + " incrustada · " + Math.round(v.length * 0.75 / 1024) + " KB]";
    return v.length > 76 ? v.slice(0, 73) + "…" : v;
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
    { g: "Vídeos",        cmds: ["video", "videos", "lote", "fragmentos", "mover", "renombrar"] },
    { g: "Imágenes",      cmds: ["imagen", "momentos"] },
    { g: "Contenido",     cmds: ["bloques", "trabajos", "buscar", "seccion"] },
    { g: "Datos",         cmds: ["exportar", "importar", "publicar", "archivos", "demo", "clave"] }
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
    name: "archivos", alias: ["files"],
    desc: "Lo subido desde el dispositivo: qué ocupa y liberar lo que ya no se usa",
    usage: "archivos [limpiar]",
    complete: function (prev, partial) {
      return prev.length ? [] : [{ name: "limpiar", desc: "Borra lo que ya no referencia ninguna foto ni vídeo" }];
    },
    run: function (args) {
      var F = w.LSD.files;
      if (!F || !F.disponible()) { T.err("Este navegador no guarda archivos."); return; }

      var sub = (args[0] || "").toLowerCase();
      if (sub && sub !== "limpiar") {
        T.err("Subcomando desconocido: «" + args[0] + "». Sólo hay:  archivos  ·  archivos limpiar");
        return;
      }

      if (sub === "limpiar") {
        F.limpiar(function (n) {
          if (!n) T.ok("No había nada que sobrara.");
          else T.ok(n + (n === 1 ? " archivo borrado" : " archivos borrados") + ": ya no los usaba nadie.");
        });
        return;
      }

      var claves = F.claves();
      T.head("ARCHIVOS EN ESTE NAVEGADOR");
      if (!claves.length) {
        T.dim("Todavía no subiste ninguno desde el dispositivo.");
      } else {
        T.table(claves.map(function (k) {
          var i = F.info(k);
          return [i.nombre, w.LSD.pesoLegible(i.peso), i.fecha];
        }));
        T.space();
        T.print("Total: " + w.LSD.pesoLegible(F.peso()) + " en " + claves.length +
          (claves.length === 1 ? " archivo" : " archivos") + ".");
      }
      F.espacio(function (e) {
        /* El navegador tarda en actualizar su propia cuenta de lo usado, así que
           se muestra sólo el techo: el total de arriba ya sale de los archivos. */
        if (e && e.total) T.dim("Este navegador le da a la página hasta " + w.LSD.pesoLegible(e.total) + ".");
        T.dim("Nada de esto sale de este navegador: para publicarlo hay que pasarlo al repositorio.");
        T.dim("Liberar lo que ya no usa ninguna foto ni vídeo:  archivos limpiar");
      });
    }
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
      if (prev.length === 0) return ["acento", "secundario", "fondo", "fondo2", "superficie", "superficie2", "texto", "suave", "borde"];
      return ["#d8ff3e", "#ff3b30", "#3d7bff", "#35e07a", "#f2c14b", "negro", "blanco", "rojo", "verde", "azul", "amarillo", "lima"];
    },
    run: function (args) {
      var map = {
        acento: "accent", accent: "accent", secundario: "accent2", acento2: "accent2", accent2: "accent2",
        fondo: "bg", bg: "bg", fondo2: "bg2", bg2: "bg2",
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
  simpleSetter("nav", ["menu", "navegacion"], "layout.nav", "Posición del menú de navegación");
  simpleSetter("tarjeta", ["card", "tarjetas"], "layout.card", "Estilo visual de las tarjetas");


  /* =========================================================
     PORTADA
     ========================================================= */
  var HERO_STYLES = LSD.SCHEMA["layout.hero"].values;

  T.register({
    name: "portada", alias: ["hero", "cabecera"],
    desc: "Vídeos y foto de fondo de la portada, y su estilo",
    usage: "portada <video|foto|estilo|quitar> …",
    complete: function (prev) {
      if (prev.length === 0) {
        return [{ name: "video", desc: "vídeos de fondo, en bucle y sin sonido" },
                { name: "foto", desc: "foto de fondo" },
                { name: "foco", desc: "qué franja de la foto se ve" },
                { name: "estilo", desc: "completa · dividida · minima · apagada" },
                { name: "quitar", desc: "sacar la media de la portada" }]
          .concat(HERO_STYLES.concat(Object.keys(VALUE_ALIAS["layout.hero"] || {})).map(function (v) { return { name: v, desc: "estilo de portada" }; }));
      }
      var sub = da(prev[0]);
      if (sub === "estilo") return HERO_STYLES.concat(Object.keys(VALUE_ALIAS["layout.hero"] || {}));
      if (sub === "foco" && prev.length === 1) return ["10", "20", "30", "50", "70"];
      if (sub === "video" && prev.length === 1) return ["add", "list", "rm", "quitar"];
      return [];
    },
    help: function () {
      T.space();
      T.dim("VÍDEO   portada video <url>            pone un vídeo de fondo (reemplaza los que haya)");
      T.dim("        portada video add <url>        añade otro: se van alternando");
      T.dim("        portada video list             lista los vídeos de portada");
      T.dim("        portada video rm <#n>          quita uno");
      T.dim("FOTO    portada foto <url>             foto de fondo (también sirve de poster del vídeo)");
      T.dim("FOCO    portada foco 20                qué franja de la foto se ve (0 arriba · 100 abajo)");
      T.dim("ESTILO  portada completa               completa · dividida · minima · apagada");
      T.dim("QUITAR  portada quitar                 deja la portada sin media");
      T.space();
      T.dim("Los vídeos de portada van siempre en bucle y SIN SONIDO.");
      T.dim("Lo mejor es un archivo .mp4 propio (assets/video/tuyo.mp4 o una URL directa):");
      T.dim("se ve a pantalla completa y sin marcas de ninguna plataforma.");
      T.dim("También acepta YouTube, Vimeo o Drive, pero recorta y depende de la plataforma.");
    },
    run: function (args) {
      var sub = da(args[0] || "");
      var cfg = S.config;

      /* --- sin argumentos: estado --- */
      if (!sub) {
        T.head("PORTADA");
        T.table([
          ["estilo", cfg.layout.hero],
          ["foto", corto(cfg.site.heroImage) || "—"],
          ["foco", cfg.site.heroFocus + "%"],
          ["vídeos", (cfg.media.heroVideos || []).length + " cargados"]
        ]);
        (cfg.media.heroVideos || []).forEach(function (v, i) {
          T.html('<div class="t-line"><span class="t-dim">#' + (i + 1) + "</span> " +
            '<span class="t-ok">' + esc(corto(v.url)) + '</span> <span class="t-dim">· ' +
            esc(LSD.providerLabel(v.provider)) + "</span></div>");
        });
        T.space();
        T.dim("portada video <url>   ·   portada foto <url>   ·   portada completa");
        return;
      }

      /* --- estilo directo: `portada dividida` --- */
      var styleVal = translate("layout.hero", args[0]);
      if (sub === "estilo" || HERO_STYLES.indexOf(styleVal) >= 0) {
        var v = sub === "estilo" ? translate("layout.hero", args[1] || "") : styleVal;
        if (!args[1] && sub === "estilo") {
          T.html('<div class="t-line"><span class="t-key">layout.hero</span> = <span class="t-ok">' + esc(cfg.layout.hero) + "</span></div>");
          T.chips(HERO_STYLES, "portada estilo ");
          return;
        }
        var res = S.set("layout.hero", v);
        if (!res.ok) { T.err(res.err); return; }
        applied("layout.hero");
        return;
      }

      /* --- foto --- */
      if (sub === "foto" || sub === "imagen") {
        if (!args[1]) { T.err("Uso: portada foto <url o ruta>"); return; }
        S.set("site.heroImage", args[1]);
        T.ok("Foto de portada puesta.");
        T.dim("  " + args[1]);
        return;
      }

      /* --- punto de foco --- */
      if (sub === "foco" || sub === "encuadre" || sub === "focus") {
        if (!args[1]) {
          T.html('<div class="t-line"><span class="t-key">site.heroFocus</span> = <span class="t-ok">' +
            esc(String(S.get("site.heroFocus"))) + "%</span></div>");
          T.dim("La portada es apaisada: una foto vertical se recorta y el foco elige qué franja se ve.");
          T.dim("0 = arriba del todo   ·   50 = centro   ·   100 = abajo del todo");
          T.chips(["10", "20", "30", "50", "70"], "portada foco ");
          return;
        }
        var resF = S.set("site.heroFocus", args[1]);
        if (!resF.ok) { T.err(resF.err); return; }
        T.ok("Foco de la portada → " + resF.value + "%");
        T.dim("  Valores bajos muestran la parte de arriba de la foto; altos, la de abajo.");
        return;
      }

      /* --- vídeo --- */
      if (sub === "video" || sub === "videos" || sub === "clip") {
        var sub2 = da(args[1] || "");
        var vids = cfg.media.heroVideos || [];

        if (sub2 === "list" || sub2 === "listar" || sub2 === "ls") {
          if (!vids.length) { T.warn("No hay vídeos de portada."); T.dim("Ponés el primero con:  portada video <url>"); return; }
          T.head("VÍDEOS DE PORTADA (" + vids.length + ")");
          vids.forEach(function (v, i) {
            T.html('<div class="t-line"><span class="t-dim">#' + (i + 1) + "</span> " +
              '<span class="t-ok">' + esc(corto(v.url)) + '</span><div class="t-dim" style="padding-left:2.2rem">' +
              esc(LSD.providerLabel(v.provider)) +
              (v.provider === "file" ? "  ·  se alterna al terminar" : "  ·  se alterna cada 24 s") + "</div></div>");
          });
          return;
        }

        if (sub2 === "rm" || sub2 === "borrar" || sub2 === "quitar" || sub2 === "eliminar") {
          if (!args[2]) {
            S.write(function (st) { st.media.heroVideos = []; });
            T.ok("Vídeos de portada quitados.");
            return;
          }
          var n = parseInt(String(args[2]).replace("#", ""), 10) - 1;
          if (isNaN(n) || !vids[n]) { T.err("No existe el vídeo #" + args[2] + ". Listá con:  portada video list"); return; }
          S.write(function (st) { st.media.heroVideos.splice(n, 1); });
          T.ok("Vídeo de portada #" + (n + 1) + " quitado.");
          return;
        }

        var isAdd = (sub2 === "add" || sub2 === "anadir" || sub2 === "agregar" || sub2 === "sumar");
        var url = isAdd ? args[2] : args[1];
        if (!url) {
          T.err("Uso: portada video <url>     (o  portada video add <url>  para sumar otro)");
          T.dim("Ejemplo con un archivo propio:  portada video assets/video/entrenamiento.mp4");
          return;
        }
        var parsed = LSD.parseMedia(url);
        if (!parsed) { T.err("No se pudo interpretar la URL."); return; }
        S.write(function (st) {
          if (!Array.isArray(st.media.heroVideos)) st.media.heroVideos = [];
          if (!isAdd) st.media.heroVideos = [];
          st.media.heroVideos.push({ url: parsed.url, provider: parsed.provider, vid: parsed.vid });
        });
        if (LSD.renderHeroMedia) LSD.renderHeroMedia(true);
        var total = S.config.media.heroVideos.length;
        T.ok((isAdd ? "Vídeo añadido a la portada" : "Vídeo de portada puesto") + "  ·  " + LSD.providerLabel(parsed.provider));
        if (parsed.provider !== "file") {
          T.warn("Con " + LSD.providerLabel(parsed.provider) + " el vídeo se recorta y depende de la plataforma.");
          T.dim("Para que se vea impecable, subí el .mp4 al repositorio y usá su ruta.");
        }
        if (total > 1) T.dim("  Hay " + total + " vídeos: se van alternando solos.");
        return;
      }

      if (sub === "quitar" || sub === "limpiar" || sub === "sin") {
        S.write(function (st) { st.media.heroVideos = []; });
        S.set("site.heroImage", "");
        T.ok("Portada sin foto ni vídeo.");
        return;
      }

      T.err("Subcomando desconocido: «" + args[0] + "»");
      T.chips(["video", "foto", "foco", "estilo", "quitar", "completa", "dividida", "minima"], "portada ");
    }
  });

  /* =========================================================
     VÍDEOS — configuración de visualización
     ========================================================= */
  T.register({
    name: "videos", alias: ["vista", "galeria"],
    desc: "Configura cómo se ven los vídeos en la página",
    usage: "videos <propiedad> <valor>",
    complete: function (prev, partial) {
      if (prev.length === 0) {
        return ["formato", "columnas", "proporcion", "tamano", "alineacion", "separacion", "efecto", "reproductor", "titulo", "meta", "etiquetas", "descripcion", "autoplay", "silencio", "bucle", "previsualizar"];
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
    destacado: "featured", featured: "featured",
    desde: "start", inicio: "start", start: "start",
    hasta: "end", fin: "end", end: "end"
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
      T.dim('                                  [--desde 2:05] [--hasta 2:25]   (para un fragmento)');
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
              (v.start != null ? "  ·  " + esc(LSD.formatTime(v.start)) +
                 (v.end != null ? " → " + esc(LSD.formatTime(v.end)) : "") : "") +
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
        var desde = LSD.parseTime(flags.desde || flags.start || flags.inicio || "");
        var hasta = LSD.parseTime(flags.hasta || flags.end || flags.fin || "");
        if (hasta != null && desde == null) desde = 0;
        if (desde != null && hasta != null && hasta <= desde) {
          T.err("El tiempo de fin debe ser posterior al de inicio.");
          return;
        }
        if (desde == null && parsed.start != null) desde = parsed.start;
        var rec = {
          id: uniqueId(LSD.slug(title)),
          title: title,
          url: parsed.url,
          provider: parsed.provider,
          vid: parsed.vid,
          block: blockId,
          work: workId,
          tags: tags,
          start: desde, end: hasta,
          duration: LSD.normDuration(flags.dur || flags.duracion || "") ||
                    ((desde != null && hasta != null) ? LSD.formatTime(hasta - desde) : ""),
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
        if (field === "start" || field === "end") {
          var seg = LSD.parseTime(val);
          if (seg == null) { T.err("Tiempo no válido. Usá 2:05, 125 o 1:02:05."); return; }
          var otro = field === "start" ? r2.v.end : r2.v.start;
          if (otro != null) {
            var ini = field === "start" ? seg : otro;
            var fin = field === "start" ? otro : seg;
            if (fin <= ini) { T.err("El fin debe ser posterior al inicio."); return; }
          }
          S.write(function (st) {
            st.media.videos[r2.i][field] = seg;
            var v2 = st.media.videos[r2.i];
            if (v2.start != null && v2.end != null) v2.duration = LSD.formatTime(v2.end - v2.start);
          });
          T.ok(r2.v.id + " · " + (field === "start" ? "desde" : "hasta") + " → " + LSD.formatTime(seg));
          return;
        }
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
        if (!download("lsd-videos.json", json)) return;
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
          start: LSD.parseTime(v.start), end: LSD.parseTime(v.end),
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
     IMÁGENES
     ========================================================= */
  T.register({
    name: "imagen", alias: ["img", "foto", "imagenes"],
    desc: "Pone la foto de la portada y la de cada bloque",
    usage: "imagen <portada|bloque|listar|quitar|trato> …",
    complete: function (prev) {
      if (prev.length === 0) return [
        { name: "portada", desc: "foto de fondo de la portada" },
        { name: "bloque", desc: "foto de un bloque" },
        { name: "listar", desc: "ver las fotos puestas" },
        { name: "quitar", desc: "sacar una foto" },
        { name: "trato", desc: "blanco y negro, color o duotono" }
      ];
      var sub = da(prev[0]);
      if ((sub === "bloque" || sub === "quitar") && prev.length === 1) {
        return sub === "quitar" ? ["portada"].concat(blockIds()) : blockIds();
      }
      if (sub === "trato" && prev.length === 1) return ["bn", "color", "duotono"];
      return [];
    },
    help: function () {
      T.space();
      T.dim("PORTADA   imagen portada https://…/foto.jpg      ·   imagen portada assets/img/portada.jpg");
      T.dim("BLOQUE    imagen bloque ssg https://…/foto.jpg");
      T.dim("QUITAR    imagen quitar portada    ·   imagen quitar ssg");
      T.dim("TRATO     imagen trato bn|color|duotono          (cómo se ven todas las fotos de bloque)");
      T.space();
      T.dim("Podés usar un enlace de internet o una ruta del propio repositorio.");
      T.dim("Para fotos propias: guardalas en assets/img/ y referencialas como assets/img/nombre.jpg");
    },
    run: function (args) {
      var sub = da(args[0] || "listar");
      var imgs = S.config.media.images || {};

      if (sub === "listar" || sub === "list" || sub === "ls") {
        T.head("FOTOGRAFÍAS");
        T.html('<div class="t-line"><span class="t-key">portada</span> <span class="' +
          (S.get("site.heroImage") ? "t-ok" : "t-dim") + '">' +
          esc(corto(S.get("site.heroImage")) || "— sin foto —") + "</span></div>");
        M.blocks.forEach(function (b) {
          T.html('<div class="t-line"><span class="t-key">' + esc(b.id) + '</span> <span class="' +
            (imgs[b.id] ? "t-ok" : "t-dim") + '">' + esc(corto(imgs[b.id]) || "— sin foto —") + "</span></div>");
        });
        T.space();
        T.dim("Tratamiento actual: " + S.get("layout.blockImg") + "   ·   imagen bloque <id> <url>");
        return;
      }

      if (sub === "portada" || sub === "hero") {
        if (!args[1]) { T.err("Uso: imagen portada <url o ruta>"); return; }
        S.set("site.heroImage", args[1]);
        T.ok("Foto de portada puesta.");
        T.dim("  " + args[1]);
        return;
      }

      if (sub === "bloque" || sub === "block") {
        if (args.length < 3) {
          T.err("Uso: imagen bloque <id> <url o ruta>");
          T.dim("Bloques disponibles:");
          T.chips(blockIds(), "imagen bloque ");
          return;
        }
        var b = findBlock(args[1]);
        if (!b) { T.err("Bloque no encontrado: «" + args[1] + "»"); T.chips(blockIds(), "imagen bloque "); return; }
        var url = args.slice(2).join(" ");
        S.write(function (st) {
          if (!st.media.images) st.media.images = {};
          st.media.images[b.id] = url;
        });
        T.ok("Foto puesta en " + b.code + " · " + b.title);
        T.dim("  " + url);
        return;
      }

      if (sub === "quitar" || sub === "rm" || sub === "borrar") {
        if (!args[1]) { T.err("Uso: imagen quitar <portada|bloque>"); T.chips(["portada"].concat(blockIds()), "imagen quitar "); return; }
        if (da(args[1]) === "portada" || da(args[1]) === "hero") {
          S.set("site.heroImage", "");
          T.ok("Foto de portada quitada.");
          return;
        }
        if (da(args[1]) === "todas" || da(args[1]) === "todo") {
          S.write(function (st) { st.media.images = {}; });
          S.set("site.heroImage", "");
          T.ok("Todas las fotos quitadas.");
          return;
        }
        var b2 = findBlock(args[1]);
        if (!b2) { T.err("Bloque no encontrado."); T.chips(blockIds(), "imagen quitar "); return; }
        S.write(function (st) { delete st.media.images[b2.id]; });
        T.ok("Foto quitada de " + b2.title);
        return;
      }

      if (sub === "trato" || sub === "tratamiento" || sub === "estilo") {
        if (!args[1]) {
          T.html('<div class="t-line"><span class="t-key">layout.blockImg</span> = <span class="t-ok">' +
            esc(S.get("layout.blockImg")) + "</span></div>");
          T.chips(["bn", "color", "duotono"], "imagen trato ");
          return;
        }
        var map = { bn: "bn", byn: "bn", blanconegro: "bn", gris: "bn", color: "color", duotono: "duotono", duo: "duotono" };
        var v = map[da(args[1])];
        if (!v) { T.err("Opciones: bn · color · duotono"); return; }
        S.set("layout.blockImg", v);
        applied("layout.blockImg");
        return;
      }

      T.err("Subcomando desconocido: «" + args[0] + "»");
      T.chips(["portada", "bloque", "listar", "quitar", "trato"], "imagen ");
    }
  });





  /* =========================================================
     MOMENTOS EN EL CLUB
     ========================================================= */
  var MOM_PROP = {
    formato: "gallery.layout", disposicion: "gallery.layout", layout: "gallery.layout",
    intervalo: "gallery.interval", segundos: "gallery.interval", tiempo: "gallery.interval",
    proporcion: "gallery.ratio", ratio: "gallery.ratio",
    tamano: "gallery.size", size: "gallery.size",
    /* «pie» no va acá: es el subcomando para escribir el pie de una foto */
    pies: "gallery.captions", textos: "gallery.captions",
    automatico: "gallery.autoplay", autoplay: "gallery.autoplay", pasar: "gallery.autoplay"
  };
  var MOM_ALIAS = {
    "gallery.layout": { pase: "pase", pasar: "pase", carrusel: "pase", mosaico: "mosaico", cuadricula: "mosaico", tira: "tira", fila: "tira" },
    "gallery.ratio":  { cuadrado: "1:1", vertical: "9:16", horizontal: "16:9", clasico: "4:3", foto: "3:2" },
    "gallery.size":   { chico: "sm", pequeno: "sm", mediano: "md", medio: "md", grande: "lg", enorme: "xl" }
  };

  T.register({
    name: "momentos", alias: ["galeria", "fotos", "club"],
    desc: "Fotografías de la sección «Momentos en el club»",
    usage: "momentos <add|list|rm|orden|pie|vaciar|formato…>",
    complete: function (prev) {
      if (prev.length === 0) {
        return [
          { name: "add", desc: "añadir una foto" },
          { name: "list", desc: "ver las fotos cargadas" },
          { name: "rm", desc: "quitar una" },
          { name: "orden", desc: "reordenar" },
          { name: "pie", desc: "poner o cambiar el pie de foto" },
          { name: "lote", desc: "añadir varias pegando una lista" },
          { name: "vaciar", desc: "quitar todas" }
        ].concat(Object.keys(MOM_PROP).map(function (k) { return { name: k, desc: LSD.SCHEMA[MOM_PROP[k]].desc }; }));
      }
      var path = MOM_PROP[da(prev[0])];
      if (path) {
        var sc = LSD.SCHEMA[path];
        if (sc.type === "enum") return sc.values.concat(Object.keys(MOM_ALIAS[path] || {}));
        if (sc.type === "bool") return ["on", "off"];
      }
      return [];
    },
    help: function () {
      T.space();
      T.dim("AÑADIR   momentos add assets/img/foto.jpg");
      T.dim('         momentos add assets/img/foto.jpg --pie "Ascenso 2024"');
      T.dim("VARIAS   momentos lote          abre un cuadro para pegar una lista");
      T.dim("VER      momentos list");
      T.dim("QUITAR   momentos rm 3          ·   momentos vaciar --si");
      T.dim("ORDENAR  momentos orden 5 1     (mueve la 5 a la posición 1)");
      T.dim('PIE      momentos pie 2 "Entrada en calor en Colón"');
      T.space();
      T.dim("ASPECTO  momentos formato pase|mosaico|tira");
      T.dim("         momentos intervalo 6        segundos que dura cada foto");
      T.dim("         momentos proporcion 3:2     ·   momentos tamano grande");
      T.dim("         momentos pies off           ·   momentos automatico off");
    },
    run: function (args, flags) {
      var sub = da(args[0] || "list");
      var rest = args.slice(1);
      var fotos = S.config.media.gallery || [];

      /* ---- ajustes de aspecto ---- */
      var path = MOM_PROP[sub];
      if (path) {
        if (!rest.length) {
          var sc = LSD.SCHEMA[path];
          T.html('<div class="t-line"><span class="t-key">' + esc(path) + '</span> = <span class="t-ok">' + esc(String(S.get(path))) + "</span></div>");
          if (sc.type === "enum") T.chips(sc.values, "momentos " + args[0] + " ");
          if (sc.type === "bool") T.chips(["on", "off"], "momentos " + args[0] + " ");
          return;
        }
        var bruto = rest.join(" ");
        var mapa = MOM_ALIAS[path];
        if (mapa && mapa[da(bruto)]) bruto = mapa[da(bruto)];
        var res = S.set(path, bruto);
        if (!res.ok) { T.err(res.err); return; }
        applied(path);
        return;
      }

      /* ---- listar ---- */
      if (sub === "list" || sub === "listar" || sub === "ls") {
        if (!fotos.length) {
          T.warn("No hay fotos en «Momentos en el club».");
          T.dim("Añadí la primera:  momentos add assets/img/foto.jpg");
          return;
        }
        T.head("MOMENTOS EN EL CLUB (" + fotos.length + ")");
        fotos.forEach(function (f, i) {
          T.html('<div class="t-line"><span class="t-dim">#' + (i + 1) + "</span>  " +
            '<span class="t-ok">' + esc(corto(f.src)) + "</span>" +
            (f.pie ? '<div class="t-dim" style="padding-left:2.2rem">' + esc(f.pie) + "</div>" : ""));
        });
        T.space();
        T.dim("Pasan solas cada " + S.get("gallery.interval") + " s  ·  formato " + S.get("gallery.layout"));
        return;
      }

      /* ---- añadir ---- */
      if (sub === "add" || sub === "anadir" || sub === "agregar" || sub === "sumar") {
        if (!rest[0]) { T.err('Uso: momentos add <ruta o url> [--pie "texto"]'); return; }
        var ruta = rest[0];
        var pie = flags.pie || flags.texto || flags.caption || "";
        if (fotos.some(function (f) { return f.src === ruta; })) {
          T.warn("Esa foto ya está en la sección.");
          return;
        }
        S.write(function (st) {
          if (!Array.isArray(st.media.gallery)) st.media.gallery = [];
          st.media.gallery.push({ src: ruta, pie: pie === true ? "" : String(pie) });
        });
        T.ok("Foto añadida (#" + S.config.media.gallery.length + ").");
        T.dim("  " + ruta + (pie && pie !== true ? "   —   " + pie : ""));
        return;
      }

      /* ---- lote ---- */
      if (sub === "lote" || sub === "varias" || sub === "pegar") {
        openPasteBox("Fotos para «Momentos en el club» — una por línea",
          function (txt) { momentosLote(txt); },
          "assets/img/foto-1.jpg | Ascenso 2024\nassets/img/foto-2.jpg | Entrada en calor en Colón\nassets/img/foto-3.jpg");
        return;
      }

      /* ---- quitar ---- */
      if (sub === "rm" || sub === "quitar" || sub === "borrar" || sub === "eliminar") {
        if (!rest[0]) { T.err("Uso: momentos rm <nº>"); return; }
        var n = parseInt(String(rest[0]).replace("#", ""), 10) - 1;
        if (isNaN(n) || !fotos[n]) { T.err("No existe la foto #" + rest[0] + ". Listá con:  momentos list"); return; }
        var quitada = fotos[n].src;
        S.write(function (st) { st.media.gallery.splice(n, 1); });
        T.ok("Quitada: " + quitada);
        return;
      }

      if (sub === "vaciar" || sub === "limpiar") {
        if (!fotos.length) { T.warn("Ya está vacía."); return; }
        if (!flags.si && !flags.confirmar && !flags.f) {
          T.warn("Esto quita las " + fotos.length + " fotos de la sección.");
          T.dim("Confirmá con:  momentos vaciar --si");
          return;
        }
        var total = fotos.length;
        S.write(function (st) { st.media.gallery = []; });
        T.ok("Sección vaciada (" + total + " fotos).");
        return;
      }

      /* ---- reordenar ---- */
      if (sub === "orden" || sub === "order" || sub === "mover") {
        if (rest.length < 2) { T.err("Uso: momentos orden <nº> <posición>"); return; }
        var de = parseInt(String(rest[0]).replace("#", ""), 10) - 1;
        var a = parseInt(String(rest[1]).replace("#", ""), 10) - 1;
        if (isNaN(de) || !fotos[de]) { T.err("No existe la foto #" + rest[0] + "."); return; }
        if (isNaN(a)) { T.err("La posición debe ser un número."); return; }
        S.write(function (st) {
          var arr = st.media.gallery;
          a = Math.max(0, Math.min(arr.length - 1, a));
          arr.splice(a, 0, arr.splice(de, 1)[0]);
        });
        T.ok("Foto movida a la posición " + (a + 1) + ".");
        return;
      }

      /* ---- pie de foto ---- */
      if (sub === "pie" || sub === "texto" || sub === "caption") {
        if (rest.length < 1) { T.err('Uso: momentos pie <nº> "texto"    (sin texto lo borra)'); return; }
        var k = parseInt(String(rest[0]).replace("#", ""), 10) - 1;
        if (isNaN(k) || !fotos[k]) { T.err("No existe la foto #" + rest[0] + "."); return; }
        var texto = rest.slice(1).join(" ");
        S.write(function (st) { st.media.gallery[k].pie = texto; });
        T.ok(texto ? "#" + (k + 1) + " → «" + texto + "»" : "Pie de foto borrado en #" + (k + 1) + ".");
        return;
      }

      T.err("Subcomando desconocido: «" + args[0] + "»");
      T.chips(["add", "list", "rm", "orden", "pie", "lote", "vaciar", "formato", "intervalo"], "momentos ");
    }
  });

  function momentosLote(texto) {
    var lineas = String(texto).split(/\r?\n/);
    var altas = [], n = 0;
    var yaEstan = (S.config.media.gallery || []).map(function (f) { return f.src; });
    lineas.forEach(function (linea) {
      var cruda = linea.trim();
      if (!cruda || cruda.charAt(0) === "#") return;
      n++;
      var partes = cruda.split(/\s*[|;\t]\s*/);
      var src = partes[0].trim();
      if (!src) return;
      if (yaEstan.indexOf(src) >= 0 || altas.some(function (a) { return a.src === src; })) return;
      altas.push({ src: src, pie: (partes[1] || "").trim() });
    });
    if (!n) { T.warn("No había ninguna línea con contenido."); return; }
    if (!altas.length) { T.warn("Ninguna foto nueva: ya estaban todas cargadas."); return; }
    S.write(function (st) {
      if (!Array.isArray(st.media.gallery)) st.media.gallery = [];
      altas.forEach(function (f) { st.media.gallery.push(f); });
    });
    T.ok(altas.length + (altas.length === 1 ? " foto añadida." : " fotos añadidas."));
    if (n > altas.length) T.dim("  (" + (n - altas.length) + " ya estaban y se saltaron)");
    T.space();
    T.dim("Para publicarlo en el sitio:  publicar");
  }

  /* =========================================================
     MOVER Y RENOMBRAR
     ========================================================= */

  /** Resuelve "1", "#3", "2-6", "todos" o un id a una lista de índices. */
  function resolverIndices(tokens) {
    var vids = S.config.media.videos;
    var out = [], errores = [];
    tokens.forEach(function (tk) {
      var t = String(tk).trim().replace(/^#/, "");
      if (!t) return;
      if (da(t) === "todos" || da(t) === "todo" || t === "*") {
        vids.forEach(function (_, i) { out.push(i); });
        return;
      }
      var rango = t.match(/^(\d+)\s*[-–]\s*(\d+)$/);
      if (rango) {
        var a = parseInt(rango[1], 10), b = parseInt(rango[2], 10);
        if (a > b) { var tmp = a; a = b; b = tmp; }
        for (var k = a; k <= b; k++) {
          if (vids[k - 1]) out.push(k - 1); else errores.push("#" + k);
        }
        return;
      }
      if (/^\d+$/.test(t)) {
        var n = parseInt(t, 10) - 1;
        if (vids[n]) out.push(n); else errores.push("#" + t);
        return;
      }
      var idx = -1;
      for (var j = 0; j < vids.length; j++) if (vids[j].id === t) { idx = j; break; }
      if (idx >= 0) out.push(idx); else errores.push(t);
    });
    // sin repetidos, en orden
    out = out.filter(function (v, i) { return out.indexOf(v) === i; }).sort(function (x, y) { return x - y; });
    return { indices: out, errores: errores };
  }

  /** Un destino puede ser un bloque o una unidad de trabajo. */
  function resolverDestino(txt) {
    var w = findWork(txt);
    if (w) return { block: w.block, work: w.item, label: w.block.code + " · " + w.block.short + " › " + w.item.name };
    var b = findBlock(txt);
    if (b) return { block: b, work: null, label: b.code + " · " + b.title };
    return null;
  }

  T.register({
    name: "mover", alias: ["move", "reubicar"],
    desc: "Mueve vídeos a otro bloque o unidad de trabajo",
    usage: "mover <nº|id|rango|todos> <bloque o unidad>",
    complete: function (prev) {
      if (prev.length === 0) {
        return S.config.media.videos.map(function (v, i) {
          return { name: String(i + 1), desc: v.title };
        }).concat([{ name: "todos", desc: "todos los vídeos" }]);
      }
      return blockIds().concat(workIds());
    },
    help: function () {
      T.space();
      T.dim("UNO        mover 3 ssg              ·  mover rondo-4v2 posesion");
      T.dim("VARIOS     mover 1 2 5 ssg          ·  mover 2-7 fuerza");
      T.dim("TODOS      mover todos ssg");
      T.dim("POR BLOQUE mover --de posesion --a ssg");
      T.space();
      T.dim("El destino puede ser un bloque (ssg) o una unidad (ssg-3v3).");
      T.dim("Si es una unidad, el bloque se ajusta solo al que corresponde.");
      T.dim("Listá los vídeos con su número:  video list");
    },
    run: function (args, flags) {
      var vids = S.config.media.videos;
      if (!vids.length) { T.warn("No hay vídeos cargados todavía."); return; }

      // --- mover un bloque entero ---
      if (flags.de || flags.desde_bloque) {
        var origen = findBlock(String(flags.de || flags.desde_bloque));
        if (!origen) { T.err("Bloque de origen no encontrado."); T.chips(blockIds()); return; }
        if (!flags.a && !flags.hacia) { T.err("Falta el destino:  mover --de " + origen.id + " --a <bloque>"); return; }
        var dest0 = resolverDestino(String(flags.a || flags.hacia));
        if (!dest0) { T.err("Destino no encontrado."); T.chips(blockIds()); return; }
        var mov = 0;
        S.write(function (st) {
          st.media.videos.forEach(function (v) {
            if (v.block !== origen.id) return;
            v.block = dest0.block.id;
            v.work = dest0.work ? dest0.work.id : null;
            mov++;
          });
        });
        if (!mov) { T.warn("No había vídeos en «" + origen.id + "»."); return; }
        T.ok(mov + " vídeos movidos de " + origen.code + " · " + origen.short + "  →  " + dest0.label);
        return;
      }

      if (args.length < 2) {
        T.err("Uso: mover <nº|id|rango|todos> <bloque o unidad>");
        T.dim("Por ejemplo:  mover 3 ssg   ·   mover 1 2 5 fuerza   ·   mover 2-7 posesion");
        T.dim("Destinos posibles:");
        T.chips(blockIds(), "mover ");
        return;
      }

      var destinoTxt = args[args.length - 1];
      var destino = resolverDestino(destinoTxt);
      if (!destino) {
        T.err("No existe el bloque ni la unidad «" + destinoTxt + "».");
        T.dim("Bloques:");
        T.chips(blockIds());
        return;
      }

      var r = resolverIndices(args.slice(0, -1));
      if (r.errores.length) {
        T.err("No encontré: " + r.errores.join(", "));
        T.dim("Listá los vídeos con su número:  video list");
        if (!r.indices.length) return;
      }
      if (!r.indices.length) { T.err("No indicaste ningún vídeo válido."); return; }

      var movidos = [];
      S.write(function (st) {
        r.indices.forEach(function (i) {
          var v = st.media.videos[i];
          movidos.push({ n: i + 1, title: v.title, antes: v.block });
          v.block = destino.block.id;
          v.work = destino.work ? destino.work.id : null;
        });
      });

      T.ok(movidos.length + (movidos.length === 1 ? " vídeo movido a " : " vídeos movidos a ") + destino.label);
      movidos.forEach(function (m) {
        var ba = LSD.blockById(m.antes);
        T.html('<div class="t-line"><span class="t-dim">#' + m.n + "</span>  " +
          '<span class="t-ok">' + esc(m.title) + "</span>" +
          '<span class="t-dim">  ' + esc(ba ? ba.short : m.antes) + " → " + esc(destino.block.short) + "</span></div>");
      });
    }
  });

  T.register({
    name: "renombrar", alias: ["rename", "nombrar", "titulos"],
    desc: "Cambia el nombre de un vídeo, o de todos de una sentada",
    usage: "renombrar [nº|id] [nombre nuevo]",
    complete: function (prev) {
      if (prev.length === 0) {
        return S.config.media.videos.map(function (v, i) { return { name: String(i + 1), desc: v.title }; })
          .concat(blockIds().map(function (b) { return { name: b, desc: "renombrar los de este bloque" }; }));
      }
      return [];
    },
    help: function () {
      T.space();
      T.dim("UNO     renombrar 3 \"Rondo 5v2 con salida\"");
      T.dim("TODOS   renombrar            abre la lista completa para editar");
      T.dim("BLOQUE  renombrar ssg        abre sólo los de ese bloque");
      T.space();
      T.dim("En el cuadro, cada línea es:   número | nombre");
      T.dim("Cambiá lo que está a la derecha de la barra y dale a Cargar.");
      T.dim("Las líneas que no toques quedan igual.");
    },
    run: function (args) {
      var vids = S.config.media.videos;
      if (!vids.length) { T.warn("No hay vídeos cargados todavía."); return; }

      // Renombrado directo de uno
      if (args.length >= 2) {
        var r1 = videoRef(args[0]);
        if (!r1) { T.err("No encontré el vídeo «" + args[0] + "». Listá con:  video list"); return; }
        var nuevo = args.slice(1).join(" ");
        S.write(function (st) { st.media.videos[r1.i].title = nuevo; });
        T.ok("#" + (r1.i + 1) + "  «" + r1.v.title + "»  →  «" + nuevo + "»");
        return;
      }

      // Lista completa o de un bloque
      var filtro = null;
      if (args[0]) {
        filtro = findBlock(args[0]);
        if (!filtro) { T.err("Bloque no encontrado: «" + args[0] + "»"); T.chips(blockIds(), "renombrar "); return; }
      }
      var lista = [];
      vids.forEach(function (v, i) {
        if (filtro && v.block !== filtro.id) return;
        lista.push({ n: i + 1, v: v });
      });
      if (!lista.length) { T.warn("No hay vídeos en «" + filtro.id + "»."); return; }

      var valor = lista.map(function (x) {
        return x.n + " | " + x.v.title +
          (x.v.start != null ? "        (" + LSD.formatTime(x.v.start) +
            (x.v.end != null ? "–" + LSD.formatTime(x.v.end) : "") + ")" : "");
      }).join("\n");

      openPasteBox(
        "Nombres — cambiá el texto a la derecha de la barra",
        function (txt) { aplicarNombres(txt); },
        null,
        valor
      );
    }
  });

  function aplicarNombres(texto) {
    var lineas = String(texto).split(/\r?\n/);
    var cambios = [], fallos = [];

    lineas.forEach(function (linea, i) {
      var cruda = linea.trim();
      if (!cruda || cruda.charAt(0) === "#") return;
      var m = cruda.match(/^(\d+)\s*[|;\t]\s*(.+)$/);
      if (!m) { fallos.push([i + 1, cruda, "se esperaba:  número | nombre"]); return; }
      var n = parseInt(m[1], 10) - 1;
      // El tiempo entre paréntesis al final es informativo: se descarta
      var nombre = m[2].replace(/\s{2,}\([\d:–\-]+\)\s*$/, "").trim();
      if (!S.config.media.videos[n]) { fallos.push([i + 1, cruda, "no existe el vídeo #" + m[1]]); return; }
      if (!nombre) { fallos.push([i + 1, cruda, "el nombre no puede quedar vacío"]); return; }
      if (S.config.media.videos[n].title !== nombre) cambios.push({ i: n, antes: S.config.media.videos[n].title, nuevo: nombre });
    });

    if (fallos.length) {
      T.err(fallos.length + " líneas tienen un problema. No se cambió nada.");
      fallos.forEach(function (f) {
        T.html('<div class="t-line"><span class="t-err">línea ' + f[0] + "</span> " +
          '<span class="t-dim">' + esc(f[1].slice(0, 60)) + "</span>" +
          '<div style="padding-left:1.2rem" class="t-warn">' + esc(f[2]) + "</div></div>");
      });
      return;
    }
    if (!cambios.length) { T.warn("No cambiaste ningún nombre."); return; }

    S.write(function (st) {
      cambios.forEach(function (c) { st.media.videos[c.i].title = c.nuevo; });
    });
    T.ok(cambios.length + (cambios.length === 1 ? " nombre cambiado." : " nombres cambiados."));
    cambios.forEach(function (c) {
      T.html('<div class="t-line"><span class="t-dim">#' + (c.i + 1) + "</span>  " +
        '<span class="t-dim">' + esc(c.antes) + '</span>  <span class="t-key">→</span>  ' +
        '<span class="t-ok">' + esc(c.nuevo) + "</span></div>");
    });
    T.space();
    T.dim("Para publicarlo en el sitio:  publicar");
  }

  /* =========================================================
     FRAGMENTOS DE UN MISMO VÍDEO
     ========================================================= */
  T.register({
    name: "fragmentos", alias: ["cortes", "partes", "tramos"],
    desc: "Da de alta varios tramos de un mismo vídeo como piezas separadas",
    usage: "fragmentos <url> --bloque <id>",
    complete: function (prev) { return prev.length ? [] : []; },
    help: function () {
      T.space();
      T.dim("Sirve para una grabación larga con varias actividades dentro.");
      T.dim("No hace falta cortar el vídeo ni volver a subirlo: cada tramo");
      T.dim("queda como una pieza propia que reproduce sólo su fragmento.");
      T.space();
      T.dim("   fragmentos https://youtu.be/xxxx --bloque ssg");
      T.space();
      T.dim("Se abre un cuadro para pegar la lista, una línea por actividad:");
      T.space();
      T.dim("   Nombre de la actividad | 2:05 | 2:25");
      T.dim("   Rondo 5v2 | 3:10 | 3:30 | rondo-base | rondo,activación");
      T.space();
      T.dim("Los tiempos admiten 2:05, 125 o 1:02:05.");
      T.dim("Si sólo ponés el de inicio, se usan 20 segundos por defecto.");
      T.space();
      T.dim("También podés pegar sólo los tiempos, sin nombre:");
      T.space();
      T.dim("   0:12 | 0:32");
      T.dim("   1:05 | 1:25");
      T.space();
      T.dim("Se numeran solas como Actividad 1, 2, 3… y las renombrás");
      T.dim("después de una sentada con el comando  renombrar.");
    },
    run: function (args, flags) {
      var url = args[0];
      if (!url) {
        T.err("Uso: fragmentos <url del vídeo> --bloque <id>");
        T.dim("Bloques disponibles:");
        T.chips(blockIds());
        return;
      }
      var parsed = LSD.parseMedia(url);
      if (!parsed || !parsed.url) { T.err("No se pudo interpretar la URL."); return; }

      var bloque = null, unidadBase = null;
      if (flags.trabajo || flags.unidad || flags.work) {
        var w0 = findWork(String(flags.trabajo || flags.unidad || flags.work));
        if (!w0) { T.err("Unidad de trabajo no encontrada."); return; }
        unidadBase = w0.item.id; bloque = w0.block;
      }
      if (flags.bloque || flags.block) {
        var b0 = findBlock(String(flags.bloque || flags.block));
        if (!b0) { T.err("Bloque no encontrado."); T.chips(blockIds()); return; }
        bloque = b0;
      }
      if (!bloque) {
        T.err("Falta indicar el bloque. Añadí  --bloque <id>  al comando.");
        T.chips(blockIds());
        return;
      }

      var pordefecto = LSD.parseTime(flags.duracion || flags.dur || "") || 20;

      openPasteBox(
        "Actividades de este vídeo — una por línea",
        function (txt) { procesarFragmentos(txt, parsed, bloque, unidadBase, pordefecto, flags); },
        "Entrada en calor con balón | 0:12 | 0:32\n" +
        "Rondo 5v2 | 1:05 | 1:25\n" +
        "SSG 4v4 con comodines | 2:40 | 3:00 | ssg-comodines | SSG,superioridad"
      );
    }
  });

  function procesarFragmentos(texto, parsed, bloque, unidadBase, pordefecto, flags) {
    var lineas = String(texto).split(/\r?\n/);
    var altas = [], fallos = [], n = 0;

    lineas.forEach(function (linea, i) {
      var cruda = linea.trim();
      if (!cruda || cruda.charAt(0) === "#") return;
      n++;
      var partes = cruda.split(/\s*[|;\t]\s*/).filter(function (x) { return x !== ""; });

      // Una línea puede venir sin nombre, sólo con los tiempos: se
      // numera sola y se renombra después con `renombrar`.
      var sinNombre = LSD.parseTime(partes[0]) != null && !/^\d{1,2}$/.test(partes[0]);
      if (sinNombre) partes.unshift("Actividad " + (altas.length + 1));

      if (partes.length < 2) {
        fallos.push([i + 1, cruda, "hacen falta al menos: nombre | inicio   (o sólo   inicio | fin)"]);
        return;
      }
      var nombre = partes[0];
      var desde = LSD.parseTime(partes[1]);
      if (desde == null) { fallos.push([i + 1, cruda, "tiempo de inicio no válido: «" + partes[1] + "»"]); return; }

      var hasta = partes[2] ? LSD.parseTime(partes[2]) : null;
      if (partes[2] && hasta == null) { fallos.push([i + 1, cruda, "tiempo de fin no válido: «" + partes[2] + "»"]); return; }
      if (hasta == null) hasta = desde + pordefecto;
      if (hasta <= desde) { fallos.push([i + 1, cruda, "el fin (" + LSD.formatTime(hasta) + ") no puede ser anterior al inicio (" + LSD.formatTime(desde) + ")"]); return; }

      var unidad = unidadBase;
      if (partes[3]) {
        var w = findWork(partes[3]);
        if (!w) { fallos.push([i + 1, cruda, "unidad desconocida: «" + partes[3] + "»"]); return; }
        if (w.block.id !== bloque.id) {
          fallos.push([i + 1, cruda, "la unidad «" + w.item.id + "» es del bloque «" + w.block.id + "»"]);
          return;
        }
        unidad = w.item.id;
      }
      var etiquetas = partes[4] ? partes[4].split(/\s*,\s*/).filter(Boolean) : [];

      altas.push({
        id: uniqueId(LSD.slug(nombre)),
        title: nombre,
        url: parsed.url, provider: parsed.provider, vid: parsed.vid,
        start: desde, end: hasta,
        block: bloque.id, work: unidad,
        tags: etiquetas,
        duration: LSD.formatTime(hasta - desde),
        desc: "", poster: "", featured: false,
        added: new Date().toISOString().slice(0, 10)
      });
    });

    if (!n) { T.warn("No había ninguna línea con contenido."); return; }

    if (fallos.length && !flags.parcial && !flags.forzar) {
      T.err(fallos.length + " de " + n + " líneas tienen un problema. No se cargó ninguna.");
      T.space();
      fallos.forEach(function (f) {
        T.html('<div class="t-line"><span class="t-err">línea ' + f[0] + "</span> " +
          '<span class="t-dim">' + esc(f[1].slice(0, 70)) + "</span>" +
          '<div style="padding-left:1.2rem" class="t-warn">' + esc(f[2]) + "</div></div>");
      });
      T.space();
      T.dim("Corregí esas líneas y volvé a pegar. Para cargar las correctas:  fragmentos … --parcial");
      return;
    }
    if (!altas.length) { T.err("Ninguna línea se pudo cargar."); return; }

    // Solapamientos: no es un error, pero conviene avisar
    var orden = altas.slice().sort(function (a, b) { return a.start - b.start; });
    var solapes = [];
    for (var k = 1; k < orden.length; k++) {
      if (orden[k].start < orden[k - 1].end) {
        solapes.push('"' + orden[k - 1].title + '" y "' + orden[k].title + '"');
      }
    }

    S.write(function (st) { altas.forEach(function (v) { st.media.videos.push(v); }); });

    T.ok(altas.length + " fragmentos cargados en " + bloque.code + " · " + bloque.title);
    altas.forEach(function (v) {
      T.html('<div class="t-line"><span class="t-key">' + esc(LSD.formatTime(v.start)) + " → " +
        esc(LSD.formatTime(v.end)) + '</span>  <span class="t-ok">' + esc(v.title) +
        '</span> <span class="t-dim">(' + esc(v.duration) + ")</span></div>");
    });
    if (solapes.length) {
      T.space();
      T.warn("Hay tramos que se pisan: " + solapes.join(", ") + ".");
      T.dim("No impide nada, pero revisá los tiempos por las dudas.");
    }
    T.space();
    T.dim("Cada uno reproduce sólo su tramo. Para publicarlo en el sitio:  publicar");
  }

  /* =========================================================
     CARGA POR LOTES
     ========================================================= */
  T.register({
    name: "lote", alias: ["batch", "pegar", "lista"],
    desc: "Carga muchos vídeos de una vez, pegando una lista de texto",
    usage: "lote",
    help: function () {
      T.space();
      T.dim("Abre un cuadro para pegar una lista, una línea por vídeo:");
      T.dim("");
      T.dim("   Título del vídeo | bloque | https://youtu.be/xxxx");
      T.dim("");
      T.dim("El separador puede ser  |  o  ;  o un tabulador.");
      T.dim("Se admiten dos campos opcionales más, en este orden:");
      T.dim("");
      T.dim("   Título | bloque | url | unidad | etiquetas,con,comas");
      T.dim("");
      T.dim("Las líneas vacías y las que empiecen con # se ignoran.");
      T.dim("Si alguna línea falla no se carga ninguna, para que puedas");
      T.dim("corregirla antes. Con  lote --parcial  se cargan las correctas.");
    },
    run: function (args, flags) {
      var texto = args.join(" ");
      if (texto) { procesarLote(texto, flags); return; }
      openPasteBox("Pegá la lista de vídeos — una línea por vídeo", function (txt) {
        procesarLote(txt, flags);
      }, EJEMPLO_LOTE);
    }
  });

  var EJEMPLO_LOTE =
    "Rondo 4v2 · circulación | posesion | https://youtu.be/xxxxxxx\n" +
    "SSG 4v4 cuatro mini-arcos | ssg | https://youtu.be/yyyyyyy\n" +
    "Nordic curl · progresión | fuerza | https://youtu.be/zzzzzzz | prevencion | prevención,isquiosurales";

  function procesarLote(texto, flags) {
    var lineas = String(texto).split(/\r?\n/);
    var altas = [], fallos = [], n = 0;

    lineas.forEach(function (linea, i) {
      var cruda = linea.trim();
      if (!cruda || cruda.charAt(0) === "#") return;
      n++;
      var partes = cruda.split(/\s*[|;\t]\s*/).filter(function (x) { return x !== ""; });

      if (partes.length < 3) {
        fallos.push([i + 1, cruda, "hacen falta al menos: título | bloque | url"]);
        return;
      }
      var titulo = partes[0];
      var bloque = findBlock(partes[1]);
      if (!bloque) { fallos.push([i + 1, cruda, "bloque desconocido: «" + partes[1] + "»"]); return; }

      var parsed = LSD.parseMedia(partes[2]);
      if (!parsed || !parsed.url) { fallos.push([i + 1, cruda, "no se pudo leer la URL"]); return; }

      var unidad = null;
      if (partes[3]) {
        var w = findWork(partes[3]);
        if (!w) { fallos.push([i + 1, cruda, "unidad desconocida: «" + partes[3] + "»"]); return; }
        if (w.block.id !== bloque.id) {
          fallos.push([i + 1, cruda, "la unidad «" + w.item.id + "» es del bloque «" + w.block.id + "», no de «" + bloque.id + "»"]);
          return;
        }
        unidad = w.item.id;
      }
      var etiquetas = partes[4] ? partes[4].split(/\s*,\s*/).filter(Boolean) : [];

      altas.push({
        id: uniqueId(LSD.slug(titulo)),
        title: titulo,
        url: parsed.url, provider: parsed.provider, vid: parsed.vid,
        block: bloque.id, work: unidad,
        tags: etiquetas, duration: "", desc: "", poster: "",
        featured: false,
        added: new Date().toISOString().slice(0, 10)
      });
    });

    if (!n) { T.warn("No había ninguna línea con contenido."); return; }

    if (fallos.length && !flags.parcial && !flags.forzar) {
      T.err(fallos.length + " de " + n + " líneas tienen un problema. No se cargó ninguna.");
      T.space();
      fallos.forEach(function (f) {
        T.html('<div class="t-line"><span class="t-err">línea ' + f[0] + "</span> " +
          '<span class="t-dim">' + esc(f[1].slice(0, 70)) + "</span>" +
          '<div style="padding-left:1.2rem" class="t-warn">' + esc(f[2]) + "</div></div>");
      });
      T.space();
      T.dim("Corregí esas líneas y volvé a pegar la lista.");
      T.dim("Para cargar igual las " + altas.length + " que sí están bien:  lote --parcial");
      T.dim("Bloques válidos:");
      T.chips(blockIds());
      return;
    }

    if (!altas.length) { T.err("Ninguna línea se pudo cargar."); return; }

    S.write(function (st) {
      altas.forEach(function (v) { st.media.videos.push(v); });
    });

    T.ok(altas.length + " vídeos cargados.");
    var porBloque = {};
    altas.forEach(function (v) { porBloque[v.block] = (porBloque[v.block] || 0) + 1; });
    Object.keys(porBloque).forEach(function (b) {
      var bl = LSD.blockById(b);
      T.dim("  " + (bl ? bl.code + " " + bl.title : b) + ": " + porBloque[b]);
    });
    if (fallos.length) T.warn(fallos.length + " líneas se saltaron por errores.");
    T.space();
    T.dim("Esto vive en tu navegador. Para que lo vea todo el mundo:  publicar");
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
    usage: "seccion <listar|ocultar|mostrar|invertir|normal|orden> [ids]",
    complete: function (prev) {
      if (prev.length === 0) return ["listar", "ocultar", "mostrar", "invertir", "normal", "orden"];
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
          var inv = (cfg.inverted || []).indexOf(id) >= 0;
          T.html('<div class="t-line"><span class="t-dim">' + (i + 1) + ".</span> " +
            '<span class="t-key">' + esc(id) + "</span> " +
            '<span class="' + (off ? "t-err" : "t-ok") + '">' + (off ? "oculta" : "visible") + "</span> " +
            '<span class="t-warn">' + (inv ? "fondo negro" : "") + "</span> " +
            '<span class="t-dim">' + esc(LSD.SECTION_LABEL[id] || "") + "</span></div>");
        });
        T.space();
        T.dim("seccion ocultar <id>   ·   seccion mostrar <id>   ·   seccion orden id1 id2 id3");
        T.dim("seccion invertir <id>  ·   seccion normal <id>    (banda negra sobre la página blanca)");
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
      if (sub === "invertir" || sub === "negro" || sub === "invert") {
        if (!args[1]) { T.err("Uso: seccion invertir <id>"); T.chips(all, "seccion invertir "); return; }
        var id3 = da(args[1]);
        if (all.indexOf(id3) < 0) { T.err("Sección desconocida."); T.chips(all, "seccion invertir "); return; }
        S.write(function (st) {
          if (!Array.isArray(st.layout.inverted)) st.layout.inverted = [];
          if (st.layout.inverted.indexOf(id3) < 0) st.layout.inverted.push(id3);
        });
        T.ok("Sección sobre fondo negro: " + id3);
        return;
      }
      if (sub === "normal" || sub === "blanco" || sub === "revertir") {
        if (!args[1]) { T.err("Uso: seccion normal <id>"); T.chips(all, "seccion normal "); return; }
        var id4 = da(args[1]);
        S.write(function (st) {
          st.layout.inverted = (st.layout.inverted || []).filter(function (x) { return x !== id4; });
        });
        T.ok("Sección sobre fondo de página: " + id4);
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
      T.chips(["listar", "ocultar", "mostrar", "invertir", "normal", "orden"], "seccion ");
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
        if (!download("lsd-videos.json", JSON.stringify(S.config.media.videos, null, 2))) return;
        T.ok("Descargado lsd-videos.json");
        return;
      }
      if (!download("lsd-config.json", S.export())) return;
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
      if (!download("config.js", body, "application/javascript;charset=utf-8")) return;
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
  function openPasteBox(title, cb, ejemplo, valor) {
    var ov = d.getElementById("overlay");
    ov.innerHTML =
      '<div class="modal" style="max-width:760px">' +
        '<div class="modal-head"><h3 class="modal-title" style="font-size:1.1rem">' + esc(title) + "</h3>" +
        '<button class="modal-close" aria-label="Cerrar">✕</button></div>' +
        '<div class="modal-body">' +
          '<textarea id="pasteBox" spellcheck="false" style="width:100%;min-height:280px;background:var(--surface);' +
          'border:1px solid var(--border);color:var(--text);font-family:var(--font-mono);font-size:.78rem;padding:1rem;line-height:1.5"' +
          (ejemplo ? ' placeholder="' + esc(ejemplo) + '"' : '') + '>' + esc(valor || "") + '</textarea>' +
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
