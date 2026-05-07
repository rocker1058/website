# Problemas SEO — alexandravasquez.com

**Fecha:** 27 de abril de 2026 · **URLs en sitemap:** 15 · **Posts en DB local:** 3

> El sitio SÍ tiene SSR parcial en `server/index.ts` — inyecta meta tags, canonical, JSON-LD y H1 oculto por ruta. Los problemas están en cómo lo hace.

---

## CANIBALIZACIÓN

| URL 1 | URL 2 | Keyword en conflicto | Recomendación |
|--------|--------|----------------------|---------------|
| `/servicios/abogado-derecho-familia-manizales` — title: "Abogado Familia Manizales \| Divorcios y Custodia" | `/noticias/derecho-de-familia/abogado-de-familia-en-manizales` — title: "Abogado de Familia en Manizales \| Alexandra Vásquez" | **abogado familia manizales** | Redirect 301 del artículo → servicios, o cambiar el enfoque del artículo a "¿Cuándo necesitas un abogado de familia?" |
| `/` — meta desc: "Abogado derecho de familia en Manizales" | `/servicios/abogado-derecho-familia-manizales` — title: "Abogado Familia Manizales" | **abogado derecho familia manizales** | Home debe posicionar la marca; servicios la keyword transaccional. Cambiar meta desc del home a algo con "Alexandra Vásquez" como foco |
| `/noticias` — title: "Derecho de Familia Colombia" | `/noticias/derecho-de-familia` — title: "Derecho de Familia \| Blog Jurídico" | **derecho de familia** | Renombrar title de `/noticias` a "Blog Jurídico \| Alexandra Vásquez" para diferenciar del listado de categoría |
| `/noticias/divorcios/divorcio-express-en-colombia-...` | `/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-...` | **divorcio colombia 2026** | Intención diferente pero keyword raíz compartida + año. Quitar año de ambos titles |

---

## ARQUITECTURA

### URLs a 3 niveles de profundidad (todos los artículos)

| URL actual | Profundidad | URL sugerida |
|------------|:-----------:|--------------|
| `/noticias/derecho-de-familia/pension-sobrevivientes-colombia-como-reclamar` | 3 | `/blog/pension-sobrevivientes-colombia` |
| `/noticias/derecho-de-familia/violencia-intrafamiliar-colombia-como-denunciar` | 3 | `/blog/violencia-intrafamiliar-denuncia` |
| `/noticias/derecho-de-familia/union-libre-colombia-derechos-obligaciones` | 3 | `/blog/union-libre-derechos-colombia` |
| `/noticias/derecho-de-familia/proceso-sucesion-colombia-2026` | 3 | `/blog/proceso-sucesion-colombia` |
| `/noticias/derecho-de-familia/custodia-hijos-colombia-guia-completa` | 3 | `/blog/custodia-hijos-colombia` |
| `/noticias/derecho-de-familia/abogado-de-familia-en-manizales` | 3 | 301 → `/servicios/abogado-derecho-familia-manizales` |
| `/noticias/divorcios/divorcio-express-en-colombia-requisitos-y-pasos-en-2026` | 3 | `/blog/divorcio-express-colombia` |
| `/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia` | 3 | `/blog/cuota-alimentaria-hijos-colombia` |
| `/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026` | 3 | `/blog/costo-divorcio-colombia` |

**Causa en código:** El sitemap y las rutas usan `/noticias/${category_slug}/${slug}`. Cambiar a `/blog/${slug}` requiere modificar el sitemap generator y la ruta SSR en `server/index.ts`.

### Slugs problemáticos

| Slug actual | Problema | Slug sugerido |
|-------------|----------|---------------|
| `como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia` | 60 chars, lleno de preposiciones | `cuota-alimentaria-hijos-colombia` |
| `divorcio-express-en-colombia-requisitos-y-pasos-en-2026` | Año hardcodeado en slug | `divorcio-express-colombia-requisitos` |
| `cuanto-cuesta-un-divorcio-en-colombia-en-2026` | Año + preposiciones | `costo-divorcio-colombia` |
| `proceso-sucesion-colombia-2026` | Año en slug | `proceso-sucesion-colombia` |

**Causa en código:** `toSlug()` convierte el título completo a slug sin limpiar preposiciones ni años. Los slugs se generan automáticamente del título en `POST /api/admin/posts`.

### Contenido de servicio en sección equivocada

| URL | Problema |
|-----|----------|
| `/noticias/derecho-de-familia/abogado-de-familia-en-manizales` | Página transaccional ("¿Necesita un abogado?") publicada como artículo de blog. Compite con `/servicios/...` |

### Solo 1 página de servicios

El sitio tiene una única ruta de servicio hardcodeada: `/servicios/abogado-derecho-familia-manizales`. Debería haber páginas individuales para divorcios, custodia, alimentos, sucesiones.

---

## DUPLICADOS Y PROBLEMAS TÉCNICOS EN EL CÓDIGO

### JSON-LD roto por inyección directa de strings (server/index.ts ~línea 230)

| URL afectada | Problema |
|-------------|---------|
| `/noticias/divorcios/divorcio-express-en-colombia-requisitos-y-pasos-en-2026` | `meta_description` tiene `\n` literal que rompe el JSON-LD |
| `/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia` | Mismo problema |
| `/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026` | Mismo problema |

**Causa en código:** La ruta SSR de posts inyecta `${desc}` y `${post.title}` directamente en el string JSON-LD sin escapar. Si el campo tiene `\n`, comillas o caracteres especiales, rompe el JSON.

```typescript
// PROBLEMA (línea ~230):
{"@context":"https://schema.org","@type":"Article","headline":"${post.title}","description":"${desc}",...}

// SOLUCIÓN: usar JSON.stringify() para escapar
const ld = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: desc,
  // ...
});
```

### Meta description con saltos de línea (mismo origen)

| URL afectada | Detalle |
|-------------|---------|
| `/noticias/divorcios/divorcio-express-...` | `content="...ante \nnotario..."` |
| `/noticias/derecho-de-familia/como-calcular-...` | `content="...el \njuez..."` |
| `/noticias/divorcios/cuanto-cuesta-...` | `content="...judicial y \nexpress..."` |

**Causa:** El campo `meta_description` en la DB tiene `\n`. El server lo inyecta sin sanitizar: `<meta name="description" content="${desc}" />`.

### Inconsistencia de año

| URL | Problema |
|-----|---------|
| `/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026` | URL y title dicen "2026", meta description dice "2025" |

### H1 inyectado como hidden (todas las páginas)

| Campo | Detalle |
|-------|---------|
| H1 | Se inyecta con `style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)"`. Google puede interpretarlo como **cloaking** o texto oculto. Es mejor que el H1 sea visible en el HTML y que React lo reemplace al montar |

### Páginas sin OG tags

| URL | Tags faltantes |
|-----|---------------|
| `/sobre-mi` | Sin og:title, og:description, og:type, og:url |
| `/noticias/divorcios` (y todas las categorías dinámicas) | Sin og:title, og:description, og:type, og:url |
| **Todas las 15 URLs** | Sin `og:image` — previews en redes sociales sin imagen |

**Causa en código:** La ruta `/sobre-mi` y `/noticias/:catSlug` no inyectan OG tags. La ruta de posts sí lo hace pero sin `og:image`.

### Páginas sin JSON-LD

| URL | Schema sugerido |
|-----|----------------|
| `/sobre-mi` | `Person` o `ProfilePage` |
| `/noticias` | `Blog` o `CollectionPage` |
| `/noticias/:catSlug` (categorías) | `CollectionPage` |

### Seguridad: contraseñas en texto plano

| Problema | Detalle |
|----------|---------|
| Auth admin | `password` se almacena y compara en texto plano en la DB. El token es Base64 de `user:pass` sin firma. No es un problema SEO pero es crítico |

---

## RESUMEN DE FIXES EN CÓDIGO

| # | Fix | Archivo | Esfuerzo |
|---|-----|---------|----------|
| 1 | Sanitizar `desc` y `post.title` antes de inyectar en HTML/JSON-LD (eliminar `\n`, escapar comillas) | `server/index.ts` | 10 min |
| 2 | Usar `JSON.stringify()` para generar JSON-LD en vez de template literals | `server/index.ts` | 20 min |
| 3 | Hacer el H1 visible (no hidden) o usar `<noscript>` con contenido real | `server/index.ts` | 10 min |
| 4 | Agregar OG tags a `/sobre-mi` y `/noticias/:catSlug` | `server/index.ts` | 15 min |
| 5 | Agregar `og:image` a todas las rutas | `server/index.ts` | 10 min |
| 6 | Agregar JSON-LD a `/sobre-mi`, `/noticias`, categorías | `server/index.ts` | 20 min |
| 7 | Limpiar `toSlug()` para quitar preposiciones comunes y años | `server/index.ts` | 15 min |
| 8 | Corregir meta desc "2025" → "2026" | DB (data.db) | 2 min |
