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

## 4. El panel de administración

Se abre con la tecla **`` ` ``**, el botón **TERMINAL** de la cabecera o el botón flotante.
Tiene cuatro pestañas:

### Vídeos

Formulario para cargar un vídeo, que es lo que más se repite. Dos orígenes:

- **Enlace** — se pega la URL de YouTube, Vimeo o Drive, o una ruta del repositorio. Al pegar
  muestra la miniatura detectada.
- **Subir archivo** — dos botones, **«Elegir un vídeo»** (abre el selector del dispositivo) y
  **«Grabar ahora»** (abre la cámara). En escritorio también se puede arrastrar. Entra cualquier
  peso; por encima de 25 MB avisa de que para publicarlo conviene YouTube, pero lo guarda igual.

Entre que se toca el vídeo en el selector y que la página lo recibe puede pasar un rato largo: iOS
exporta el vídeo antes de entregarlo, y si está en iCloud primero lo baja. El botón se queda en
**«Buscando el archivo…»** mientras tanto, para que no parezca colgado.

Después: **desde** y **hasta** (admiten `0:30`, `30` y `0:00:30`, con la duración calculada en
vivo), título, bloque, unidad de trabajo y etiquetas. **Probar el corte** incrusta el reproductor
con esos tiempos para confirmarlo antes de guardar. **Añadir y seguir** mantiene el vídeo y limpia
los tiempos, para cortar varios tramos de la misma grabación.

Abajo, la lista de lo cargado, con editar, borrar y reordenar.

### Fotos

Lo mismo para las fotos: **«Elegir fotos»** —se pueden marcar varias de una vez— o **«Sacar una
foto»**, o pegar una ruta. Después se elige dónde van: portada, un bloque concreto o «Momentos en
el club» (con su pie de foto) o un día del microciclo. La portada y los bloques admiten una sola
foto y lo dicen si se eligen más; «Momentos» y los días aceptan todas las que haya.

Lo elegido no se guarda de inmediato: aparece en una **cola de repaso** con su miniatura, su nombre
y su peso, y cada una se puede sacar con la ✕ antes de confirmar.

**Se comprimen acá, no hace falta prepararlas.** Cada foto pasa por el mismo tratamiento que usé
con las del club: se respeta la orientación EXIF, se escala al lado largo de 2560 px y se guarda en
JPEG con calidad 0,92, bajando a 0,86 · 0,80 · 0,74 sólo si sigue pesando de más. **Una foto que ya
está bien no se toca**, porque reencodar sin necesidad sólo quita calidad. La cola muestra la
cuenta real: `4,8 MB → 1,2 MB · 2560×1707`.

### Qué ve esta página de tu dispositivo

Únicamente los archivos que se tocan en el selector. No hay forma de que una página lea la galería
entera: el navegador abre el selector del sistema, la persona elige, y lo elegido —y nada más— es
lo que llega. De ahí los botones separados, para que se vea de antemano qué abre cada uno.

Después, lo elegido se guarda **en ese navegador** (IndexedDB) y no se envía a ninguna parte: ni a
un servidor, ni al repositorio, ni a mí. Para publicarlo hay que pasarlo aparte. El comando
`archivos` de la consola muestra qué hay guardado y cuánto ocupa, y `archivos limpiar` borra lo que
ya no usa ninguna foto ni ningún vídeo.

### Archivos

Todo lo que hay cargado en el sitio —fotos y vídeos juntos— en una sola lista, y al lado de cada
uno **la carpeta en la que está**, en un desplegable. Cambiarlo mueve el archivo ahí mismo: un
vídeo pasa de un bloque a otro (y se le limpia la unidad de trabajo, que ya no le corresponde), y
una foto puede ir a la portada, a un bloque, a «Momentos en el club» o a un **día del microciclo**.
Los vídeos llevan además un segundo desplegable, el **día**, para que aparezcan al abrir ese día en
el gráfico del microciclo.

La portada y cada bloque admiten una sola foto. Si el destino ya tiene una, **la que estaba no se
pierde: pasa a «Momentos en el club»**, y el mensaje lo dice.

Arriba hay dos filtros, por tipo y por carpeta —los diez bloques, la portada, momentos y cada día
del microciclo—, con el recuento y el peso de lo que está guardado en el navegador.

### Consola

La línea de comandos de siempre, intacta. Sigue siendo lo más rápido para cargar muchos vídeos de
una vez (`lote`, `fragmentos`) y para todo lo que no sea media.

### Lo subido desde el dispositivo

Un archivo elegido en el navegador **no puede subirse solo al repositorio**: el sitio es estático,
no hay servidor detrás. Lo que sí hace el panel es guardarlo en el navegador (IndexedDB) para que
se vea funcionando al instante, y marcar la tarjeta como **«sin publicar»** hasta que entre al
repositorio. Sobrevive a recargar la página.

Un enlace de YouTube, en cambio, lo ven los visitantes apenas se publique la configuración.

El botón **«Copiar para enviar»** copia el listado al portapapeles, para pegarlo en el chat y
dejarlo fijo en el repositorio. Es la vía cuando las descargas están bloqueadas.

## 5. La consola: atajos

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

## 6. Comandos

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
archivos          Lista lo subido desde el dispositivo, con su peso y el espacio disponible
archivos limpiar  Borra los archivos que ya no usa ninguna foto ni ningún vídeo
reset [ámbito]    Restablece: tema · layout · video · site · terminal · todo
clave miClave     Protege la terminal con una clave (protección visual, no criptográfica)
```

---

## 7. Cómo dejar los cambios fijos para todos

Los cambios que hacés desde la terminal se guardan **en tu navegador** (`localStorage`), así que sólo
los ves vos. Para que los vea cualquier visitante:

1. Dejá el sitio como querés que quede.
2. Escribí `publicar` en la terminal → se descarga un archivo `config.js`.
3. Reemplazá con él el archivo `data/config.js` del repositorio.
4. Subí el cambio (`git add`, `git commit`, `git push`).

A partir de ese momento, esa configuración —incluidos los vídeos cargados— es la que ve todo el
mundo al entrar.

---

## 8. Estructura del proyecto

```
index.html                  Estructura de la página
data/
  methodology.js            TODO el contenido metodológico (bloques, unidades, morfociclos)
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
  js/filestore.js           Archivos subidos desde el dispositivo (IndexedDB)
  js/mediapanel.js          Pestañas «Vídeos» y «Fotos» del panel
  js/app.js                 Arranque
tools/build-preview.mjs     Empaqueta el sitio en un solo archivo (dist/preview.html)
```

---

## 9. Editar la metodología

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

**Estado actual del archivo:** 10 bloques · 49 unidades de trabajo · dos morfociclos, de 6 y de 5 días.

---

## 10. El microciclo: gráfico, escala y días

La sección abre con el **gráfico de la semana**, dibujado a partir de las láminas del club: una
barra por día, con altura por carga, color por nivel y los arcos de fase encima —compensación,
incorporación, descarga + ajuste táctico—. **Cada barra es un botón**: al tocarla se abre el día
con su acentuación, sus claves, las tareas del archivo etiquetadas con ese día y sus fotos y
vídeos. Se mueve con ← →, se cierra con Esc, y debajo queda la misma semana en tabla, plegada.

Arriba hay dos solapas, que son los dos morfociclos que usa el club:

| | 6 días · domingo → domingo | 5 días · domingo → sábado |
|---|---|---|
| MD+1 | Compensación (fútbol de 60') | Descanso |
| MD+2 | Descanso | Compensación + G2 recovery |
| MD-4 | Tensión · acentuación **ofensiva** | Tensión · acentuación **ofensiva** |
| MD-3 | Velocidad y duración · acentuación **defensiva** | Duración · acentuación **defensiva** |
| MD-2 | Táctico y ABP | *(no existe)* |
| MD-1 | Activación · plan de juego | Plan de juego + ABP |

En la semana de 5 días se dan vuelta el descanso y la compensación, y sin MD-2 el ajuste táctico y
el balón parado se juntan en el MD-1.

Cada día lleva un nivel declarado, con su color:

| Nivel | Color | Días (semana de 6) |
|---|---|---|
| **Muy intenso** | Rojo | MD |
| **Intenso** | Naranja | MD+1 · MD-4 · MD-3 |
| **Moderado-alto** | Ámbar | MD-1 |
| **Moderado** | Amarillo | MD-2 |
| **Bajo** | Verde | MD+2 |

Es la escala de sus propias láminas —B, M, A, MA—, con un escalón más: el **moderado-alto** existe
porque el MD-1 no es ni una cosa ni la otra. El partido es el único día en rojo; los de acentuación
van en naranja. Y el MD+1 está en naranja por los que no jugaron, que compensan con fútbol de 60':
el nivel declara el día del grupo que más trabaja, no el del que se recupera.

El gráfico y la tabla salen del **mismo array** `morfociclos` de `data/methodology.js`, así que no
pueden contradecirse. El nivel está declarado ahí (campo `nivel`) y no se deduce del porcentaje: la
exigencia de un día es una valoración metodológica, no una cuenta. La barra muestra la magnitud
relativa; el nivel, lo que se le pide al jugador. Si un día no lleva `nivel`, se deduce de la carga
(≥85 muy intenso · ≥60 intenso · ≥35 moderado · resto bajo).

```js
{ day: "MD-4", tipo: "Tensión", acentuacion: "Acentuación ofensiva",
  fase: "Incorporación", carga: 90, nivel: "intenso", dur: "80-95'", claves: [ … ] }
```

**Las fotos y los vídeos de cada día** se asignan desde el panel: en Vídeos hay un desplegable
«Día del microciclo», en Fotos los destinos incluyen cada día, y en la pestaña Archivos cada vídeo
lleva su día al lado de la carpeta. Se guardan en `media.dias` de la configuración y en el campo
`dia` de cada vídeo.

Dos detalles de la implementación:

- **Ni el amarillo ni el ámbar se usan como texto sobre blanco**: tienen 1,6:1 y 2,2:1 de
  contraste, son ilegibles. El relleno de la barra va en el tono vivo y la palabra en una versión
  oscura del mismo color — `#96700a` y `#a86206`, que dan 4,55:1 y 4,76:1. Sobre las bandas negras se
  invierte: ahí el tono vivo es el que se lee.
- **La barra va sobre un carril gris** que representa el 100%, para que se vea la proporción y no
  sólo una barra suelta.

## 11. Referencias metodológicas

La estructura de contenidos sigue el marco habitual de la planificación en fútbol profesional:
periodización táctica y microciclo estructurado, clasificación de juegos reducidos por número de
jugadores y área relativa, y control de carga combinando carga interna (sRPE) y externa (GPS).

La distribución semanal concreta es la que trabaja Luciano en el club, y en un punto se aparta del
patrón de manual: la velocidad va en el **MD-3** junto con la duración, el **MD-2** queda táctico
sin oposición con volumen bajo, y los driles de aceleración se reparten hacia el **MD-1** dentro de
la activación.

- [Microciclos en fútbol: estructura semanal del MD-5 al MD+1 — Barça Innovation Hub](https://barcainnovationhub.fcbarcelona.com/es/blog/microciclos-futbol-estructura-semanal-md5-md1/)
- [Periodización táctica: cómo diseñar un morfociclo patrón — Efficient Football](https://efficientfootball.com/periodizacion-tactica-morfociclo-patron/)
- [Juegos reducidos en fútbol: cómo construirlos en el entrenamiento — Efficient Football](https://efficientfootball.com/juegos-reducidos-en-futbol/)
- [Los juegos reducidos como metodología de enseñanza en el fútbol (Dialnet)](https://dialnet.unirioja.es/descarga/articulo/6885200.pdf)
- [Carga de entrenamiento dentro de un microciclo de fútbol. Revisión sistemática](https://futbolrevolucionario.com/carga-de-entrenamiento-dentro-de-un-microciclo-de-futbol-revision-sistematica/)

---

© Luciano Santo Domingo · Club Agropecuario Argentino, Carlos Casares, Argentina.
