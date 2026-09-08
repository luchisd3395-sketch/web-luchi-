/* =============================================================
   filestore.js — archivos subidos desde el dispositivo
   -------------------------------------------------------------
   El sitio es estático: un archivo elegido en el navegador no puede
   subirse solo al repositorio. Lo que sí se puede es guardarlo acá
   para que se vea funcionando al instante, y avisar de que está
   pendiente de publicar.

   Los registros guardan la ruta como "local:<clave>" y se resuelve
   con LSD.resolveUrl() en el momento de pintar.
   ============================================================= */
(function (w) {
  "use strict";
  var LSD = w.LSD = w.LSD || {};

  var BASE = "lsd-archivos";
  var ALMACEN = "archivos";
  var db = null;
  var urls = {};     // clave -> URL de objeto
  var meta = {};     // clave -> { nombre, tipo, peso, fecha }
  var listo = false;

  function abrir(cb) {
    if (!w.indexedDB) { cb(new Error("Este navegador no guarda archivos.")); return; }
    var req;
    try { req = w.indexedDB.open(BASE, 1); }
    catch (e) { cb(e); return; }
    req.onupgradeneeded = function () {
      var d = req.result;
      if (!d.objectStoreNames.contains(ALMACEN)) d.createObjectStore(ALMACEN, { keyPath: "clave" });
    };
    req.onsuccess = function () { db = req.result; cb(null, db); };
    req.onerror = function () { cb(req.error || new Error("No se pudo abrir el almacén.")); };
  }

  /** Un QuotaExceededError dice poco: se cambia por lo que hay que hacer. */
  function traducir(err) {
    var nombre = err && err.name ? err.name : "";
    if (nombre === "QuotaExceededError" || /quota/i.test(nombre)) {
      return new Error("Se llenó el espacio que el navegador le da a esta página. " +
        "Publicá lo que ya subiste y después escribí «archivos limpiar» en la consola para liberar sitio.");
    }
    return err || new Error("No se pudo guardar el archivo.");
  }

  function nuevaClave() {
    return "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  var files = LSD.files = {

    /** Abre el almacén y prepara las URL de todo lo guardado. */
    init: function (cb) {
      cb = cb || function () {};
      abrir(function (err) {
        if (err) { listo = true; cb(err); return; }
        var tx = db.transaction(ALMACEN, "readonly").objectStore(ALMACEN).getAll();
        tx.onsuccess = function () {
          (tx.result || []).forEach(function (r) {
            try { urls[r.clave] = URL.createObjectURL(r.blob); } catch (e) {}
            meta[r.clave] = { nombre: r.nombre, tipo: r.tipo, peso: r.peso, fecha: r.fecha };
          });
          listo = true;
          cb(null, (tx.result || []).length);
        };
        tx.onerror = function () { listo = true; cb(tx.error); };
      });
    },

    listo: function () { return listo; },
    disponible: function () { return !!db; },

    /** Guarda un File y devuelve su clave por callback. */
    guardar: function (file, cb) {
      if (!db) { cb(new Error("El almacén de archivos no está disponible en este navegador.")); return; }
      var clave = nuevaClave();
      var reg = {
        clave: clave, blob: file,
        nombre: file.name || "archivo",
        tipo: file.type || "",
        peso: file.size || 0,
        fecha: new Date().toISOString().slice(0, 10)
      };
      var tx;
      try { tx = db.transaction(ALMACEN, "readwrite").objectStore(ALMACEN).put(reg); }
      catch (e) { cb(traducir(e)); return; }
      tx.onsuccess = function () {
        try { urls[clave] = URL.createObjectURL(file); } catch (e) {}
        meta[clave] = { nombre: reg.nombre, tipo: reg.tipo, peso: reg.peso, fecha: reg.fecha };
        cb(null, clave);
      };
      tx.onerror = function () { cb(traducir(tx.error)); };
    },

    /** Cuánto espacio hay usado y disponible, si el navegador lo dice. */
    espacio: function (cb) {
      var nav = w.navigator;
      if (!nav || !nav.storage || !nav.storage.estimate) { cb(null); return; }
      nav.storage.estimate().then(function (e) {
        cb({ usado: e.usage || 0, total: e.quota || 0 });
      }, function () { cb(null); });
    },

    borrar: function (clave, cb) {
      cb = cb || function () {};
      if (!db) { cb(); return; }
      if (urls[clave]) { try { URL.revokeObjectURL(urls[clave]); } catch (e) {} }
      delete urls[clave]; delete meta[clave];
      var tx;
      try { tx = db.transaction(ALMACEN, "readwrite").objectStore(ALMACEN).delete(clave); }
      catch (e) { cb(e); return; }
      tx.onsuccess = function () { cb(); };
      tx.onerror = function () { cb(tx.error); };
    },

    /** Devuelve el archivo guardado, para volver a trabajarlo (una portada
       nueva, por ejemplo) sin pedirle a la persona que lo suba de nuevo. */
    archivo: function (clave, cb) {
      if (!db) { cb(new Error("El almacén de archivos no está disponible.")); return; }
      var tx;
      try { tx = db.transaction(ALMACEN, "readonly").objectStore(ALMACEN).get(clave); }
      catch (e) { cb(e); return; }
      tx.onsuccess = function () {
        var r = tx.result;
        if (!r || !r.blob) { cb(new Error("Ese archivo ya no está guardado.")); return; }
        var f = r.blob;
        try { f = new File([r.blob], r.nombre || "archivo", { type: r.tipo || r.blob.type }); }
        catch (e) {}
        cb(null, f);
      };
      tx.onerror = function () { cb(tx.error || new Error("No se pudo leer el archivo.")); };
    },

    url: function (clave) { return urls[clave] || ""; },
    info: function (clave) { return meta[clave] || null; },
    claves: function () { return Object.keys(meta); },

    /** Peso total de lo guardado, en bytes. */
    peso: function () {
      return Object.keys(meta).reduce(function (t, k) { return t + (meta[k].peso || 0); }, 0);
    },

    /** Quita del almacén lo que ya nadie referencia. */
    limpiar: function (cb) {
      cb = cb || function () {};
      var c = LSD.store.config;
      var enUso = {};
      var marcar = function (u) {
        var s = String(u || "");
        if (s.indexOf("local:") === 0) enUso[s.slice(6)] = 1;
      };
      (c.media.videos || []).forEach(function (v) { marcar(v.url); marcar(v.poster); });
      (c.media.gallery || []).forEach(function (f) { marcar(f.src); });
      Object.keys(c.media.images || {}).forEach(function (k) { marcar(c.media.images[k]); });
      (c.media.heroVideos || []).forEach(function (v) { marcar(v.url); });
      marcar(c.site.heroImage);

      var sobran = files.claves().filter(function (k) { return !enUso[k]; });
      var quedan = sobran.length;
      if (!quedan) { cb(0); return; }
      sobran.forEach(function (k) { files.borrar(k, function () { if (!--quedan) cb(sobran.length); }); });
    }
  };

  /** "local:clave" → URL de objeto. Cualquier otra cosa vuelve igual. */
  LSD.resolveUrl = function (u) {
    var s = String(u || "");
    return s.indexOf("local:") === 0 ? files.url(s.slice(6)) : s;
  };

  LSD.esLocal = function (u) { return String(u || "").indexOf("local:") === 0; };

  /** Peso legible: 4,2 MB */
  LSD.pesoLegible = function (n) {
    if (!n) return "0 KB";
    return n >= 1024 * 1024
      ? (n / 1024 / 1024).toFixed(1).replace(".", ",") + " MB"
      : Math.round(n / 1024) + " KB";
  };
})(window);
