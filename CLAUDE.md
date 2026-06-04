# The ABANCA Heritage & Future

Microsite corporativo editorial sobre la historia de ABANCA (1717–2026). Público C-level, inversores y prensa económica. Tono institucional, sobrio, premium.

Ejercicio interno de Redbility para validar la creación de productos digitales con IA. El site ya está en producción en Vercel. Ahora estamos construyendo un CMS sobre el mismo repo.

---

## Arquitectura actual

```
/
├── index.html                  Home del site (público)
├── css/editorial.css           CSS único del site con todos los módulos y tokens
├── js/editorial.js             JS único del site
├── assets/                     Logos SVG
├── pages/
│   ├── preview.html            Preview aislado por componente del DS
│   └── sistema-de-diseno.html  Documentación visual del DS
├── docs/
│   ├── cms-spec.md             Especificación detallada del CMS (lee este antes de tocar admin)
│   └── prototype/              HTML autocontenido del prototipo visual del CMS
└── vercel.json
```

Stack: HTML + CSS + JS planos. Sin frameworks. Despliega en Vercel desde `main`.

---

## Sistema de Diseño

### Tokens (definidos en `:root` de `css/editorial.css`)

- **Color sólido**: `--ink` `--ink-2` `--paper` `--paper-2` `--paper-3` `--accent` `--accent-deep` `--accent-pale` `--mid` `--pos`
- **Opacidades sobre claro**: `--ink-soft` `--ink-dim` `--line` `--line-2` `--line-3` `--ink-shadow` `--line-strong`
- **Opacidades sobre oscuro**: `--paper-faint` `--paper-muted` `--paper-dim` `--paper-soft` `--paper-hint` `--paper-ghost` `--paper-tint` `--paper-hover` `--accent-subtle` y variantes
- **Tipografía**: `--serif` (Cormorant Garamond) `--serif-body` (Source Serif 4) `--sans` (Geist) `--mono` (Geist Mono)
- **Espaciado**: `--pad` `--pad-l` `--s-sm` `--s-md` `--s-lg` `--s-xl` `--s-2xl`

**Regla**: nada de valores hardcoded en el cuerpo del CSS. Siempre tokens. Excepción única: rgba dentro de `linear-gradient`, `radial-gradient`, `text-shadow` y `@keyframes` del hero del site (son composición visual, no tokens).

### Módulos del sistema (13)

**Globales** (7): Hero, Manifesto, Stats, Big Quote, Timeline Horizontal, Refundación, Liderazgo.
**Sala de Prensa** (3): Press Hero, Press Featured, Press Grid.
**Línea de Tiempo** (3): Timeline Hero, Timeline Item Full, Milestone Stat.

### Sistema de animaciones declarativo

Clases CSS reutilizables, registradas en `js/editorial.js` con `IntersectionObserver`:

- `reveal` (fade up), `reveal-fast` (solo fade), `reveal-mask` (mask up)
- `reveal-left`, `reveal-right`, `reveal-scale`
- `draw-line` (línea que se dibuja de izquierda a derecha)
- Delays: `d-100` `d-150` `d-200` `d-300` `d-400` `d-500` `d-600`
- `counter` con `data-target`, `data-decimals`, `data-duration`

Cualquier módulo nuevo debe usar este sistema. No escribir JS de animación específico por módulo.

---

## Qué estamos construyendo ahora

**CMS conversacional accesible en `/admin`** que permite a usuarios no técnicos (marketing, negocio, producto) gestionar el contenido del site:

- Crear y editar páginas usando los módulos del DS
- Gestionar un repositorio de imágenes
- Chat de IA con vocabulario cerrado (sin API key) para esta primera versión
- Publicar a Vercel con un botón (deploy hook)

**Detalle completo del CMS**: `docs/cms-spec.md`. Léelo antes de tocar nada de `/admin`.

---

## Convenciones

- **Idioma**: castellano de España. Tono profesional pero cercano.
- **Comentarios en código**: en español.
- **Nombres de archivos**: kebab-case.
- **Nombres de clases CSS**: BEM ligero con prefijos por módulo (`.press-hero`, `.tli-content`).
- **No tocar**: `index.html` ni los módulos existentes del site sin instrucción explícita.
- **Sí tocar libremente**: archivos nuevos bajo `/admin` y nuevas secciones de `editorial.css` para módulos nuevos del DS.

## Reglas de trabajo

1. Antes de hacer cambios estructurales, leer `docs/cms-spec.md` para entender decisiones ya tomadas.
2. Antes de añadir un módulo al DS, comprobar que no existe ya uno equivalente.
3. Cualquier valor de color, tipografía o espaciado pasa por tokens del `:root`. Si no existe el token, crearlo, no hardcodear.
4. Cualquier animación nueva usa el sistema declarativo existente. Si necesita un efecto nuevo, ampliar el sistema, no crear código ad-hoc.
5. Commit por unidad lógica. Mensajes claros en español, prefijo `feat:`, `fix:`, `refactor:`, `docs:`.
6. Para tareas largas, proponer el plan antes de ejecutar y confirmar con el usuario.

## Despliegue

- **Producción**: push a `main` → deploy automático en Vercel.
- **El usuario es** Pablo Pérez (`pabloperez`). Editor del CMS y desarrollador del proyecto.
- **Repo**: `github.com/pablopercom/The-ABANCA-Heritage-_-Future`
