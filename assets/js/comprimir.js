/* =============================================================
   comprimir.js — dejar las fotos en tamaño publicable
   -------------------------------------------------------------
   La regla es entrar con lo que haya y comprimir acá, no rechazar.
   Una foto que ya está bien no se toca: reencodar sin necesidad
   sólo le quita calidad.

   createImageBitmap con imageOrientation:"from-image" respeta la
   orientación EXIF, que es lo que rota las fotos de teléfono.
   ============================================================= */
(function (w) {
  "use strict";
  var LSD = w.LSD = w.LSD || {};

  var LADO_MAX = 2560;              // suficiente para la portada en pantalla retina
  var PESO_OBJETIVO = 2 * 1024 * 1024;
  var CALIDADES = [0.92, 0.86, 0.8, 0.74];   // nunca más abajo: se empieza a notar

  function medidas(ancho, alto) {
    var lado = Math.max(ancho, alto);
    if (lado <= LADO_MAX) return { ancho: ancho, alto: alto, escala: 1 };
    var k = LADO_MAX / lado;
    return { ancho: Math.round(ancho * k), alto: Math.round(alto * k), escala: k };
  }

  /** Prueba las calidades de mayor a menor y se queda con la primera que entra. */
  function encodar(canvas, i, cb) {
    canvas.toBlob(function (blob) {
      if (!blob) { cb(new Error("El navegador no pudo generar la imagen.")); return; }
      if (blob.size <= PESO_OBJETIVO || i >= CALIDADES.length - 1) { cb(null, blob, CALIDADES[i]); return; }
      encodar(canvas, i + 1, cb);
    }, "image/jpeg", CALIDADES[i]);
  }

  /**
   * Deja la foto lista para publicar.
   * cb(err, { file, ancho, alto, pesoOriginal, pesoFinal, recomprimido, calidad })
   * Si algo falla — un formato que el navegador no abre, por ejemplo — devuelve
   * el archivo original sin tocar y lo dice en `motivo`, en vez de perder la foto.
   */
  LSD.comprimirImagen = function (file, cb) {
    var original = {
      file: file, ancho: 0, alto: 0,
      pesoOriginal: file.size, pesoFinal: file.size,
      recomprimido: false, calidad: 0, motivo: ""
    };

    if (!w.createImageBitmap || !file.type || file.type.indexOf("image") !== 0) {
      original.motivo = "no-imagen";
      cb(null, original);
      return;
    }

    w.createImageBitmap(file, { imageOrientation: "from-image" }).then(function (bmp) {
      var m = medidas(bmp.width, bmp.height);
      original.ancho = bmp.width;
      original.alto = bmp.height;

      // Ya está bien: ni pesa de más ni es más grande de lo que el sitio usa.
      if (m.escala === 1 && file.size <= PESO_OBJETIVO) {
        bmp.close && bmp.close();
        cb(null, original);
        return;
      }

      var canvas = document.createElement("canvas");
      canvas.width = m.ancho;
      canvas.height = m.alto;
      var ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bmp, 0, 0, m.ancho, m.alto);
      bmp.close && bmp.close();

      encodar(canvas, 0, function (err, blob, calidad) {
        if (err) { original.motivo = "sin-encoder"; cb(null, original); return; }

        // Si el JPEG sale más pesado que el original y encima no hubo que
        // escalar, el original ya estaba mejor comprimido: se queda.
        if (blob.size >= file.size && m.escala === 1) {
          cb(null, original);
          return;
        }

        var nombre = (file.name || "foto").replace(/\.[^.]+$/, "") + ".jpg";
        var salida;
        try { salida = new File([blob], nombre, { type: "image/jpeg" }); }
        catch (e) { salida = blob; salida.name = nombre; }

        cb(null, {
          file: salida, ancho: m.ancho, alto: m.alto,
          pesoOriginal: file.size, pesoFinal: blob.size,
          recomprimido: true, calidad: calidad, motivo: ""
        });
      });
    }).catch(function () {
      // Caso típico: un HEIC en un navegador que no lo decodifica.
      original.motivo = /heic|heif/i.test(file.type + " " + file.name) ? "heic" : "ilegible";
      cb(null, original);
    });
  };

  /* =============================================================
     Portada de un vídeo
     -------------------------------------------------------------
     Un archivo del dispositivo no trae miniatura, así que la
     tarjeta quedaba negra. Se saca un fotograma del propio vídeo.
     ============================================================= */
  var POSTER_ANCHO = 1280;

  /** ¿El fotograma es una pantalla plana —negro de arranque, fundido—? */
  function fotogramaPlano(ctx, ancho, alto) {
    var d;
    try { d = ctx.getImageData(0, 0, ancho, alto).data; }
    catch (e) { return false; }          // sin permiso para leerlo: se acepta
    var n = 0, sum = 0, sum2 = 0;
    for (var i = 0; i < d.length; i += 4 * 97) {   // una muestra cada tantos píxeles
      var lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      sum += lum; sum2 += lum * lum; n++;
    }
    if (!n) return false;
    var media = sum / n;
    var desvio = Math.sqrt(Math.max(0, sum2 / n - media * media));
    return desvio < 8 && media < 40;     // casi sin contraste y oscuro
  }

  /**
   * Saca un fotograma del vídeo y lo devuelve como JPEG.
   * cb(err, { blob, ancho, alto, duracion, segundo })
   * Prueba varios instantes: si el primero sale negro —un fundido de
   * entrada, por ejemplo—, sigue más adelante en vez de entregar una
   * portada inservible.
   */
  LSD.posterDeVideo = function (file, segundo, cb) {
    if (!file || !w.URL || !w.URL.createObjectURL) { cb(new Error("Sin archivo.")); return; }

    var url = URL.createObjectURL(file);
    var vid = document.createElement("video");
    vid.muted = true;                    // sin esto iOS no pinta el fotograma
    vid.playsInline = true;
    vid.setAttribute("playsinline", "");
    vid.preload = "auto";
    vid.crossOrigin = "anonymous";
    vid.style.cssText = "position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0";
    document.body.appendChild(vid);

    var terminado = false;
    function limpiar() {
      try { URL.revokeObjectURL(url); } catch (e) {}
      if (vid.parentNode) vid.parentNode.removeChild(vid);
    }
    function fallar(msg) {
      if (terminado) return;
      terminado = true; limpiar(); cb(new Error(msg));
    }
    function entregar(blob, ancho, alto, seg) {
      if (terminado) return;
      terminado = true;
      var dur = vid.duration;
      limpiar();
      cb(null, { blob: blob, ancho: ancho, alto: alto, duracion: dur, segundo: seg });
    }

    var guardia = setTimeout(function () { fallar("El vídeo tardó demasiado en abrirse."); }, 20000);

    vid.addEventListener("error", function () { clearTimeout(guardia); fallar("El navegador no pudo abrir este vídeo."); });

    vid.addEventListener("loadeddata", function () {
      var dur = isFinite(vid.duration) && vid.duration > 0 ? vid.duration : 0;
      // El instante pedido primero; después, puntos de rescate.
      var intentos = [];
      var pedido = Number(segundo) || 0;
      if (pedido > 0 && (!dur || pedido < dur - 0.2)) intentos.push(pedido + 0.15);
      [1, 2, 5].forEach(function (s) { if (!dur || s < dur - 0.2) intentos.push(s); });
      if (dur) intentos.push(dur * 0.2, dur * 0.5);
      if (!intentos.length) intentos.push(0);

      var i = 0;
      function probar() {
        if (i >= intentos.length) { clearTimeout(guardia); fallar("No se pudo sacar un fotograma."); return; }
        var t = intentos[i++];
        var alSaltar = function () {
          vid.removeEventListener("seeked", alSaltar);
          var ancho = Math.min(POSTER_ANCHO, vid.videoWidth || POSTER_ANCHO);
          var alto = Math.round(ancho * ((vid.videoHeight || 720) / (vid.videoWidth || 1280)));
          var cv = document.createElement("canvas");
          cv.width = ancho; cv.height = alto;
          var ctx = cv.getContext("2d");
          try { ctx.drawImage(vid, 0, 0, ancho, alto); }
          catch (e) { clearTimeout(guardia); fallar("No se pudo dibujar el fotograma."); return; }

          // Si salió negro y quedan instantes por probar, se sigue buscando.
          if (fotogramaPlano(ctx, ancho, alto) && i < intentos.length) { probar(); return; }

          cv.toBlob(function (blob) {
            clearTimeout(guardia);
            if (!blob) { fallar("No se pudo generar la portada."); return; }
            entregar(blob, ancho, alto, t);
          }, "image/jpeg", 0.82);
        };
        vid.addEventListener("seeked", alSaltar);
        try { vid.currentTime = t; }
        catch (e) { vid.removeEventListener("seeked", alSaltar); probar(); }
      }
      probar();
    });

    vid.src = url;
    vid.load();
  };

  /** "4,8 MB → 1,2 MB · 2560×1707", o sólo el peso si no se tocó. */
  LSD.resumenCompresion = function (r) {
    var peso = LSD.pesoLegible;
    if (!r.recomprimido) {
      var txt = peso(r.pesoOriginal);
      if (r.ancho) txt += " · " + r.ancho + "×" + r.alto;
      if (r.motivo === "heic") txt += " · HEIC sin convertir";
      return txt;
    }
    return peso(r.pesoOriginal) + " → " + peso(r.pesoFinal) + " · " + r.ancho + "×" + r.alto;
  };
})(window);
