/* =============================================================
   render.js — aplicación del tema y pintado de la página
   ============================================================= */
(function (w, d) {
  "use strict";
  var LSD = w.LSD = w.LSD || {};
  var esc = LSD.esc;
  var M = w.LSD_METHODOLOGY;

  var ui = {
    filterWorks: "all",
    filterVideos: "all",
    cinemaIndex: 0
  };
  LSD.ui = ui;

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  LSD.$ = $; LSD.$$ = $$;

  /* ================================================================
     TEMA
     ================================================================ */
  function luminance(hex) {
    var m = /^#([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return 0.5;
    var n = parseInt(m[1], 16);
    var r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    var f = function (c) { return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }

  /** Sube la luminosidad de un color manteniendo tono y saturación.
     Mezclar hacia el blanco lo desatura: un rojo terminaría rosado. */
  function lighten(hex, targetL) {
    var m = /^#([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return hex;
    var n = parseInt(m[1], 16);
    var r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var l = (max + min) / 2, h = 0, sat = 0, dd = max - min;
    if (dd) {
      sat = l > 0.5 ? dd / (2 - max - min) : dd / (max + min);
      if (max === r) h = ((g - b) / dd + (g < b ? 6 : 0));
      else if (max === g) h = (b - r) / dd + 2;
      else h = (r - g) / dd + 4;
      h /= 6;
    }
    if (l >= targetL) return hex;
    l = targetL;
    var hue = function (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    var q2 = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
    var p2 = 2 * l - q2;
    var out = [hue(p2, q2, h + 1 / 3), hue(p2, q2, h), hue(p2, q2, h - 1 / 3)];
    return "#" + out.map(function (v) {
      return ("0" + Math.round(v * 255).toString(16)).slice(-2);
    }).join("");
  }
  LSD.lighten = lighten;

  function applyTheme() {
    var c = LSD.store.config, t = c.theme, root = d.documentElement, s = root.style;
    s.setProperty("--bg", t.bg);
    s.setProperty("--bg-2", t.bg2);
    s.setProperty("--surface", t.surface);
    s.setProperty("--surface-2", t.surface2);
    s.setProperty("--text", t.text);
    s.setProperty("--muted", t.muted);
    s.setProperty("--border", t.border);
    s.setProperty("--accent", t.accent);
    s.setProperty("--accent-ink", luminance(t.accent) > 0.55 ? "#0a0d08" : "#ffffff");
    s.setProperty("--accent-2", t.accent2 || t.accent);
    s.setProperty("--accent-alt", lighten(t.accent, 0.56));
    s.setProperty("--accent-2-alt", lighten(t.accent2 || t.accent, 0.40));
    s.setProperty("--accent-2-ink", luminance(t.accent2 || t.accent) > 0.55 ? "#0a0d08" : "#ffffff");
    s.setProperty("--radius", t.radius + "px");
    s.setProperty("--grid-gap", c.video.gap + "px");
    s.setProperty("--term-height", c.terminal.height + "vh");
    // Punto de foco de la portada: va por variable para que valga igual
    // en la foto y en el vídeo, y cambie sin repintar la media.
    s.setProperty("--hero-focus", (c.site.heroFocus == null ? 50 : c.site.heroFocus) + "%");

    root.setAttribute("data-mode", t.mode);
    root.setAttribute("data-font", t.font);
    root.setAttribute("data-density", t.density);
    root.setAttribute("data-titlecase", t.titlecase);
    root.setAttribute("data-grain", t.grain ? "on" : "off");
    root.setAttribute("data-motion", t.motion ? "on" : "off");
    root.setAttribute("data-container", c.layout.container);
    root.setAttribute("data-hero", c.layout.hero);
    root.setAttribute("data-nav", c.layout.nav);
    root.setAttribute("data-card", c.layout.card);
    root.setAttribute("data-blockimg", c.layout.blockImg || "bn");
    root.setAttribute("data-vhover", c.video.hover);
    root.setAttribute("data-vtitle", c.video.title ? "on" : "off");
    root.setAttribute("data-vmeta", c.video.meta ? "on" : "off");
    root.setAttribute("data-vtags", c.video.tags ? "on" : "off");
    root.setAttribute("data-vdesc", c.video.desc ? "on" : "off");

    var term = $("#term");
    if (term) term.setAttribute("data-dock", c.terminal.dock);
  }
  LSD.applyTheme = applyTheme;

  /* ================================================================
     DATOS DERIVADOS
     ================================================================ */
  function blockById(id) {
    for (var i = 0; i < M.blocks.length; i++) if (M.blocks[i].id === id) return M.blocks[i];
    return null;
  }
  function workById(id) {
    for (var i = 0; i < M.blocks.length; i++) {
      var it = M.blocks[i].items;
      for (var j = 0; j < it.length; j++) if (it[j].id === id) return { block: M.blocks[i], item: it[j] };
    }
    return null;
  }
  function allWorks() {
    var out = [];
    M.blocks.forEach(function (b) { b.items.forEach(function (it) { out.push({ block: b, item: it }); }); });
    return out;
  }
  LSD.blockById = blockById;
  LSD.workById = workById;
  LSD.allWorks = allWorks;

  function videos() { return LSD.store.config.media.videos || []; }
  function videosOf(blockId) {
    return blockId === "all" ? videos() : videos().filter(function (v) { return v.block === blockId; });
  }
  function videosOfWork(workId) {
    return videos().filter(function (v) { return v.work === workId; });
  }
  LSD.videosOf = videosOf;

  /* ================================================================
     PORTADA
     ================================================================ */
  /** Sanea una URL para usarla dentro de url(...) en un atributo style. */
  function safeUrl(u) {
    var s = String(u || "").trim();
    if (!s) return "";
    if (/^\s*(javascript|vbscript)\s*:/i.test(s)) return "";
    return s.replace(/["'()\\<>]/g, encodeURIComponent);
  }
  LSD.safeUrl = safeUrl;

  /** Ruta lista para el navegador: resuelve un archivo subido desde el
     dispositivo ("local:clave") y después lo sanea como cualquier otra. */
  function mediaUrl(u) {
    return safeUrl(LSD.resolveUrl ? LSD.resolveUrl(u) : u);
  }
  LSD.mediaUrl = mediaUrl;

  function renderHero() {
    var c = LSD.store.config, s = c.site;
    var nWorks = allWorks().length;
    renderHeroMedia();
    $("#heroEyebrow").textContent = s.role;
    $("#heroL1").textContent = s.heroLine1;
    $("#heroL2").textContent = s.heroLine2;
    $("#heroL3").textContent = s.heroLine3;
    $("#heroIntro").textContent = s.intro;
    $("#heroStats").innerHTML = [
      stat(M.blocks.length, "Bloques metodológicos"),
      stat(nWorks, "Unidades de trabajo"),
      stat(videos().length, "Vídeos en el archivo"),
      stat(((M.morfociclos || [])[0] || { dias: M.microcycle || [] }).dias.length - 1, "Días de microciclo")
    ].join("");
    $("#brandName").textContent = s.author;
    $("#brandSub").textContent = s.title;
    $("#brandMark").textContent = initials(s.author);
    d.title = s.title + " · " + s.author;
  }

  /* ----------------------------------------------------------------
     FONDO DE PORTADA
     Reproduce en bucle y sin sonido los vídeos cargados. Con varios,
     va pasando de uno al siguiente. Si no hay vídeos usa la foto.
     ---------------------------------------------------------------- */
  var heroTimer = null;
  var heroIndex = 0;
  var heroSig = null;

  function heroMediaSignature() {
    var c = LSD.store.config;
    return JSON.stringify((c.media.heroVideos || []).map(function (v) { return v.url; })) + "|" + (c.site.heroImage || "");
  }

  function renderHeroMedia(force) {
    var host = $("#heroMedia");
    if (!host) return;
    var c = LSD.store.config;
    var sig = heroMediaSignature();
    var hero = $(".hero");

    var vids = c.media.heroVideos || [];
    var img = mediaUrl(c.site.heroImage);
    var hasMedia = vids.length > 0 || !!img;

    if (hero) hero.classList.toggle("has-media", hasMedia);
    d.documentElement.setAttribute("data-heromedia", hasMedia ? "on" : "off");

    // No reiniciar la reproducción si la media no cambió
    if (sig === heroSig && !force) return;
    heroSig = sig;
    heroIndex = 0;
    if (heroTimer) { clearTimeout(heroTimer); heroTimer = null; }

    if (!hasMedia) { host.innerHTML = ""; return; }
    if (!vids.length) {
      host.innerHTML = '<img src="' + esc(img) + '" alt="" loading="eager">' + mutedTag(false);
      return;
    }
    paintHeroVideo();
  }

  function mutedTag(show) {
    return show ? '<span class="hero-muted"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">' +
      '<path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3l2.7-2.7-1.4-1.4L15.2 10.6 12.5 7.9l-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4L16.6 12z"/>' +
      "</svg> Sin sonido</span>" : "";
  }

  function paintHeroVideo() {
    var host = $("#heroMedia");
    var vids = LSD.store.config.media.heroVideos || [];
    if (!vids.length) return;
    heroIndex = heroIndex % vids.length;
    var v = vids[heroIndex];
    var solo = vids.length === 1;
    var poster = mediaUrl(LSD.store.config.site.heroImage);

    if (v.provider === "file") {
      host.innerHTML = '<video src="' + esc(mediaUrl(v.url)) + '" autoplay muted playsinline ' +
        (solo ? "loop " : "") + (poster ? 'poster="' + esc(poster) + '" ' : "") +
        'preload="auto"></video>' + mutedTag(true);
      var el = host.querySelector("video");
      el.muted = true;                       // Safari exige fijarlo también por propiedad
      var play = el.play();
      if (play && play.catch) play.catch(function () {});
      if (!solo) {
        el.addEventListener("ended", function () { heroIndex++; paintHeroVideo(); });
        el.addEventListener("error", function () { heroIndex++; if (heroIndex < vids.length * 2) paintHeroVideo(); });
      }
      return;
    }

    // Proveedores embebidos: siempre en silencio, sin controles ni marca
    host.innerHTML = '<iframe src="' + esc(LSD.heroEmbedUrl(v)) + '" title="" tabindex="-1" ' +
      'allow="autoplay; encrypted-media" frameborder="0"></iframe>' + mutedTag(true);
    if (!solo) {
      heroTimer = setTimeout(function () { heroIndex++; paintHeroVideo(); }, 24000);
    }
  }
  LSD.renderHeroMedia = renderHeroMedia;

  function stat(n, l) {
    return '<div class="stat"><div class="stat-num">' + esc(String(n).padStart(2, "0")) +
           '</div><div class="stat-lbl label">' + esc(l) + '</div></div>';
  }
  function initials(name) {
    return String(name || "LSD").split(/\s+/).slice(0, 2).map(function (x) { return x[0] || ""; }).join("").toUpperCase() || "LSD";
  }

  function renderMarquee() {
    var items = (M.principios || []).map(function (p) {
      return '<span class="marquee-item"><i></i>' + esc(p) + '</span>';
    }).join("");
    $("#marqueeTrack").innerHTML = items + items;
  }

  /* ================================================================
     BLOQUES
     ================================================================ */
  function renderBlocks() {
    var imgs = LSD.store.config.media.images || {};
    $("#blocksGrid").innerHTML = M.blocks.map(function (b) {
      var nv = videosOf(b.id).length;
      var img = mediaUrl(imgs[b.id]);
      return '<button class="block-card reveal' + (img ? " has-img" : "") + '" data-block="' + b.id + '">' +
        (img ? '<span class="bc-img" style="background-image:url(&quot;' + esc(img) + '&quot;)"></span>' +
               '<span class="bar-bottom"></span>' : "") +
        '<div><div class="bc-code">' + esc(b.code) + ' / ' + esc(b.short.toUpperCase()) + '</div>' +
        '<h3 class="bc-title">' + esc(b.title) + '</h3>' +
        '<p class="bc-desc">' + esc(b.desc) + '</p></div>' +
        '<div class="bc-foot"><span class="label">' + b.items.length + ' unidades · ' + nv + ' vídeos</span>' +
        '<span class="bc-arrow" aria-hidden="true">→</span></div>' +
        '</button>';
    }).join("");

    $$("#blocksGrid .block-card").forEach(function (el) {
      el.addEventListener("click", function () {
        setWorkFilter(el.getAttribute("data-block"));
        var t = $("#trabajos");
        if (t) t.scrollIntoView({ behavior: LSD.store.config.theme.motion ? "smooth" : "auto", block: "start" });
      });
    });
    $("#blocksCount").textContent = M.blocks.length + " bloques · " + allWorks().length + " unidades";
  }

  /* ================================================================
     UNIDADES DE TRABAJO
     ================================================================ */
  function renderWorkFilters() {
    var html = ['<button class="chip' + (ui.filterWorks === "all" ? " is-active" : "") + '" data-f="all">Todos</button>'];
    M.blocks.forEach(function (b) {
      html.push('<button class="chip' + (ui.filterWorks === b.id ? " is-active" : "") + '" data-f="' + b.id + '">' +
        esc(b.code + " " + b.short) + '</button>');
    });
    $("#worksFilters").innerHTML = html.join("");
    $$("#worksFilters .chip").forEach(function (el) {
      el.addEventListener("click", function () { setWorkFilter(el.getAttribute("data-f")); });
    });
  }

  function setWorkFilter(f) {
    ui.filterWorks = f;
    renderWorkFilters();
    renderWorks();
    LSD.observeReveal();
  }
  LSD.setWorkFilter = setWorkFilter;

  function meta(v) { return v && v !== "\u2014"; }

  function renderWorks() {
    var list = ui.filterWorks === "all" ? allWorks() : allWorks().filter(function (x) { return x.block.id === ui.filterWorks; });
    $("#worksCount").textContent = list.length + (list.length === 1 ? " unidad" : " unidades");
    $("#worksGrid").innerHTML = list.map(function (x) {
      var nv = videosOfWork(x.item.id).length;
      return '<button class="work-card reveal" data-work="' + x.item.id + '">' +
        '<div class="wc-top"><span class="wc-tag">' + esc(x.block.code + " · " + x.block.short) + '</span>' +
        (nv ? '<span class="wc-vid">▶ ' + nv + '</span>' : '') + '</div>' +
        '<h3 class="wc-title">' + esc(x.item.name) + '</h3>' +
        '<p class="wc-obj">' + esc(x.item.objetivo) + '</p>' +
        '<div class="wc-meta">' +
          (meta(x.item.formato) ? '<span>' + esc(x.item.formato) + '</span>' : '') +
          (meta(x.item.duracion) ? '<span>' + esc(x.item.duracion) + '</span>' : '') +
        '</div></button>';
    }).join("");
    $$("#worksGrid .work-card").forEach(function (el) {
      el.addEventListener("click", function () { openFicha(el.getAttribute("data-work")); });
    });
  }

  /* ================================================================
     VÍDEOS
     ================================================================ */
  function renderVideoFilters() {
    var used = {};
    videos().forEach(function (v) { used[v.block] = (used[v.block] || 0) + 1; });
    var html = ['<button class="chip' + (ui.filterVideos === "all" ? " is-active" : "") + '" data-f="all">Todos (' + videos().length + ')</button>'];
    M.blocks.forEach(function (b) {
      if (!used[b.id]) return;
      html.push('<button class="chip' + (ui.filterVideos === b.id ? " is-active" : "") + '" data-f="' + b.id + '">' +
        esc(b.short) + ' (' + used[b.id] + ')</button>');
    });
    $("#videoFilters").innerHTML = videos().length ? html.join("") : "";
    $$("#videoFilters .chip").forEach(function (el) {
      el.addEventListener("click", function () {
        ui.filterVideos = el.getAttribute("data-f");
        ui.cinemaIndex = 0;
        renderVideoFilters(); renderVideos(); LSD.observeReveal();
      });
    });
  }

  function videoCard(v, i, opts) {
    opts = opts || {};
    var c = LSD.store.config;
    var ph = opts.dark
      ? LSD.placeholder(v.title, c.theme.accent, "#191919", "#6f6f6f")
      : LSD.placeholder(v.title, c.theme.accent, c.theme.surface, c.theme.muted);
    var thumb = LSD.thumbUrl(v) || ph;
    var b = blockById(v.block);
    var live = opts.live;
    var inner;
    if (live) {
      inner = '<div class="video-thumb is-live">' + playerMarkup(v, true) + '</div>';
    } else {
      inner = '<div class="video-thumb">' +
        '<img src="' + esc(thumb) + '" alt="' + esc(v.title) + '" loading="lazy" ' +
        'onerror="this.onerror=null;this.src=\'' + ph.replace(/'/g, "%27") + '\'">' +
        (v.featured ? '<span class="video-badge">Destacado</span>' : '') +
        '<span class="play-btn" aria-hidden="true">' +
          '<svg width="17" height="19" viewBox="0 0 17 19" fill="currentColor"><path d="M0 0l17 9.5L0 19V0z"/></svg>' +
        '</span>' +
        (v.duration ? '<span class="video-dur">' + esc(v.duration) + '</span>' : '') +
        (v.start != null ? '<span class="video-frag" title="Fragmento de una grabación más larga">' +
          esc(LSD.formatTime(v.start)) + (v.end != null ? '–' + esc(LSD.formatTime(v.end)) : '') + '</span>' : '') +
        (c.video.hoverPlay && LSD.canHoverPreview(v)
          ? '<video class="hover-preview" src="' + esc(mediaUrl(v.url)) + '" muted loop playsinline preload="none"></video>'
          : '') +
        '</div>';
    }

    var tags = (v.tags || []).map(function (t) { return '<b>' + esc(t) + '</b>'; }).join("");
    var body = '<div class="video-body">' +
      '<div class="video-title">' + esc(v.title) + '</div>' +
      '<div class="video-meta">' +
        (b ? '<span>' + esc(b.code + " · " + b.short) + '</span>' : '') +
        '<span>' + esc(LSD.providerLabel(v.provider)) + '</span>' +
      '</div>' +
      (v.desc ? '<p class="video-desc">' + esc(v.desc) + '</p>' : '') +
      (tags ? '<div class="video-tags">' + tags + '</div>' : '') +
      '</div>';

    var tag = live ? "div" : "button";
    return '<' + tag + ' class="video-card reveal" data-vid="' + esc(v.id) + '" data-i="' + i + '">' + inner + body + '</' + tag + '>';
  }

  function playerMarkup(v, inline) {
    var c = LSD.store.config.video;
    if (!v.url || v.provider === "demo") {
      return '<div style="display:grid;place-items:center;height:100%;min-height:220px;background:var(--surface);' +
        'padding:2rem;text-align:center;font-family:var(--font-mono);font-size:.75rem;line-height:2;color:var(--muted)">' +
        '<div>Vídeo de ejemplo, todavía sin enlace.<br>Asignale uno desde la terminal:<br>' +
        '<span style="color:var(--accent)">video edit ' + esc(v.id) + ' url &lt;enlace&gt;</span></div></div>';
    }
    var opts = { autoplay: inline ? false : c.autoplay, muted: c.muted, loop: c.loop };
    if (v.provider === "file") {
      return '<video src="' + esc(mediaUrl(v.url)) + '" controls playsinline ' +
        (opts.autoplay ? "autoplay " : "") + (c.muted ? "muted " : "") + (c.loop ? "loop " : "") +
        (v.poster ? 'poster="' + esc(v.poster) + '" ' : "") + 'style="width:100%;height:100%;object-fit:contain;background:#000"></video>';
    }
    return '<iframe src="' + esc(LSD.embedUrl(v, opts)) + '" title="' + esc(v.title) +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>';
  }
  LSD.playerMarkup = playerMarkup;


  /** Arranca y detiene la previsualización silenciosa al pasar el cursor. */
  function bindHoverPreview(scope) {
    $$(".video-card", scope).forEach(function (card) {
      var vid = $(".hover-preview", card);
      if (!vid) return;
      card.addEventListener("mouseenter", function () {
        vid.muted = true;
        var p = vid.play();
        if (p && p.then) p.then(function () { vid.classList.add("is-ready"); }).catch(function () {});
        else vid.classList.add("is-ready");
      });
      card.addEventListener("mouseleave", function () {
        vid.pause();
        vid.classList.remove("is-ready");
        try { vid.currentTime = 0; } catch (e) {}
      });
    });
  }

  /** Lleva a un vídeo recién subido y lo señala: la subida termina cuando
     se lo ve en la página, no cuando el panel dice que sí. */
  LSD.irAlVideo = function (id) {
    ui.filterVideos = "all";
    renderVideoFilters();
    renderVideos();
    LSD.observeReveal();
    setTimeout(function () {
      var card = $('#videoCollection [data-vid="' + String(id).replace(/"/g, '\\"') + '"]');
      if (!card) { var s = $("#videos"); if (s) s.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      card.classList.add("is-nuevo");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(function () { card.classList.remove("is-nuevo"); }, 4000);
    }, 120);
  };

  function renderVideos() {
    var c = LSD.store.config, cfg = c.video;
    var dark = (c.layout.inverted || []).indexOf("videos") >= 0;
    var list = videosOf(ui.filterVideos);
    var host = $("#videoCollection");
    var strip = $("#videoStrip");

    $("#videosCount").textContent = list.length + (list.length === 1 ? " vídeo" : " vídeos");

    host.setAttribute("data-layout", cfg.layout);
    host.setAttribute("data-ratio", cfg.ratio);
    host.setAttribute("data-size", cfg.size);
    host.setAttribute("data-align", cfg.align);
    host.setAttribute("data-cols", cfg.cols === "auto" ? "auto" : String(cfg.cols));
    host.style.setProperty("--cols", cfg.cols === "auto" ? 3 : cfg.cols);

    if (!list.length) {
      host.innerHTML = "";
      strip.innerHTML = "";
      $("#videosEmpty").classList.remove("hidden");
      return;
    }
    $("#videosEmpty").classList.add("hidden");

    if (cfg.layout === "cinema") {
      var idx = Math.min(ui.cinemaIndex, list.length - 1);
      var main = list[idx];
      host.innerHTML = videoCard(main, idx, { live: true, dark: dark });
      strip.innerHTML = list.map(function (v, i) {
        var th = LSD.thumbUrl(v) || LSD.placeholder(v.title, c.theme.accent, dark ? "#191919" : c.theme.surface, dark ? "#6f6f6f" : c.theme.muted);
        return '<button data-i="' + i + '" class="' + (i === idx ? "is-active" : "") + '">' +
          '<img src="' + esc(th) + '" alt=""><span class="st-title">' + esc(v.title) + '</span></button>';
      }).join("");
      $$("#videoStrip button").forEach(function (el) {
        el.addEventListener("click", function () {
          ui.cinemaIndex = parseInt(el.getAttribute("data-i"), 10);
          renderVideos();
        });
      });
      return;
    }

    strip.innerHTML = "";
    host.innerHTML = list.map(function (v, i) { return videoCard(v, i, { dark: dark }); }).join("");
    bindHoverPreview(host);
    $$("#videoCollection .video-card").forEach(function (el) {
      el.addEventListener("click", function () {
        var v = list[parseInt(el.getAttribute("data-i"), 10)];
        if (!v) return;
        if (cfg.player === "inline") {
          var t = $(".video-thumb", el);
          if (t && !t.classList.contains("is-live")) {
            t.classList.add("is-live");
            t.innerHTML = playerMarkup(v, false);
          }
        } else {
          openPlayer(v);
        }
      });
    });
  }
  LSD.renderVideos = renderVideos;


  /* ================================================================
     MOMENTOS EN EL CLUB
     ================================================================ */
  var momTimer = null;
  var momSig = null;

  function renderMomentos() {
    var c = LSD.store.config;
    var g = c.gallery || {};
    var fotos = (c.media.gallery || []).filter(function (f) { return f && f.src; });
    var host = $("#momentos-galeria");
    var strip = $("#momStrip");
    if (!host || !strip) return;

    host.setAttribute("data-layout", g.layout || "pase");
    host.setAttribute("data-ratio", g.ratio || "3:2");
    host.setAttribute("data-size", g.size || "md");
    d.documentElement.setAttribute("data-momcaptions", g.captions ? "on" : "off");

    $("#momCount").textContent = fotos.length + (fotos.length === 1 ? " foto" : " fotos");

    var sig = JSON.stringify(fotos) + "|" + g.layout + "|" + g.ratio + "|" + g.size;
    if (sig === momSig) return;          // no reiniciar el pase por cualquier cambio
    momSig = sig;
    detenerPase();

    if (!fotos.length) {
      strip.innerHTML = "";
      $("#momDots").innerHTML = "";
      $("#momCounter").textContent = "";
      $("#momVacio").classList.remove("hidden");
      $(".mom-bar").classList.add("hidden");
      return;
    }
    $("#momVacio").classList.add("hidden");
    $(".mom-bar").classList.toggle("hidden", fotos.length < 2);

    strip.innerHTML = fotos.map(function (f, i) {
      var url = mediaUrl(f.src);
      return '<div class="mom-slide reveal" role="group" aria-label="Foto ' + (i + 1) + " de " + fotos.length + '">' +
        "<figure><img src=\"" + esc(url) + '" alt="' + esc(f.pie || "") + '" loading="' + (i < 2 ? "eager" : "lazy") + '">' +
        (f.pie ? "<figcaption>" + esc(f.pie) + "</figcaption>" : "") +
        "</figure></div>";
    }).join("");

    $("#momDots").innerHTML = fotos.map(function (_, i) {
      return '<button data-i="' + i + '" aria-label="Ir a la foto ' + (i + 1) + '"></button>';
    }).join("");

    $$("#momDots button").forEach(function (b) {
      b.addEventListener("click", function () { irAFoto(parseInt(b.getAttribute("data-i"), 10)); });
    });
    $("#momPrev").onclick = function () { mover(-1); };
    $("#momNext").onclick = function () { mover(1); };

    strip.addEventListener("scroll", marcarActiva, { passive: true });
    ["mouseenter", "focusin", "touchstart", "pointerdown"].forEach(function (ev) {
      strip.addEventListener(ev, detenerPase, { passive: true });
    });
    ["mouseleave", "focusout"].forEach(function (ev) {
      strip.addEventListener(ev, arrancarPase);
    });
    strip.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); mover(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); mover(-1); }
    });

    marcarActiva();
    arrancarPase();
  }

  function slides() { return $$("#momStrip .mom-slide"); }

  function indiceActual() {
    var strip = $("#momStrip");
    if (!strip) return 0;
    var els = slides();
    if (!els.length) return 0;
    var centro = strip.scrollLeft + strip.clientWidth / 2;
    var mejor = 0, dist = Infinity;
    els.forEach(function (el, i) {
      var c = el.offsetLeft + el.offsetWidth / 2;
      var dd = Math.abs(c - centro);
      if (dd < dist) { dist = dd; mejor = i; }
    });
    return mejor;
  }

  function irAFoto(i) {
    var strip = $("#momStrip");
    var els = slides();
    if (!strip || !els.length) return;
    i = (i + els.length) % els.length;
    var el = els[i];
    strip.scrollTo({
      left: el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2,
      behavior: LSD.store.get("theme.motion") ? "smooth" : "auto"
    });
  }

  function mover(paso) {
    detenerPase();
    irAFoto(indiceActual() + paso);
    arrancarPase();
  }

  function marcarActiva() {
    var i = indiceActual();
    var total = slides().length;
    $$("#momDots button").forEach(function (b, j) { b.classList.toggle("is-active", j === i); });
    var cont = $("#momCounter");
    if (cont) cont.textContent = total ? String(i + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0") : "";
  }

  function arrancarPase() {
    detenerPase();
    var g = LSD.store.config.gallery || {};
    if (!g.autoplay || !LSD.store.get("theme.motion")) return;
    if (slides().length < 2) return;
    if (d.documentElement.classList.contains("is-locked")) return;
    momTimer = setInterval(function () {
      // Sólo avanza si la sección está a la vista: sin esto la tira
      // se desplaza sola mientras se lee otra parte de la página.
      var sec = d.getElementById("momentos");
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > w.innerHeight) return;
      irAFoto(indiceActual() + 1);
    }, Math.max(2, g.interval || 5) * 1000);
  }
  function detenerPase() { if (momTimer) { clearInterval(momTimer); momTimer = null; } }
  LSD.detenerPase = detenerPase;

  /* ================================================================
     MICROCICLO
     ================================================================ */
  var NIVELES = [
    { id: "bajo",           label: "Bajo" },
    { id: "moderado",       label: "Moderado" },
    { id: "moderado-alto",  label: "Moderado-alto" },
    { id: "intenso",        label: "Intenso" },
    { id: "muy-intenso",    label: "Muy intenso" }
  ];

  /** Nivel de un día: el declarado en los datos, o deducido de la carga. */
  function nivelDe(r) {
    var ids = NIVELES.map(function (n) { return n.id; });
    if (r.nivel && ids.indexOf(r.nivel) >= 0) return r.nivel;
    if (r.carga >= 85) return "muy-intenso";
    if (r.carga >= 60) return "intenso";
    if (r.carga >= 35) return "moderado";
    return "bajo";
  }
  function nivelLabel(id) {
    for (var i = 0; i < NIVELES.length; i++) if (NIVELES[i].id === id) return NIVELES[i].label;
    return id;
  }

  /* La tabla y el gráfico salen del mismo sitio: el morfociclo activo.
     Así no pueden contradecirse. */
  function renderMicro() {
    var ciclo = (M.morfociclos || [])[morfoActivo] || (M.morfociclos || [])[0];
    var filas = ciclo ? ciclo.dias : (M.microcycle || []);
    $("#microBody").innerHTML = filas.map(function (r) {
      var n = nivelDe(r);
      return '<tr><td class="md">' + esc(r.day) + '</td><td>' + esc(r.tipo) + '</td>' +
        '<td class="muted">' + esc(r.acentuacion || r.foco || "") + '</td>' +
        '<td class="muted">' + esc(r.contenidos) + '</td>' +
        '<td style="white-space:nowrap">' + esc(r.dur) + '</td>' +
        '<td>' +
          '<span class="load-track"><span class="load-bar" data-nivel="' + n +
            '" style="width:' + Math.max(3, r.carga) + '%"></span></span>' +
          '<span class="load-tag" data-nivel="' + n + '">' + esc(nivelLabel(n)) + '</span>' +
          '<span class="load-pct">' + r.carga + '%</span>' +
        '</td></tr>';
    }).join("");

    var leg = $("#microLegend");
    if (leg) {
      leg.innerHTML = NIVELES.map(function (n) {
        return '<span><i data-nivel="' + n.id + '"></i>' + esc(n.label) + "</span>";
      }).join("");
    }
  }

  /* ================================================================
     MORFOCICLO INTERACTIVO
     ----------------------------------------------------------------
     Las dos semanas que arma Luciano, dibujadas como en sus láminas:
     barras por carga, color por nivel y los arcos de fase encima.
     Cada barra es un botón que abre el día con su material.
     ================================================================ */
  var morfoActivo = 0;
  var morfoDiaAbierto = -1;

  function morfoCiclos() { return M.morfociclos || []; }

  /** Fotos guardadas para un día, desde la configuración. */
  function fotosDelDia(day) {
    var d = LSD.store.config.media.dias || {};
    return (d[day] || []).slice();
  }
  /** Vídeos marcados con ese día. */
  function videosDelDia(day) {
    return videos().filter(function (v) { return v.dia === day; });
  }
  /** Unidades de trabajo etiquetadas con ese día (MD-3, MD+1…). */
  function tareasDelDia(day) {
    var t = String(day).toLowerCase();
    return allWorks().filter(function (w) {
      return (w.item.tags || []).some(function (x) { return String(x).toLowerCase() === t; });
    });
  }

  function renderMorfoTabs() {
    var host = $("#morfoTabs");
    if (!host) return;
    host.innerHTML = morfoCiclos().map(function (c, i) {
      return '<button class="morfo-tab' + (i === morfoActivo ? " is-active" : "") + '" role="tab" ' +
        'aria-selected="' + (i === morfoActivo) + '" data-i="' + i + '">' +
        '<b>' + esc(c.dias.length - 1) + ' días</b><span>' +
        esc(c.sub + (c.temporada ? " · " + c.temporada : "")) + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(host.querySelectorAll("button"), function (b) {
      b.addEventListener("click", function () {
        morfoActivo = parseInt(b.getAttribute("data-i"), 10);
        morfoDiaAbierto = -1;
        renderMorfo();
        renderMicro();
      });
    });
  }

  /** Los arcos de fase: días seguidos que comparten `fase`. */
  function renderMorfoFases(ciclo) {
    var host = $("#morfoFases");
    if (!host) return;
    var tramos = [];
    ciclo.dias.forEach(function (d, i) {
      var ult = tramos[tramos.length - 1];
      if (d.fase && ult && ult.fase === d.fase) ult.n++;
      else tramos.push({ fase: d.fase || "", n: 1, desde: i });
    });
    // la barra de cierre del partido no lleva fase, pero ocupa su columna
    if (ciclo.dias[0] && ciclo.dias[0].day === "MD") tramos.push({ fase: "", n: 1 });
    host.innerHTML = tramos.map(function (t) {
      return '<span class="morfo-fase' + (t.fase ? "" : " is-vacia") + '" style="flex:' + t.n + '">' +
        (t.fase ? '<i></i><b>' + esc(t.fase) + "</b>" : "") + "</span>";
    }).join("");
  }

  /** Canchita con la zona de trabajo, como las de sus láminas: el espacio
     crece del día de tensión al de duración. */
  function campito(campo) {
    var zonas = { reducido: [46, 62, 16, 12], medio: [30, 40, 40, 30], amplio: [4, 6, 92, 88] };
    var z = zonas[campo];
    if (!z) return "";
    return '<svg class="mb-campo" viewBox="0 0 60 40" aria-hidden="true">' +
      '<rect x="1" y="1" width="58" height="38" rx="1"/>' +
      '<line x1="30" y1="1" x2="30" y2="39"/><circle cx="30" cy="20" r="6"/>' +
      '<rect class="zona" x="' + (z[0] * 0.6) + '" y="' + (z[1] * 0.4) + '" width="' +
        (z[2] * 0.6) + '" height="' + (z[3] * 0.4) + '"/></svg>';
  }

  function renderMorfoBarras(ciclo) {
    var host = $("#morfoBarras");
    if (!host) return;
    var max = ciclo.dias.reduce(function (m, d) { return Math.max(m, d.carga || 0); }, 100);

    function barra(d, i, cierre) {
      var n = nivelDe(d);
      var alto = Math.max(6, Math.round((d.carga / max) * 100));
      var partido = d.day === "MD";
      var cuantos = fotosDelDia(d.day).length + videosDelDia(d.day).length;

      /* Un día con dos grupos se dibuja con dos bloques, como en la lámina:
         el que compensa arriba y el que recupera abajo. */
      var relleno;
      if (d.grupos && d.grupos.length) {
        relleno = d.grupos.map(function (g, k) {
          var h = Math.max(8, Math.round((g.carga / max) * 100));
          return '<span class="mb-fill mb-grupo' + (h < 25 ? " is-corta" : "") + '" data-nivel="' +
            nivelDe(g) + '" style="height:' + h + '%">' +
            '<span class="mb-acento">' + esc(g.label) + "</span></span>";
        }).join("");
      } else {
        relleno = '<span class="mb-fill' + (alto < 25 ? " is-corta" : "") + '" data-nivel="' + n +
          '" style="height:' + alto + '%">' +
          (d.campo ? campito(d.campo) : "") +
          '<span class="mb-acento">' + esc(d.acentuacion || d.tipo) + "</span></span>";
      }

      return '<button class="morfo-barra' + (partido ? " is-partido" : "") +
          (d.grupos ? " tiene-grupos" : "") +
          (i === morfoDiaAbierto && !cierre ? " is-abierta" : "") + '" data-i="' + i + '" ' +
          'aria-expanded="' + (i === morfoDiaAbierto && !cierre) + '" ' +
          (cierre ? 'aria-label="Competencia: la semana termina donde empieza"' :
            'aria-label="' + esc(d.day + " · " + d.tipo + " · " + nivelLabel(n) + ", " + d.carga + "%") + '"') + '>' +
        '<span class="mb-col">' + relleno + "</span>" +
        '<span class="mb-pie">' +
          '<span class="mb-dia">' + esc(cierre ? "MD" : d.day) + "</span>" +
          '<span class="mb-tipo">' + esc(d.tipo) + "</span>" +
          (cuantos && !cierre ? '<span class="mb-mat">' + cuantos + "</span>" : "") +
        "</span></button>";
    }

    /* La semana va de partido a partido: la competencia cierra igual que abre. */
    var html = ciclo.dias.map(function (d, i) { return barra(d, i, false); }).join("");
    if (ciclo.dias[0] && ciclo.dias[0].day === "MD") html += barra(ciclo.dias[0], 0, true);
    host.innerHTML = html;

    Array.prototype.forEach.call(host.querySelectorAll(".morfo-barra"), function (b) {
      b.addEventListener("click", function () {
        var i = parseInt(b.getAttribute("data-i"), 10);
        abrirDia(i === morfoDiaAbierto ? -1 : i);
      });
      b.addEventListener("keydown", function (e) {
        var i = parseInt(b.getAttribute("data-i"), 10);
        var n = ciclo.dias.length;
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var j = (i + (e.key === "ArrowRight" ? 1 : n - 1)) % n;
          var sig = host.querySelector('.morfo-barra[data-i="' + j + '"]');
          if (sig) { sig.focus(); if (morfoDiaAbierto >= 0) abrirDia(j, true); }
        } else if (e.key === "Escape" && morfoDiaAbierto >= 0) {
          e.preventDefault(); abrirDia(-1, true);
        }
      });
    });
  }

  function abrirDia(i, sinDesplazar) {
    /* Repintar las barras destruye el botón que tenía el foco, y sin foco
       las flechas y Esc dejan de servir: se devuelve a la misma barra. */
    var teniaFoco = document.activeElement && document.activeElement.classList
      && document.activeElement.classList.contains("morfo-barra");
    var volverA = teniaFoco ? document.activeElement.getAttribute("data-i") : null;

    morfoDiaAbierto = i;
    var ciclo = morfoCiclos()[morfoActivo];
    renderMorfoBarras(ciclo);
    renderMorfoDia(ciclo);

    if (volverA != null) {
      var b = $('#morfoBarras .morfo-barra[data-i="' + volverA + '"]');
      if (b) b.focus({ preventScroll: true });
    }
    if (i >= 0 && !sinDesplazar) {
      var panel = $("#morfoDia");
      if (panel) panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function renderMorfoDia(ciclo) {
    var panel = $("#morfoDia");
    if (!panel) return;
    if (morfoDiaAbierto < 0) { panel.hidden = true; panel.innerHTML = ""; return; }

    var d = ciclo.dias[morfoDiaAbierto];
    var n = nivelDe(d);
    var fotos = fotosDelDia(d.day);
    var vids = videosDelDia(d.day);
    var tareas = tareasDelDia(d.day);

    var html =
      '<div class="md-head">' +
        '<div class="md-id"><span class="md-day">' + esc(d.day) + "</span>" +
          '<span class="md-tipo">' + esc(d.tipo) + "</span></div>" +
        '<div class="md-meta">' +
          '<span class="load-tag" data-nivel="' + n + '">' + esc(nivelLabel(n)) + "</span>" +
          '<span class="md-dato">' + esc(d.dur) + "</span>" +
          '<span class="md-dato">' + d.carga + "%</span>" +
          (d.fase ? '<span class="md-fase">' + esc(d.fase) + "</span>" : "") +
        "</div>" +
        '<button class="md-cerrar" id="mdCerrar" aria-label="Cerrar el día">✕</button>' +
      "</div>" +
      '<p class="md-acento">' + esc(d.acentuacion) + "</p>" +
      '<p class="md-cont">' + esc(d.contenidos) + "</p>" +
      ((d.claves || []).length
        ? '<ul class="md-claves">' + d.claves.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul>"
        : "");

    if (vids.length) {
      html += '<div class="md-bloque"><h4>Vídeos de este día</h4><div class="md-videos">' +
        vids.map(function (v) {
          var th = LSD.thumbUrl(v);
          return '<button class="md-video" data-vid="' + esc(v.id) + '">' +
            (th ? '<img src="' + esc(mediaUrl(th)) + '" alt="">' : '<span class="md-ph">vídeo</span>') +
            "<span>" + esc(v.title) + "</span></button>";
        }).join("") + '</div><div class="md-player" id="mdPlayer" hidden></div></div>';
    }
    if (fotos.length) {
      html += '<div class="md-bloque"><h4>Fotos de este día</h4><div class="md-fotos">' +
        fotos.map(function (f) {
          return '<img src="' + esc(mediaUrl(f)) + '" alt="">';
        }).join("") + "</div></div>";
    }
    if (tareas.length) {
      html += '<div class="md-bloque"><h4>Tareas del archivo para este día</h4><div class="md-tareas">' +
        tareas.map(function (w) {
          return '<button class="md-tarea" data-work="' + esc(w.item.id) + '">' +
            '<b>' + esc(w.item.name) + "</b><span>" + esc(w.block.code + " · " + w.block.short) + "</span></button>";
        }).join("") + "</div></div>";
    }
    if (!vids.length && !fotos.length) {
      html += '<p class="md-vacio">Todavía no hay fotos ni vídeos cargados para este día. ' +
        "Se suben desde el panel, eligiendo «" + esc(d.day) + "» como día.</p>";
    }

    panel.innerHTML = html;
    panel.hidden = false;

    var cerrar = $("#mdCerrar");
    if (cerrar) cerrar.addEventListener("click", function () { abrirDia(-1); });

    Array.prototype.forEach.call(panel.querySelectorAll(".md-tarea"), function (b) {
      b.addEventListener("click", function () { openFicha(b.getAttribute("data-work")); });
    });

    /* El vídeo se ve acá mismo, con su recorte: entrar en el día no
       debería obligar a irse a otra sección. */
    Array.prototype.forEach.call(panel.querySelectorAll(".md-video"), function (b) {
      b.addEventListener("click", function () {
        var v = vids.filter(function (x) { return x.id === b.getAttribute("data-vid"); })[0];
        var caja = $("#mdPlayer");
        if (!v || !caja) return;
        Array.prototype.forEach.call(panel.querySelectorAll(".md-video"), function (o) {
          o.classList.toggle("is-on", o === b);
        });
        caja.hidden = false;
        var tramo = v.start != null
          ? "#t=" + Math.round(v.start) + (v.end != null ? "," + Math.round(v.end) : "") : "";
        caja.innerHTML = v.provider === "file" || LSD.esLocal(v.url)
          ? '<video src="' + esc(mediaUrl(v.url) + tramo) + '" controls playsinline></video>'
          : '<iframe src="' + esc(LSD.embedUrl(v)) + '" title="' + esc(v.title) +
            '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
      });
    });
  }

  function renderMorfo() {
    var ciclos = morfoCiclos();
    if (!ciclos.length || !$("#morfoBarras")) return;
    if (morfoActivo >= ciclos.length) morfoActivo = 0;
    var ciclo = ciclos[morfoActivo];
    renderMorfoTabs();
    renderMorfoFases(ciclo);
    renderMorfoBarras(ciclo);
    renderMorfoDia(ciclo);
  }

  /* ================================================================
     FOOTER
     ================================================================ */
  function renderFooter() {
    var s = LSD.store.config.site;
    $("#footLogo").innerHTML = esc(s.heroLine1) + "<br>" + esc(s.heroLine2);
    $("#footNote").textContent = s.footerNote;
    $("#footAuthor").textContent = s.author + " · " + s.club;
    $("#footYear").textContent = new Date().getFullYear();
    var links = M.blocks.map(function (b) {
      return '<li><a href="#trabajos" data-block="' + b.id + '">' + esc(b.title) + '</a></li>';
    }).join("");
    $("#footBlocks").innerHTML = links;
    $$("#footBlocks a").forEach(function (el) {
      el.addEventListener("click", function () { setWorkFilter(el.getAttribute("data-block")); });
    });
    var contact = [];
    if (s.email) contact.push('<li><a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a></li>');
    if (s.instagram) contact.push('<li><a href="https://instagram.com/' + esc(s.instagram.replace(/^@/, "")) + '" target="_blank" rel="noopener">@' + esc(s.instagram.replace(/^@/, "")) + '</a></li>');
    $("#footContact").innerHTML = contact.join("") || '<li class="label">—</li>';
  }

  /* ================================================================
     NAVEGACIÓN + ORDEN DE SECCIONES
     ================================================================ */
  var SECTION_LABEL = { bloques: "Bloques", trabajos: "Trabajos", videos: "Vídeos", momentos: "Momentos", microciclo: "Microciclo" };

  function applySections() {
    var c = LSD.store.config.layout;
    var main = $("#main");
    c.sections.forEach(function (id) {
      var el = d.getElementById(id);
      if (el) main.appendChild(el);
    });
    ["bloques", "trabajos", "videos", "momentos", "microciclo"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      var off = c.hidden.indexOf(id) >= 0 || c.sections.indexOf(id) < 0;
      el.classList.toggle("hidden", off);
      el.classList.toggle("is-inverted", (c.inverted || []).indexOf(id) >= 0);
    });
    var nav = $("#nav");
    var html = ['<a href="#inicio">Inicio</a>'];
    c.sections.forEach(function (id) {
      if (c.hidden.indexOf(id) >= 0) return;
      html.push('<a href="#' + id + '">' + esc(SECTION_LABEL[id] || id) + '</a>');
    });
    nav.innerHTML = html.join("");
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("is-open"); });
    });
  }
  LSD.SECTION_LABEL = SECTION_LABEL;

  /* ================================================================
     MODALES: ficha de trabajo y reproductor
     ================================================================ */
  function openOverlay(html) {
    var ov = $("#overlay");
    ov.innerHTML = html;
    ov.classList.add("is-open");
    d.documentElement.classList.add("is-locked");
    var close = $(".modal-close", ov);
    if (close) close.focus();
  }
  function closeOverlay() {
    var ov = $("#overlay");
    ov.classList.remove("is-open");
    ov.innerHTML = "";
    d.documentElement.classList.remove("is-locked");
  }
  LSD.closeOverlay = closeOverlay;

  function openFicha(workId) {
    var x = workById(workId);
    if (!x) return;
    var it = x.item, b = x.block;
    var vids = videosOfWork(workId);
    var c = LSD.store.config;

    var ficha = [
      ["Formato", it.formato], ["Espacio", it.espacio], ["Duración", it.duracion]
    ].filter(function (r) { return r[1] && r[1] !== "\u2014"; }).map(function (r) {
      return '<div class="ficha-item"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
    }).join("");

    var claves = (it.claves || []).map(function (k) { return '<li>' + esc(k) + '</li>'; }).join("");
    var vars = (it.variantes || []).map(function (k) { return '<li>' + esc(k) + '</li>'; }).join("");
    var tags = (it.tags || []).map(function (t) { return '<b>' + esc(t) + '</b>'; }).join("");

    var vidHtml = vids.length
      ? '<div class="video-collection" data-layout="grid" data-cols="auto" data-size="sm" data-ratio="' + esc(c.video.ratio) + '" data-align="stretch" style="--cols:2;margin-top:.6rem">' +
          vids.map(function (v, i) { return videoCard(v, i); }).join("") + '</div>'
      : '<p class="label" style="line-height:1.9">Sin vídeos asociados todavía. Desde la terminal: <code>video add "Título" &lt;url&gt; --trabajo ' + esc(it.id) + '</code></p>';

    openOverlay(
      '<div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(it.name) + '">' +
        '<div class="modal-head"><div>' +
          '<div class="label" style="color:var(--accent);margin-bottom:.5rem">' + esc(b.code + " · " + b.title) + '</div>' +
          '<h3 class="modal-title">' + esc(it.name) + '</h3>' +
        '</div><button class="modal-close" aria-label="Cerrar">✕</button></div>' +
        '<div class="modal-body">' +
          '<p class="lede" style="margin-bottom:1.8rem">' + esc(it.objetivo) + '</p>' +
          '<dl class="ficha-grid">' + ficha + '</dl>' +
          (claves ? '<div class="ficha-h">Claves de ejecución</div><ul class="ficha-list">' + claves + '</ul>' : '') +
          (vars ? '<div class="ficha-h">Variantes</div><ul class="ficha-list">' + vars + '</ul>' : '') +
          (tags ? '<div class="ficha-h">Etiquetas</div><div class="video-tags">' + tags + '</div>' : '') +
          '<div class="ficha-h">Vídeos de la unidad (' + vids.length + ')</div>' + vidHtml +
        '</div></div>'
    );
    bindOverlay(vids);
  }
  LSD.openFicha = openFicha;

  function openPlayer(v) {
    openOverlay(
      '<div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(v.title) + '">' +
        '<div class="modal-head"><div>' +
          '<div class="label" style="color:var(--accent);margin-bottom:.5rem">' +
            esc((blockById(v.block) || {}).title || "Vídeo") + '</div>' +
          '<h3 class="modal-title">' + esc(v.title) + '</h3>' +
        '</div><button class="modal-close" aria-label="Cerrar">✕</button></div>' +
        '<div class="modal-player">' + playerMarkup(v, false) + '</div>' +
        (v.desc ? '<div class="modal-body"><p class="lede">' + esc(v.desc) + '</p></div>' : '') +
      '</div>'
    );
    bindOverlay([]);
  }
  LSD.openPlayer = openPlayer;

  function bindOverlay(list) {
    var ov = $("#overlay");
    var close = $(".modal-close", ov);
    if (close) close.addEventListener("click", closeOverlay);
    ov.addEventListener("click", function (e) { if (e.target === ov) closeOverlay(); });
    $$(".video-card", ov).forEach(function (el) {
      el.addEventListener("click", function () {
        var v = list[parseInt(el.getAttribute("data-i"), 10)];
        if (!v) return;
        var t = $(".video-thumb", el);
        if (t && !t.classList.contains("is-live")) { t.classList.add("is-live"); t.innerHTML = playerMarkup(v, false); }
      });
    });
  }

  /* ================================================================
     REVEAL EN SCROLL
     ================================================================ */
  var io = null;
  LSD.observeReveal = function () {
    if (!("IntersectionObserver" in w)) {
      $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    }
    $$(".reveal:not(.is-in)").forEach(function (el) { io.observe(el); });
  };

  /* ================================================================
     RENDER COMPLETO
     ================================================================ */
  LSD.renderAll = function () {
    applyTheme();
    applySections();
    renderHero();
    renderMarquee();
    renderBlocks();
    renderWorkFilters();
    renderWorks();
    renderVideoFilters();
    renderVideos();
    renderMomentos();
    renderMicro();
    renderMorfo();
    renderFooter();
    LSD.observeReveal();
  };
})(window, document);
