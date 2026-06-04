# CMS — Especificación funcional y de diseño

Este documento define el CMS conversacional que vamos a construir en `/admin`. Es la referencia única para decisiones de UX, estructura y comportamiento. Cualquier duda sobre el CMS se resuelve aquí o se añade aquí.

> **Referencia visual viva**: `docs/prototype/cms_demo.html`. Es un prototipo HTML autocontenido con todas las pantallas y flujos navegables. Sirve como contrato visual de cómo debe verse y comportarse el CMS.

---

## 1. Contexto y objetivo

### Qué es

CMS modular y conversacional para gestionar el contenido del microsite ABANCA Heritage. Permite crear y editar páginas combinando módulos del Sistema de Diseño existente, gestionar un repositorio de imágenes, y publicar cambios a producción.

### Para quién

Usuario tipo: perfiles de marketing, negocio o producto en un cliente IBEX 35. No técnicos. Esperan algo cercano a Notion en simplicidad y a Webflow en capacidad.

### Por qué existe

Ejercicio interno de Redbility para validar dos cosas:

1. Que se puede construir un site editorial premium con IA (hecho)
2. Que se puede entregar al cliente un CMS sencillo para gestionar ese site sin necesitar al equipo de desarrollo cada vez (en curso)

### Alcance de esta primera versión (A1 funcional)

- Persistencia local en el navegador (`localStorage`) y/o JSON commiteado al repo
- Chat de IA simulado con vocabulario cerrado (sin API key de Anthropic)
- Publicar via deploy hook de Vercel
- Cubrir las 3 páginas del site: Home, Sala de Prensa, Línea de Tiempo

### Fuera de alcance (para A2 o posteriores)

- Chat de IA real con API de Anthropic
- Base de datos remota (Supabase u otra)
- Multiusuario, permisos, auditoría
- Versionado de contenido
- Soporte móvil del CMS (la edición es desktop)

---

## 2. Arquitectura del CMS dentro del repo

```
/admin/
├── index.html              Portada del CMS (listado de páginas)
├── editar.html             Vista de edición de página
├── imagenes.html           Repositorio de imágenes
├── css/
│   └── admin.css           CSS único del CMS, usa los mismos tokens del :root global
└── js/
    ├── admin.js            Lógica de navegación, render, persistencia
    ├── assistant.js        Chat simulado con vocabulario cerrado
    └── publish.js          Llamada al deploy hook de Vercel
```

El CMS reutiliza los tokens y el sistema de animaciones del site. **No replicar tokens en `admin.css`**: importar o referenciar los del `:root` global definido en `css/editorial.css`.

**Persistencia (A1)**: el estado de las páginas (qué módulos tiene cada una, en qué orden, con qué contenido) se guarda en `localStorage`. El botón "Publicar" exporta el JSON resultante a un archivo commiteable o llama directamente al deploy hook.

---

## 3. Identidad visual del CMS

### Estética

Neutra con toque editorial sutil. Es una herramienta de trabajo: debe desaparecer visualmente cuando el usuario edita, no competir. Pero conserva identidad (serif solo en títulos clave, color brass como acento) para que se reconozca como producto Redbility/ABANCA.

### Tokens propios del CMS

Definidos en `admin.css` y solo aplican al CMS:

- `--cms-bg-app: #FAFAF8`
- `--cms-bg-primary: #FFFFFF`
- `--cms-bg-secondary: #F4F3EF`
- `--cms-bg-tertiary: #EDECE6`
- `--cms-text-primary: #1A1A18`
- `--cms-text-secondary: #5F5E5A`
- `--cms-text-tertiary: #888780`

Los tokens del site (`--ink`, `--accent`, `--paper`, etc.) se usan dentro del CMS para todos los acentos cromáticos y para los renders de módulos en el canvas.

### Tipografía

- Títulos clave (cabecera de modales, nombres de páginas en cards): `--serif`
- Resto de UI: `--sans`
- Etiquetas técnicas, contadores, rutas: `--mono`

---

## 4. Estructura de navegación

### Sidebar lateral (siempre visible)

Ancho: 56px colapsada (por defecto) / 224px expandida.

**Cabecera**:
- Logo `//` clicable. Al hacer hover sobre el área del logo, el cuadrado se desvanece y aparece un icono de plegar/desplegar la sidebar. Funciona igual en estado colapsado y expandido.
- Al lado del logo, en estado expandido, aparece el texto **"Abanca CMS"** clicable que lleva a la portada del CMS.

**Sección "Páginas"** con las páginas existentes:
- Home (icono `home`, dot verde si publicada, gris si borrador)
- Sala de Prensa (icono `news`)
- Línea de Tiempo (icono `timeline`)

**Sección "Recursos"**:
- Imágenes (icono `photo`, contador del nº de imágenes)
- Sistema de Diseño (icono `components`, contador del nº de módulos)

**Avatar** del usuario abajo (Pablo Pérez · Editor).

### Topbar (cabecera de cada vista)

Contiene:
- A la izquierda: título de la vista o breadcrumb (según contexto)
- A la derecha siempre: botón **"Asistente"** (sparkles brass + texto + estado activo cuando el panel está abierto)
- En la vista de edición, además: botones **"Previsualizar"** (ghost) y **"Publicar"** (navy, acción más crítica del sistema)

---

## 5. Pantallas y flujos

### 5.1 Portada del CMS — listado de páginas

Es lo que el usuario ve al entrar.

**Toolbar superior**:
- Chips de estado: "Publicadas · 1" (dot verde), "Borradores · 2" (dot gris). Sin chip "Total".
- Buscador con icono lupa
- Selector de vista (3 modos): tabla, cards grandes (por defecto), cards compactas
- A la derecha: botón **`+`** brass (32×32) para nueva página

**Grid de páginas**: cards con aspect ratio 16:10 en el thumbnail.

Cada card muestra:
- Thumbnail editorial que evoca el contenido real:
  - Home: gradiente navy con la frase del hero ("Una banca con raíces de *mar.*")
  - Sala de Prensa: fondo crema con eyebrow mono + frase serif
  - Línea de Tiempo: fondo navy con el arco cronológico 1717—2026
- Badge de estado arriba a la derecha: "Publicada" (verde sobre crema), "Borrador" (gris)
- Nombre de la página + URL en mono
- Footer con número de módulos + tiempo desde última modificación

**Card "Nueva página"** al final del grid: dashed border, icono `+` en círculo crema, texto "Nueva página" + sub "o pídeselo al asistente".

### 5.2 Vista de edición de página

Estructura de tres columnas dentro del workspace:

**Columna izquierda — Panel de módulos (260px)**:
- Cabecera: "Módulos · N" + botón `+` para añadir
- Lista ordenable drag-and-drop. Cada fila: grip, número, icono semántico, nombre del módulo
- Módulo activo (el que se está editando): fondo crema, border brass, texto brass
- Botón "Añadir módulo" al final
- Bloque "Configuración" abajo: ruta de la página, última modificación

**Columna central — Canvas**:
- Fondo gris claro (`--bg-tertiary`)
- Max-width 920px centrado, gap 14px entre módulos
- Cada módulo se renderiza tal como aparecerá en el site
- Etiqueta superior izquierda en mono pequeño con el nombre del módulo
- Módulo activo: border brass 2px y etiqueta "[Módulo] · editando" en brass sobre crema
- **Insert dividers** entre módulos: línea con botón circular `+` en el centro, para insertar nuevo módulo en esa posición exacta

**Columna derecha — Panel de propiedades (320px)**:
- Cabecera: icono del módulo + nombre + clase CSS + menú de tres puntos (acciones: duplicar, eliminar, ocultar, etc.)
- Body: campos editables según el módulo. Inputs con label en mono uppercase pequeño.
- Foco en input: border brass

### 5.3 Asistente (panel lateral)

Despliega desde la derecha. Ancho 340px. Empuja el contenido (no overlay).

**Estado inicial — pantalla de bienvenida**:
- Centrado verticalmente en su contenedor
- Avatar circular crema con icono sparkles brass
- Saludo en serif: "Hola Pablo" (en portada) / "Editando [página]" (en edición)
- Copy explicando capacidades en 1-2 frases
- Bloque de sugerencias contextuales (4 chips):
  - Portada: Crear nueva página, Publicar Sala de Prensa, Añadir imágenes al repositorio, Mostrar módulos disponibles
  - Edición: Cambiar el titular del Hero, Añadir un Press Featured, Reordenar los módulos, Publicar esta página

**Estado conversación**:
- Header: icono sparkles + "Asistente" + botón "Nueva conversación" (lápiz) + botón cerrar (sidebar collapse)
- Mensajes alternados: usuario a la derecha (burbuja navy), asistente a la izquierda (burbuja gris)
- Cuando el asistente propone crear algo (página, módulo): incluye en la burbuja un **bloque visual estructurado** (ver 5.4)
- Botones de acción dentro del mensaje: primario brass + ghost secundario
- Input inferior: textarea con icono de adjuntar + botón de enviar brass

### 5.4 Flujo "Crear página por chat"

Se dispara desde la sugerencia "Crear una nueva página" o tecleando algo equivalente.

Secuencia:
1. **Usuario**: "Crea una página de Inversores"
2. **Asistente** (tras ~600ms): texto interpretativo + **bloque "Page proposal"** con:
   - Icono asignado automáticamente (en este caso `chart-line` por el contexto financiero)
   - Nombre propuesto + ruta auto-generada (`/inversores`)
   - Lista de módulos sugeridos numerados, con icono y categoría de origen
   - Botones: **"Crear página"** (brass primario) + **"Ajustar"** (ghost)
3. Si pulsa "Crear página": confirmación con bloque verde de éxito + link "Abrir →" que lleva a la edición de la nueva página
4. Si pulsa "Ajustar": el asistente abre conversación libre para iterar

**Vocabulario cerrado del asistente** (A1): reconoce verbos clave (crear, añadir, publicar, mostrar, listar, cambiar, mover, eliminar) + nombres de módulos del DS + nombres de páginas existentes. Si la petición no encaja, responde con un mensaje educado de "no he entendido, ¿puedes reformularlo?".

### 5.5 Flujo "Crear página por formulario"

Se dispara desde el botón `+` brass de la portada o desde la card "Nueva página".

Modal centrado, max-width 480px, fondo blanco, backdrop semi-transparente navy.

Campos:
- **Nombre** (input)
- **Ruta** (input con prefijo `/`, auto-generada como slug del nombre; deja de auto-actualizarse en cuanto el usuario la edita manualmente)
- **Punto de partida** (radio group):
  - "En blanco" (por defecto)
  - "Basada en otra página" (al seleccionar, expande un select con las páginas existentes)

**No** se selecciona el icono en este modal. El icono lo asigna el sistema automáticamente al crear (`file-text` por defecto). El usuario podrá cambiarlo después en la configuración de la página dentro de la vista de edición.

Botones: Cancelar (ghost) + Crear página (brass).

### 5.6 Selector de módulos

Drawer lateral desde la derecha, 480px de ancho. Backdrop oscurece el resto.

**Cabecera**: "Añadir módulo · N módulos disponibles en el Sistema de Diseño" + botón cerrar.

**Buscador**: input con icono lupa.

**Body**: módulos agrupados por categoría, cada categoría con su label y contador:
- Globales (7)
- Sala de Prensa (3)
- Línea de Tiempo (3)

Cada módulo se presenta como tarjeta 1:1 con:
- Mini-render visual del módulo a escala (con su estética real: navy, paper, serif, etc.)
- Nombre del módulo
- Descripción breve (1 línea)

Hover: card se eleva con sombra y border brass.

Al hacer clic en una card: se inserta el módulo en la posición correspondiente. Si se abrió desde un insert-divider entre dos módulos, se inserta ahí. Si se abrió desde el botón general "Añadir módulo", se inserta al final.

### 5.7 Repositorio de imágenes

Dos modos:

#### Vista completa (accesible desde sidebar)

**Toolbar**:
- Tabs de categoría: Todas, Edificios, Archivo, Equipo, Editorial. Con contadores en mono.
- Buscador
- Botón "Subir imagen" brass

**Grid**: aspect ratio 1:1, columnas auto-fill min 180px.

Card "Subir imagen" al inicio: dashed, icono nube de subida.

Cada card de imagen:
- Thumbnail (placeholder coloreado en la demo, real en producción)
- Nombre del archivo
- Tag de categoría (en mono pequeño sobre crema)
- Indicador de uso: `link` + número de módulos donde se usa, o `link-off` + 0 si no se usa (en gris desaturado)

Hover: border brass + ligera elevación.

#### Picker contextual (desde el editor)

Se dispara al pulsar "Cambiar imagen" en el panel de propiedades de un módulo que tiene imagen.

Drawer lateral desde la derecha, 540px de ancho. Mismo grid que la vista completa pero en 3 columnas. Buscador + botón "Subir". Footer con botones "Cancelar" + "Seleccionar imagen" (brass).

Imagen actualmente asignada al módulo aparece preseleccionada (border brass 2px).

---

## 6. Iconografía

Se usa **Tabler Icons** vía CDN (`@tabler/icons-webfont`).

Iconos clave:
- Páginas (sección): `file-text`
- Home: `home`
- Sala de Prensa: `news`
- Línea de Tiempo: `timeline`
- Imágenes: `photo`
- Sistema de Diseño: `components`
- Asistente IA: `sparkles`
- Publicar: `cloud-upload`
- Previsualizar: `eye`
- Plegar/desplegar sidebar: `layout-sidebar-left-expand` / `layout-sidebar-left-collapse`
- Drag handle: `grip-vertical`

### Asignación automática de iconos a páginas nuevas

El asistente sugiere el icono basado en el nombre/contexto de la página:
- Home → `home`
- Sala de Prensa → `news`
- Línea de Tiempo → `timeline`
- Liderazgo → `users`
- Inversores → `chart-line`
- Sostenibilidad → `leaf`
- Cualquier otro nombre no reconocido → `file-text` (por defecto, editable después)

---

## 7. Publicación

Botón "Publicar" arriba a la derecha en la vista de edición de una página.

Comportamiento:
1. El usuario pulsa "Publicar"
2. Modal de confirmación: resumen de cambios (módulos añadidos/modificados/eliminados desde la última publicación) + botón "Publicar ahora"
3. Al confirmar: el CMS llama al **deploy hook de Vercel** (URL secreta que dispara un deploy)
4. Estado de progreso: "Publicando..." con spinner discreto
5. Al completar: mensaje de éxito + link a la URL pública de la página

**Implementación A1**: el deploy hook se llama desde el frontend del CMS con un `fetch(POST)` a la URL del hook. La URL no es secreta crítica (Vercel los considera públicos), pero conviene no hardcodearla en el JS.

---

## 8. Pendientes para versiones posteriores

Estos puntos están definidos conceptualmente pero no se construyen en A1:

- **Estado vacío de página**: cuando se crea una página nueva y no tiene módulos. Debe haber una vista intermedia con CTA grande "Añadir tu primer módulo" + sugerencia del asistente.
- **Modal de edición del icono y nombre de página**: accesible desde el menú de tres puntos en el header de la vista de edición.
- **Versionado simple**: poder volver a un estado anterior de la página tras publicar.
- **Multiusuario y permisos**: tener distintos roles (Editor, Revisor, Administrador).
- **A2 — Chat real con API de Anthropic**: sustituye el chat simulado por uno con LLM real para entender peticiones abiertas.
