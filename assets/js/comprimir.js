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
