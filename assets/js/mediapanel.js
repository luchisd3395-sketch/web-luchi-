/* =============================================================
   mediapanel.js — pestañas «Vídeos» y «Fotos» del panel
   -------------------------------------------------------------
   Cargar vídeos y fotos es lo que más se repite, y hacerlo por
   comandos obliga a recordar una sintaxis. Acá se hace con un
   formulario: enlace o archivo, desde/hasta, bloque y listo.

   Los comandos siguen existiendo para cargar muchos de una vez.
   ============================================================= */
(function (w, d) {
  "use strict";
  var LSD = w.LSD;
  var M = w.LSD_METHODOLOGY;
  var S, T;

  var MAX_VIDEO = 25 * 1024 * 1024;
  var MAX_FOTO = 8 * 1024 * 1024;

  function $(s) { return d.getElementById(s); }
  function esc(x) { return LSD.esc(x); }

  /* ---------------------------------------------------------
     Utilidades compartidas
     --------------------------------------------------------- */
  function mensaje(el, texto, clase) {
    if (!el) return;
    el.className = "f-msg" + (texto ? " is-" + (clase || "err") : "");
    el.innerHTML = texto || "";
  }

  function opcionesBloque(sel, vacio) {
    var html = vacio ? '<option value="">' + esc(vacio) + "</option>" : "";
    M.blocks.forEach(function (b) {
      html += '<option value="' + b.id + '">' + esc(b.code + " · " + b.title) + "</option>";
    });
    sel.innerHTML = html;
  }

  function opcionesUnidad(sel, bloqueId) {
    var b = LSD.blockById(bloqueId);
    var html = '<option value="">— ninguna —</option>';
    if (b) b.items.forEach(function (i) {
      html += '<option value="' + i.id + '">' + esc(i.name) + "</option>";
    });
    sel.innerHTML = html;
  }

  /** Copia texto al portapapeles. En la vista previa publicada no se
     puede descargar, así que copiar es la vía para hacérmelo llegar. */
  function copiar(texto, cb) {
    if (w.navigator && w.navigator.clipboard && w.navigator.clipboard.writeText) {
      w.navigator.clipboard.writeText(texto).then(function () { cb(true); }, function () { cb(false); });
      return;
    }
    try {
      var ta = d.createElement("textarea");
      ta.value = texto; ta.style.position = "fixed"; ta.style.opacity = "0";
      d.body.appendChild(ta); ta.select();
      var ok = d.execCommand("copy");
      d.body.removeChild(ta);
      cb(ok);
    } catch (e) { cb(false); }
  }

  function zonaArrastre(zona, input, acepta, alElegir) {
    zona.addEventListener("click", function () { input.click(); });
    zona.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
    });
    input.addEventListener("change", function () {
      if (input.files && input.files[0]) alElegir(input.files[0]);
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      zona.addEventListener(ev, function (e) { e.preventDefault(); zona.classList.add("is-over"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      zona.addEventListener(ev, function (e) { e.preventDefault(); zona.classList.remove("is-over"); });
    });
    zona.addEventListener("drop", function (e) {
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!f) return;
      if (acepta && f.type.indexOf(acepta) !== 0) return;
      alElegir(f);
    });
  }

  /* =========================================================
     PESTAÑA VÍDEOS
     ========================================================= */
  var vOrigen = "enlace";
  var vArchivo = null;      // { clave, nombre, peso }
  var vEditando = null;     // id del vídeo que se está editando

  function vMostrarOrigen(origen) {
    vOrigen = origen;
    $("vSrcEnlace").classList.toggle("hidden", origen !== "enlace");
    $("vSrcArchivo").classList.toggle("hidden", origen !== "archivo");
    Array.prototype.forEach.call($("vSrcTabs").children, function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-src") === origen);
    });
  }

  function vDetectar() {
    var caja = $("vDetect");
    var url = $("vLink").value.trim();
    if (!url) { caja.className = "f-detected"; caja.innerHTML = ""; return null; }
    var p = LSD.parseMedia(url);
    if (!p || !p.url) { caja.className = "f-detected"; caja.innerHTML = ""; return null; }
    var th = LSD.thumbUrl(p);
    caja.className = "f-detected is-on";
    caja.innerHTML =
      (th ? '<img src="' + esc(th) + '" alt="">' : '<span class="f-ph">sin<br>miniatura</span>') +
      '<span class="d-txt"><b>' + esc(LSD.providerLabel(p.provider)) + "</b><br>" +
      "<em>" + esc(p.vid || p.url) + "</em></span>";
    if (p.start != null && !$("vFrom").value) {
      $("vFrom").value = LSD.formatTime(p.start);
      vDuracion();
    }
    return p;
  }

  function vDuracion() {
    var caja = $("vDur");
    var a = LSD.parseTime($("vFrom").value);
    var b = LSD.parseTime($("vTo").value);
    if (a == null || b == null || b <= a) {
      caja.textContent = "—";
      caja.parentNode.classList.remove("is-largo");
      return null;
    }
    var d0 = b - a;
    caja.textContent = LSD.formatTime(d0);
    caja.parentNode.classList.toggle("is-largo", d0 > 30);
    return d0;
  }

  function vLimpiar(todo) {
    if (todo !== false) {
      $("vLink").value = "";
      vArchivo = null;
      $("vFileInfo").className = "f-detected";
      $("vFileInfo").innerHTML = "";
      $("vDetect").className = "f-detected";
      $("vDetect").innerHTML = "";
    }
    $("vFrom").value = ""; $("vTo").value = ""; $("vTitle").value = ""; $("vTags").value = "";
    $("vDur").textContent = "—";
    $("vPreview").classList.add("hidden");
    $("vPreview").innerHTML = "";
    vEditando = null;
    $("vSave").textContent = "Añadir vídeo";
    mensaje($("vMsg"), "");
  }

  /** Reúne y valida lo del formulario. Devuelve null si algo falta. */
  function vRecoger() {
    var msg = $("vMsg");
    var url = "", provider = "", vid = "";

    if (vOrigen === "archivo") {
      if (!vArchivo) { mensaje(msg, "Elegí un archivo de vídeo.", "err"); return null; }
      url = "local:" + vArchivo.clave; provider = "file"; vid = "";
    } else {
      var p = LSD.parseMedia($("vLink").value.trim());
      if (!p || !p.url) { mensaje(msg, "Pegá un enlace de vídeo o una ruta del repositorio.", "err"); return null; }
      url = p.url; provider = p.provider; vid = p.vid;
    }

    var desde = LSD.parseTime($("vFrom").value);
    var hasta = LSD.parseTime($("vTo").value);
    if ($("vFrom").value.trim() && desde == null) { mensaje(msg, "El «desde» no se entiende. Usá 0:30, 30 o 1:02:05.", "err"); return null; }
    if ($("vTo").value.trim() && hasta == null) { mensaje(msg, "El «hasta» no se entiende. Usá 0:30, 30 o 1:02:05.", "err"); return null; }
    if (desde != null && hasta != null && hasta <= desde) {
      mensaje(msg, "El «hasta» tiene que ser posterior al «desde».", "err"); return null;
    }
    if (hasta != null && desde == null) desde = 0;

    var bloque = $("vBlock").value;
    if (!bloque) { mensaje(msg, "Elegí a qué bloque va.", "err"); return null; }

    var unidad = $("vWork").value || null;
    var titulo = $("vTitle").value.trim();
    if (!titulo) {
      titulo = "Actividad " + (S.config.media.videos.filter(function (v) { return v.block === bloque; }).length + 1);
    }

    return {
      title: titulo, url: url, provider: provider, vid: vid,
      start: desde, end: hasta,
      block: bloque, work: unidad,
      tags: $("vTags").value.split(/\s*,\s*/).filter(Boolean),
      duration: (desde != null && hasta != null) ? LSD.formatTime(hasta - desde) : "",
      desc: "", poster: "", featured: false,
      added: new Date().toISOString().slice(0, 10)
    };
  }

  function vGuardar(seguir) {
    var reg = vRecoger();
    if (!reg) return;

    if (vEditando) {
      S.write(function (st) {
        st.media.videos.forEach(function (v, i) {
          if (v.id !== vEditando) return;
          reg.id = v.id;
          st.media.videos[i] = reg;
        });
      });
      vLimpiar(true);
      mensaje($("vMsg"), "Vídeo actualizado.", "ok");
    } else {
      var base = LSD.slug(reg.title), id = base, n = 2;
      while (S.config.media.videos.some(function (v) { return v.id === id; })) id = base + "-" + (n++);
      reg.id = id;
      S.write(function (st) { st.media.videos.push(reg); });
      var local = LSD.esLocal(reg.url);
      // Limpiar primero: vLimpiar() borra el mensaje, así que el aviso va después.
      vLimpiar(!seguir);
      mensaje($("vMsg"), local
        ? "Vídeo añadido. Está guardado en este navegador: para que lo vean los visitantes hay que publicarlo."
        : "Vídeo añadido.", local ? "warn" : "ok");
    }
    vLista();
  }

  function vProbar() {
    var reg = vRecoger();
    if (!reg) return;
    var caja = $("vPreview");
    caja.classList.remove("hidden");
    caja.innerHTML = LSD.playerMarkup(reg, false);
  }

  function vLista() {
    var caja = $("vList");
    var vids = S.config.media.videos || [];
    $("vCount").textContent = vids.length ? "(" + vids.length + ")" : "";
    if (!vids.length) {
      caja.innerHTML = '<p class="f-vacio">Todavía no hay vídeos. Pegá un enlace de YouTube arriba, ' +
        "poné desde y hasta qué minuto, y elegí el bloque.</p>";
      return;
    }
    caja.innerHTML = vids.map(function (v, i) {
      var b = LSD.blockById(v.block);
      var th = LSD.thumbUrl(v);
      var pendiente = LSD.esLocal(v.url);
      var tramo = v.start != null
        ? LSD.formatTime(v.start) + (v.end != null ? " → " + LSD.formatTime(v.end) : "") : "completo";
      return '<div class="f-item' + (pendiente ? " is-pendiente" : "") + '" data-id="' + esc(v.id) + '">' +
        (th ? '<img src="' + esc(th) + '" alt="">' : '<span class="f-ph">' + esc(LSD.providerLabel(v.provider)) + "</span>") +
        '<div class="f-body"><div class="f-t">' + esc(v.title) +
          (pendiente ? '<span class="f-pend">sin publicar</span>' : "") + "</div>" +
        '<div class="f-d">' + esc((b ? b.short : v.block) + "  ·  " + tramo +
          (v.duration ? "  ·  " + v.duration : "")) + "</div></div>" +
        '<div class="f-acts">' +
          '<button data-acc="sube" data-i="' + i + '" title="Subir">↑</button>' +
          '<button data-acc="edita" data-i="' + i + '">Editar</button>' +
          '<button class="f-del" data-acc="borra" data-i="' + i + '">Borrar</button>' +
        "</div></div>";
    }).join("");

    Array.prototype.forEach.call(caja.querySelectorAll("button[data-acc]"), function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-i"), 10);
        var acc = btn.getAttribute("data-acc");
        var v = S.config.media.videos[i];
        if (!v) return;
        if (acc === "borra") {
          if (LSD.esLocal(v.url)) LSD.files.borrar(v.url.slice(6));
          S.write(function (st) { st.media.videos.splice(i, 1); });
          vLista();
        } else if (acc === "sube") {
          if (i === 0) return;
          S.write(function (st) { st.media.videos.splice(i - 1, 0, st.media.videos.splice(i, 1)[0]); });
          vLista();
        } else if (acc === "edita") {
          vEditar(v);
        }
      });
    });
  }

  function vEditar(v) {
    vEditando = v.id;
    if (LSD.esLocal(v.url)) {
      vMostrarOrigen("archivo");
      var info = LSD.files.info(v.url.slice(6));
      vArchivo = { clave: v.url.slice(6), nombre: info ? info.nombre : "archivo", peso: info ? info.peso : 0 };
      $("vFileInfo").className = "f-detected is-on";
      $("vFileInfo").innerHTML = '<span class="f-ph">vídeo</span><span class="d-txt"><b>Archivo</b><br><em>' +
        esc(vArchivo.nombre) + "</em></span>";
    } else {
      vMostrarOrigen("enlace");
      $("vLink").value = v.url;
      vDetectar();
    }
    $("vFrom").value = v.start != null ? LSD.formatTime(v.start) : "";
    $("vTo").value = v.end != null ? LSD.formatTime(v.end) : "";
    $("vTitle").value = v.title;
    $("vBlock").value = v.block;
    opcionesUnidad($("vWork"), v.block);
    $("vWork").value = v.work || "";
    $("vTags").value = (v.tags || []).join(", ");
    vDuracion();
    $("vSave").textContent = "Guardar cambios";
    mensaje($("vMsg"), "Editando «" + esc(v.title) + "».", "warn");
    $("vLink").scrollIntoView({ block: "nearest" });
  }

  /* =========================================================
     PESTAÑA FOTOS
     ========================================================= */
  var fOrigen = "archivo";
  var fArchivo = null;

  function fMostrarOrigen(origen) {
    fOrigen = origen;
    $("fSrcEnlace").classList.toggle("hidden", origen !== "enlace");
    $("fSrcArchivo").classList.toggle("hidden", origen !== "archivo");
    Array.prototype.forEach.call($("fSrcTabs").children, function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-src") === origen);
    });
  }

  function fDestinos() {
    var sel = $("fDest");
    var html = '<option value="momentos">Momentos en el club</option>' +
               '<option value="portada">Portada del sitio</option>';
    M.blocks.forEach(function (b) {
      html += '<option value="bloque:' + b.id + '">Bloque ' + esc(b.code + " · " + b.title) + "</option>";
    });
    sel.innerHTML = html;
  }

  function fLimpiar() {
    $("fLink").value = ""; $("fPie").value = "";
    fArchivo = null;
    $("fFileInfo").className = "f-detected"; $("fFileInfo").innerHTML = "";
    $("fDetect").className = "f-detected"; $("fDetect").innerHTML = "";
    mensaje($("fMsg"), "");
  }

  function fGuardar() {
    var msg = $("fMsg");
    var ruta = "";
    if (fOrigen === "archivo") {
      if (!fArchivo) { mensaje(msg, "Elegí una foto.", "err"); return; }
      ruta = "local:" + fArchivo.clave;
    } else {
      ruta = $("fLink").value.trim();
      if (!ruta) { mensaje(msg, "Pegá el enlace o la ruta de la foto.", "err"); return; }
    }

    var destino = $("fDest").value;
    var pie = $("fPie").value.trim();
    var local = LSD.esLocal(ruta);

    if (destino === "portada") {
      S.set("site.heroImage", ruta);
    } else if (destino.indexOf("bloque:") === 0) {
      var id = destino.slice(7);
      S.write(function (st) {
        if (!st.media.images) st.media.images = {};
        st.media.images[id] = ruta;
      });
    } else {
      S.write(function (st) {
        if (!Array.isArray(st.media.gallery)) st.media.gallery = [];
        st.media.gallery.push({ src: ruta, pie: pie });
      });
    }

    fLimpiar();
    mensaje(msg, local
      ? "Foto añadida. Está guardada en este navegador: para que la vean los visitantes hay que publicarla."
      : "Foto añadida.", local ? "warn" : "ok");
    fLista();
  }

  function fLista() {
    var caja = $("fList");
    var c = S.config;
    var filas = [];

    if (c.site.heroImage) filas.push({ src: c.site.heroImage, donde: "Portada", tipo: "portada" });
    Object.keys(c.media.images || {}).forEach(function (id) {
      var b = LSD.blockById(id);
      filas.push({ src: c.media.images[id], donde: "Bloque " + (b ? b.short : id), tipo: "bloque", id: id });
    });
    (c.media.gallery || []).forEach(function (f, i) {
      filas.push({ src: f.src, donde: "Momentos" + (f.pie ? " · " + f.pie : ""), tipo: "galeria", i: i });
    });

    $("fCount").textContent = filas.length ? "(" + filas.length + ")" : "";
    if (!filas.length) {
      caja.innerHTML = '<p class="f-vacio">Todavía no hay fotos puestas.</p>';
      return;
    }

    caja.innerHTML = filas.map(function (r, k) {
      var pendiente = LSD.esLocal(r.src);
      return '<div class="f-item' + (pendiente ? " is-pendiente" : "") + '">' +
        '<img src="' + esc(LSD.mediaUrl(r.src)) + '" alt="">' +
        '<div class="f-body"><div class="f-t">' + esc(r.donde) +
          (pendiente ? '<span class="f-pend">sin publicar</span>' : "") + "</div>" +
        '<div class="f-d">' + esc(pendiente ? "archivo de este navegador" : r.src) + "</div></div>" +
        '<div class="f-acts"><button class="f-del" data-k="' + k + '">Quitar</button></div></div>';
    }).join("");

    Array.prototype.forEach.call(caja.querySelectorAll("button[data-k]"), function (btn) {
      btn.addEventListener("click", function () {
        var r = filas[parseInt(btn.getAttribute("data-k"), 10)];
        if (!r) return;
        if (LSD.esLocal(r.src)) LSD.files.borrar(r.src.slice(6));
        if (r.tipo === "portada") S.set("site.heroImage", "");
        else if (r.tipo === "bloque") S.write(function (st) { delete st.media.images[r.id]; });
        else S.write(function (st) { st.media.gallery.splice(r.i, 1); });
        fLista();
      });
    });
  }

  /* =========================================================
     PESTAÑAS
     ========================================================= */
  function irA(tab) {
    ["videos", "fotos", "consola"].forEach(function (t) {
      var pane = $("pane" + t.charAt(0).toUpperCase() + t.slice(1));
      if (pane) pane.classList.toggle("hidden", t !== tab);
    });
    Array.prototype.forEach.call($("termTabs").children, function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-tab") === tab);
    });
    if (tab === "consola" && LSD.term) setTimeout(function () { LSD.term.focus(); }, 60);
    if (tab === "videos") vLista();
    if (tab === "fotos") fLista();
  }
  LSD.panelIrA = irA;

  /* =========================================================
     ARRANQUE
     ========================================================= */
  LSD.panel = {
    mount: function () {
      S = LSD.store; T = LSD.term;
      if (!$("paneVideos")) return;

      Array.prototype.forEach.call($("termTabs").children, function (b) {
        b.addEventListener("click", function () { irA(b.getAttribute("data-tab")); });
      });

      /* --- vídeos --- */
      opcionesBloque($("vBlock"), "— elegí un bloque —");
      opcionesUnidad($("vWork"), "");
      $("vBlock").addEventListener("change", function () { opcionesUnidad($("vWork"), $("vBlock").value); });
      Array.prototype.forEach.call($("vSrcTabs").children, function (b) {
        b.addEventListener("click", function () { vMostrarOrigen(b.getAttribute("data-src")); });
      });
      $("vLink").addEventListener("input", vDetectar);
      $("vFrom").addEventListener("input", vDuracion);
      $("vTo").addEventListener("input", vDuracion);
      $("vSave").addEventListener("click", function () { vGuardar(false); });
      $("vSaveMore").addEventListener("click", function () { vGuardar(true); });
      $("vTest").addEventListener("click", vProbar);
      $("vReset").addEventListener("click", function () { vLimpiar(true); });

      zonaArrastre($("vDrop"), $("vFile"), "video", function (file) {
        if (file.size > MAX_VIDEO) {
          mensaje($("vMsg"), "El archivo pesa " + LSD.pesoLegible(file.size) +
            ". Por encima de 25 MB conviene subirlo a YouTube y pegar el enlace.", "err");
          return;
        }
        LSD.files.guardar(file, function (err, clave) {
          if (err) { mensaje($("vMsg"), "No se pudo guardar el archivo: " + err.message, "err"); return; }
          vArchivo = { clave: clave, nombre: file.name, peso: file.size };
          $("vFileInfo").className = "f-detected is-on";
          $("vFileInfo").innerHTML =
            '<video src="' + esc(LSD.files.url(clave)) + '" muted></video>' +
            '<span class="d-txt"><b>' + esc(LSD.pesoLegible(file.size)) + "</b><br><em>" +
            esc(file.name) + "</em></span>";
          mensaje($("vMsg"), "");
        });
      });

      $("vCopy").addEventListener("click", function () {
        var json = JSON.stringify(S.config.media.videos, null, 2);
        copiar(json, function (ok) {
          mensaje($("vMsg"), ok
            ? "Listado copiado. Pegalo en el chat y lo dejo fijo en el sitio."
            : "El navegador no dejó copiar. Usá el comando `exportar` en la consola.", ok ? "ok" : "err");
        });
      });

      /* --- fotos --- */
      fDestinos();
      Array.prototype.forEach.call($("fSrcTabs").children, function (b) {
        b.addEventListener("click", function () { fMostrarOrigen(b.getAttribute("data-src")); });
      });
      $("fDest").addEventListener("change", function () {
        $("fPieCampo").style.display = $("fDest").value === "momentos" ? "" : "none";
      });
      $("fSave").addEventListener("click", fGuardar);
      $("fReset").addEventListener("click", fLimpiar);
      $("fLink").addEventListener("input", function () {
        var caja = $("fDetect"), r = $("fLink").value.trim();
        if (!r) { caja.className = "f-detected"; caja.innerHTML = ""; return; }
        caja.className = "f-detected is-on";
        caja.innerHTML = '<img src="' + esc(LSD.mediaUrl(r)) + '" alt="">' +
          '<span class="d-txt"><em>' + esc(r) + "</em></span>";
      });

      zonaArrastre($("fDrop"), $("fFile"), "image", function (file) {
        if (file.size > MAX_FOTO) {
          mensaje($("fMsg"), "La foto pesa " + LSD.pesoLegible(file.size) +
            ". Comprimila por debajo de 8 MB antes de subirla.", "err");
          return;
        }
        LSD.files.guardar(file, function (err, clave) {
          if (err) { mensaje($("fMsg"), "No se pudo guardar la foto: " + err.message, "err"); return; }
          fArchivo = { clave: clave, nombre: file.name, peso: file.size };
          $("fFileInfo").className = "f-detected is-on";
          $("fFileInfo").innerHTML =
            '<img src="' + esc(LSD.files.url(clave)) + '" alt="">' +
            '<span class="d-txt"><b>' + esc(LSD.pesoLegible(file.size)) + "</b><br><em>" +
            esc(file.name) + "</em></span>";
          mensaje($("fMsg"), "");
        });
      });

      $("fCopy").addEventListener("click", function () {
        var c = S.config;
        var json = JSON.stringify({
          site: { heroImage: c.site.heroImage, heroFocus: c.site.heroFocus },
          media: { images: c.media.images, gallery: c.media.gallery }
        }, null, 2);
        copiar(json, function (ok) {
          mensaje($("fMsg"), ok
            ? "Listado copiado. Pegalo en el chat y lo dejo fijo en el sitio."
            : "El navegador no dejó copiar. Usá el comando `exportar` en la consola.", ok ? "ok" : "err");
        });
      });

      $("fPieCampo").style.display = "";
      vLista();
      fLista();
    },

    refrescar: function () {
      if (!$("paneVideos")) return;
      if (!$("paneVideos").classList.contains("hidden")) vLista();
      if (!$("paneFotos").classList.contains("hidden")) fLista();
    }
  };
})(window, document);
