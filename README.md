# ABANCA · The History — Editorial Atlántico

Site institucional de la historia de ABANCA Corporación Bancaria. Three centuries on the Atlantic, in editorial form.

## Arquitectura

```
/
├── index.html                       ← Home (entrada principal)
├── pages/
│   ├── linea-de-tiempo.html         ← Recorrido por los 9 hitos
│   └── sala-de-prensa.html          ← Comunicación institucional
├── css/
│   └── editorial.css                ← Sistema de diseño + componentes
├── js/
│   └── editorial.js                 ← Cursor magnético, audio, parallax, reveals
├── assets/
│   └── abanca-logo.svg              ← Wordmark
├── variants/
│   ├── atlantico-editorial.html     ← Variante A original (archivo de propuesta)
│   ├── cinematico-profundo.html     ← Variante B (archivo de propuesta)
│   └── datos-geografia.html         ← Variante C (archivo de propuesta)
├── canvas.html                      ← Vista comparativa de las 3 variantes
├── shared.css                       ← CSS compartido entre variantes propuestas
├── design-canvas.jsx                ← (solo para canvas.html)
├── tweaks-panel.jsx                 ← (solo para canvas.html)
├── vercel.json                      ← Configuración de hosting
└── README.md
```

**La página de producción es `index.html`**. Las carpetas `variants/`, `canvas.html` y los `.jsx` están conservadas como archivo histórico de la exploración inicial — son seguras de eliminar si quieres limpiar el repo antes de subir.

## Stack

- HTML5 + CSS3 (custom properties, container queries) + JS vanilla
- Sin build step. Sin bundler. Sin dependencias npm.
- Tipografías: Cormorant Garamond (serif display), Source Serif 4 (serif body), Geist (sans), Geist Mono — cargadas vía Google Fonts.
- Imágenes: Unsplash CDN (urls firmadas) — reemplazables por archivo real de ABANCA cuando esté disponible.

## Trabajar en local con Cursor / VS Code

```bash
# 1. Descomprime el ZIP o clona el repo
cd abanca-historia

# 2. Abre con Cursor
cursor .

# 3. Sirve en local (cualquier servidor estático sirve)
python3 -m http.server 8000
# o
npx serve .
# o usa la extensión "Live Server" de VS Code/Cursor
```

Visita `http://localhost:8000` para ver la home.

### Editar interacciones

Las interacciones globales (cursor magnético, audio ambiente, scroll reveals, parallax, nav scroll state) viven en `js/editorial.js`. Las específicas de cada página (sticky cifras reversibles, scroll-jacking de la timeline, mapa con tooltips) están en línea al final de cada `.html`.

### Editar estilos

- Variables globales (colores, tipos, espaciado) → `css/editorial.css` arriba del archivo.
- Componentes compartidos (nav, footer, image tiles, reveals) → `css/editorial.css`.
- Estilos específicos de cada página → bloque `<style>` en línea dentro del HTML.

## Deploy a Vercel (gratis)

### Opción A — Desde GitHub (recomendado)

```bash
# 1. Crea el repo
git init
git add .
git commit -m "Initial commit · ABANCA editorial site"

# 2. Sube a GitHub (crea el repo vacío en github.com primero)
git remote add origin https://github.com/<tu-usuario>/abanca-historia.git
git branch -M main
git push -u origin main

# 3. En vercel.com → "Add New Project" → conectar el repo
#    - Framework Preset: Other
#    - Build command: (déjalo vacío)
#    - Output directory: ./
#    - Install command: (déjalo vacío)
#    Deploy.
```

URL resultante: `https://abanca-historia-<hash>.vercel.app` — puedes asignarle dominio propio después.

### Opción B — Vercel CLI

```bash
npm install -g vercel
cd abanca-historia
vercel        # primera vez: te guía por la configuración
vercel --prod # cuando estés listo para producción
```

## Configuración aplicada (vercel.json)

- **Clean URLs**: `/pages/sala-de-prensa` funciona sin la extensión `.html`.
- **Cache headers**: assets estáticos (css, js, imágenes, fuentes) se cachean 1 año; HTML se revalida en cada visita para que los cambios sean visibles inmediatamente al re-deployar.

## Próximos pasos sugeridos

1. **Imágenes reales**: sustituir las URLs de Unsplash por fotografía oficial de ABANCA. Edita `index.html` y las páginas en `pages/` — busca `images.unsplash.com` y reemplaza por rutas locales (ej. `assets/img/hero.jpg`).
2. **Datos auditados**: las cifras (121,4 mil M€, 1.245 M€ de beneficio, etc.) están como proyecciones basadas en información pública. Reemplaza con datos verificados por IR antes de publicación.
3. **Versión gallega / inglesa**: el selector ES / GL / EN del nav es visual hoy. Para activarlo, duplica los archivos en `/gl/` y `/en/` y enlaza desde el selector.
4. **Páginas internas adicionales**: Liderazgo, ESG, Presencia y Cifras todavía hacen scroll a la home. Cuando queráis profundizar cada una, las puedes crear bajo `pages/` siguiendo el mismo patrón que `linea-de-tiempo.html`.
5. **Sustituir cita de Escotet**: la cita actual («Un banco con alma de caja...») es pública y verificada. Si queréis añadir más citas históricas, hay placeholders en línea de tiempo (1717, 1927) que pueden citar el archivo Etcheverría.
6. **Accesibilidad**: revisar contrastes en el hero (texto cream sobre Atlántico oscuro pasa AA), añadir focus states más visibles, y validar lectores de pantalla.

## Crédito

Diseño y código: Claude · Anthropic · 2026.
