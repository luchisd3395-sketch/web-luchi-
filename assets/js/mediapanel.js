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

  /* No hay tope de entrada: entra lo que haya y las fotos se comprimen acá
     (comprimir.js). Este número sólo decide cuándo un vídeo se avisa como
     pesado para el repositorio; guardarlo se guarda igual. */
  var VIDEO_PESADO = 25 * 1024 * 1024;

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

  /** Los días que existen en los morfociclos, sin repetir. Sirve para
     etiquetar un vídeo o una foto con el día al que pertenece. */
  function diasDelCiclo() {
    var vistos = {}, out = [];
    (M.morfociclos || []).forEach(function (c) {
      c.dias.forEach(function (d) {
        if (vistos[d.day]) return;
        vistos[d.day] = 1;
        out.push(d.day);
      });
    });
    return out;
  }

  function opcionesDia(sel, vacio) {
    var html = '<option value="">' + esc(vacio || "— ninguno —") + "</option>";
    diasDelCiclo().forEach(function (d) { html += '<option value="' + esc(d) + '">' + esc(d) + "</option>"; });
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

  /** Conecta un botón con su selector de archivos. Cada botón abre un
     selector distinto (galería o cámara), y la página sólo recibe lo que
     la persona elija: no puede leer el resto del dispositivo. */
  function conectarSelector(boton, input, alElegir, aviso) {
    var etiqueta = boton.innerHTML;

    function esperar(on) {
      boton.disabled = on;
      boton.classList.toggle("is-esperando", on);
      if (on) boton.innerHTML = "<b>Buscando el archivo…</b><span>El dispositivo lo está preparando</span>";
      else boton.innerHTML = etiqueta;
    }

    boton.addEventListener("click", function () {
      input.value = "";
      esperar(true);
      if (aviso) mensaje(aviso, "Elegí el archivo en tu dispositivo. Si es un vídeo largo, " +
        "el iPad tarda un rato en prepararlo antes de entregarlo: es normal.", "info");
      input.click();
      /* Si cancela el selector no llega ningún «change», así que el botón se
         desbloquea al volver el foco a la página. */
      w.addEventListener("focus", function reponer() {
        w.removeEventListener("focus", reponer);
        w.setTimeout(function () { if (!input.files || !input.files.length) { esperar(false); if (aviso) mensaje(aviso, ""); } }, 400);
      });
    });

    input.addEventListener("change", function () {
      esperar(false);
      var fs = input.files;
      if (!fs || !fs.length) { if (aviso) mensaje(aviso, ""); return; }
      alElegir(Array.prototype.slice.call(fs));
    });
  }

  /** Arrastrar y soltar, para escritorio. */
  function zonaArrastre(zona, acepta, alElegir) {
    ["dragenter", "dragover"].forEach(function (ev) {
      zona.addEventListener(ev, function (e) { e.preventDefault(); zona.classList.add("is-over"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      zona.addEventListener(ev, function (e) { e.preventDefault(); zona.classList.remove("is-over"); });
    });
    zona.addEventListener("drop", function (e) {
      var fs = e.dataTransfer && e.dataTransfer.files;
      if (!fs || !fs.length) return;
      var lista = Array.prototype.slice.call(fs).filter(function (f) {
        return !acepta || f.type.indexOf(acepta) === 0;
      });
      if (lista.length) alElegir(lista);
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
    $("vDia").value = "";
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
      dia: $("vDia").value || "",
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
    $("vDia").value = v.dia || "";
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
  var fCola = [];            // fotos elegidas, a la espera de confirmación

  /** Muestra lo elegido para repasarlo y poder sacar lo que no vaya. */
  function fPintarCola() {
    var caja = $("fQueue");
    if (!fCola.length) { caja.innerHTML = ""; return; }
    caja.innerHTML = '<div class="f-queue-head">' + (fCola.length === 1
        ? "Vas a añadir 1 foto — repasala antes de guardar"
        : "Vas a añadir " + fCola.length + " fotos — repasalas antes de guardar") + "</div>" +
      fCola.map(function (f, i) {
        var detalle = f.listo
          ? esc(LSD.resumenCompresion(f))
          : "preparando la foto…";
        return '<div class="q-item' + (f.listo ? "" : " is-pendiente") + '">' +
          '<img src="' + esc(f.url) + '" alt="">' +
          '<div class="q-txt"><div class="q-n">' + esc(f.nombre) + "</div>" +
          '<div class="q-p">' + detalle + "</div></div>" +
          '<button class="q-x" data-i="' + i + '" title="Sacar de la lista">✕</button></div>';
      }).join("");
    Array.prototype.forEach.call(caja.querySelectorAll(".q-x"), function (b) {
      b.addEventListener("click", function () {
        var i = parseInt(b.getAttribute("data-i"), 10);
        try { URL.revokeObjectURL(fCola[i].url); } catch (e) {}
        fCola.splice(i, 1);
        fPintarCola();
      });
    });
  }

  /** Encola lo elegido y lo va dejando en tamaño publicable. Entra cualquier
     peso: comprimir es tarea de la página, no de quien sube la foto. */
  function fEncolar(archivos) {
    archivos.forEach(function (file) {
      if (file.type.indexOf("image") !== 0) return;
      var entrada = {
        file: file, url: URL.createObjectURL(file), nombre: file.name || "foto",
        listo: false, pesoOriginal: file.size, pesoFinal: file.size,
        ancho: 0, alto: 0, recomprimido: false, motivo: ""
      };
      fCola.push(entrada);

      LSD.comprimirImagen(file, function (err, r) {
        if (!err && r) {
          entrada.file = r.file;
          entrada.pesoOriginal = r.pesoOriginal;
          entrada.pesoFinal = r.pesoFinal;
          entrada.ancho = r.ancho; entrada.alto = r.alto;
          entrada.recomprimido = r.recomprimido;
          entrada.motivo = r.motivo;
        }
        entrada.listo = true;
        fPintarCola();
      });
    });
    fArchivo = null;
    $("fFileInfo").className = "f-detected";
    $("fFileInfo").innerHTML = "";
    mensaje($("fMsg"), "");
    fPintarCola();
  }

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
    diasDelCiclo().forEach(function (d) {
      html += '<option value="dia:' + esc(d) + '">Día ' + esc(d) + " del microciclo</option>";
    });
    sel.innerHTML = html;
  }

  function fLimpiar() {
    $("fLink").value = ""; $("fPie").value = "";
    fArchivo = null;
    fCola.forEach(function (f) { try { URL.revokeObjectURL(f.url); } catch (e) {} });
    fCola = [];
    fPintarCola();
    $("fFileInfo").className = "f-detected"; $("fFileInfo").innerHTML = "";
    $("fDetect").className = "f-detected"; $("fDetect").innerHTML = "";
    mensaje($("fMsg"), "");
  }

  /** Coloca una ruta ya resuelta en el destino elegido. */
  function fColocar(ruta, destino, pie) {
    if (destino === "portada") {
      S.set("site.heroImage", ruta);
    } else if (destino.indexOf("dia:") === 0) {
      var dia = destino.slice(4);
      S.write(function (st) {
        if (!st.media.dias || typeof st.media.dias !== "object") st.media.dias = {};
        if (!Array.isArray(st.media.dias[dia])) st.media.dias[dia] = [];
        st.media.dias[dia].push(ruta);
      });
    } else if (destino.indexOf("bloque:") === 0) {
      var id = destino.slice(7);
      S.write(function (st) {
        if (!st.media.images) st.media.images = {};
        st.media.images[id] = ruta;
      });
    } else {
      S.write(function (st) {
        if (!Array.isArray(st.media.gallery)) st.media.gallery = [];
        st.media.gallery.push({ src: ruta, pie: pie || "" });
      });
    }
  }

  function fGuardar() {
    var msg = $("fMsg");
    var destino = $("fDest").value;
    var pie = $("fPie").value.trim();

    /* --- por enlace --- */
    if (fOrigen === "enlace") {
      var ruta = $("fLink").value.trim();
      if (!ruta) { mensaje(msg, "Pegá el enlace o la ruta de la foto.", "err"); return; }
      fColocar(ruta, destino, pie);
      fLimpiar();
      mensaje(msg, "Foto añadida.", "ok");
      fLista();
      return;
    }

    /* --- por archivo --- */
    if (!fCola.length) { mensaje(msg, "Elegí al menos una foto.", "err"); return; }

    // La portada y los bloques admiten una sola foto: mejor decirlo que
    // guardar la primera y descartar el resto en silencio.
    var variasOk = destino === "momentos" || destino.indexOf("dia:") === 0;
    if (!variasOk && fCola.length > 1) {
      mensaje(msg, "Ahí va una sola foto y elegiste " + fCola.length +
        ". Sacá las que sobren, o mandalas a «Momentos en el club».", "err");
      return;
    }

    if (fCola.some(function (f) { return !f.listo; })) {
      mensaje(msg, "Esperá un segundo: todavía se están preparando las fotos.", "warn");
      return;
    }

    var lista = fCola.slice();
    var pendientes = lista.length, fallos = 0, error = "";
    mensaje(msg, "Guardando…", "warn");

    lista.forEach(function (f) {
      LSD.files.guardar(f.file, function (err, clave) {
        if (err) { fallos++; error = err.message || ""; }
        else fColocar("local:" + clave, destino, pie);
        if (--pendientes) return;

        var puestas = lista.length - fallos;
        fLimpiar();
        if (!puestas) {
          mensaje(msg, "No se pudo guardar ninguna. " + esc(error), "err");
          return;
        }
        var partes = [puestas + (puestas === 1 ? " foto añadida" : " fotos añadidas")];
        if (fallos) partes.push(fallos + " no se pudieron guardar: " + esc(error));
        mensaje(msg, partes.join(" · ") +
          ". Quedan en este navegador: para que las vean los visitantes hay que publicarlas.",
          fallos ? "warn" : "ok");
        fLista();
      });
    });
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
     PESTAÑA ARCHIVOS
     ---------------------------------------------------------
     Todo lo cargado en una sola lista, con la carpeta donde
     está cada cosa y un desplegable para cambiarla. Es lo que
     antes obligaba a abrir «Editar» o a usar el comando mover.
     ========================================================= */

  /** Junta vídeos y fotos en filas con la misma forma. */
  function aFilas() {
    var c = S.config;
    var filas = [];

    (c.media.videos || []).forEach(function (v, i) {
      filas.push({
        clase: "video", i: i, id: v.id,
        nombre: v.title || v.id,
        origen: LSD.esLocal(v.url) ? "archivo de este navegador" : LSD.providerLabel(v.provider),
        thumb: LSD.thumbUrl(v), src: v.url,
        carpeta: v.block || "", dia: v.dia || "", etiqueta: "vídeo"
      });
    });

    if (c.site.heroImage) {
      filas.push({
        clase: "foto", tipo: "portada", nombre: aNombre(c.site.heroImage),
        origen: "", thumb: LSD.mediaUrl(c.site.heroImage), src: c.site.heroImage,
        carpeta: "portada", etiqueta: "foto"
      });
    }
    Object.keys(c.media.images || {}).forEach(function (id) {
      filas.push({
        clase: "foto", tipo: "bloque", id: id, nombre: aNombre(c.media.images[id]),
        origen: "", thumb: LSD.mediaUrl(c.media.images[id]), src: c.media.images[id],
        carpeta: "bloque:" + id, etiqueta: "foto"
      });
    });
    (c.media.gallery || []).forEach(function (f, i) {
      filas.push({
        clase: "foto", tipo: "galeria", i: i, nombre: f.pie || aNombre(f.src),
        origen: "", thumb: LSD.mediaUrl(f.src), src: f.src,
        carpeta: "momentos", etiqueta: "foto"
      });
    });
    Object.keys(c.media.dias || {}).forEach(function (dia) {
      (c.media.dias[dia] || []).forEach(function (src, i) {
        filas.push({
          clase: "foto", tipo: "dia", dia: dia, i: i, nombre: aNombre(src),
          origen: "", thumb: LSD.mediaUrl(src), src: src,
          carpeta: "dia:" + dia, etiqueta: "foto"
        });
      });
    });

    return filas;
  }

  /** De una ruta o clave local, algo legible para llamar al archivo. */
  function aNombre(ruta) {
    if (LSD.esLocal(ruta)) {
      var info = LSD.files.info(ruta.slice(6));
      return info ? info.nombre : "archivo";
    }
    return String(ruta).split("/").pop().split("?")[0] || ruta;
  }

  /** Nombre de la carpeta tal y como se lee en la lista. */
  function aCarpetaLabel(carpeta) {
    if (carpeta === "portada") return "Portada del sitio";
    if (carpeta === "momentos") return "Momentos en el club";
    if (carpeta.indexOf("dia:") === 0) return "Día " + carpeta.slice(4);
    var id = carpeta.indexOf("bloque:") === 0 ? carpeta.slice(7) : carpeta;
    var b = LSD.blockById(id);
    return b ? b.code + " · " + b.title : (id ? id : "Sin carpeta");
  }

  /** Opciones del desplegable: los vídeos van a bloques; las fotos, también a portada y momentos. */
  function aOpciones(fila) {
    var html = "";
    if (fila.clase === "foto") {
      html += '<option value="momentos">Momentos en el club</option>' +
              '<option value="portada">Portada del sitio</option>';
      M.blocks.forEach(function (b) {
        html += '<option value="bloque:' + b.id + '">' + esc(b.code + " · " + b.title) + "</option>";
      });
      diasDelCiclo().forEach(function (d) {
        html += '<option value="dia:' + esc(d) + '">Día ' + esc(d) + "</option>";
      });
    } else {
      html += '<option value="">— sin carpeta —</option>';
      M.blocks.forEach(function (b) {
        html += '<option value="' + b.id + '">' + esc(b.code + " · " + b.title) + "</option>";
      });
    }
    return html;
  }

  function aRellenarFiltro() {
    var sel = $("aCarpeta");
    var html = '<option value="">Todas</option>' +
      '<option value="portada">Portada del sitio</option>' +
      '<option value="momentos">Momentos en el club</option>';
    M.blocks.forEach(function (b) {
      html += '<option value="bloque:' + b.id + '">' + esc(b.code + " · " + b.title) + "</option>";
    });
    diasDelCiclo().forEach(function (d) {
      html += '<option value="dia:' + esc(d) + '">Día ' + esc(d) + "</option>";
    });
    html += '<option value="sin">Sin carpeta</option>';
    sel.innerHTML = html;
  }

  function aLista() {
    var caja = $("aList");
    var tipo = $("aTipo").value;
    var carp = $("aCarpeta").value;
    var todas = aFilas();

    var filas = todas.filter(function (r) {
      if (tipo && r.clase !== tipo) return false;
      if (!carp) return true;
      if (carp === "sin") return !r.carpeta;
      // un vídeo guarda el bloque pelado; una foto, con el prefijo
      return r.carpeta === carp || (r.clase === "video" && carp === "bloque:" + r.carpeta);
    });

    var pesoLocal = todas.reduce(function (t, r) {
      if (!LSD.esLocal(r.src)) return t;
      var info = LSD.files.info(r.src.slice(6));
      return t + (info ? info.peso : 0);
    }, 0);

    $("aResumen").innerHTML = esc(todas.length + (todas.length === 1 ? " archivo" : " archivos") +
      (filas.length !== todas.length ? " · " + filas.length + " en pantalla" : "") +
      (pesoLocal ? " · " + LSD.pesoLegible(pesoLocal) + " guardados en este navegador" : ""));

    if (!filas.length) {
      caja.innerHTML = '<p class="f-vacio">' + (todas.length
        ? "Ningún archivo en esa carpeta."
        : "Todavía no hay nada cargado. Subilo desde las pestañas de Vídeos y Fotos.") + "</p>";
      return;
    }

    caja.innerHTML = filas.map(function (r, k) {
      var pendiente = LSD.esLocal(r.src);
      var valor = r.clase === "video"
        ? r.carpeta
        : (r.carpeta.indexOf("bloque:") === 0 || r.carpeta === "portada" || r.carpeta === "momentos"
            ? r.carpeta : "momentos");
      return '<div class="f-item a-item' + (pendiente ? " is-pendiente" : "") + '">' +
        (r.thumb ? '<img src="' + esc(r.thumb) + '" alt="">'
                 : '<span class="f-ph">' + esc(r.etiqueta) + "</span>") +
        '<div class="f-body"><div class="f-t">' + esc(r.nombre) +
          (pendiente ? '<span class="f-pend">sin publicar</span>' : "") + "</div>" +
        '<div class="f-d">' + esc(r.etiqueta + (r.origen ? " · " + r.origen : "") +
          (pendiente ? "" : " · " + r.src)) + "</div></div>" +
        '<label class="a-carpeta"><span>Carpeta</span>' +
          '<select data-k="' + k + '">' + aOpciones(r) + "</select></label>" +
        (r.clase === "video"
          ? '<label class="a-carpeta a-carpeta-sm"><span>Día</span><select data-dia="' + k + '">' +
              '<option value="">— sin día —</option>' +
              diasDelCiclo().map(function (d) { return '<option value="' + esc(d) + '">' + esc(d) + "</option>"; }).join("") +
            "</select></label>"
          : "") +
        '<div class="f-acts"><button class="f-del" data-quita="' + k + '">Quitar</button></div>' +
        "</div>";
    }).join("");

    // El valor se pone después: así una carpeta que ya no existe no rompe el desplegable
    Array.prototype.forEach.call(caja.querySelectorAll("select[data-k]"), function (sel) {
      var r = filas[parseInt(sel.getAttribute("data-k"), 10)];
      sel.value = r.clase === "video" ? (r.carpeta || "") : r.carpeta;
      sel.addEventListener("change", function () { aMover(r, sel.value); });
    });

    Array.prototype.forEach.call(caja.querySelectorAll("select[data-dia]"), function (sel) {
      var r = filas[parseInt(sel.getAttribute("data-dia"), 10)];
      sel.value = r.dia || "";
      sel.addEventListener("change", function () {
        S.write(function (st) {
          var v = st.media.videos.filter(function (x) { return x.id === r.id; })[0];
          if (v) v.dia = sel.value;
        });
        mensaje($("aMsg"), "«" + esc(r.nombre) + "» " +
          (sel.value ? "queda en el día " + esc(sel.value) + " del microciclo." : "ya no está asignado a ningún día."), "ok");
        aLista();
      });
    });

    Array.prototype.forEach.call(caja.querySelectorAll("button[data-quita]"), function (btn) {
      btn.addEventListener("click", function () {
        var r = filas[parseInt(btn.getAttribute("data-quita"), 10)];
        aQuitar(r);
        mensaje($("aMsg"), "«" + esc(r.nombre) + "» quitado del sitio.", "ok");
        aLista(); vLista(); fLista();
      });
    });
  }

  /** Saca la fila de donde está, sin borrar el archivo del navegador. */
  function aQuitar(r) {
    if (r.clase === "video") {
      if (LSD.esLocal(r.src)) LSD.files.borrar(r.src.slice(6));
      S.write(function (st) {
        var i = st.media.videos.findIndex(function (v) { return v.id === r.id; });
        if (i >= 0) st.media.videos.splice(i, 1);
      });
      return;
    }
    aSacar(r);
    if (LSD.esLocal(r.src)) LSD.files.borrar(r.src.slice(6));
  }

  /** Saca la foto de donde esté, sin tocar el archivo. */
  function aSacar(r) {
    if (r.tipo === "portada") S.set("site.heroImage", "");
    else if (r.tipo === "bloque") S.write(function (st) { delete st.media.images[r.id]; });
    else if (r.tipo === "dia") S.write(function (st) { (st.media.dias[r.dia] || []).splice(r.i, 1); });
    else S.write(function (st) { st.media.gallery.splice(r.i, 1); });
  }

  /** Cambia de carpeta. La portada y los bloques admiten una sola foto:
     si el destino está ocupado, la que estaba pasa a «Momentos» en vez
     de perderse, y el mensaje lo dice. */
  function aMover(r, destino) {
    var msg = $("aMsg");

    if (r.clase === "video") {
      S.write(function (st) {
        var v = st.media.videos.filter(function (x) { return x.id === r.id; })[0];
        if (!v) return;
        v.block = destino;
        v.work = null;   // una unidad de otro bloque no existe acá
      });
      mensaje(msg, "«" + esc(r.nombre) + "» → " + esc(destino ? aCarpetaLabel(destino) : "sin carpeta") + ".", "ok");
      aLista(); vLista();
      return;
    }

    if (destino === r.carpeta) return;

    var c = S.config;
    var desplazada = "";
    if (destino === "portada" && c.site.heroImage) desplazada = c.site.heroImage;
    if (destino.indexOf("bloque:") === 0) {
      var id = destino.slice(7);
      if (c.media.images && c.media.images[id]) desplazada = c.media.images[id];
    }

    var ruta = r.src;
    aSacar(r);
    if (desplazada) {
      S.write(function (st) {
        if (!Array.isArray(st.media.gallery)) st.media.gallery = [];
        st.media.gallery.push({ src: desplazada, pie: "" });
      });
    }
    fColocar(ruta, destino, r.clase === "foto" && destino === "momentos" ? r.nombre : "");

    mensaje(msg, "Movida a " + esc(aCarpetaLabel(destino)) + "." +
      (desplazada ? " La que estaba ahí pasó a «Momentos en el club»." : ""), "ok");
    aLista(); fLista();
  }



  /* =========================================================
     PESTAÑAS
     ========================================================= */
  function irA(tab) {
    ["videos", "fotos", "archivos", "consola"].forEach(function (t) {
      var pane = $("pane" + t.charAt(0).toUpperCase() + t.slice(1));
      if (pane) pane.classList.toggle("hidden", t !== tab);
    });
    Array.prototype.forEach.call($("termTabs").children, function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-tab") === tab);
    });
    if (tab === "consola" && LSD.term) setTimeout(function () { LSD.term.focus(); }, 60);
    if (tab === "videos") vLista();
    if (tab === "fotos") fLista();
    if (tab === "archivos") { mensaje($("aMsg"), ""); aLista(); }
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
      opcionesDia($("vDia"), "— sin día —");
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

      var vTomar = function (archivos) {
        var file = archivos[0];
        if (!file) return;
        var pesado = file.size > VIDEO_PESADO;
        mensaje($("vMsg"), "Guardando el vídeo…", "warn");
        LSD.files.guardar(file, function (err, clave) {
          if (err) { mensaje($("vMsg"), "No se pudo guardar el vídeo: " + esc(err.message), "err"); return; }
          vArchivo = { clave: clave, nombre: file.name, peso: file.size };
          $("vFileInfo").className = "f-detected is-on";
          $("vFileInfo").innerHTML =
            '<video src="' + esc(LSD.files.url(clave)) + '" muted></video>' +
            '<span class="d-txt"><b>' + esc(LSD.pesoLegible(file.size)) + "</b><br><em>" +
            esc(file.name) + "</em></span>";
          /* Entra igual: el peso sólo cambia lo que conviene hacer después. */
          mensaje($("vMsg"), pesado
            ? "Guardado, y se ve acá al instante. Pesa " + esc(LSD.pesoLegible(file.size)) +
              ": para publicarlo conviene subirlo a YouTube y pegar el enlace, o pasármelo y lo preparo yo."
            : "", pesado ? "warn" : "ok");
        });
      };
      conectarSelector($("vPickLib"), $("vFile"), vTomar, $("vMsg"));
      conectarSelector($("vPickCam"), $("vFileCam"), vTomar, $("vMsg"));
      zonaArrastre($("vDrop"), "video", vTomar);

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

      conectarSelector($("fPickLib"), $("fFile"), fEncolar, $("fMsg"));
      conectarSelector($("fPickCam"), $("fFileCam"), fEncolar, $("fMsg"));
      zonaArrastre($("fDrop"), "image", fEncolar);

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

      /* --- archivos --- */
      aRellenarFiltro();
      $("aTipo").addEventListener("change", aLista);
      $("aCarpeta").addEventListener("change", aLista);

      $("fPieCampo").style.display = "";
      vLista();
      fLista();
    },

    refrescar: function () {
      if (!$("paneVideos")) return;
      if (!$("paneVideos").classList.contains("hidden")) vLista();
      if (!$("paneFotos").classList.contains("hidden")) fLista();
      if (!$("paneArchivos").classList.contains("hidden")) aLista();
    }
  };
})(window, document);
