/* =============================================================
   terminal.js — motor de la consola LSD//CONSOLE
   ============================================================= */
(function (w, d) {
  "use strict";
  var LSD = w.LSD = w.LSD || {};
  var esc = LSD.esc;

  var el = {};          // referencias del DOM
  var registry = [];    // comandos
  var byName = {};      // índice nombre/alias -> comando
  var history = [];
  var hIndex = -1;
  var sugItems = [];
  var sugIndex = -1;
  var unlocked = false;

  /* ---------------------------------------------------------
     Registro de comandos
     --------------------------------------------------------- */
  function deaccent(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  LSD.deaccent = deaccent;

  var term = LSD.term = {
    register: function (cmd) {
      registry.push(cmd);
      [cmd.name].concat(cmd.alias || []).forEach(function (n) { byName[deaccent(n)] = cmd; });
      return cmd;
    },
    commands: function () { return registry; },
    find: function (n) { return byName[deaccent(n)]; },

    /* ---------- salida ---------- */
    print: function (text, cls) {
      var line = d.createElement("div");
      line.className = "t-line " + (cls || "t-info");
      line.textContent = text;
      el.out.appendChild(line);
      term.scroll();
      return line;
    },
    html: function (markup) {
      var line = d.createElement("div");
      line.className = "t-line";
      line.innerHTML = markup;
      el.out.appendChild(line);
      term.scroll();
      return line;
    },
    ok:   function (t) { return term.print("✔ " + t, "t-ok"); },
    err:  function (t) { return term.print("✖ " + t, "t-err"); },
    warn: function (t) { return term.print("▲ " + t, "t-warn"); },
    dim:  function (t) { return term.print(t, "t-dim"); },
    head: function (t) { return term.print(t, "t-head"); },
    space: function () { var s = d.createElement("div"); s.className = "t-spacer"; el.out.appendChild(s); },

    /** Tabla de dos columnas: [[clave, valor], ...] */
    table: function (rows) {
      var html = '<div class="t-table">' + rows.map(function (r) {
        return '<div class="k">' + esc(r[0]) + '</div><div class="v">' + esc(r[1]) + '</div>';
      }).join("") + '</div>';
      return term.html(html);
    },

    /** Fila de sugerencias clicables que rellenan la entrada. */
    chips: function (values, prefix) {
      var html = '<div class="t-chipline">' + values.map(function (v) {
        return '<b data-fill="' + esc((prefix || "") + v) + '">' + esc(v) + '</b>';
      }).join("") + '</div>';
      var node = term.html(html);
      Array.prototype.forEach.call(node.querySelectorAll("b[data-fill]"), function (b) {
        b.addEventListener("click", function () {
          el.input.value = b.getAttribute("data-fill");
          el.input.focus();
          updateGhost();
        });
      });
      return node;
    },

    scroll: function () { el.out.scrollTop = el.out.scrollHeight; },
    clear: function () { el.out.innerHTML = ""; },

    /* ---------- control ---------- */
    open: function () {
      el.root.classList.add("is-open");
      el.fab.classList.add("is-hidden");
      checkLock();
      if (unlocked) setTimeout(function () { el.input.focus(); }, 120);
    },
    close: function () {
      el.root.classList.remove("is-open");
      el.fab.classList.remove("is-hidden");
      el.input.blur();
    },
    toggle: function () { el.root.classList.contains("is-open") ? term.close() : term.open(); },
    isOpen: function () { return el.root.classList.contains("is-open"); },
    focus: function () { el.input.focus(); },
    setInput: function (v) { el.input.value = v; updateGhost(); el.input.focus(); },

    run: function (raw) { return execute(raw); }
  };

  /* ---------------------------------------------------------
     Parser de argumentos: respeta comillas y admite --opciones
     --------------------------------------------------------- */
  function tokenize(str) {
    var out = [], cur = "", q = null, i, ch;
    for (i = 0; i < str.length; i++) {
      ch = str[i];
      if (q) {
        if (ch === q) { q = null; }
        else if (ch === "\\" && str[i + 1] === q) { cur += q; i++; }
        else cur += ch;
      } else if (ch === '"' || ch === "'" || ch === "\u201C" || ch === "\u201D") {
        q = (ch === "\u201C") ? "\u201D" : ch;
      } else if (/\s/.test(ch)) {
        if (cur) { out.push(cur); cur = ""; }
      } else cur += ch;
    }
    if (cur) out.push(cur);
    return out;
  }
  LSD.tokenize = tokenize;

  function parseArgs(tokens) {
    var args = [], flags = {}, i, t, name, val;
    for (i = 0; i < tokens.length; i++) {
      t = tokens[i];
      if (t.indexOf("--") === 0 && t.length > 2) {
        name = deaccent(t.slice(2));
        if (name.indexOf("=") > 0) {
          val = name.slice(name.indexOf("=") + 1);
          name = name.slice(0, name.indexOf("="));
          flags[name] = val;
        } else if (tokens[i + 1] !== undefined && tokens[i + 1].indexOf("--") !== 0) {
          flags[name] = tokens[++i];
        } else {
          flags[name] = true;
        }
      } else {
        args.push(t);
      }
    }
    return { args: args, flags: flags };
  }
  LSD.parseArgs = parseArgs;

  /* ---------------------------------------------------------
     Ejecución
     --------------------------------------------------------- */
  function execute(raw) {
    var line = String(raw || "").trim();
    if (!line) return;

    term.html('<div class="t-line t-cmd"><span class="t-prompt">lsd ❯</span> ' + esc(line) + '</div>');

    if (history[history.length - 1] !== line) history.push(line);
    if (history.length > 200) history.shift();
    hIndex = history.length;

    // Varios comandos separados por " ; "
    if (line.indexOf(";") > 0 && !/["']/.test(line)) {
      line.split(";").forEach(function (part) {
        part = part.trim();
        if (part) dispatch(part);
      });
      return;
    }
    dispatch(line);
  }

  function dispatch(line) {
    var tokens = tokenize(line);
    var name = tokens.shift();
    var cmd = term.find(name);
    if (!cmd) {
      var near = suggestNear(name);
      term.err('Comando desconocido: «' + name + '»');
      if (near.length) {
        term.dim("¿Quisiste decir?");
        term.chips(near);
      } else {
        term.dim("Escribí `ayuda` para ver todos los comandos.");
      }
      return;
    }
    var pa = parseArgs(tokens);
    try {
      cmd.run(pa.args, pa.flags, line);
    } catch (e) {
      term.err("Error al ejecutar: " + (e && e.message ? e.message : e));
      if (w.console) console.error(e);
    }
  }

  function suggestNear(name) {
    var n = deaccent(name);
    return Object.keys(byName).filter(function (k) {
      return k.indexOf(n.slice(0, 3)) === 0 || n.indexOf(k.slice(0, 3)) === 0;
    }).slice(0, 6);
  }

  /* ---------------------------------------------------------
     Autocompletado
     --------------------------------------------------------- */
  function completions(value) {
    var tokens = value.split(/\s+/);
    var head = tokens[0] || "";
    var out = [];

    if (tokens.length <= 1) {
      registry.forEach(function (c) {
        if (deaccent(c.name).indexOf(deaccent(head)) === 0) out.push({ name: c.name, desc: c.desc });
      });
      if (!out.length) {
        registry.forEach(function (c) {
          (c.alias || []).forEach(function (a) {
            if (deaccent(a).indexOf(deaccent(head)) === 0) out.push({ name: a, desc: c.desc });
          });
        });
      }
      return out.slice(0, 12);
    }

    var cmd = term.find(head);
    if (cmd && typeof cmd.complete === "function") {
      var partial = tokens[tokens.length - 1];
      var prev = tokens.slice(0, -1);
      var list = cmd.complete(prev.slice(1), partial) || [];
      return list.filter(function (x) {
        return deaccent(String(x.name != null ? x.name : x)).indexOf(deaccent(partial)) === 0;
      }).map(function (x) {
        return (x && x.name != null) ? x : { name: String(x), desc: "" };
      }).slice(0, 14);
    }
    return [];
  }

  function renderSug() {
    var v = el.input.value;
    sugItems = v.trim() ? completions(v) : [];
    if (!sugItems.length) { el.sug.classList.remove("is-open"); el.sug.innerHTML = ""; sugIndex = -1; return; }
    sugIndex = 0;
    el.sug.innerHTML = sugItems.map(function (s, i) {
      return '<button data-i="' + i + '" class="' + (i === 0 ? "is-sel" : "") + '">' +
        '<span class="s-name">' + esc(s.name) + '</span><span>' + esc(s.desc || "") + '</span></button>';
    }).join("");
    el.sug.classList.add("is-open");
    Array.prototype.forEach.call(el.sug.querySelectorAll("button"), function (b) {
      b.addEventListener("mousedown", function (e) {
        e.preventDefault();
        applySug(parseInt(b.getAttribute("data-i"), 10));
      });
    });
  }

  function applySug(i) {
    var s = sugItems[i];
    if (!s) return;
    var tokens = el.input.value.split(/\s+/);
    tokens[tokens.length - 1] = s.name;
    el.input.value = tokens.join(" ") + " ";
    el.sug.classList.remove("is-open");
    sugItems = []; sugIndex = -1;
    updateGhost();
    el.input.focus();
  }

  function moveSug(delta) {
    if (!sugItems.length) return false;
    sugIndex = (sugIndex + delta + sugItems.length) % sugItems.length;
    Array.prototype.forEach.call(el.sug.querySelectorAll("button"), function (b, i) {
      b.classList.toggle("is-sel", i === sugIndex);
      if (i === sugIndex) b.scrollIntoView({ block: "nearest" });
    });
    return true;
  }

  function updateGhost() {
    var v = el.input.value;
    if (!v.trim()) { el.ghost.textContent = ""; return; }
    var c = completions(v);
    if (!c.length) { el.ghost.textContent = ""; return; }
    var tokens = v.split(/\s+/);
    var partial = tokens[tokens.length - 1];
    var full = c[0].name;
    if (deaccent(full).indexOf(deaccent(partial)) === 0 && full.length > partial.length) {
      el.ghost.textContent = v + full.slice(partial.length);
    } else el.ghost.textContent = "";
  }

  /* ---------------------------------------------------------
     Bloqueo por clave
     --------------------------------------------------------- */
  function checkLock() {
    var pass = LSD.store.get("terminal.pass");
    if (!pass || unlocked) { el.lock.classList.remove("is-on"); unlocked = true; return; }
    el.lock.classList.add("is-on");
    setTimeout(function () { el.lockInput.focus(); }, 100);
  }

  /* ---------------------------------------------------------
     Arranque
     --------------------------------------------------------- */
  term.mount = function () {
    el.root = d.getElementById("term");
    el.out = d.getElementById("termOut");
    el.input = d.getElementById("termInput");
    el.ghost = d.getElementById("termGhost");
    el.sug = d.getElementById("termSug");
    el.fab = d.getElementById("termFab");
    el.lock = d.getElementById("termLock");
    el.lockInput = d.getElementById("termLockInput");

    el.fab.addEventListener("click", term.open);
    d.getElementById("termOpen").addEventListener("click", term.open);
    d.getElementById("termClose").addEventListener("click", term.close);
    d.getElementById("termClear").addEventListener("click", function () { term.clear(); banner(); });
    d.getElementById("termDock").addEventListener("click", function () {
      var order = ["bottom", "float", "right", "full"];
      var cur = LSD.store.get("terminal.dock");
      var next = order[(order.indexOf(cur) + 1) % order.length];
      LSD.store.set("terminal.dock", next);
      term.ok("Terminal anclada: " + next);
    });

    el.input.addEventListener("input", function () { renderSug(); updateGhost(); });

    el.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var v = el.input.value;
        el.input.value = ""; el.ghost.textContent = "";
        el.sug.classList.remove("is-open"); sugItems = [];
        execute(v);
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (sugItems.length) applySug(sugIndex >= 0 ? sugIndex : 0);
        else if (el.ghost.textContent) { el.input.value = el.ghost.textContent; updateGhost(); }
        return;
      }
      if (e.key === "ArrowDown") { if (moveSug(1)) { e.preventDefault(); return; } }
      if (e.key === "ArrowUp") { if (moveSug(-1)) { e.preventDefault(); return; } }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        if (!history.length) return;
        hIndex += (e.key === "ArrowUp" ? -1 : 1);
        if (hIndex < 0) hIndex = 0;
        if (hIndex >= history.length) { hIndex = history.length; el.input.value = ""; updateGhost(); return; }
        el.input.value = history[hIndex];
        updateGhost();
        return;
      }
      if (e.key === "Escape") {
        if (el.sug.classList.contains("is-open")) { el.sug.classList.remove("is-open"); sugItems = []; return; }
        term.close();
      }
      if (e.key === "l" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); term.clear(); }
    });

    el.lockInput.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      if (el.lockInput.value === LSD.store.get("terminal.pass")) {
        unlocked = true;
        el.lock.classList.remove("is-on");
        el.lockInput.value = "";
        el.input.focus();
        term.ok("Acceso concedido.");
      } else {
        el.lockInput.value = "";
        el.lock.querySelector("p").textContent = "Clave incorrecta. Probá de nuevo.";
      }
    });

    // Atajos globales
    d.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName || "").toLowerCase();
      var typing = tag === "input" || tag === "textarea";
      if ((e.ctrlKey || e.metaKey) && (e.key === "`" || e.key === "\u00AA")) { e.preventDefault(); term.toggle(); return; }
      if (e.key === "`" && !typing) { e.preventDefault(); term.toggle(); return; }
      if (e.key === "Escape") {
        var ov = d.getElementById("overlay");
        if (ov && ov.classList.contains("is-open")) { LSD.closeOverlay(); return; }
      }
    });

    banner();
  };

  function banner() {
    var s = LSD.store.get("site");
    term.html('<pre class="t-banner">' +
      "  _    ____  ____     ______ ____  _   _ ____   ___  _     _____ \n" +
      " | |  / ___||  _ \\   / / ___/ ___|| \\ | / ___| / _ \\| |   | ____|\n" +
      " | |  \\___ \\| | | | / / |  | |  _ |  \\| \\___ \\| | | | |   |  _|  \n" +
      " | |___ ___) | |_| |/ /| |__| |_| || |\\  |___) | |_| | |___| |___ \n" +
      " |_____|____/|____//_/  \\____\\____||_| \\_|____/ \\___/|_____|_____|\n" +
      '</pre>');
    term.html('<div class="t-banner-alt">LSD//CONSOLE</div>');
    term.dim("Terminal de configuración · " + s.author + " · v" + LSD.store.config.version);
    term.html('<div class="t-line t-info">Escribí <span class="t-key">ayuda</span> para ver todo lo que podés hacer. ' +
      '<span class="t-dim">Tab</span> autocompleta · <span class="t-dim">↑ ↓</span> historial · <span class="t-dim">Esc</span> cierra.</div>');
    term.space();
  }
  term.banner = banner;
})(window, document);
