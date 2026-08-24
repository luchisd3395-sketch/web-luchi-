/* =============================================================
   store.js — configuración, esquema y persistencia
   Namespace global: window.LSD
   ============================================================= */
(function (w) {
  "use strict";

  var LSD = w.LSD = w.LSD || {};
  var KEY = "lsd.config.v1";

  /* ------------------------------------------------------------------
     PRESETS DE TEMA
     ------------------------------------------------------------------ */
  var PRESETS = {
    noir:    { label: "Noir — negro absoluto y volt",     mode: "dark",  bg: "#080908", bg2: "#0f110f", surface: "#131613", surface2: "#1b1f1b", text: "#f2f4f0", muted: "#8e948b", border: "#262a26", accent: "#d8ff3e" },
    cancha:  { label: "Cancha — verde profundo",          mode: "dark",  bg: "#05130b", bg2: "#081a10", surface: "#0b2115", surface2: "#0f2c1c", text: "#eef7f0", muted: "#7f9b89", border: "#173726", accent: "#35e07a" },
    acero:   { label: "Acero — grafito y azul eléctrico", mode: "dark",  bg: "#0a0c10", bg2: "#0f1319", surface: "#131822", surface2: "#1a212d", text: "#eef1f6", muted: "#8792a4", border: "#232b38", accent: "#3d7bff" },
    sangre:  { label: "Sangre — negro y rojo",            mode: "dark",  bg: "#0a0708", bg2: "#110c0d", surface: "#171011", surface2: "#1f1618", text: "#f6f0f0", muted: "#9b8a8c", border: "#2b1e20", accent: "#ff3b30" },
    arena:   { label: "Arena — tierra y ámbar",           mode: "dark",  bg: "#100e0a", bg2: "#17140f", surface: "#1d1913", surface2: "#26211a", text: "#f5f0e6", muted: "#9c9083", border: "#2e281f", accent: "#e8a33d" },
    blanco:  { label: "Blanco — claro editorial",         mode: "light", bg: "#f4f4f1", bg2: "#ffffff", surface: "#ffffff", surface2: "#ececE6", text: "#0b0d0a", muted: "#5f645c", border: "#d9dad4", accent: "#111111" },
    hielo:   { label: "Hielo — claro y azul",             mode: "light", bg: "#f3f6fa", bg2: "#ffffff", surface: "#ffffff", surface2: "#e8eef6", text: "#0a1220", muted: "#5b6b80", border: "#d3dce8", accent: "#0057ff" },
    club:    { label: "Club — verde, rojo y blanco",      mode: "dark",  bg: "#050f09", bg2: "#08170e", surface: "#0b1e12", surface2: "#102918", text: "#f1f7f2", muted: "#84a08d", border: "#183524", accent: "#1faa4b" }
  };
  LSD.PRESETS = PRESETS;

  /* ------------------------------------------------------------------
     CONFIGURACIÓN POR DEFECTO
     ------------------------------------------------------------------ */
  var DEFAULTS = {
    version: 1,
    site: {
      title: "Metodología de Trabajo",
      author: "Luciano Santo Domingo",
      role: "Preparador Físico · Metodología de Entrenamiento",
      club: "Club Agropecuario Argentino · Carlos Casares, Argentina",
      tagline: "Años de trabajo de campo, ordenados.",
      heroLine1: "Metodología",
      heroLine2: "de Trabajo",
      heroLine3: "Luciano Santo Domingo",
      intro: "Archivo metodológico construido a lo largo de años de trabajo en el Club Agropecuario Argentino junto a distintos cuerpos técnicos. Fuerza, juegos reducidos, posesión, trabajos tácticos y control de carga: cada bloque documentado con el mismo criterio y con el vídeo de la tarea real.",
      email: "",
      instagram: "",
      footerNote: "Documento vivo. Se actualiza con cada temporada."
    },
    theme: {
      preset: "noir",
      mode: "dark",
      accent: "#d8ff3e",
      bg: "#080908",
      bg2: "#0f110f",
      surface: "#131613",
      surface2: "#1b1f1b",
      text: "#f2f4f0",
      muted: "#8e948b",
      border: "#262a26",
      font: "archivo",
      radius: 0,
      density: "normal",
      titlecase: "upper",
      grain: false,
      motion: true
    },
    layout: {
      container: "wide",
      hero: "full",
      nav: "top",
      card: "sharp",
      sections: ["bloques", "trabajos", "videos", "microciclo"],
      hidden: []
    },
    video: {
      layout: "grid",
      cols: 3,
      ratio: "16:9",
      size: "md",
      align: "stretch",
      gap: 24,
      hover: "zoom",
      player: "modal",
      title: true,
      meta: true,
      tags: true,
      desc: false,
      autoplay: true,
      muted: false,
      loop: false
    },
    terminal: {
      dock: "bottom",
      height: 52,
      pass: ""
    },
    media: {
      videos: []
    }
  };
  LSD.DEFAULTS = DEFAULTS;

  /* ------------------------------------------------------------------
     ESQUEMA — describe cada clave configurable.
     Lo usan `set`, `get`, `config`, la ayuda y el autocompletado.
     ------------------------------------------------------------------ */
  var C = function (t, d, o) { o = o || {}; o.type = t; o.desc = d; return o; };
  var SCHEMA = {
    "site.title":      C("text", "Título principal del sitio"),
    "site.author":     C("text", "Autor / responsable"),
    "site.role":       C("text", "Rol o cargo"),
    "site.club":       C("text", "Club o institución"),
    "site.tagline":    C("text", "Frase corta bajo el título"),
    "site.heroLine1":  C("text", "Portada — línea 1"),
    "site.heroLine2":  C("text", "Portada — línea 2"),
    "site.heroLine3":  C("text", "Portada — línea 3 (en color de acento)"),
    "site.intro":      C("text", "Párrafo de introducción"),
    "site.email":      C("text", "Email de contacto (opcional)"),
    "site.instagram":  C("text", "Usuario de Instagram (opcional)"),
    "site.footerNote": C("text", "Nota del pie de página"),

    "theme.preset":    C("enum", "Paleta completa", { values: Object.keys(PRESETS) }),
    "theme.mode":      C("enum", "Modo de color", { values: ["dark", "light"] }),
    "theme.accent":    C("color", "Color de acento"),
    "theme.bg":        C("color", "Fondo principal"),
    "theme.bg2":       C("color", "Fondo secundario"),
    "theme.surface":   C("color", "Superficie de tarjetas"),
    "theme.surface2":  C("color", "Superficie elevada"),
    "theme.text":      C("color", "Color de texto"),
    "theme.muted":     C("color", "Texto secundario"),
    "theme.border":    C("color", "Color de bordes"),
    "theme.font":      C("enum", "Familia tipográfica", { values: ["archivo", "condensed", "inter", "mono", "serif"] }),
    "theme.radius":    C("num", "Radio de esquinas (px)", { min: 0, max: 32 }),
    "theme.density":   C("enum", "Densidad de espaciado", { values: ["compact", "normal", "wide"] }),
    "theme.titlecase": C("enum", "Títulos en mayúsculas o normales", { values: ["upper", "normal"] }),
    "theme.grain":     C("bool", "Textura de grano sobre la página"),
    "theme.motion":    C("bool", "Animaciones y transiciones"),

    "layout.container": C("enum", "Ancho del contenedor", { values: ["boxed", "wide", "full"] }),
    "layout.hero":      C("enum", "Estilo de portada", { values: ["full", "split", "minimal", "off"] }),
    "layout.nav":       C("enum", "Posición de la navegación", { values: ["top", "side", "hidden"] }),
    "layout.card":      C("enum", "Estilo de tarjeta", { values: ["sharp", "soft", "outline", "glass"] }),

    "video.layout":   C("enum", "Disposición de los vídeos", { values: ["grid", "mosaic", "masonry", "list", "carousel", "cinema"] }),
    "video.cols":     C("cols", "Columnas (1-6 o 'auto')"),
    "video.ratio":    C("enum", "Proporción del vídeo", { values: ["16:9", "4:3", "3:2", "1:1", "9:16", "21:9"] }),
    "video.size":     C("enum", "Tamaño de la tarjeta", { values: ["xs", "sm", "md", "lg", "xl"] }),
    "video.align":    C("enum", "Alineación del conjunto", { values: ["stretch", "left", "center", "right"] }),
    "video.gap":      C("num", "Separación entre vídeos (px)", { min: 0, max: 80 }),
    "video.hover":    C("enum", "Efecto al pasar el cursor", { values: ["zoom", "lift", "none"] }),
    "video.player":   C("enum", "Dónde se reproduce", { values: ["modal", "inline"] }),
    "video.title":    C("bool", "Mostrar el título del vídeo"),
    "video.meta":     C("bool", "Mostrar bloque y duración"),
    "video.tags":     C("bool", "Mostrar etiquetas"),
    "video.desc":     C("bool", "Mostrar descripción"),
    "video.autoplay": C("bool", "Reproducir automáticamente al abrir"),
    "video.muted":    C("bool", "Iniciar sin sonido"),
    "video.loop":     C("bool", "Repetir en bucle"),

    "terminal.dock":   C("enum", "Posición de la terminal", { values: ["bottom", "float", "right", "full"] }),
    "terminal.height": C("num", "Altura de la terminal (% de pantalla)", { min: 25, max: 95 }),
    "terminal.pass":   C("text", "Clave de acceso a la terminal (vacío = sin clave)")
  };
  LSD.SCHEMA = SCHEMA;

  /* ------------------------------------------------------------------
     UTILIDADES
     ------------------------------------------------------------------ */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  LSD.clone = clone;

  function deepMerge(base, over) {
    var out = clone(base);
    Object.keys(over || {}).forEach(function (k) {
      var v = over[k];
      if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) {
        out[k] = deepMerge(out[k], v);
      } else if (v !== undefined) {
        out[k] = Array.isArray(v) ? clone(v) : v;
      }
    });
    return out;
  }
  LSD.deepMerge = deepMerge;

  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) { return (o == null) ? undefined : o[k]; }, obj);
  }
  function setPath(obj, path, val) {
    var ks = path.split("."), last = ks.pop(), cur = obj;
    ks.forEach(function (k) { if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {}; cur = cur[k]; });
    cur[last] = val;
    return obj;
  }
  LSD.getPath = getPath;
  LSD.setPath = setPath;

  function slug(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "item";
  }
  LSD.slug = slug;

  /* --- Validación / casteo según el esquema --- */
  var TRUE = ["1", "true", "si", "sí", "on", "yes", "activo", "y"];
  var FALSE = ["0", "false", "no", "off", "inactivo", "n"];

  function coerce(path, raw) {
    var s = SCHEMA[path];
    if (!s) return { ok: false, err: "La clave «" + path + "» no existe. Probá `config` para ver todas." };
    var v = String(raw).trim();

    if (s.type === "bool") {
      var lv = v.toLowerCase();
      if (TRUE.indexOf(lv) >= 0) return { ok: true, value: true };
      if (FALSE.indexOf(lv) >= 0) return { ok: true, value: false };
      return { ok: false, err: "Valor booleano no válido. Usá: on / off" };
    }
    if (s.type === "num") {
      var n = parseFloat(v.replace(",", "."));
      if (isNaN(n)) return { ok: false, err: "Se esperaba un número." };
      if (s.min != null && n < s.min) n = s.min;
      if (s.max != null && n > s.max) n = s.max;
      return { ok: true, value: n };
    }
    if (s.type === "cols") {
      if (v.toLowerCase() === "auto") return { ok: true, value: "auto" };
      var c = parseInt(v, 10);
      if (isNaN(c)) return { ok: false, err: "Se esperaba un número de 1 a 6, o 'auto'." };
      return { ok: true, value: Math.max(1, Math.min(6, c)) };
    }
    if (s.type === "enum") {
      var lv2 = v.toLowerCase();
      if (s.values.indexOf(lv2) < 0) {
        return { ok: false, err: "Valor no válido. Opciones: " + s.values.join(" · ") };
      }
      return { ok: true, value: lv2 };
    }
    if (s.type === "color") {
      var col = normalizeColor(v);
      if (!col) return { ok: false, err: "Color no válido. Usá #rrggbb, rgb(...) o un nombre CSS." };
      return { ok: true, value: col };
    }
    return { ok: true, value: raw };
  }
  LSD.coerce = coerce;

  var NAMED = {
    negro: "#000000", blanco: "#ffffff", rojo: "#e02020", verde: "#2ecc71", azul: "#2f6bff",
    amarillo: "#ffd400", naranja: "#ff7a00", violeta: "#8b5cf6", gris: "#8a8a8a",
    celeste: "#5ac8fa", rosa: "#ff4d8d", lima: "#d8ff3e", turquesa: "#1abc9c", dorado: "#f2c14b"
  };
  function normalizeColor(v) {
    var s = String(v).trim().toLowerCase();
    if (NAMED[s]) return NAMED[s];
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(s)) {
      if (s.length === 4) s = "#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
      return s;
    }
    if (/^([0-9a-f]{3}|[0-9a-f]{6})$/.test(s)) return normalizeColor("#" + s);
    if (/^(rgb|hsl)a?\([\d\s.,%\/]+\)$/.test(s)) return s;
    // Nombre CSS válido: lo verifica el propio navegador
    if (typeof document !== "undefined") {
      var probe = document.createElement("span");
      probe.style.color = "";
      probe.style.color = s;
      if (probe.style.color !== "") return s;
    }
    return null;
  }
  LSD.normalizeColor = normalizeColor;

  /* ------------------------------------------------------------------
     STORE
     ------------------------------------------------------------------ */
  var listeners = [];
  var state = null;

  function load() {
    var published = w.LSD_CONFIG || {};          // data/config.js — versionado en el repo
    var local = null;
    try {
      var raw = w.localStorage && w.localStorage.getItem(KEY);
      if (raw) local = JSON.parse(raw);
    } catch (e) { local = null; }
    state = deepMerge(deepMerge(DEFAULTS, published), local || {});
    if (!Array.isArray(state.media.videos)) state.media.videos = [];
    if (!Array.isArray(state.layout.sections)) state.layout.sections = clone(DEFAULTS.layout.sections);
    if (!Array.isArray(state.layout.hidden)) state.layout.hidden = [];
    return state;
  }

  function persist() {
    try { w.localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch (e) { return false; }
  }

  var store = LSD.store = {
    get config() { return state || load(); },

    init: function () { load(); return state; },

    get: function (path) { return getPath(store.config, path); },

    /** Aplica un valor validado por esquema. */
    set: function (path, raw, opts) {
      var res = coerce(path, raw);
      if (!res.ok) return res;
      setPath(state, path, res.value);
      if (path === "theme.preset") store.applyPreset(res.value, true);
      if (path.indexOf("theme.") === 0 && path !== "theme.preset" && ["accent","bg","bg2","surface","surface2","text","muted","border","mode"].indexOf(path.split(".")[1]) >= 0) {
        state.theme.preset = "custom";
      }
      persist();
      if (!opts || opts.emit !== false) store.emit(path);
      return { ok: true, value: res.value };
    },

    /** Escritura directa sin validación (uso interno: vídeos, secciones). */
    write: function (fn) {
      fn(state);
      persist();
      store.emit("*");
    },

    applyPreset: function (name, quiet) {
      var p = PRESETS[name];
      if (!p) return false;
      var t = state.theme;
      t.preset = name; t.mode = p.mode; t.bg = p.bg; t.bg2 = p.bg2;
      t.surface = p.surface; t.surface2 = p.surface2; t.text = p.text;
      t.muted = p.muted; t.border = p.border; t.accent = p.accent;
      persist();
      if (!quiet) store.emit("theme");
      return true;
    },

    reset: function (scope) {
      if (!scope || scope === "all" || scope === "todo") {
        var videos = state.media.videos;
        state = clone(DEFAULTS);
        if (scope !== "all" && scope !== "todo") state.media.videos = videos;
        state = deepMerge(state, w.LSD_CONFIG || {});
      } else if (DEFAULTS[scope]) {
        state[scope] = deepMerge(clone(DEFAULTS[scope]), (w.LSD_CONFIG || {})[scope] || {});
      } else {
        return false;
      }
      persist();
      store.emit("*");
      return true;
    },

    replace: function (obj) {
      state = deepMerge(clone(DEFAULTS), obj || {});
      if (!Array.isArray(state.media.videos)) state.media.videos = [];
      persist();
      store.emit("*");
    },

    clearLocal: function () {
      try { w.localStorage.removeItem(KEY); } catch (e) {}
      load();
      store.emit("*");
    },

    export: function () { return JSON.stringify(state, null, 2); },

    on: function (fn) { listeners.push(fn); return fn; },
    emit: function (what) { listeners.forEach(function (fn) { try { fn(what, state); } catch (e) { console.error(e); } }); }
  };

  load();
})(window);
