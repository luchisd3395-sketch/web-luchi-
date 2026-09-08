/* =============================================================
   build-preview.mjs — empaqueta el sitio en un solo archivo
   -------------------------------------------------------------
   Genera dist/preview.html: el sitio entero autocontenido, con el
   CSS, el JavaScript y las fotos incrustados. Sirve para publicar
   una vista previa en un sitio que sólo acepta una página suelta,
   o para abrir el sitio sin levantar un servidor.

       node tools/build-preview.mjs

   Lo único que sigue viniendo de fuera es la hoja de Google Fonts.
   ============================================================= */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const leer = (p) => fs.readFileSync(path.join(raiz, p), "utf8");
const kb = (n) => (n / 1024).toFixed(0) + " KB";
const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";

let html = leer("index.html");

/* --- 1. Atributos de la etiqueta <html> ---------------------------
   La página publicada aporta su propio esqueleto, así que estos
   atributos se pierden. Se vuelven a poner por script antes de que
   se pinte nada, para que no haya un parpadeo de tema. */
const attrs = {};
const etiqueta = html.match(/<html\b([^>]*)>/i);
if (etiqueta) {
  for (const m of etiqueta[1].matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)) attrs[m[1]] = m[2];
}
delete attrs.lang;

/* --- 2. Hojas de estilo ------------------------------------------ */
let nCss = 0;
html = html.replace(/[ \t]*<link[^>]*rel="stylesheet"[^>]*href="((?:assets|data)\/[^"]+)"[^>]*>\n?/gi,
  (_, ruta) => {
    nCss++;
    return `<style>\n/* ${ruta} */\n${leer(ruta)}\n</style>\n`;
  });

/* --- 3. Scripts --------------------------------------------------- */
let nJs = 0;
html = html.replace(/[ \t]*<script[^>]*src="((?:assets|data)\/[^"]+)"[^>]*><\/script>\n?/gi,
  (_, ruta) => {
    nJs++;
    return `<script>\n/* ${ruta} */\n${leer(ruta)}\n</script>\n`;
  });

/* --- 4. Fotografías ----------------------------------------------
   Sólo se sustituyen las rutas que corresponden a un archivo real.
   Las de los textos de ayuda de la terminal (assets/img/foto.jpg y
   similares) no existen, así que quedan tal cual y la ayuda se
   sigue leyendo bien. */
const tipos = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const dirImg = path.join(raiz, "assets/img");
let nImg = 0, pesoImg = 0;

for (const archivo of fs.readdirSync(dirImg).sort()) {
  const ext = path.extname(archivo).toLowerCase();
  if (!tipos[ext]) continue;
  const ruta = "assets/img/" + archivo;
  if (!html.includes(ruta)) continue;
  const datos = fs.readFileSync(path.join(dirImg, archivo));
  const uri = `data:${tipos[ext]};base64,${datos.toString("base64")}`;
  html = html.split(ruta).join(uri);
  nImg++; pesoImg += datos.length;
}

/* --- 5. Fuera el esqueleto ---------------------------------------- */
html = html
  .replace(/<!DOCTYPE[^>]*>\s*/i, "")
  .replace(/<html\b[^>]*>\s*/i, "")
  .replace(/<\/html>\s*$/i, "")
  .replace(/<head\b[^>]*>\s*/i, "")
  .replace(/<\/head>\s*/i, "")
  .replace(/<body\b[^>]*>\s*/i, "")
  .replace(/<\/body>\s*/i, "")
  .replace(/^\s*<meta\s+charset[^>]*>\s*/im, "")
  .trim();

/* --- 5b. Nombre de la vista previa -------------------------------
   El título del sitio lleva el nombre completo, que es lo correcto para
   buscadores. En una galería de páginas conviene el nombre a secas. */
html = html.replace(/<title>[\s\S]*?<\/title>/i, "<title>Metodología Santo Domingo</title>");

/* --- 6. Reponer los atributos antes de pintar --------------------- */
const arranque =
  `<script>\n/* La página publicada trae su propio esqueleto: se reponen los\n` +
  `   atributos de <html> antes de pintar, para que no haya parpadeo. */\n` +
  `(function(r){var a=${JSON.stringify(attrs)};for(var k in a)r.setAttribute(k,a[k]);})(document.documentElement);\n` +
  `/* Marca la vista previa: acá el navegador bloquea las descargas. */\n` +
  `window.LSD_PREVIEW = true;\n` +
  `</script>\n`;

html = arranque + html;

/* --- 7. Escribir -------------------------------------------------- */
fs.mkdirSync(path.join(raiz, "dist"), { recursive: true });
const salida = path.join(raiz, "dist/preview.html");
fs.writeFileSync(salida, html, "utf8");

const total = Buffer.byteLength(html, "utf8");
console.log(`hojas de estilo incrustadas : ${nCss}`);
console.log(`scripts incrustados         : ${nJs}`);
console.log(`fotografías incrustadas     : ${nImg}  (${mb(pesoImg)} en disco)`);
console.log(`atributos repuestos         : ${Object.keys(attrs).join(", ")}`);
console.log(`\ndist/preview.html           : ${mb(total)}  (${kb(total)})`);
if (total > 6 * 1024 * 1024) {
  console.log("\n⚠  Por encima de 6 MB: conviene reescalar las fotos antes de publicar.");
}
