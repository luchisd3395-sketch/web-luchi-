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

## 2. Vista previa en un solo archivo

Para mirar el sitio sin clonar el repositorio ni levantar un servidor:

```bash
node tools/build-preview.mjs
```

Genera `dist/preview.html`: el sitio entero en un único archivo, con el CSS, el JavaScript y las
fotografías incrustadas. Se abre con doble clic y funciona todo, terminal incluida. Lo único que
sigue viniendo de internet es la tipografía.

Dos avisos sobre ese archivo:

- **Las descargas no funcionan** si se publica como página suelta (el navegador las bloquea en ese
  contexto). `exportar` y `publicar` lo dicen en vez de fallar en silencio. Abierto como archivo
  local o servido normalmente, sí funcionan.
- Pesa unos 4,4 MB porque lleva las fotos dentro. Se regenera cada vez que cambia el sitio.

## 3. El estilo

Los cuatro colores del Club Agropecuario Argentino: **blanco, negro, rojo y verde**. Titulares en
**condensada pesada y mayúsculas**, y el recurso que ordena toda la página: una **barra gruesa de
color bajo cada titular**.

- **Rojo** (`#d81222`) para la acción: subrayado de titulares, botón de reproducción, filtro
  activo, enlace de navegación activo, barra inferior de las tarjetas, cargas altas.
- **Verde** (`#0a7d3f`) para la clasificación: códigos de bloque, etiquetas, fichas, cargas bajas.
- **Bandas negras** que alternan con el blanco de la página, para que la sección de vídeo resalte.
  Viene activada en la sección de vídeos y se cambia sección por sección.

Los dos tonos están elegidos para leerse bien sobre blanco (5,2:1 de contraste ambos). Dentro de
las bandas negras la página los aclara sola, subiendo la luminosidad sin tocar el tono, para que
no pierdan contraste ni se vuelvan pasteles.

Las tarjetas de bloque con foto llevan la imagen a sangre, el titular en blanco abajo y la barra
de acento en el borde inferior; la descripción aparece al pasar el cursor.

Todo se cambia desde la terminal. Hay diez paletas, claras y oscuras (`tema lista`):

```
tema agro                   Blanco, negro, rojo y verde del club (por defecto)
tema pista                  Igual, con naranja en lugar del rojo
tema club                   Los colores del club sobre fondo oscuro
tema noir                   Negro absoluto
color acento #d81222        Color principal (rojo)
color secundario #0a7d3f    Color secundario (verde)
fuente anton                anton · archivo · condensed · inter · mono · serif
seccion invertir videos     Pone una sección sobre fondo negro
seccion normal videos       La devuelve al fondo de la página
```

> **La tipografía de titulares es Anton**, que se descarga de Google Fonts. Si no llega a cargar
> (sin conexión, o una red que la bloquee), la página lo detecta midiendo el ancho del texto y
> cambia sola a una alternativa que aguanta el peso, en vez de quedar con una fuente fina.

## 4. La terminal de configuración

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

## 5. Comandos

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
videos previsualizar on    Previsualiza el vídeo en silencio al pasar el cursor (archivos .mp4 propios)
```

### Archivo de vídeos
```
video add "Rondo 4v2" https://youtu.be/XXXX --bloque posesion
video add "Nordic curl" https://youtu.be/YYYY --trabajo prevencion --tags "prevención,isquios" --dur 1:40
video list [bloque]              Lista el archivo, numerado
video edit <id|#n> <campo> <v>   campos: titulo, url, bloque, trabajo, tags, dur, desc, poster, destacado
mover 3 ssg                      Mueve vídeos: uno, varios (1 2 5), un rango (2-7) o todos
mover 3 ssg-3v3                  El destino también puede ser una unidad de trabajo
mover --de posesion --a ssg      Mueve todo un bloque de una vez
renombrar                        Abre la lista completa de nombres para editarla de una sentada
renombrar 3 "Rondo 5v2"          Renombra uno solo
video destacar <id|#n>           Marca o desmarca como destacado
video orden <id|#n> <posición>   Reordena
video rm <id|#n>                 Borra un vídeo
video vaciar --si                Borra todos
video export · video import      Descarga o carga el archivo en JSON
lote                             Carga muchos vídeos de una vez, pegando una lista
fragmentos <url> --bloque <id>   Da de alta varios tramos de un mismo vídeo
demo                             Carga 10 vídeos de ejemplo para probar los formatos
```

**Fragmentos de una misma grabación.** Si tenés una sesión larga con varias actividades dentro,
no hace falta cortar el vídeo ni volver a subirlo: cada tramo se da de alta como una pieza propia
que reproduce sólo su fragmento.

```
fragmentos https://youtu.be/xxxxxxx --bloque ssg
```

Abre un cuadro para pegar la lista de actividades, una por línea:

```
Entrada en calor con balón | 0:12 | 0:32
Rondo 5v2 | 1:05 | 1:25 | ssg-3v3 | SSG,activación
SSG 4v4 con comodines | 2:40 | 3:00
Actividad sin fin declarado | 3:30
```

Nombre e inicio son obligatorios; el fin, la unidad de trabajo y las etiquetas son opcionales. Si
no ponés el fin se usan 20 segundos (`--duracion 15` cambia ese valor). Los tiempos admiten
`2:05`, `125` o `1:02:05`. Avisa si dos tramos se pisan.

**También podés pegar sólo los tiempos**, sin nombrar nada:

```
0:12 | 0:32
1:05 | 1:25
2:40 | 3:00
```

Se numeran solas como *Actividad 1, 2, 3…* y les ponés nombre después con `renombrar`, que abre
la lista entera para editarla de una sentada:

```
1 | Entrada en calor con balón        (0:12–0:32)
2 | Rondo 5v2                         (1:05–1:25)
```

Cambiás el texto a la derecha de la barra y listo. Las líneas que no toques quedan igual, y el
tiempo entre paréntesis es informativo: no hace falta borrarlo.

Para un fragmento suelto: `video add "Título" <url> --bloque ssg --desde 2:05 --hasta 2:25`, y
`video edit <id> desde 2:10` para ajustarlo después. La duración se recalcula sola.

**Carga por lotes.** Para muchos vídeos, `lote` abre un cuadro donde se pega una lista de texto,
una línea por vídeo:

```
Rondo 4v2 · circulación | posesion | https://youtu.be/xxxxxxx
SSG 4v4 cuatro mini-arcos | ssg | https://youtu.be/yyyyyyy
Nordic curl · progresión | fuerza | https://youtu.be/zzzzzzz | prevencion | prevención,isquiosurales
```

Los tres primeros campos son obligatorios (título, bloque, URL); los dos últimos, opcionales
(unidad de trabajo y etiquetas). El separador puede ser `|`, `;` o un tabulador, así que se puede
pegar directo desde una planilla. Las líneas vacías y las que empiezan con `#` se ignoran.

Si alguna línea tiene un error, **no se carga ninguna** y se listan los problemas con su número de
línea, para corregir y volver a pegar. Con `lote --parcial` se cargan sólo las correctas.

**Plataformas admitidas:** YouTube (incluidos Shorts), Vimeo, Google Drive, Dailymotion, Streamable
y archivos de vídeo directos (`.mp4`, `.webm`, `.mov`). Basta con pegar el enlace tal cual: el
proveedor y la miniatura se detectan solos.

> **Google Drive:** el vídeo tiene que estar compartido como *"Cualquier persona con el enlace"*
> para que se vea desde la web.

### Portada
```
portada video assets/video/entrenamiento.mp4   Vídeo de fondo, en bucle y SIN SONIDO
portada video add assets/video/gimnasio.mp4    Añade otro: se van alternando solos
portada video list · portada video rm #2       Listar y quitar
portada foto assets/img/portada.jpg            Foto de fondo (también sirve de poster del vídeo)
portada foco 12                                Qué franja de la foto se ve (0 arriba · 100 abajo)
portada completa                               Estilo: completa · dividida · minima · apagada
portada quitar                                 Deja la portada sin media
```

La portada ocupa **todo el ancho de la pantalla**, sin importar el contenedor elegido para el resto
de la página. Los vídeos van siempre **en bucle y sin sonido** (los navegadores sólo permiten
reproducción automática si el vídeo está silenciado). Con varios cargados, se alternan solos: los
archivos propios pasan al siguiente al terminar; los enlaces de plataforma rotan cada 24 segundos.

Cuando la portada tiene foto o vídeo detrás, su texto pasa a blanco para que se lea sobre la
imagen. El resto de la página se mantiene en blanco con letras negras.

**El foco de la portada.** La portada es apaisada y ocupa todo el ancho, así que una foto vertical
se recorta mucho: sólo se ve alrededor de un tercio de su alto. `portada foco <n>` elige qué franja.
Con la foto actual está en 12, que es lo que deja las cuatro caras completas. Valores bajos muestran
la parte de arriba de la foto; altos, la de abajo.

> **Lo mejor es un `.mp4` propio** (H.264, horizontal, 10–20 s, por debajo de 5 MB). Se ve a
> pantalla completa y sin marcas de ninguna plataforma. YouTube, Vimeo y Drive también funcionan,
> pero recortan la imagen y dependen de la plataforma.

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

### Momentos en el club

Una tira de fotografías del día a día que va pasando sola. Es donde van las fotos que no ilustran
un bloque concreto.

```
momentos add assets/img/foto.jpg --pie "Ascenso 2024"
momentos lote                    Abre un cuadro para pegar varias de una vez
momentos list                    Ver las cargadas, numeradas
momentos rm 3                    Quitar una
momentos orden 5 1               Mover la 5 a la posición 1
momentos pie 2 "Texto"           Poner o cambiar el pie (sin texto, lo borra)
momentos vaciar --si             Quitar todas
```

Y su aspecto:

```
momentos formato pase       pase (va pasando) · mosaico (todas a la vista) · tira
momentos intervalo 6        Segundos que dura cada foto
momentos proporcion 4:3     16:9 · 3:2 · 4:3 · 1:1 · 9:16
momentos tamano grande      chico · mediano · grande · enorme
momentos pies off           Ocultar los pies de foto
momentos automatico off     Que no pasen solas
```

Detalles de cómo está hecha: usa desplazamiento con anclaje nativo, así que el gesto táctil y las
flechas del teclado funcionan sin código propio. Se detiene sola al pasar el cursor por encima, al
tocarla, y mientras la sección no está a la vista. Las fotos se recortan con el foco en el tercio
superior, porque centrando el recorte se les corta la cabeza a las personas.

### Secciones y contenido
```
bloques                     Lista los bloques y sus identificadores
trabajos [bloque]           Lista las unidades de trabajo y sus identificadores
seccion listar              Estado de las secciones de la página
seccion ocultar videos      Oculta una sección
seccion invertir videos     Sección sobre fondo negro
seccion normal videos       Sección sobre el fondo de la página
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

## 6. Cómo dejar los cambios fijos para todos

Los cambios que hacés desde la terminal se guardan **en tu navegador** (`localStorage`), así que sólo
los ves vos. Para que los vea cualquier visitante:

1. Dejá el sitio como querés que quede.
2. Escribí `publicar` en la terminal → se descarga un archivo `config.js`.
3. Reemplazá con él el archivo `data/config.js` del repositorio.
4. Subí el cambio (`git add`, `git commit`, `git push`).

A partir de ese momento, esa configuración —incluidos los vídeos cargados— es la que ve todo el
mundo al entrar.

---

## 7. Estructura del proyecto

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
  video/                    Tus vídeos (ver assets/video/LEEME.txt)
  js/render.js              Aplicación del tema y pintado de la página
  js/terminal.js            Motor de la consola (historial, autocompletado, parser)
  js/commands.js            Todos los comandos
  js/app.js                 Arranque
tools/build-preview.mjs     Empaqueta el sitio en un solo archivo (dist/preview.html)
```

---

## 8. Editar la metodología

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

## 9. La escala de intensidad del microciclo

Cada día del microciclo lleva un nivel declarado, con su color:

| Nivel | Color | Días |
|---|---|---|
| **Muy intenso** | Rojo | MD-4 · MD-3 · MD |
| **Intenso** | Naranja | MD-2 |
| **Moderado** | Amarillo | MD+1 |
| **Bajo** | Verde | MD+2 · MD-1 |

El nivel está declarado en `data/methodology.js` (campo `nivel`), no se deduce del porcentaje: la
exigencia de un día es una valoración metodológica, no una cuenta. La barra muestra la magnitud
relativa; el nivel, lo que se le pide al jugador. Si un día no lleva `nivel`, se deduce de la carga
(≥85 muy intenso · ≥60 intenso · ≥35 moderado · resto bajo).

```js
{ day: "MD-4", tipo: "Tensión", carga: 90, nivel: "muy-intenso", … }
```

Dos detalles de la implementación:

- **El amarillo no se usa como texto sobre blanco**: tiene 1,6:1 de contraste, es ilegible. El
  relleno de la barra va en amarillo vivo y la palabra en un ámbar oscuro que sí se lee.
- **La barra va sobre un carril gris** que representa el 100%, para que se vea la proporción y no
  sólo una barra suelta.

## 10. Referencias metodológicas

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
