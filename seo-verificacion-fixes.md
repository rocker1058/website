# Verificación de Fixes SEO — alexandravasquez.com

**Fecha:** 28 de abril de 2026 · **URLs verificadas:** 9

---

## Resultado por fix

| Fix | Descripción | Estado | Detalle |
|-----|-------------|--------|---------|
| 1 | JSON-LD válido (sin `\n` rotos) | ✅ OK | Las 9 URLs tienen JSON-LD que parsea correctamente con `JSON.parse()`. Tipos: Attorney, ProfilePage, Blog, CollectionPage (×2), LegalService, Article (×3) |
| 2 | Meta description sin `\n` | ✅ OK | Las 9 URLs tienen meta description limpia, sin saltos de línea. El post "cuánto cuesta un divorcio" ahora dice "2026" (antes decía "2025") |
| 3 | H1 visible (no oculto) | ⚠️ PARCIAL | 8 de 9 URLs tienen H1 visible con `style="font-size:1.5rem;text-align:center;padding:1rem"`. **Falta H1 en `/servicios/abogado-derecho-familia-manizales`** (la ruta SSR no llama a `injectH1()`) |
| 4 | OG tags en `/sobre-mi` | ✅ OK | Tiene og:title, og:description, og:type (profile), og:url |
| 5 | OG tags en `/noticias` y categorías | ✅ OK | `/noticias`, `/noticias/derecho-de-familia` y `/noticias/divorcios` tienen los 4 OG tags |
| 6 | `og:image` en todas | ❌ FALLO | Ninguna de las 9 URLs tiene `og:image`. Se saltó intencionalmente porque no hay imagen disponible |
| 7 | JSON-LD en `/sobre-mi` | ✅ OK | Tiene `@type: ProfilePage` con `mainEntity` de tipo `Person` |
| 8 | JSON-LD en `/noticias` y categorías | ✅ OK | `/noticias` tiene `@type: Blog`, `/noticias/derecho-de-familia` y `/noticias/divorcios` tienen `@type: CollectionPage` |

### Verificación extra

| Check | Estado | Detalle |
|-------|--------|---------|
| 301 redirect post borrado | ✅ OK | `/noticias/derecho-de-familia/abogado-de-familia-en-manizales` → 301 → `/servicios/abogado-derecho-familia-manizales` |
| Año corregido en DB | ✅ OK | Meta description de "cuánto cuesta un divorcio" ahora dice "2026" |

---

## Problemas pendientes

1. **H1 faltante en `/servicios/abogado-derecho-familia-manizales`** — La ruta SSR de servicios no llama a `injectH1()`. Agregar: `html = injectH1(html, "Abogado de Derecho de Familia en Manizales");`
2. **`og:image` ausente en todas las páginas** — Pendiente hasta tener una imagen disponible para usar como preview en redes sociales
