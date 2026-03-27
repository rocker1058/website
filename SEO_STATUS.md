# SEO - Alexandra Vásquez Abogada

## Estado actual del proyecto

**Stack:** Vite + React + TypeScript + Express + SQLite
**Ubicación:** `~/lawyer/`
**Server:** `node dist/index.js` (puerto 3000)
**Admin:** `/admin` → usuario: `admin` / contraseña: `admin123` (CAMBIAR antes de producción)

---

## SEO On-Page — Lo que ya tiene ✅

- [x] URLs semánticas: `/noticias/divorcios/pasos-para-tramitar-un-divorcio`
- [x] Meta title y description dinámicos por página (SSR desde Express)
- [x] Open Graph tags (og:title, og:description, og:type, og:url)
- [x] Canonical URLs en todas las páginas
- [x] Schema.org JSON-LD tipo `Attorney` en el home
- [x] Schema.org JSON-LD tipo `Article` en cada post
- [x] Sitemap.xml dinámico (`/sitemap.xml`)
- [x] Robots.txt (`/robots.txt`) — bloquea `/admin`
- [x] Geo meta tags (CO-CAL, Manizales)
- [x] Keywords por página
- [x] Categorías con páginas propias (`/noticias/custodia`, `/noticias/divorcios`)
- [x] Scroll to top al navegar entre páginas
- [x] Menú móvil funcional con delay para scroll
- [x] Panel admin con CRUD de posts (crear, editar, eliminar)
- [x] Campos SEO en admin (meta title, meta description)
- [x] Formulario de contacto con almacenamiento en DB
- [x] Página "Sobre Mí" separada (`/sobre-mi`)

---

## SEO On-Page — Lo que falta ❌

### Alta prioridad (mayor impacto en posicionamiento)

- [ ] **Breadcrumbs con Schema.org** — `Inicio > Noticias > Divorcios > Título`
  - Google los muestra en resultados de búsqueda
  - Agregar JSON-LD BreadcrumbList en cada post y categoría

- [ ] **Internal linking** — Posts relacionados al final de cada artículo
  - Mostrar 2-3 posts de la misma categoría
  - Google valora mucho los enlaces internos

- [ ] **Mejorar H1 del home** — Actualmente dice "Alexandra Vásquez"
  - Debería incluir keywords: "Abogada Especialista en Derecho de Familia en Manizales"

- [ ] **Contenido largo en posts** — Los de ejemplo tienen ~50 palabras
  - Google prefiere artículos de +1000 palabras
  - Agregar subtítulos H2/H3 dentro del contenido (soporte markdown o HTML)

### Media prioridad

- [ ] **Favicon** — No tiene, se ve genérico en el navegador
- [ ] **Open Graph image** — No hay imagen para preview en redes sociales
  - Crear imagen default con logo/nombre para compartir en WhatsApp/Facebook
- [ ] **Alt text en imágenes** — Cuando se agreguen imágenes, necesitan alt descriptivo
- [ ] **Lazy loading de componentes** — El JS pesa 313kb, se puede dividir con dynamic imports
- [ ] **Soporte de imágenes en posts** — Actualmente solo texto plano
- [ ] **Página 404 personalizada** — Actualmente muestra página en blanco

### Baja prioridad (nice to have)

- [ ] **Blog con paginación** — Si crece a +20 posts
- [ ] **Búsqueda interna** — Buscar posts por texto
- [ ] **RSS Feed** — Para suscriptores
- [ ] **Tiempo de lectura** — Estimado en cada post
- [ ] **Botón compartir** — WhatsApp, Facebook, Twitter en cada post
- [ ] **Google Analytics / Search Console** — Medir tráfico
- [ ] **Botón flotante de WhatsApp** — Siempre visible en la esquina

---

## Infraestructura pendiente

- [ ] **Dominio** — Comprar dominio (ej: alexandravasquez.com)
  - Cambiar todas las referencias de `alexandravasquez.com` en `server/index.ts`
- [ ] **SSL/HTTPS** — Certificado SSL (Let's Encrypt con certbot)
- [ ] **Deploy a EC2** — Subir a t3.micro con PM2
- [ ] **Cambiar contraseña admin** — `admin123` es solo para desarrollo
- [ ] **Backup de DB** — Cron job para respaldar `data.db`
- [ ] **Nginx como reverse proxy** — Para servir en puerto 80/443
- [ ] **Foto profesional** — Reemplazar placeholder "AV" en Sobre Mí

---

## Comandos útiles

```bash
# Desarrollo local
cd ~/lawyer && node dist/index.js

# Rebuild después de cambios
npx vite build && npx esbuild server/index.ts --bundle --platform=node --format=esm --outfile=dist/index.js --external:better-sqlite3 --external:express --packages=external

# Borrar DB y recrear con datos de ejemplo
rm -f data.db && node dist/index.js

# Ver sitemap
curl http://localhost:3000/sitemap.xml

# Ver robots.txt
curl http://localhost:3000/robots.txt
```

---

## Estructura de URLs

```
/                                          → Home
/sobre-mi                                  → Página Sobre Mí
/noticias/{categoria}                      → Lista de posts por categoría
/noticias/{categoria}/{slug-del-post}      → Post individual
/admin                                     → Panel administrativo
/sitemap.xml                               → Sitemap para Google
/robots.txt                                → Directivas para bots
```
