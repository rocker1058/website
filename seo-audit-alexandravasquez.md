# Auditoría SEO — alexandravasquez.com

**Fecha:** 27 de abril de 2026
**Total de URLs en sitemap:** 15

---

## 🚨 HALLAZGO CRÍTICO: Sitio SPA sin Server-Side Rendering

El sitio está construido como una **Single Page Application (React)** que renderiza todo el contenido con JavaScript del lado del cliente. El HTML que recibe Google contiene:

```html
<body>
  <div id="root" class="max-w-full"></div>
</body>
```

**Impacto:** Google puede tener dificultades para indexar el contenido real (H1, H2, párrafos, links internos, imágenes). Los meta tags del `<head>` sí se leen correctamente, pero **todo el body está vacío** para crawlers que no ejecutan JS.

**Recomendación urgente:** Implementar **SSR (Server-Side Rendering)** o **SSG (Static Site Generation)** con frameworks como Next.js, Astro, o pre-rendering con herramientas como Prerender.io.

---

## 1. Tabla Resumen — Estado SEO por URL

| # | URL | Title | Meta Desc | H1 | H2/H3 | Canonical | JSON-LD | OG Tags | Keywords |
|---|-----|-------|-----------|----|--------|-----------|---------|---------|----------|
| 1 | `/` (Home) | ✅ 62 chars | ✅ 140 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ✅ Attorney | ✅ | ✅ |
| 2 | `/sobre-mi` | ✅ 51 chars | ✅ 116 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ❌ Ausente | ❌ Ausente | ❌ Ausente |
| 3 | `/servicios/abogado-derecho-familia-manizales` | ✅ 48 chars | ✅ 144 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ✅ LegalService | ❌ Ausente | ❌ Ausente |
| 4 | `/noticias` | ✅ 47 chars | ✅ 139 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ❌ Ausente | ✅ | ❌ Ausente |
| 5 | `/noticias/divorcios` | ✅ 45 chars | ✅ 104 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ❌ Ausente | ❌ Ausente | ❌ Ausente |
| 6 | `/noticias/derecho-de-familia` | ✅ 54 chars | ✅ 113 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ❌ Ausente | ❌ Ausente | ❌ Ausente |
| 7 | `/noticias/derecho-de-familia/pension-sobrevivientes-colombia-como-reclamar` | ✅ 62 chars | ✅ 156 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ✅ Article | ✅ | ✅ |
| 8 | `/noticias/derecho-de-familia/violencia-intrafamiliar-colombia-como-denunciar` | ⚠️ 71 chars | ✅ 144 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ✅ Article | ✅ | ✅ |
| 9 | `/noticias/derecho-de-familia/union-libre-colombia-derechos-obligaciones` | ⚠️ 71 chars | ✅ 152 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ✅ Article | ✅ | ✅ |
| 10 | `/noticias/derecho-de-familia/proceso-sucesion-colombia-2026` | ✅ 56 chars | ✅ 150 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ✅ Article | ✅ | ✅ |
| 11 | `/noticias/derecho-de-familia/custodia-hijos-colombia-guia-completa` | ✅ 54 chars | ✅ 155 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ✅ Article | ✅ | ✅ |
| 12 | `/noticias/derecho-de-familia/abogado-de-familia-en-manizales` | ✅ 51 chars | ✅ 153 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ✅ Article | ✅ | ✅ |
| 13 | `/noticias/divorcios/divorcio-express-en-colombia-requisitos-y-pasos-en-2026` | ✅ 54 chars | ✅ 141 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ⚠️ JSON roto | ✅ | ✅ |
| 14 | `/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia` | ✅ 51 chars | ✅ 142 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ⚠️ JSON roto | ✅ | ✅ |
| 15 | `/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026` | ✅ 49 chars | ✅ 145 chars | ❌ No renderiza | ❌ No renderiza | ✅ Self | ⚠️ JSON roto | ✅ | ✅ |

### Leyenda
- ✅ Correcto
- ⚠️ Presente pero con problemas
- ❌ Ausente o no funcional

---

## 2. Issues Críticos (ordenados por prioridad)

### P0 — BLOQUEANTE

**1. Sin Server-Side Rendering (SSR)**
- **Afecta:** Todas las 15 URLs
- **Problema:** El body HTML está vacío (`<div id="root"></div>`). Google debe ejecutar JavaScript para ver el contenido. Esto causa:
  - H1, H2, H3 no visibles para crawlers
  - Links internos no descubribles por Googlebot en primera pasada
  - Imágenes y alt text no indexables
  - Contenido del body no disponible para snippets
- **Solución:** Migrar a SSR/SSG (Next.js, Astro, o Prerender.io como solución rápida)

### P1 — ALTO

**2. JSON-LD roto en 3 artículos**
- **Afecta:** divorcio-express, cuota-alimentaria, cuanto-cuesta-divorcio
- **Problema:** El campo `description` del JSON-LD contiene saltos de línea literales (`\n`) que rompen el JSON
- **Solución:** Sanitizar las descripciones eliminando `\n` antes de inyectar en el JSON-LD

**3. Páginas sin JSON-LD (4 URLs)**
- **Afecta:** `/sobre-mi`, `/noticias`, `/noticias/divorcios`, `/noticias/derecho-de-familia`
- **Problema:** Sin datos estructurados, Google no puede generar rich snippets
- **Solución:**
  - `/sobre-mi` → Schema `Person` o `ProfilePage`
  - `/noticias` → Schema `CollectionPage` o `Blog`
  - Categorías → Schema `CollectionPage`

**4. Páginas sin Open Graph tags (4 URLs)**
- **Afecta:** `/sobre-mi`, `/servicios/...`, `/noticias/divorcios`, `/noticias/derecho-de-familia`
- **Problema:** Al compartir en redes sociales no se muestra preview correcto
- **Solución:** Agregar `og:title`, `og:description`, `og:type`, `og:url` y `og:image`

**5. Ninguna página tiene `og:image`**
- **Afecta:** Todas las 15 URLs
- **Problema:** Sin imagen OG, las previews en redes sociales y WhatsApp se ven vacías
- **Solución:** Agregar una imagen OG por página (mínimo 1200x630px)

### P2 — MEDIO

**6. Titles ligeramente largos (2 URLs)**
- `/noticias/derecho-de-familia/violencia-intrafamiliar-colombia-como-denunciar` → 71 chars (recomendado: ≤60)
- `/noticias/derecho-de-familia/union-libre-colombia-derechos-obligaciones` → 71 chars
- **Solución:** Acortar a ≤60 caracteres para evitar truncamiento en SERPs

**7. Meta description con salto de línea (3 URLs)**
- Las mismas 3 páginas con JSON-LD roto tienen `\n` en la meta description
- **Solución:** Eliminar saltos de línea de las meta descriptions

**8. Sin meta `robots` en 14 de 15 páginas**
- Solo `/servicios/abogado-derecho-familia-manizales` tiene `<meta name="robots">`
- **Solución:** Agregar `<meta name="robots" content="index, follow">` a todas las páginas (o confiar en el default, pero es mejor ser explícito)

**9. Sin keywords meta en 5 páginas**
- **Afecta:** `/sobre-mi`, `/noticias`, `/noticias/divorcios`, `/noticias/derecho-de-familia`, `/servicios/...`
- **Nota:** Google ignora `meta keywords`, pero Bing y otros motores menores aún lo consideran

---

## 3. Análisis de Canibalización de Keywords

| Keyword Principal | URLs que compiten | Riesgo |
|---|---|---|
| **"abogado familia manizales"** | `/` (home), `/servicios/abogado-derecho-familia-manizales`, `/noticias/derecho-de-familia/abogado-de-familia-en-manizales` | 🔴 ALTO — 3 páginas compiten por la misma keyword transaccional |
| **"divorcio colombia"** | `/noticias/divorcios/divorcio-express-en-colombia-requisitos-y-pasos-en-2026`, `/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026` | 🟡 MEDIO — Diferente intención (proceso vs. costo), pero comparten keyword raíz |
| **"derecho de familia colombia"** | `/noticias` (title), `/noticias/derecho-de-familia` (title y URL) | 🟡 MEDIO — La página de noticias y la categoría compiten |
| **"custodia hijos colombia"** | `/servicios/abogado-derecho-familia-manizales` (meta desc), `/noticias/derecho-de-familia/custodia-hijos-colombia-guia-completa` | 🟡 MEDIO — Servicio vs. artículo informativo |

### Recomendaciones anti-canibalización:
1. **"abogado familia manizales"**: La página de servicios debe ser la principal. El artículo `/noticias/.../abogado-de-familia-en-manizales` debería redirigir a servicios o cambiar su enfoque a contenido informativo ("¿Cuándo necesitas un abogado de familia?")
2. **Noticias vs. categoría derecho-de-familia**: `/noticias` debería ser un hub general; `/noticias/derecho-de-familia` la categoría específica. Diferenciar titles claramente.

---

## 4. Problemas de Arquitectura URL

### 4.1 Profundidad excesiva (>2 niveles)

| URL | Niveles | Problema |
|---|---|---|
| `/noticias/derecho-de-familia/pension-sobrevivientes-colombia-como-reclamar` | 3 | Demasiado profundo |
| `/noticias/derecho-de-familia/violencia-intrafamiliar-colombia-como-denunciar` | 3 | Demasiado profundo |
| `/noticias/derecho-de-familia/union-libre-colombia-derechos-obligaciones` | 3 | Demasiado profundo |
| `/noticias/derecho-de-familia/proceso-sucesion-colombia-2026` | 3 | Demasiado profundo |
| `/noticias/derecho-de-familia/custodia-hijos-colombia-guia-completa` | 3 | Demasiado profundo |
| `/noticias/derecho-de-familia/abogado-de-familia-en-manizales` | 3 | Demasiado profundo |
| `/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia` | 3 | Demasiado profundo + slug muy largo |
| `/noticias/divorcios/divorcio-express-en-colombia-requisitos-y-pasos-en-2026` | 3 | Demasiado profundo |
| `/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026` | 3 | Demasiado profundo |

**Recomendación:** Aplanar a 2 niveles: `/blog/slug-del-articulo` en lugar de `/noticias/categoria/slug`

### 4.2 Slugs poco naturales o demasiado largos

| URL | Problema |
|---|---|
| `como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia` | 60 chars — demasiado largo, incluye preposiciones innecesarias ("de-los", "en") |
| `divorcio-express-en-colombia-requisitos-y-pasos-en-2026` | Incluye año que requerirá actualización |
| `cuanto-cuesta-un-divorcio-en-colombia-en-2026` | Incluye año que requerirá actualización |
| `proceso-sucesion-colombia-2026` | Incluye año |
| `abogado-derecho-familia-manizales` | Keyword stuffing en slug de servicio |

**Recomendaciones:**
- Eliminar preposiciones: `cuota-alimentaria-hijos-colombia` en vez de `como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia`
- Eliminar años de URLs (usar el año solo en el title/contenido, no en el slug)
- Slugs ideales: 3-5 palabras, sin preposiciones

### 4.3 Contenido de servicios en sección de noticias

| URL actual | Debería estar en | Razón |
|---|---|---|
| `/noticias/derecho-de-familia/abogado-de-familia-en-manizales` | `/servicios/abogado-familia-manizales` | Es contenido transaccional/comercial, no informativo |

Este artículo compite directamente con la página de servicios y debería ser una página de servicio o redirigir a ella.

---

## 5. Arquitectura URL Recomendada

```
alexandravasquez.com/
├── /sobre-mi
├── /servicios/
│   ├── /servicios/derecho-familia          (página principal de servicios)
│   ├── /servicios/divorcios
│   ├── /servicios/custodia
│   ├── /servicios/sucesiones
│   └── /servicios/alimentos
├── /blog/                                   (renombrar "noticias" → "blog")
│   ├── /blog/divorcio-express-colombia
│   ├── /blog/cuota-alimentaria-colombia
│   ├── /blog/costo-divorcio-colombia
│   ├── /blog/pension-sobrevivientes-colombia
│   ├── /blog/violencia-intrafamiliar-denuncia
│   ├── /blog/union-libre-derechos-colombia
│   ├── /blog/proceso-sucesion-colombia
│   └── /blog/custodia-hijos-colombia
└── /contacto
```

**Beneficios:**
- Máximo 2 niveles de profundidad
- Separación clara entre contenido transaccional (servicios) e informativo (blog)
- Slugs cortos y sin años
- Elimina canibalización entre servicios y artículos

---

## 6. Checklist de Acciones Prioritarias

| # | Acción | Prioridad | Esfuerzo |
|---|--------|-----------|----------|
| 1 | Implementar SSR/SSG o pre-rendering | P0 | Alto |
| 2 | Corregir JSON-LD roto (3 páginas) — eliminar `\n` de descriptions | P1 | Bajo |
| 3 | Agregar JSON-LD a 4 páginas que no lo tienen | P1 | Bajo |
| 4 | Agregar `og:image` a todas las páginas | P1 | Medio |
| 5 | Completar OG tags en 4 páginas faltantes | P1 | Bajo |
| 6 | Mover artículo "abogado-de-familia-en-manizales" a /servicios/ o redirigir | P1 | Bajo |
| 7 | Acortar 2 titles que exceden 60 chars | P2 | Bajo |
| 8 | Eliminar `\n` de meta descriptions | P2 | Bajo |
| 9 | Reestructurar URLs (aplanar a 2 niveles, quitar años) con redirects 301 | P2 | Medio |
| 10 | Agregar más páginas de servicios individuales | P3 | Medio |
