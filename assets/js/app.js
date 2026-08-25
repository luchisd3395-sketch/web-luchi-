/* =============================================================
   app.js — arranque de la aplicación
   ============================================================= */
(function (w, d) {
  "use strict";
  var LSD = w.LSD;

  /* ---------- Avisos flotantes ---------- */
  LSD.toast = function (msg, kind) {
    var stack = d.getElementById("toastStack");
    if (!stack) return;
    var t = d.createElement("div");
    t.className = "toast " + (kind || "");
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .35s, transform .35s";
      t.style.opacity = "0";
      t.style.transform = "translateX(20px)";
      setTimeout(function () { t.remove(); }, 380);
    }, 2600);
  };

  /* Comprueba si la tipografía de titulares llegó a cargar de verdad.
     No sirve document.fonts.check(): devuelve true tratando el nombre
     como fuente del sistema cuando la hoja de Google Fonts no llega.
     Se mide el ancho de un texto y se compara con el de la alternativa. */
  function fontLoaded(name) {
    try {
      var ctx = d.createElement("canvas").getContext("2d");
      var probe = "MMMWWWmmmwww0123456789";
      var refs = ["monospace", "serif"];
      for (var i = 0; i < refs.length; i++) {
        ctx.font = '72px ' + refs[i];
        var base = ctx.measureText(probe).width;
        ctx.font = '72px "' + name + '", ' + refs[i];
        if (ctx.measureText(probe).width !== base) return true;
      }
      return false;
    } catch (e) { return false; }
  }

  function checkDisplayFont() {
    var root = d.documentElement;
    var mark = function () { root.setAttribute("data-anton", fontLoaded("Anton") ? "on" : "off"); };
    mark();
    if (d.fonts && d.fonts.ready && d.fonts.ready.then) d.fonts.ready.then(mark).catch(mark);
    setTimeout(mark, 1500);
    setTimeout(mark, 4000);
  }

  function boot() {
    LSD.store.init();
    checkDisplayFont();
    LSD.renderAll();
    LSD.term.mount();

    /* Re-render ante cualquier cambio de configuración */
    var raf = null;
    LSD.store.on(function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { LSD.renderAll(); });
    });

    /* Cabecera: fondo al hacer scroll + ocultar al bajar */
    var header = d.querySelector(".site-header");
    var last = 0;
    w.addEventListener("scroll", function () {
      var y = w.scrollY || w.pageYOffset;
      header.classList.toggle("is-stuck", y > 40);
      if (LSD.store.get("layout.nav") === "top") {
        header.classList.toggle("is-hidden", y > last && y > 420 && !LSD.term.isOpen());
      } else {
        header.classList.remove("is-hidden");
      }
      var fab = d.getElementById("termFab");
      if (fab) fab.classList.toggle("is-away", y < 320 && w.innerWidth > 680);
      last = y;
      markActive();
    }, { passive: true });

    /* Enlace activo en la navegación */
    function markActive() {
      var y = (w.scrollY || 0) + 140;
      var ids = ["inicio"].concat(LSD.store.get("layout.sections"));
      var current = ids[0];
      ids.forEach(function (id) {
        var el = d.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      });
      LSD.$$("#nav a").forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
      });
    }

    /* Menú móvil */
    var toggle = d.getElementById("navToggle");
    if (toggle) toggle.addEventListener("click", function () {
      d.getElementById("nav").classList.toggle("is-open");
    });

    /* Botón de la portada */
    var cta = d.getElementById("heroCta");
    if (cta) cta.addEventListener("click", function () {
      var el = d.getElementById("bloques");
      if (el) el.scrollIntoView({ behavior: LSD.store.get("theme.motion") ? "smooth" : "auto" });
    });

    var fab0 = d.getElementById("termFab");
    if (fab0 && (w.scrollY || 0) < 320 && w.innerWidth > 680) fab0.classList.add("is-away");
    markActive();
    if (w.console && w.console.log) {
      w.console.log("%cLSD//CONSOLE", "background:#d8ff3e;color:#0a0d08;padding:2px 8px;font-weight:700");
      w.console.log("Pulsá la tecla ` (o el botón TERMINAL) para abrir la consola de configuración.");
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
