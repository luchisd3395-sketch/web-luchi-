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
    s.setProperty("--radius", t.radius + "px");
    s.setProperty("--grid-gap", c.video.gap + "px");
    s.setProperty("--term-height", c.terminal.height + "vh");

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

  function renderHero() {
    var c = LSD.store.config, s = c.site;
    var nWorks = allWorks().length;
    var hm = $("#heroMedia");
    if (hm) {
      var hi = safeUrl(s.heroImage);
      hm.innerHTML = hi ? '<img src="' + esc(hi) + '" alt="" loading="eager">' : "";
    }
    $("#heroEyebrow").textContent = s.role;
    $("#heroL1").textContent = s.heroLine1;
    $("#heroL2").textContent = s.heroLine2;
    $("#heroL3").textContent = s.heroLine3;
    $("#heroIntro").textContent = s.intro;
    $("#heroStats").innerHTML = [
      stat(M.blocks.length, "Bloques metodológicos"),
      stat(nWorks, "Unidades de trabajo"),
      stat(videos().length, "Vídeos en el archivo"),
      stat(M.microcycle.length, "Días de microciclo")
    ].join("");
    $("#brandName").textContent = s.author;
    $("#brandSub").textContent = s.title;
    $("#brandMark").textContent = initials(s.author);
    d.title = s.title + " · " + s.author;
  }
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
      var img = safeUrl(imgs[b.id]);
      return '<button class="block-card reveal' + (img ? " has-img" : "") + '" data-block="' + b.id + '">' +
        (img ? '<span class="bc-img" style="background-image:url(&quot;' + esc(img) + '&quot;)"></span>' : "") +
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
    var thumb = LSD.thumbUrl(v) || LSD.placeholder(v.title, c.theme.accent, c.theme.surface, c.theme.muted);
    var b = blockById(v.block);
    var live = opts.live;
    var inner;
    if (live) {
      inner = '<div class="video-thumb is-live">' + playerMarkup(v, true) + '</div>';
    } else {
      inner = '<div class="video-thumb">' +
        '<img src="' + esc(thumb) + '" alt="' + esc(v.title) + '" loading="lazy" ' +
        'onerror="this.onerror=null;this.src=\'' + LSD.placeholder(v.title, c.theme.accent, c.theme.surface, c.theme.muted).replace(/'/g, "%27") + '\'">' +
        (v.featured ? '<span class="video-badge">Destacado</span>' : '') +
        '<span class="play-btn" aria-hidden="true">' +
          '<svg width="17" height="19" viewBox="0 0 17 19" fill="currentColor"><path d="M0 0l17 9.5L0 19V0z"/></svg>' +
        '</span>' +
        (v.duration ? '<span class="video-dur">' + esc(v.duration) + '</span>' : '') +
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
      return '<video src="' + esc(v.url) + '" controls playsinline ' +
        (opts.autoplay ? "autoplay " : "") + (c.muted ? "muted " : "") + (c.loop ? "loop " : "") +
        (v.poster ? 'poster="' + esc(v.poster) + '" ' : "") + 'style="width:100%;height:100%;object-fit:contain;background:#000"></video>';
    }
    return '<iframe src="' + esc(LSD.embedUrl(v, opts)) + '" title="' + esc(v.title) +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>';
  }
  LSD.playerMarkup = playerMarkup;

  function renderVideos() {
    var c = LSD.store.config, cfg = c.video;
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
      host.innerHTML = videoCard(main, idx, { live: true });
      strip.innerHTML = list.map(function (v, i) {
        var th = LSD.thumbUrl(v) || LSD.placeholder(v.title, c.theme.accent, c.theme.surface, c.theme.muted);
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
    host.innerHTML = list.map(function (v, i) { return videoCard(v, i); }).join("");
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
     MICROCICLO
     ================================================================ */
  function renderMicro() {
    $("#microBody").innerHTML = M.microcycle.map(function (r) {
      return '<tr><td class="md">' + esc(r.day) + '</td><td>' + esc(r.tipo) + '</td>' +
        '<td class="muted">' + esc(r.foco) + '</td>' +
        '<td class="muted">' + esc(r.contenidos) + '</td>' +
        '<td style="white-space:nowrap">' + esc(r.dur) + '</td>' +
        '<td><span class="load-bar" style="width:' + (r.carga * 0.9) + 'px"></span> <span class="muted">' + r.carga + '%</span></td></tr>';
    }).join("");
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
  var SECTION_LABEL = { bloques: "Bloques", trabajos: "Trabajos", videos: "Vídeos", microciclo: "Microciclo" };

  function applySections() {
    var c = LSD.store.config.layout;
    var main = $("#main");
    c.sections.forEach(function (id) {
      var el = d.getElementById(id);
      if (el) main.appendChild(el);
    });
    ["bloques", "trabajos", "videos", "microciclo"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      var off = c.hidden.indexOf(id) >= 0 || c.sections.indexOf(id) < 0;
      el.classList.toggle("hidden", off);
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
    renderMicro();
    renderFooter();
    LSD.observeReveal();
  };
})(window, document);
