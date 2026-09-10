/* =============================================================
   cv.js — pinta la página del CV
   -------------------------------------------------------------
   Lee tres archivos de datos y los convierte en la página:
     data/cv.js           → la persona, la trayectoria, la ficha
     data/config.js       → los vídeos y las fotos ya cargados
     data/methodology.js  → el recuento de bloques y unidades

   No guarda nada ni pide nada a ningún servidor.
   ============================================================= */
(function () {
  "use strict";

  var d = document;
  var $  = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  var CV  = window.LSD_CV || {};
  var CFG = window.LSD_CONFIG || {};
  var MET = window.LSD_METHODOLOGY || {};

  var P = CV.persona || {};

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function hay(v) { return v != null && String(v).trim() !== ""; }

  /* Un dato que todavía no mandó: se marca, no se inventa. */
  var PENDIENTE = '<span class="cv-pendiente">Por completar</span>';

  /* ================================================================
     PORTADA
     ================================================================ */
  function portada() {
    var nombre = P.nombre || "";
    var apellido = P.apellido || "";

    $("#cvNombre").textContent = nombre;
    $("#cvApellido").textContent = apellido;
    $("#cvGhost").textContent = apellido;
    $("#cvRol").textContent = P.rol || "";
    $("#cvBandera").textContent = P.pais || "";
    d.title = (nombre + " " + apellido).trim() + " · " + (P.rol || "CV");

    var badge = $("#cvClubBadge");
    if (hay(P.club)) badge.textContent = P.club; else badge.remove();

    var foto = $("#cvHeroFoto");
    if (hay(P.portada)) {
      foto.src = P.portada;
      foto.alt = (nombre + " " + apellido).trim();
      /* Un recorte en PNG se para sobre el fondo; una foto normal se usa
         de fondo y se apaga con un degradado. */
      if (P.recorte) $(".cv-hero").classList.add("is-recorte");
      if (hay(P.foco)) foto.style.objectPosition = "center " + P.foco;
    } else { foto.remove(); }

    /* En la barra va el primer plano; si no hay, sirve el retrato grande. */
    var cara = $("#cvFace");
    var chica = hay(P.avatar) ? P.avatar : P.retrato;
    if (hay(chica)) { cara.src = chica; cara.alt = ""; }
    else { var f = $(".cv-pill-face"); if (f) f.remove(); }

    /* El sello de arriba a la derecha: el vídeo más nuevo marca la fecha. */
    var fechas = (CFG.media && CFG.media.videos || []).map(function (v) { return v.added; }).filter(Boolean).sort();
    var ultima = fechas[fechas.length - 1];
    var MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    if (ultima) {
      var p = ultima.split("-");
      $("#cvStamp").textContent = MES[Number(p[1]) - 1] + " " + p[0];
    } else {
      var hoy = new Date();
      $("#cvStamp").textContent = MES[hoy.getMonth()] + " " + hoy.getFullYear();
    }
  }

  /* ================================================================
     BIO
     ================================================================ */
  function bio() {
    var nombre = P.nombre || "", apellido = P.apellido || "";
    $("#cvNombreGrande").innerHTML = esc(nombre) + "<br>" + esc(apellido);
    $("#cvRol2").textContent = P.rol || "";
    $("#cvFlags").textContent = P.pais || "";
    $("#cvPieNombre").textContent = (nombre + " " + apellido).trim();

    var r = $("#cvRetrato");
    if (hay(P.retrato)) { r.src = P.retrato; r.alt = (nombre + " " + apellido).trim(); } else { r.remove(); }

    /* Enlaces: sólo los que tienen valor. */
    var links = [];

    /* WhatsApp primero, que es por donde lo van a buscar. wa.me sólo acepta
       dígitos: ni el «+», ni espacios, ni guiones. */
    var wa = P.whatsapp === true ? P.telefono : P.whatsapp;
    if (hay(wa)) {
      links.push('<a class="es-wa" href="https://wa.me/' + String(wa).replace(/\D/g, "") +
        '" target="_blank" rel="noopener">WhatsApp</a>');
    }

    if (hay(P.instagram)) links.push(['<a href="' + esc(P.instagram) + '" target="_blank" rel="noopener">Instagram</a>']);
    if (hay(P.linkedin))  links.push(['<a href="' + esc(P.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>']);
    if (hay(P.mail))      links.push(['<a href="mailto:' + esc(P.mail) + '">Mail</a>']);
    if (hay(P.telefono))  links.push(['<a href="tel:' + esc(String(P.telefono).replace(/[^\d+]/g, "")) + '">Teléfono</a>']);
    var caja = $("#cvLinks");
    if (links.length) caja.innerHTML = links.join(""); else caja.remove();

    var texto = $("#cvBio");
    if (hay(CV.bio)) {
      texto.innerHTML = String(CV.bio).split(/\n{2,}/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    } else {
      texto.innerHTML = "<p>" + PENDIENTE + "</p>";
    }

    /* Formación: si no hay nada, la tarjeta entera no aparece. */
    var estudios = CV.formacion || [];
    if (estudios.length) {
      $("#cvEstudiosCaja").hidden = false;
      $("#cvFormacion").innerHTML = estudios.map(function (f) {
        var pie = [f.casa, f.anio].filter(hay).join(" · ");
        return '<li>' +
          (f.tipo ? '<span class="tipo' + (f.tipo === "titulo" ? " es-titulo" : "") + '">' +
            (f.tipo === "titulo" ? "Título" : "Curso") + '</span>' : '') +
          '<span class="t">' + esc(f.titulo) + '</span>' +
          (pie ? '<span class="c">' + esc(pie) + '</span>' : '') +
          (hay(f.detalle) ? '<span class="d">' + esc(f.detalle) + '</span>' : '') +
          '</li>';
      }).join("");
    }

    $("#cvFicha").innerHTML = (CV.ficha || []).map(function (f) {
      /* `icono: "escudo"` pone el escudo del club antes del valor. Si el
         archivo no está, la imagen se saca y no queda ningún hueco. */
      var icono = (f.icono === "escudo" && hay(P.escudo))
        ? '<img class="cv-dato-escudo" src="' + esc(P.escudo) + '" alt="" onerror="this.remove()">' : '';
      return '<div class="cv-dato">' +
        '<span class="k">' + esc(f.label) + '</span>' +
        '<span class="v">' + icono + (hay(f.valor) ? esc(f.valor) : PENDIENTE) + '</span>' +
        (hay(f.nota) ? '<span class="n">' + esc(f.nota) + '</span>' : '') +
        '</div>';
    }).join("");
  }

  /* ================================================================
     MÉTODO — los números salen del propio archivo del sitio
     ================================================================ */
  function metodo() {
    var bloques = MET.blocks || MET.bloques || [];
    var unidades = bloques.reduce(function (s, b) { return s + ((b.items || []).length); }, 0);
    var ciclos = (MET.morfociclos || []).length;
    var videos = (CFG.media && CFG.media.videos || []).length;

    var m = [
      [bloques.length, "Bloques"],
      [unidades, "Unidades de trabajo"],
      [ciclos, ciclos === 1 ? "Morfociclo" : "Morfociclos"],
      [videos, "Vídeos en el archivo"]
    ].filter(function (x) { return x[0] > 0; });

    $("#cvMetricas").innerHTML = m.map(function (x) {
      return '<div class="cv-metrica"><span class="n">' + x[0] + '</span><span class="k">' + esc(x[1]) + '</span></div>';
    }).join("");

    var areas = (CV.areas || []).slice();
    /* Si no hay lista propia, se usan los nombres cortos de los bloques. */
    if (!areas.length) areas = bloques.map(function (b) { return b.short || b.name; });
    $("#cvAreas").innerHTML = areas.map(function (a) {
      return '<span class="cv-chip">' + esc(a) + '</span>';
    }).join("");
  }

  /* ================================================================
     TRAYECTORIA
     ================================================================ */
  var etapas = [];

  function ordenarEtapas() {
    etapas = (CV.trayectoria || []).slice().sort(function (a, b) {
      var x = a.desde == null ? Infinity : a.desde;
      var y = b.desde == null ? Infinity : b.desde;
      return x - y;
    });
  }

  function rotulo(e) {
    var enCurso = e.actual || (e.hasta === null && e.desde != null);
    var anios;
    if (hay(e.desde) && hay(e.hasta)) anios = e.desde === e.hasta ? String(e.desde) : e.desde + " – " + e.hasta;
    else if (hay(e.desde)) anios = String(e.desde);
    else if (hay(e.hasta)) anios = String(e.hasta);
    else anios = enCurso ? "" : "Sin fecha";

    /* Año · etapa · Actual, en ese orden: «2026 · 3ª etapa · Actual». */
    var partes = [];
    if (anios) partes.push(anios);
    if (hay(e.etapa)) partes.push(e.etapa);
    if (enCurso) partes.push("Actual");
    return partes.join(" · ");
  }

  /* ¿Toda la carrera en el mismo club? Entonces repetir el nombre del club
     debajo de cada punto de la línea no dice nada: va el cuerpo técnico. */
  /* Cada etapa puede traer su escudo; si no, sirve el del club de la persona. */
  function escudoDe(e) {
    return hay(e.escudo) ? e.escudo : (P.escudo || "");
  }

  function unSoloClub() {
    var primero = (etapas[0] || {}).club;
    return etapas.length > 1 && etapas.every(function (e) { return e.club === primero; });
  }

  function pintarEtapa(i) {
    var e = etapas[i];
    var caja = $("#cvEtapa");
    if (!e) { caja.innerHTML = '<div class="cv-card cv-etapa-vacia">Todavía no hay etapas cargadas.</div>'; return; }

    var datos = (e.datos || []).map(function (dd) {
      return '<div class="cv-etapa-dato"><span class="k">' + esc(dd.k || dd.label) + '</span>' +
             '<span class="n">' + esc(dd.n != null ? dd.n : dd.valor) + '</span></div>';
    }).join("");

    var logros = (e.logros || []).map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("");

    var tareas = (e.tareas || []).map(function (t) {
      return '<span class="cv-chip">' + esc(t) + '</span>';
    }).join("");

    caja.innerHTML =
      '<article class="cv-card cv-etapa-card">' +
        (hay(escudoDe(e)) ? '<img class="cv-etapa-escudo" src="' + esc(escudoDe(e)) + '" alt="" onerror="this.remove()">' : '') +
        '<span class="cv-etapa-badge' + (e.actual ? ' actual' : '') + '">' + esc(rotulo(e)) + '</span>' +
        '<h3 class="cv-etapa-club">' + esc(e.club || "—") + '</h3>' +
        '<p class="cv-etapa-liga">' +
          (hay(e.rol) ? '<span>' + esc(e.rol) + '</span>' : '') +
          (hay(e.liga) ? '<span>·</span><span>' + esc(e.liga) + '</span>' : '') +
          (hay(e.cuerpo) ? '<span>·</span><span>' + esc(e.cuerpo) + '</span>' : '') +
        '</p>' +
        (datos ? '<div class="cv-etapa-datos">' + datos + '</div>' : '') +
        (tareas ? '<p class="cv-etapa-h">A cargo de</p><div class="cv-chips left">' + tareas + '</div>' : '') +
        (logros ? '<ul class="cv-etapa-logros">' + logros + '</ul>' : '') +
        (hay(e.nota) ? '<p class="cv-etapa-nota">' + esc(e.nota) + '</p>' : '') +
      '</article>';

    var hitos = $$("#cvLinea .cv-hito");
    hitos.forEach(function (b, j) {
      var on = j === i;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    medirLinea(hitos[i]);
  }

  /* El ancho total de la línea y hasta dónde llega el tramo iluminado.
     Van como variables CSS porque el contenido es más ancho que la ventana. */
  function medirLinea(activo) {
    var linea = $("#cvLinea");
    if (!linea) return;
    linea.style.setProperty("--ancho", linea.scrollWidth + "px");
    if (activo) linea.style.setProperty("--avance", (activo.offsetLeft + activo.offsetWidth / 2) + "px");
  }

  function pintarLinea() {
    var linea = $("#cvLinea");
    var mismoClub = unSoloClub();
    linea.innerHTML = etapas.map(function (e, i) {
      var anio = hay(e.desde) ? e.desde : (e.actual ? "Hoy" : "—");
      var pie = mismoClub ? (e.cuerpo || e.liga || e.rol || "") : (e.club || "");
      /* «Cuerpo técnico de X» es demasiado largo debajo de un punto. */
      pie = String(pie).replace(/^Cuerpo t[ée]cnico de\s+/i, "");
      return '<button class="cv-hito" role="tab" data-i="' + i + '" aria-selected="false" tabindex="-1">' +
        '<span class="punto" aria-hidden="true"></span>' +
        '<span class="anio">' + esc(anio) + '</span>' +
        '<span class="club">' + esc(pie) + '</span>' +
        (hay(escudoDe(e)) ? '<img class="escudo" src="' + esc(escudoDe(e)) + '" alt="" onerror="this.remove()">' : '') +
        '</button>';
    }).join("");

    linea.addEventListener("click", function (ev) {
      var b = ev.target.closest(".cv-hito");
      if (b) pintarEtapa(Number(b.dataset.i));
    });

    /* Flechas para moverse por la línea sin el ratón. */
    linea.addEventListener("keydown", function (ev) {
      if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
      var b = ev.target.closest(".cv-hito");
      if (!b) return;
      ev.preventDefault();
      var i = Number(b.dataset.i) + (ev.key === "ArrowRight" ? 1 : -1);
      if (i < 0 || i >= etapas.length) return;
      pintarEtapa(i);
      var nuevo = $$("#cvLinea .cv-hito")[i];
      nuevo.focus();
      nuevo.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
  }

  function trayectoria() {
    ordenarEtapas();
    pintarLinea();
    /* Arranca en la etapa actual, o en la última. */
    var i = etapas.findIndex(function (e) { return e.actual; });
    if (i < 0) i = etapas.length - 1;
    pintarEtapa(i);

    /* Con muchas etapas el punto activo cae fuera de la vista. Se corre la
       línea a mano —no con scrollIntoView— para no mover la página. */
    var linea = $("#cvLinea");
    var act = $$("#cvLinea .cv-hito")[i];
    if (linea && act) linea.scrollLeft = act.offsetLeft - (linea.clientWidth - act.offsetWidth) / 2;

    /* Al cambiar el ancho de la ventana los puntos se recolocan. */
    window.addEventListener("resize", function () {
      medirLinea($(".cv-hito.is-active", linea));
    });
  }

  /* ================================================================
     VÍDEOS
     ================================================================ */
  function miniatura(v) {
    if (hay(v.poster)) return esc(v.poster);
    if (v.provider === "youtube" && hay(v.vid)) return "https://i.ytimg.com/vi/" + esc(v.vid) + "/hqdefault.jpg";
    return "";
  }

  function videos() {
    var lista = (CFG.media && CFG.media.videos || []).slice();
    /* Primero los destacados, después los más nuevos. */
    lista.sort(function (a, b) {
      if (!!b.featured - !!a.featured) return !!b.featured - !!a.featured;
      return String(b.added || "").localeCompare(String(a.added || ""));
    });
    lista = lista.slice(0, 6);

    $("#cvVideosCuenta").textContent = (CFG.media && CFG.media.videos || []).length + " tareas grabadas";

    $("#cvVideos").innerHTML = lista.map(function (v) {
      var mini = miniatura(v);
      var etiquetas = (v.tags || []).slice(0, 3).join(" · ");
      return '<button class="cv-video" data-vid="' + esc(v.vid || "") + '" data-url="' + esc(v.url || "") + '" data-t="' + esc(v.title) + '">' +
        /* Si la miniatura no llega, se saca y queda la caja con el triángulo. */
        '<span class="cv-video-mini">' + (mini ? '<img src="' + mini + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '</span>' +
        '<span><span class="cv-video-t">' + esc(v.title) + '</span>' +
        (etiquetas ? '<span class="cv-video-k">' + esc(etiquetas) + '</span>' : '') + '</span>' +
        (hay(v.dia) ? '<span class="cv-video-dia">' + esc(v.dia) + '</span>' : '<span></span>') +
        '</button>';
    }).join("");

    $("#cvVideos").addEventListener("click", function (ev) {
      var b = ev.target.closest(".cv-video");
      if (!b) return;
      var vid = b.dataset.vid;
      if (vid) {
        abrirCaja(
          '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(vid) + '?autoplay=1&rel=0" ' +
          'title="' + esc(b.dataset.t) + '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" ' +
          'allowfullscreen></iframe>', b.dataset.t);
      } else if (b.dataset.url) {
        window.open(b.dataset.url, "_blank", "noopener");
      }
    });
  }

  /* ================================================================
     GALERÍA
     ================================================================ */
  function galeria() {
    var fotos = (CV.galeria && CV.galeria.length) ? CV.galeria : ((CFG.media && CFG.media.gallery) || []);
    $("#cvGaleriaCuenta").textContent = String(fotos.length).padStart(2, "0") + " capturas";

    $("#cvGaleria").innerHTML = fotos.map(function (f, i) {
      return '<button class="cv-foto" data-src="' + esc(f.src) + '" data-pie="' + esc(f.pie || "") + '">' +
        '<img src="' + esc(f.src) + '" alt="' + esc(f.pie || "") + '" loading="lazy">' +
        '<span class="cv-foto-n">' + String(i + 1).padStart(2, "0") + '</span>' +
        (hay(f.pie) ? '<span class="cv-foto-pie">' + esc(f.pie) + '</span>' : '') +
        '</button>';
    }).join("");

    $("#cvGaleria").addEventListener("click", function (ev) {
      var b = ev.target.closest(".cv-foto");
      if (!b) return;
      abrirCaja('<img src="' + esc(b.dataset.src) + '" alt="' + esc(b.dataset.pie) + '">', b.dataset.pie);
    });
  }

  /* ================================================================
     LIGHTBOX
     ================================================================ */
  var ultimoFoco = null;

  function abrirCaja(html, pie) {
    var lb = $("#cvLightbox");
    ultimoFoco = d.activeElement;
    lb.innerHTML =
      '<button class="cv-lightbox-cerrar" aria-label="Cerrar">×</button>' +
      '<div class="cv-lightbox-caja">' + html +
      (hay(pie) ? '<p class="cv-lightbox-pie">' + esc(pie) + '</p>' : '') + '</div>';
    lb.hidden = false;
    d.documentElement.style.overflow = "hidden";
    $(".cv-lightbox-cerrar", lb).focus();
  }

  function cerrarCaja() {
    var lb = $("#cvLightbox");
    if (lb.hidden) return;
    lb.hidden = true;
    lb.innerHTML = "";           /* corta la reproducción */
    d.documentElement.style.overflow = "";
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  d.addEventListener("click", function (ev) {
    var lb = $("#cvLightbox");
    if (lb.hidden) return;
    if (ev.target === lb || ev.target.closest(".cv-lightbox-cerrar")) cerrarCaja();
  });
  d.addEventListener("keydown", function (ev) { if (ev.key === "Escape") cerrarCaja(); });

  /* ================================================================
     NAVEGACIÓN
     ================================================================ */
  function navegacion() {
    var pill = $("#cvPill") || $(".cv-pill");
    var burger = $("#cvBurger");

    burger.addEventListener("click", function () { pill.classList.toggle("is-open"); });
    pill.addEventListener("click", function (ev) {
      if (ev.target.closest("a")) pill.classList.remove("is-open");
    });

    /* La pestaña activa sigue al scroll. */
    var enlaces = $$('.cv-pill a[href^="#"]');
    var mapa = {};
    enlaces.forEach(function (a) { mapa[a.getAttribute("href").slice(1)] = a; });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        enlaces.forEach(function (a) { a.classList.remove("is-active"); });
        var a = mapa[e.target.id];
        if (a) a.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(mapa).forEach(function (id) {
      var s = d.getElementById(id);
      if (s) obs.observe(s);
    });

    /* Compartir: el menú del sistema si existe, y si no, copiar el enlace. */
    $("#cvShare").addEventListener("click", function () {
      var datos = { title: d.title, url: location.href };
      if (navigator.share) { navigator.share(datos).catch(function () {}); return; }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(location.href).then(function () {
          var b = $("#cvShare");
          b.style.color = "var(--cv-cyan)";
          setTimeout(function () { b.style.color = ""; }, 1200);
        });
      }
    });
  }

  /* ================================================================
     APARICIÓN AL ENTRAR
     ================================================================ */
  function aparecer() {
    var piezas = $$(".cv-sec .cv-wrap > *, .cv-card, .cv-video, .cv-foto");
    piezas.forEach(function (el) { el.classList.add("reveal"); });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        obs.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    piezas.forEach(function (el) { obs.observe(el); });
  }

  /* ================================================================
     ARRANQUE
     ================================================================ */
  portada();
  bio();
  metodo();
  trayectoria();
  videos();
  galeria();
  navegacion();
  aparecer();
})();
