/* =============================================================
   media.js — detección de proveedor, embeds y miniaturas
   ============================================================= */
(function (w) {
  "use strict";
  var LSD = w.LSD = w.LSD || {};

  var RX = {
    youtube: [
      /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{6,})/i,
      /(?:youtu\.be\/)([\w-]{6,})/i,
      /(?:youtube\.com\/embed\/)([\w-]{6,})/i,
      /(?:youtube\.com\/shorts\/)([\w-]{6,})/i,
      /(?:youtube\.com\/live\/)([\w-]{6,})/i
    ],
    vimeo: [/vimeo\.com\/(?:video\/)?(\d{6,})/i, /player\.vimeo\.com\/video\/(\d{6,})/i],
    drive: [/drive\.google\.com\/file\/d\/([\w-]{10,})/i, /drive\.google\.com\/open\?id=([\w-]{10,})/i, /docs\.google\.com\/.*\/d\/([\w-]{10,})/i],
    dailymotion: [/dailymotion\.com\/video\/([\w]+)/i, /dai\.ly\/([\w]+)/i],
    streamable: [/streamable\.com\/([\w]+)/i]
  };

  var FILE_RX = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i;

  /** Analiza una URL y devuelve { provider, vid, url }. */
  function parse(url) {
    var u = String(url || "").trim();
    if (!u) return null;
    if (/^(www\.)/i.test(u)) u = "https://" + u;

    var p, i, m;
    for (p in RX) {
      for (i = 0; i < RX[p].length; i++) {
        m = u.match(RX[p][i]);
        if (m) return { provider: p, vid: m[1], url: u, start: startFromUrl(u) };
      }
    }
    if (FILE_RX.test(u)) return { provider: "file", vid: "", url: u };
    if (/^(https?:)?\/\//i.test(u)) return { provider: "iframe", vid: "", url: u };
    // Ruta relativa: se asume archivo local del repositorio
    return { provider: "file", vid: "", url: u };
  }
  LSD.parseMedia = parse;

  var LABEL = {
    youtube: "YouTube", vimeo: "Vimeo", drive: "Google Drive",
    dailymotion: "Dailymotion", streamable: "Streamable",
    file: "Archivo", iframe: "Enlace", demo: "Ejemplo"
  };
  LSD.providerLabel = function (p) { return LABEL[p] || p || "—"; };

  /** URL de reproducción embebida. */
  LSD.embedUrl = function (v, opts) {
    opts = opts || {};
    var auto = opts.autoplay ? 1 : 0;
    var mute = opts.muted ? 1 : 0;
    var loop = opts.loop ? 1 : 0;
    switch (v.provider) {
      case "youtube":
        return "https://www.youtube-nocookie.com/embed/" + v.vid +
          "?autoplay=" + auto + "&mute=" + mute + "&rel=0&modestbranding=1&playsinline=1" +
          (v.start != null ? "&start=" + Math.round(v.start) : "") +
          (v.end != null ? "&end=" + Math.round(v.end) : "") +
          (loop ? "&loop=1&playlist=" + v.vid : "");
      case "vimeo":
        return "https://player.vimeo.com/video/" + v.vid +
          "?autoplay=" + auto + "&muted=" + mute + "&loop=" + loop + "&dnt=1" +
          (v.start != null ? "#t=" + Math.round(v.start) + "s" : "");
      case "drive":
        return "https://drive.google.com/file/d/" + v.vid + "/preview";
      case "dailymotion":
        return "https://www.dailymotion.com/embed/video/" + v.vid + "?autoplay=" + auto + "&mute=" + mute;
      case "streamable":
        return "https://streamable.com/e/" + v.vid + "?autoplay=" + auto + "&muted=" + mute;
      default:
        return v.url;
    }
  };



  /* ----------------------------------------------------------------
     TIEMPOS
     Permiten mostrar un fragmento de un vídeo largo como si fuera una
     pieza propia, sin necesidad de cortar ni volver a subir nada.
     ---------------------------------------------------------------- */

  /** Convierte "2:05", "125", "1:02:05" o "2m5s" en segundos. */
  LSD.parseTime = function (v) {
    if (v == null || v === "") return null;
    var s = String(v).trim().toLowerCase();
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    if (/^(\d{1,2}:)?\d{1,2}:\d{1,2}$/.test(s)) {
      var p = s.split(":").map(Number);
      return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
    }
    var m = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    if (m && (m[1] || m[2] || m[3])) {
      return (+(m[1] || 0)) * 3600 + (+(m[2] || 0)) * 60 + (+(m[3] || 0));
    }
    return null;
  };

  /** Convierte segundos en "2:05" o "1:02:05". */
  LSD.formatTime = function (n) {
    if (n == null || isNaN(n)) return "";
    n = Math.max(0, Math.round(n));
    var h = Math.floor(n / 3600), m = Math.floor((n % 3600) / 60), s = n % 60;
    var mm = h ? ("0" + m).slice(-2) : String(m);
    return (h ? h + ":" : "") + mm + ":" + ("0" + s).slice(-2);
  };

  /** Extrae de la URL la marca de tiempo de inicio, si la trae. */
  function startFromUrl(u) {
    var m = String(u).match(/[?&#](?:t|start)=([0-9hms:]+)/i);
    return m ? LSD.parseTime(m[1]) : null;
  }

  /** Duración de un fragmento, en texto. */
  LSD.rangeLabel = function (v) {
    if (v.start == null || v.end == null) return "";
    var d = v.end - v.start;
    return d > 0 ? LSD.formatTime(d) : "";
  };

  /** URL de reproducción para el fondo de portada: en bucle, en silencio y sin adornos. */
  LSD.heroEmbedUrl = function (v) {
    switch (v.provider) {
      case "youtube":
        return "https://www.youtube-nocookie.com/embed/" + v.vid +
          "?autoplay=1&mute=1&loop=1&playlist=" + v.vid +
          "&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3";
      case "vimeo":
        return "https://player.vimeo.com/video/" + v.vid +
          "?autoplay=1&muted=1&loop=1&background=1&dnt=1";
      case "drive":
        return "https://drive.google.com/file/d/" + v.vid + "/preview";
      case "dailymotion":
        return "https://www.dailymotion.com/embed/video/" + v.vid + "?autoplay=1&mute=1&controls=0&ui-logo=0";
      case "streamable":
        return "https://streamable.com/e/" + v.vid + "?autoplay=1&muted=1&loop=1&nocontrols=1";
      default:
        if (v.start != null) {
          return v.url.split("#")[0] + "#t=" + Math.round(v.start) +
            (v.end != null ? "," + Math.round(v.end) : "");
        }
        return v.url;
    }
  };

  /** ¿Se puede previsualizar en la propia tarjeta al pasar el cursor? */
  LSD.canHoverPreview = function (v) {
    return v && v.provider === "file" && !!v.url;
  };

  /** Miniatura automática según proveedor. */
  LSD.thumbUrl = function (v) {
    if (v.poster) return LSD.resolveUrl ? LSD.resolveUrl(v.poster) : v.poster;
    switch (v.provider) {
      case "youtube": return "https://i.ytimg.com/vi/" + v.vid + "/hqdefault.jpg";
      case "drive":   return "https://drive.google.com/thumbnail?id=" + v.vid + "&sz=w1200";
      default:        return null;
    }
  };

  /** Marcador de posición generado (SVG en data URI) para vídeos sin miniatura. */
  LSD.placeholder = function (label, accent, bg, fg) {
    accent = accent || "#d8ff3e"; bg = bg || "#131613"; fg = fg || "#7d857a";
    var txt = String(label || "VIDEO").toUpperCase();
    if (txt.length > 24) txt = txt.slice(0, 23) + "…";
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">' +
      '<defs><pattern id="p" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">' +
      '<line x1="0" y1="0" x2="0" y2="18" stroke="' + fg + '" stroke-opacity="0.18" stroke-width="6"/></pattern></defs>' +
      '<rect width="640" height="360" fill="' + bg + '"/>' +
      '<rect width="640" height="360" fill="url(#p)"/>' +
      '<rect x="0" y="0" width="640" height="4" fill="' + accent + '"/>' +
      '<text x="320" y="318" text-anchor="middle" font-family="monospace" font-size="17" letter-spacing="3" fill="' + fg + '">' +
      esc(txt) + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  LSD.esc = esc;

  /** Normaliza una duración escrita como 90, 1:30, 01:30:00. */
  LSD.normDuration = function (d) {
    var s = String(d || "").trim();
    if (!s) return "";
    if (/^\d+$/.test(s)) {
      var t = parseInt(s, 10);
      return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
    }
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) return s;
    return s;
  };
})(window);
