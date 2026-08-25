# Metodología de Trabajo · Luciano Santo Domingo

Sitio web que ordena y publica la metodología de entrenamiento desarrollada durante años en el
**Club Agropecuario Argentino (Carlos Casares, Argentina)** junto a distintos cuerpos técnicos: fuerza, juegos reducidos,
posesión y juegos de posición, trabajos tácticos, finalización, balón parado, control de carga y
planificación del microciclo.

La página incluye una **terminal de configuración** integrada: desde ahí se cambia el aspecto del
sitio, el formato de la galería de vídeos y se administra el archivo de vídeo, sin tocar el código.

---

## 1. Cómo verlo

**Opción rápida:** abrí `index.html` con doble clic. No hace falta compilar nada — es HTML, CSS y
JavaScript puro, sin dependencias.

**Con servidor local** (recomendado, para que todo funcione igual que en producción):

```bash
python3 -m http.server 8080
# después, en el navegador: http://localhost:8080
```

**Publicarlo en internet:** subí el repositorio a GitHub y activá **GitHub Pages**
(Settings › Pages › Deploy from a branch › rama y carpeta `/root`). No requiere ninguna configuración
adicional.

---

## 2. La terminal de configuración

Se abre de tres formas:

- Pulsando la tecla **`` ` ``** (o **Ctrl + `**)
- Con el botón **TERMINAL** de la cabecera
- Con el botón flotante de la esquina inferior derecha

Dentro:

| Atajo | Qué hace |
|---|---|
| `Tab` | Autocompleta el comando o el valor |
| `↑` `↓` | Recorre el historial y las sugerencias |
| `Enter` | Ejecuta |
| `Ctrl + L` | Limpia la pantalla |
| `Esc` | Cierra la terminal |

Escribí `ayuda` para ver todos los comandos, y `ayuda <comando>` para el detalle de uno.
Se pueden encadenar comandos con `;` — por ejemplo: `tema cancha ; videos formato mosaico`.

---

## 3. Comandos

### Básicos
```
ayuda [comando]        Lista de comandos, o detalle de uno
estado                 Resumen de toda la configuración actual
config [filtro]        Todas las claves configurables con su valor
buscar <texto>         Busca en bloques, unidades de trabajo y vídeos
abrir <sección>        Desplaza la página hasta una sección
limpiar · salir        Limpiar pantalla · cerrar la terminal
```

### Aspecto de la página
```
tema lista             Muestra las paletas disponibles
tema cancha            Aplica una paleta completa
color acento #d8ff3e   Cambia un color suelto (acento, fondo, texto, borde…)
fuente condensada      archivo · condensada · inter · mono · serif
densidad amplia        compacta · normal · amplia
layout ancho           Ancho del contenedor: caja · ancho · completo
portada dividida       Estilo de la portada: completa · dividida · minima · apagada
nav lateral            Menú: arriba · lateral · oculta
tarjeta suave          Tarjetas: recta · suave · contorno · vidrio
set theme.radius 8     Cualquier ajuste, por su clave exacta
```

### Formato de los vídeos
```
videos formato mosaico     grid · mosaico · masonry · lista · carrusel · cine
videos columnas 4          1 a 6, o "auto"
videos proporcion 1:1      16:9 · 4:3 · 3:2 · 1:1 · 9:16 · 21:9  (o cuadrado/vertical/panoramico)
videos tamano grande       mini · chico · mediano · grande · enorme
videos alineacion centro   izquierda · centro · derecha · completo
videos separacion 32       Espacio entre vídeos, en píxeles
videos efecto elevar       zoom · elevar · ninguno
videos reproductor ventana ventana (modal) · incrustado (dentro de la tarjeta)
videos titulo off          Mostrar u ocultar título, meta, etiquetas, descripción
videos autoplay on         Reproducción automática al abrir
```

### Archivo de vídeos
```
video add "Rondo 4v2" https://youtu.be/XXXX --bloque posesion
video add "Nordic curl" https://youtu.be/YYYY --trabajo prevencion --tags "prevención,isquios" --dur 1:40
video list [bloque]              Lista el archivo, numerado
video edit <id|#n> <campo> <v>   campos: titulo, url, bloque, trabajo, tags, dur, desc, poster, destacado
video mover <id|#n> <bloque>     Cambia el vídeo de bloque
video destacar <id|#n>           Marca o desmarca como destacado
video orden <id|#n> <posición>   Reordena
video rm <id|#n>                 Borra un vídeo
video vaciar --si                Borra todos
video export · video import      Descarga o carga el archivo en JSON
demo                             Carga 10 vídeos de ejemplo para probar los formatos
```

**Plataformas admitidas:** YouTube (incluidos Shorts), Vimeo, Google Drive, Dailymotion, Streamable
y archivos de vídeo directos (`.mp4`, `.webm`, `.mov`). Basta con pegar el enlace tal cual: el
proveedor y la miniatura se detectan solos.

> **Google Drive:** el vídeo tiene que estar compartido como *"Cualquier persona con el enlace"*
> para que se vea desde la web.

### Fotografías
```
imagen portada assets/img/foto.jpg    Foto de fondo de la portada
imagen bloque ssg assets/img/ssg.jpg  Foto de un bloque (se ve en su tarjeta)
imagen listar                         Qué foto tiene puesta cada cosa
imagen quitar ssg · imagen quitar portada · imagen quitar todas
imagen trato bn                       Tratamiento: bn · color · duotono
```

Podés usar una URL de internet o una ruta del propio repositorio. Para fotos propias, guardalas en
`assets/img/` y referencialas como `assets/img/nombre.jpg`. Sin fotos, el sitio mantiene su aspecto
tipográfico: las imágenes son opcionales en todos lados.

### Secciones y contenido
```
bloques                     Lista los bloques y sus identificadores
trabajos [bloque]           Lista las unidades de trabajo y sus identificadores
seccion listar              Estado de las secciones de la página
seccion ocultar videos      Oculta una sección
seccion orden bloques videos trabajos microciclo
texto tagline "…"           Edita los textos del sitio (portada, intro, contacto…)
```

### Datos
```
exportar          Descarga toda la configuración como copia de seguridad
importar          Abre un cuadro para pegar una configuración guardada
publicar          Genera data/config.js para dejar los ajustes fijos en el sitio
reset [ámbito]    Restablece: tema · layout · video · site · terminal · todo
clave miClave     Protege la terminal con una clave (protección visual, no criptográfica)
```

---

## 4. Cómo dejar los cambios fijos para todos

Los cambios que hacés desde la terminal se guardan **en tu navegador** (`localStorage`), así que sólo
los ves vos. Para que los vea cualquier visitante:

1. Dejá el sitio como querés que quede.
2. Escribí `publicar` en la terminal → se descarga un archivo `config.js`.
3. Reemplazá con él el archivo `data/config.js` del repositorio.
4. Subí el cambio (`git add`, `git commit`, `git push`).

A partir de ese momento, esa configuración —incluidos los vídeos cargados— es la que ve todo el
mundo al entrar.

---

## 5. Estructura del proyecto

```
index.html                  Estructura de la página
data/
  methodology.js            TODO el contenido metodológico (bloques, unidades, microciclo)
  config.js                 Configuración publicada del sitio (la genera `publicar`)
assets/
  css/base.css              Tokens de diseño, reset y tipografía
  css/site.css              Cabecera, portada, secciones, tarjetas y galería de vídeo
  css/terminal.css          Estilos de la terminal
  js/store.js               Configuración, esquema de ajustes y persistencia
  js/media.js               Detección de proveedor de vídeo, embeds y miniaturas
  img/                      Tus fotografías (ver assets/img/LEEME.txt)
  js/render.js              Aplicación del tema y pintado de la página
  js/terminal.js            Motor de la consola (historial, autocompletado, parser)
  js/commands.js            Todos los comandos
  js/app.js                 Arranque
```

---

## 6. Editar la metodología

El contenido vive en **`data/methodology.js`**. Cada bloque tiene esta forma:

```js
{
  id: "ssg",                       // identificador que se usa en los comandos
  code: "03",
  title: "Juegos Reducidos · Small-Sided Games",
  short: "Reducidos",              // etiqueta corta para filtros
  desc: "…",
  items: [ /* unidades de trabajo */ ]
}
```

Y cada unidad de trabajo se describe siempre con la misma ficha, para mantener un lenguaje común:

```js
{
  id: "ssg-3v3",
  name: "SSG 3v3 y 4v4 · Formato Madre",
  objetivo:  "…",                  // para qué sirve la tarea
  formato:   "3v3 / 4v4 · 4-6 series de 2-4'",
  espacio:   "30×20 a 40×30 m",
  duracion:  "16-24 min efectivos",
  claves:    ["…", "…"],           // claves de ejecución
  variantes: ["…", "…"],
  tags:      ["SSG", "posesión"]
}
```

Añadir un bloque o una unidad es agregar un objeto más al array: la página, los filtros, el buscador
y el autocompletado de la terminal lo recogen solos.

**Estado actual del archivo:** 9 bloques · 61 unidades de trabajo · microciclo tipo de 7 días.

---

## 7. Referencias metodológicas

La estructura de contenidos sigue el marco habitual de la planificación en fútbol profesional:
periodización táctica y microciclo estructurado (alternancia tensión / duración / velocidad entre
MD-4 y MD-2), clasificación de juegos reducidos por número de jugadores y área relativa, y control
de carga combinando carga interna (sRPE) y externa (GPS).

- [Microciclos en fútbol: estructura semanal del MD-5 al MD+1 — Barça Innovation Hub](https://barcainnovationhub.fcbarcelona.com/es/blog/microciclos-futbol-estructura-semanal-md5-md1/)
- [Periodización táctica: cómo diseñar un morfociclo patrón — Efficient Football](https://efficientfootball.com/periodizacion-tactica-morfociclo-patron/)
- [Juegos reducidos en fútbol: cómo construirlos en el entrenamiento — Efficient Football](https://efficientfootball.com/juegos-reducidos-en-futbol/)
- [Los juegos reducidos como metodología de enseñanza en el fútbol (Dialnet)](https://dialnet.unirioja.es/descarga/articulo/6885200.pdf)
- [Carga de entrenamiento dentro de un microciclo de fútbol. Revisión sistemática](https://futbolrevolucionario.com/carga-de-entrenamiento-dentro-de-un-microciclo-de-futbol-revision-sistematica/)

---

© Luciano Santo Domingo · Club Agropecuario Argentino, Carlos Casares, Argentina.
