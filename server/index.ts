import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import compression from "compression";
import { marked } from "marked";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(compression());
// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json());

let postsCache: { data: any; ts: number } | null = null;
const CACHE_TTL = 60_000;

function toSlug(text: string) {
  const stopwords = ["el","la","los","las","de","del","en","un","una","y","o","que","como","para","por","con","al","ante","se","lo","su","es","son","todo","sobre"];
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(20\d{2})\b/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/)
    .filter(w => !stopwords.includes(w))
    .join("-").replace(/^-|-$/g, "");
}

function sanitize(text: string) {
  return text.replace(/[\n\r]+/g, " ").replace(/\s+/g, " ").trim();
}

function escAttr(text: string) {
  return sanitize(text).replace(/"/g, "&quot;");
}

// Public: get published posts
app.get("/api/posts", (_req, res) => {
  if (postsCache && Date.now() - postsCache.ts < CACHE_TTL) return res.json(postsCache.data);
  const data = db.prepare("SELECT id, title, slug, excerpt, category, category_slug, date FROM posts WHERE published = 1 ORDER BY id DESC").all();
  postsCache = { data, ts: Date.now() };
  res.json(data);
});

// Public: get posts by category
app.get("/api/posts/categoria/:catSlug", (req, res) => {
  const posts = db.prepare("SELECT id, title, slug, excerpt, category, category_slug, date FROM posts WHERE category_slug = ? AND published = 1 ORDER BY id DESC").all(req.params.catSlug);
  res.json(posts);
});

// Public: get post by category_slug + slug
app.get("/api/posts/:catSlug/:slug", (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE category_slug = ? AND slug = ? AND published = 1").get(req.params.catSlug, req.params.slug) as any;
  if (!post) return res.status(404).json({ error: "No encontrado" });
  res.json(post);
});

// Public: get all categories
app.get("/api/categories", (_req, res) => {
  const cats = db.prepare("SELECT DISTINCT category, category_slug FROM posts WHERE published = 1 ORDER BY category").all();
  res.json(cats);
});

// Public: submit contact
app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "Campos requeridos" });
  db.prepare("INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)").run(name, email, phone || "", message);
  res.json({ ok: true });
});

// Admin auth
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM admin WHERE username = ? AND password = ?").get(username, password) as any;
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
  res.json({ ok: true, token: Buffer.from(`${username}:${password}`).toString("base64") });
});

const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.replace("Basic ", "");
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    const [username, password] = Buffer.from(token, "base64").toString().split(":");
    const user = db.prepare("SELECT * FROM admin WHERE username = ? AND password = ?").get(username, password);
    if (!user) return res.status(401).json({ error: "No autorizado" });
    next();
  } catch { res.status(401).json({ error: "No autorizado" }); }
};

app.get("/api/admin/posts", auth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM posts ORDER BY id DESC").all());
});

app.post("/api/admin/posts", auth, (req, res) => {
  const { title, excerpt, content, category, meta_title, meta_description } = req.body;
  if (!title || !excerpt) return res.status(400).json({ error: "Título y extracto requeridos" });
  const slug = toSlug(title);
  const catSlug = toSlug(category || "General");
  const result = db.prepare("INSERT INTO posts (title, slug, excerpt, content, category, category_slug, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(title, slug, excerpt, content || "", category || "General", catSlug, meta_title || title, meta_description || excerpt);
  postsCache = null;
  res.json({ id: result.lastInsertRowid, slug, category_slug: catSlug });
});

app.put("/api/admin/posts/:id", auth, (req, res) => {
  const { title, excerpt, content, category, meta_title, meta_description } = req.body;
  if (!title || !excerpt) return res.status(400).json({ error: "Título y extracto requeridos" });
  const slug = toSlug(title);
  const catSlug = toSlug(category || "General");
  db.prepare("UPDATE posts SET title=?, slug=?, excerpt=?, content=?, category=?, category_slug=?, meta_title=?, meta_description=? WHERE id=?").run(title, slug, excerpt, content || "", category || "General", catSlug, meta_title || title, meta_description || excerpt, req.params.id);
  postsCache = null;
  res.json({ ok: true, slug, category_slug: catSlug });
});

app.delete("/api/admin/posts/:id", auth, (req, res) => {
  db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  postsCache = null;
  res.json({ ok: true });
});

app.get("/api/admin/contacts", auth, (_req, res) => {
  res.json(db.prepare("SELECT * FROM contacts ORDER BY id DESC").all());
});

// Sitemap
app.get("/sitemap.xml", (_req, res) => {
  const posts = db.prepare("SELECT slug, category_slug, date FROM posts WHERE published = 1 ORDER BY id DESC").all() as any[];
  const cats = db.prepare("SELECT DISTINCT category_slug FROM posts WHERE published = 1").all() as any[];
  const base = "https://alexandravasquez.com";
  const today = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url><loc>${base}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  xml += `  <url><loc>${base}/sobre-mi</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  xml += `  <url><loc>${base}/servicios/abogado-derecho-familia-manizales</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n`;
  xml += `  <url><loc>${base}/servicios/divorcio-manizales</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  xml += `  <url><loc>${base}/servicios/custodia-hijos-manizales</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  xml += `  <url><loc>${base}/servicios/sucesiones-manizales</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  xml += `  <url><loc>${base}/servicios/cuota-alimentaria-manizales</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  xml += `  <url><loc>${base}/noticias</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  for (const c of cats) {
    xml += `  <url><loc>${base}/noticias/${c.category_slug}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
  }
  for (const p of posts) {
    if (p.category_slug === "derecho-de-familia" && p.slug === "abogado-de-familia-en-manizales") continue;
    xml += `  <url><loc>${base}/noticias/${p.category_slug}/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
  }
  xml += `</urlset>`;
  res.header("Content-Type", "application/xml").send(xml);
});

app.get("/robots.txt", (_req, res) => {
  res.header("Content-Type", "text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://alexandravasquez.com/sitemap.xml`);
});

app.get("/llms.txt", (_req, res) => {
  res.header("Content-Type", "text/plain").send(`# Alexandra Vásquez - Abogada de Familia en Manizales

## Información general
- Nombre: Alexandra Vásquez
- Profesión: Abogada especialista en Derecho de Familia
- Ubicación: Manizales, Caldas, Colombia
- Sitio web: https://alexandravasquez.com

## Áreas de práctica
- Divorcios (express y contenciosos)
- Custodia de hijos
- Cuota alimentaria
- Sucesiones y herencias
- Liquidación de sociedad conyugal
- Violencia intrafamiliar
- Unión marital de hecho

## Páginas principales
- Inicio: https://alexandravasquez.com/
- Sobre mí: https://alexandravasquez.com/sobre-mi
- Servicios: https://alexandravasquez.com/servicios/abogado-derecho-familia-manizales
- Divorcio: https://alexandravasquez.com/servicios/divorcio-manizales
- Custodia: https://alexandravasquez.com/servicios/custodia-hijos-manizales
- Cuota alimentaria: https://alexandravasquez.com/servicios/cuota-alimentaria-manizales
- Sucesiones: https://alexandravasquez.com/servicios/sucesiones-manizales
- Blog: https://alexandravasquez.com/noticias
`);
});

app.use(express.static(path.join(__dirname, "public"), { index: false, maxAge: "7d" }));

const htmlPath = path.join(__dirname, "public", "index.html");
const getHtml = () => fs.readFileSync(htmlPath, "utf-8");
const OG_IMG = "https://alexandravasquez.com/og-image.png";
const injectH1 = (html: string, h1: string) =>
  html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full"><h1>${escAttr(h1)}</h1></div>`);

// SSR: Home
app.get("/", (_req, res) => {
  let html = getHtml();
  const homeContent = `<h1>Abogado Especialista en Derecho de Familia</h1>
<p>Alexandra Vásquez — Abogada de familia en Manizales, Caldas. Más de 10 años de experiencia protegiendo los derechos de las familias colombianas.</p>
<nav><h2>Áreas de Práctica</h2><ul>
<li><a href="/servicios/divorcio-manizales">Divorcios en Manizales</a> — Divorcio express ante notario y divorcio contencioso</li>
<li><a href="/servicios/custodia-hijos-manizales">Custodia de Hijos</a> — Custodia compartida, régimen de visitas y patria potestad</li>
<li><a href="/servicios/cuota-alimentaria-manizales">Cuota Alimentaria</a> — Fijación, aumento, reducción y cobro de alimentos</li>
<li><a href="/servicios/sucesiones-manizales">Sucesiones y Herencias</a> — Sucesión intestada, testamentos y partición de bienes</li>
</ul></nav>
<section><h2>Blog Jurídico</h2><ul>
<li><a href="/noticias/divorcios/divorcio-express-en-colombia-requisitos-y-pasos-en-2026">Divorcio Express en Colombia: Requisitos y Pasos en 2026</a></li>
<li><a href="/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026">¿Cuánto cuesta un divorcio en Colombia en 2026?</a></li>
<li><a href="/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia">¿Cómo calcular la cuota alimentaria de los hijos en Colombia?</a></li>
</ul><a href="/noticias">Ver todos los artículos</a></section>
<p><a href="/sobre-mi">Conozca a Alexandra Vásquez</a></p>`;
  html = html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full">${homeContent}</div>`);
  html = html.replace(/<title>.*?<\/title>/, `<title>Abogado de Familia en Manizales | Alexandra Vásquez</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="Abogado de familia en Manizales con experiencia en divorcios, custodia de hijos, alimentos y sucesiones. Alexandra Vásquez — consulta hoy." />`);
  const meta = `
    <meta property="og:title" content="Abogado de Familia en Manizales | Alexandra Vásquez" />
    <meta property="og:description" content="Divorcios, custodia, alimentos y sucesiones en Manizales. Asesoría legal familiar con Alexandra Vásquez." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://alexandravasquez.com/" />
    <meta property="og:image" content="${OG_IMG}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="keywords" content="abogado de familia manizales, abogado familia manizales, derecho de familia manizales, abogado divorcio manizales, custodia hijos manizales, cuota alimentaria manizales" />
    <meta name="author" content="Alexandra Vásquez" />
    <meta name="geo.region" content="CO-CAL" />
    <meta name="geo.placename" content="Manizales" />
    <link rel="canonical" href="https://alexandravasquez.com/" />
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Attorney","name":"Alexandra Vásquez","description":"Abogado de familia en Manizales, Colombia. Divorcios, custodia, alimentos y sucesiones.","url":"https://alexandravasquez.com","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"areaServed":{"@type":"Country","name":"Colombia"},"knowsAbout":["Derecho de Familia","Divorcios","Custodia","Alimentos","Sucesiones"]}
    </script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Sobre Mi — full content for crawlers
app.get("/sobre-mi", (_req, res) => {
  let html = getHtml();
  const aboutContent = `<h1>Alexandra Vásquez - Abogada de Familia en Manizales</h1>
<section><h2>Mi Historia</h2><p>Abogada de la Universidad de Caldas con especialización en Derecho de Familia. Con más de una década de trayectoria, he dedicado mi carrera a proteger los derechos de las familias colombianas con un enfoque humano, estratégico y orientado a resultados.</p><p>Cada caso es único y merece una atención personalizada. Mi compromiso es brindarle la tranquilidad de saber que su situación está en manos de una profesional que entiende la importancia de lo que está en juego: su familia.</p><p>Radicada en Manizales, Caldas, brindo asesoría legal a familias en toda Colombia, combinando el conocimiento jurídico con la sensibilidad que cada situación familiar requiere.</p></section>
<section><h2>Experiencia</h2><ul><li>Más de 10 años de experiencia en derecho de familia</li><li>Más de 500 familias asesoradas</li><li>98% de casos exitosos</li><li>15+ especializaciones y cursos de actualización</li></ul></section>
<section><h2>Áreas de práctica</h2><ul><li><a href="/servicios/divorcio-manizales">Divorcios en Manizales</a> — Express y contenciosos</li><li><a href="/servicios/custodia-hijos-manizales">Custodia de hijos</a> — Compartida, régimen de visitas</li><li><a href="/servicios/cuota-alimentaria-manizales">Cuota alimentaria</a> — Fijación, aumento y cobro</li><li><a href="/servicios/sucesiones-manizales">Sucesiones y herencias</a> — Testamentos, partición de bienes</li></ul></section>
<section><h2>¿Por qué elegirme?</h2><ul><li><strong>Compromiso:</strong> Cada caso recibe mi dedicación completa. Su tranquilidad es mi prioridad.</li><li><strong>Experiencia:</strong> Formación continua y actualización permanente en legislación familiar colombiana.</li><li><strong>Cercanía:</strong> Atención personalizada y comunicación constante durante todo el proceso.</li></ul></section>`;
  html = html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full">${aboutContent}</div>`);
  const title = "Sobre Mí | Alexandra Vásquez - Abogada en Manizales";
  const desc = "Conozca a Alexandra Vásquez, abogada con más de 10 años de experiencia en derecho de familia en Manizales, Colombia.";
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
  const ld = JSON.stringify({"@context":"https://schema.org","@type":"ProfilePage","mainEntity":{"@type":"Person","name":"Alexandra Vásquez","jobTitle":"Abogada","description":desc,"url":"https://alexandravasquez.com/sobre-mi","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"}}});
  const meta = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="https://alexandravasquez.com/sobre-mi" />
    <meta property="og:image" content="${OG_IMG}" />
    <link rel="canonical" href="https://alexandravasquez.com/sobre-mi" />
    <script type="application/ld+json">${ld}</script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Servicios
app.get("/servicios/abogado-derecho-familia-manizales", (_req, res) => {
  let html = getHtml();
  const content = `<h1>Abogado de Familia en Manizales</h1>
<p>Alexandra Vásquez — Abogada especialista en derecho de familia en Manizales, Caldas. Más de 10 años de experiencia en divorcios, custodia, alimentos y sucesiones.</p>
<section><h2>Nuestros Servicios</h2>
<ul><li><a href="/servicios/divorcio-manizales"><strong>Divorcios:</strong></a> Divorcio express ante notario, divorcio de mutuo acuerdo y divorcio contencioso.</li>
<li><a href="/servicios/custodia-hijos-manizales"><strong>Custodia de Hijos:</strong></a> Custodia compartida, régimen de visitas, modificación de custodia y patria potestad.</li>
<li><a href="/servicios/cuota-alimentaria-manizales"><strong>Cuota Alimentaria:</strong></a> Fijación, aumento, reducción y cobro ejecutivo de alimentos.</li>
<li><a href="/servicios/sucesiones-manizales"><strong>Sucesiones y Herencias:</strong></a> Sucesión intestada, testamentos, liquidación y partición de bienes.</li>
<li><strong>Liquidación de Sociedad Conyugal:</strong> División de bienes adquiridos durante el matrimonio.</li>
<li><strong>Violencia Intrafamiliar:</strong> Medidas de protección y acompañamiento legal.</li>
<li><strong>Unión Marital de Hecho:</strong> Declaración, derechos patrimoniales y disolución.</li></ul></section>
<section><h2>¿Por qué elegir a Alexandra Vásquez?</h2>
<ul><li>Más de 10 años de experiencia en derecho de familia</li><li>Más de 500 familias asesoradas en Manizales y Colombia</li><li>Atención personalizada y comunicación constante</li><li>Enfoque humano y orientado a resultados</li></ul></section>
<p><a href="/sobre-mi">Conozca más sobre Alexandra Vásquez</a></p>`;
  html = html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full">${content}</div>`);
  const title = "Abogado Familia Manizales | Divorcios y Custodia";
  const desc = "Abogado de familia en Manizales especialista en divorcios, custodia de hijos, cuota alimentaria y sucesiones. Consulta con Alexandra Vásquez hoy.";
  const url = "https://alexandravasquez.com/servicios/abogado-derecho-familia-manizales";
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
  const meta = `
    <meta name="robots" content="index, follow" />
    <meta name="geo.region" content="CO-CAL" />
    <meta name="geo.placename" content="Manizales" />
    <meta name="geo.position" content="5.0703;-75.5138" />
    <meta name="ICBM" content="5.0703, -75.5138" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMG}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="keywords" content="abogado derecho de familia manizales, abogada familia manizales, divorcio manizales, custodia hijos manizales, cuota alimentaria colombia" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"LegalService","name":"Alexandra Vásquez - Abogada de Familia en Manizales","description":"${desc}","url":"${url}","areaServed":{"@type":"City","name":"Manizales"},"serviceType":"Derecho de Familia","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"hasOfferCatalog":{"@type":"OfferCatalog","name":"Servicios Legales","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"Divorcios en Manizales"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Custodia de hijos"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Cuota alimentaria"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Separación de bienes"}}]}}
    </script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});


// SSR: Divorcio Manizales
app.get("/servicios/divorcio-manizales", (_req, res) => {
  let html = getHtml();
  const content = `<h1>Abogado de Divorcios en Manizales</h1>
<p>Asesoría legal experta para su proceso de divorcio. Tramitamos divorcios express ante notario, divorcios de mutuo acuerdo y divorcios contenciosos con la protección que usted y su familia necesitan.</p>
<section><h2>Tipos de Divorcio que Tramitamos</h2>
<ol><li><strong>Divorcio Express:</strong> Ante notario, en 1-2 semanas. Requiere mutuo acuerdo y no tener hijos menores o ya tener acuerdo sobre custodia y alimentos.</li>
<li><strong>Divorcio de Mutuo Acuerdo:</strong> Ambos cónyuges acuerdan los términos: bienes, custodia y alimentos. Puede ser notarial o judicial según el caso.</li>
<li><strong>Divorcio Contencioso:</strong> Cuando no hay acuerdo. Se presenta demanda ante juez de familia. Requiere abogado obligatoriamente.</li></ol></section>
<section><h2>¿Cómo es el Proceso de Divorcio en Manizales?</h2>
<ol><li>Consulta inicial gratuita para evaluar su caso</li><li>Recopilación de documentos necesarios</li><li>Elaboración del acuerdo o demanda</li><li>Trámite ante notaría o juzgado</li><li>Registro de la sentencia o escritura</li></ol></section>
<section><h2>Documentos Necesarios</h2><ul><li>Registro civil de matrimonio</li><li>Cédulas de ciudadanía</li><li>Registro civil de nacimiento de los hijos (si aplica)</li><li>Acuerdo de custodia y alimentos (si hay hijos menores)</li></ul></section>
<p><a href="/noticias/divorcios/divorcio-express-en-colombia-requisitos-y-pasos-en-2026">Lea más: Divorcio Express en Colombia - Requisitos y Pasos</a></p>
<p><a href="/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026">¿Cuánto cuesta un divorcio en Colombia en 2026?</a></p>`;
  html = html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full">${content}</div>`);
  const title = "Abogado Divorcio Manizales | Trámite Rápido y Seguro";
  const desc = "Abogado especialista en divorcios en Manizales. Divorcio express ante notario, divorcio contencioso y de mutuo acuerdo. Asesoría con Alexandra Vásquez.";
  const url = "https://alexandravasquez.com/servicios/divorcio-manizales";
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
  const ld = JSON.stringify({"@context":"https://schema.org","@type":"LegalService","name":"Divorcios en Manizales - Alexandra Vásquez","description":desc,"url":url,"areaServed":{"@type":"City","name":"Manizales"},"serviceType":"Divorcios","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"provider":{"@type":"Person","name":"Alexandra Vásquez","jobTitle":"Abogada"}});
  const meta = `
    <meta name="robots" content="index, follow" />
    <meta name="geo.region" content="CO-CAL" />
    <meta name="geo.placename" content="Manizales" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMG}" />
    <meta name="keywords" content="abogado divorcio manizales, divorcio express manizales, divorcio mutuo acuerdo manizales, abogado divorcio caldas, cuánto cuesta divorcio manizales" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">${ld}</script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Custodia Hijos Manizales
app.get("/servicios/custodia-hijos-manizales", (_req, res) => {
  let html = getHtml();
  const content = `<h1>Abogado de Custodia de Hijos en Manizales</h1>
<p>Abogado especialista en custodia de hijos en Manizales. Protegemos los derechos de sus hijos con un enfoque humano y legal sólido.</p>
<section><h2>Servicios de Custodia</h2>
<ul><li><strong>Custodia compartida:</strong> Acuerdos equitativos para ambos padres que priorizan el bienestar del menor.</li>
<li><strong>Régimen de visitas:</strong> Establecimiento y modificación de horarios de visita.</li>
<li><strong>Modificación de custodia:</strong> Cuando las circunstancias cambian y se requiere un nuevo acuerdo.</li>
<li><strong>Patria potestad:</strong> Privación o restablecimiento según el caso.</li></ul></section>
<section><h2>¿Cómo se Define la Custodia en Colombia?</h2>
<ol><li>Acuerdo entre los padres (preferido por la ley)</li><li>Conciliación ante el ICBF o comisaría de familia</li><li>Proceso judicial ante juez de familia si no hay acuerdo</li></ol>
<p>El juez siempre decide basándose en el interés superior del niño, considerando: estabilidad emocional, capacidad económica, vínculo afectivo y entorno familiar.</p></section>
<p><a href="/noticias/derecho-de-familia/custodia-hijos-colombia-guia-completa">Lea más: Custodia de Hijos en Colombia - Guía Completa</a></p>
<p><a href="/servicios/cuota-alimentaria-manizales">Ver también: Cuota Alimentaria en Manizales</a></p>`;
  html = html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full">${content}</div>`);
  const title = "Custodia de Hijos Manizales | Abogado Especialista";
  const desc = "Abogado especialista en custodia de hijos en Manizales. Custodia compartida, régimen de visitas y modificación de custodia. Alexandra Vásquez.";
  const url = "https://alexandravasquez.com/servicios/custodia-hijos-manizales";
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
  const ld = JSON.stringify({"@context":"https://schema.org","@type":"LegalService","name":"Custodia de Hijos en Manizales - Alexandra Vásquez","description":desc,"url":url,"areaServed":{"@type":"City","name":"Manizales"},"serviceType":"Custodia de Hijos","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"provider":{"@type":"Person","name":"Alexandra Vásquez","jobTitle":"Abogada"}});
  const meta = `
    <meta name="robots" content="index, follow" />
    <meta name="geo.region" content="CO-CAL" />
    <meta name="geo.placename" content="Manizales" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMG}" />
    <meta name="keywords" content="custodia hijos manizales, abogado custodia manizales, régimen de visitas manizales, custodia compartida colombia, patria potestad manizales" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">${ld}</script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Sucesiones Manizales
app.get("/servicios/sucesiones-manizales", (_req, res) => {
  let html = getHtml();
  const content = `<h1>Abogado de Sucesiones en Manizales</h1>
<p>Abogado especialista en sucesiones y herencias en Manizales. Tramitamos sucesiones intestadas, testamentos, liquidación de herencia y partición de bienes.</p>
<section><h2>Servicios de Sucesiones</h2>
<ul><li><strong>Sucesión intestada:</strong> Cuando el fallecido no dejó testamento. Se reparten los bienes según la ley colombiana.</li>
<li><strong>Sucesión testamentaria:</strong> Ejecución de la voluntad del testador conforme a la ley.</li>
<li><strong>Liquidación de herencia:</strong> Inventario, avalúo y distribución de bienes entre herederos.</li>
<li><strong>Partición de bienes:</strong> División formal de la propiedad entre los herederos.</li></ul></section>
<section><h2>Proceso de Sucesión en Colombia</h2>
<ol><li>Obtener registro civil de defunción</li><li>Identificar herederos y bienes del causante</li><li>Iniciar proceso notarial (si hay acuerdo) o judicial</li><li>Inventario y avalúo de bienes</li><li>Partición y adjudicación</li><li>Registro de escritura pública</li></ol></section>
<p><a href="/noticias/derecho-de-familia/proceso-sucesion-colombia-2026">Lea más: Proceso de Sucesión en Colombia 2026</a></p>`;
  html = html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full">${content}</div>`);
  const title = "Abogado Sucesiones Manizales | Herencias y Testamentos";
  const desc = "Abogado especialista en sucesiones en Manizales. Sucesión intestada, testamentos, liquidación de herencia y partición de bienes. Alexandra Vásquez.";
  const url = "https://alexandravasquez.com/servicios/sucesiones-manizales";
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
  const ld = JSON.stringify({"@context":"https://schema.org","@type":"LegalService","name":"Sucesiones en Manizales - Alexandra Vásquez","description":desc,"url":url,"areaServed":{"@type":"City","name":"Manizales"},"serviceType":"Sucesiones y Herencias","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"provider":{"@type":"Person","name":"Alexandra Vásquez","jobTitle":"Abogada"}});
  const meta = `
    <meta name="robots" content="index, follow" />
    <meta name="geo.region" content="CO-CAL" />
    <meta name="geo.placename" content="Manizales" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMG}" />
    <meta name="keywords" content="abogado sucesiones manizales, herencia manizales, sucesión intestada manizales, testamento colombia, partición bienes manizales" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">${ld}</script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Cuota Alimentaria Manizales
app.get("/servicios/cuota-alimentaria-manizales", (_req, res) => {
  let html = getHtml();
  const content = `<h1>Abogado Cuota Alimentaria en Manizales</h1>
<p>Abogado especialista en cuota alimentaria en Manizales. Fijación, aumento, reducción y cobro de alimentos para hijos menores y mayores dependientes.</p>
<section><h2>Servicios de Cuota Alimentaria</h2>
<ul><li><strong>Fijación de cuota:</strong> Establecimiento inicial del monto de alimentos según ingresos del obligado y necesidades del menor.</li>
<li><strong>Aumento de cuota:</strong> Cuando las necesidades del hijo aumentan o los ingresos del obligado mejoran.</li>
<li><strong>Reducción de cuota:</strong> Cuando las circunstancias económicas del obligado cambian significativamente.</li>
<li><strong>Cobro ejecutivo:</strong> Demanda para obligar al pago cuando hay incumplimiento.</li></ul></section>
<section><h2>¿Cómo se Calcula la Cuota Alimentaria en Colombia?</h2>
<p>La cuota alimentaria se calcula considerando:</p>
<ol><li>Ingresos del padre o madre obligado</li><li>Necesidades del hijo (educación, salud, vivienda, recreación)</li><li>Capacidad económica de ambos padres</li><li>Número de hijos a cargo</li></ol>
<p>Generalmente oscila entre el 25% y 50% del salario del obligado, dependiendo del número de hijos.</p></section>
<section><h2>Proceso para Fijar la Cuota</h2>
<ol><li>Conciliación ante el ICBF o comisaría de familia</li><li>Si no hay acuerdo, demanda ante juez de familia</li><li>Fijación provisional mientras se resuelve el proceso</li><li>Sentencia definitiva</li></ol></section>
<p><a href="/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia">Lea más: ¿Cómo calcular la cuota alimentaria en Colombia?</a></p>`;
  html = html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full">${content}</div>`);
  const title = "Cuota Alimentaria Manizales | Abogado Alimentos";
  const desc = "Abogado especialista en cuota alimentaria en Manizales. Fijación, aumento, reducción y cobro de alimentos para hijos. Consulta con Alexandra Vásquez.";
  const url = "https://alexandravasquez.com/servicios/cuota-alimentaria-manizales";
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
  const ld = JSON.stringify({"@context":"https://schema.org","@type":"LegalService","name":"Cuota Alimentaria en Manizales - Alexandra Vásquez","description":desc,"url":url,"areaServed":{"@type":"City","name":"Manizales"},"serviceType":"Cuota Alimentaria","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"provider":{"@type":"Person","name":"Alexandra Vásquez","jobTitle":"Abogada"}});
  const meta = `
    <meta name="robots" content="index, follow" />
    <meta name="geo.region" content="CO-CAL" />
    <meta name="geo.placename" content="Manizales" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMG}" />
    <meta name="keywords" content="cuota alimentaria manizales, abogado alimentos manizales, demanda alimentos manizales, pensión alimenticia hijos colombia, cobro alimentos manizales" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">${ld}</script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Noticias index
app.get("/noticias", (_req, res) => {
  let html = getHtml();
  html = injectH1(html, "Blog Jurídico | Alexandra Vásquez");
  const title = "Blog Jurídico | Alexandra Vásquez";
  const desc = "Artículos sobre derecho de familia en Colombia: divorcios, custodia, alimentos y sucesiones. Blog jurídico de Alexandra Vásquez, Manizales.";
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
  const ld = JSON.stringify({"@context":"https://schema.org","@type":"Blog","name":title,"description":desc,"url":"https://alexandravasquez.com/noticias","author":{"@type":"Person","name":"Alexandra Vásquez"}});
  const meta = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://alexandravasquez.com/noticias" />
    <meta property="og:image" content="${OG_IMG}" />
    <link rel="canonical" href="https://alexandravasquez.com/noticias" />
    <script type="application/ld+json">${ld}</script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

app.get("/noticias/:catSlug", (req, res) => {
  const cat = db.prepare("SELECT DISTINCT category, category_slug FROM posts WHERE category_slug = ? AND published = 1").get(req.params.catSlug) as any;
  let html = getHtml();
  const catName = cat?.category || req.params.catSlug;
  const url = `https://alexandravasquez.com/noticias/${req.params.catSlug}`;
  const title = `${catName} | Blog Jurídico - Alexandra Vásquez`;
  const desc = `Artículos sobre ${catName.toLowerCase()} por Alexandra Vásquez, abogada especialista en derecho de familia en Colombia.`;
  html = injectH1(html, `Artículos sobre ${catName} en Colombia`);
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
  const ld = JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":title,"description":desc,"url":url});
  const meta = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMG}" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">${ld}</script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// 301 redirect: old cannibalizing post → servicios
app.get("/noticias/derecho-de-familia/abogado-de-familia-en-manizales", (_req, res) => {
  res.redirect(301, "/servicios/abogado-derecho-familia-manizales");
});

// SSR: Post page — full content for crawlers
app.get("/noticias/:catSlug/:slug", (req, res) => {
  let html = getHtml();
  const post = db.prepare("SELECT * FROM posts WHERE category_slug = ? AND slug = ? AND published = 1").get(req.params.catSlug, req.params.slug) as any;
  if (post) {
    // Inject full article content so crawlers see it without JS
    const renderedContent = marked(post.content) as string;
    const articleHtml = `<h1>${escAttr(post.title)}</h1><p>${escAttr(post.excerpt)}</p><article>${renderedContent}</article>`;
    html = html.replace('<div id="root" class="max-w-full"></div>', `<div id="root" class="max-w-full">${articleHtml}</div>`);
    const title = escAttr(post.meta_title || post.title);
    const desc = escAttr(post.meta_description || post.excerpt);
    const url = `https://alexandravasquez.com/noticias/${post.category_slug}/${post.slug}`;
    html = html.replace(/<title>.*?<\/title>/, `<title>${sanitize(post.meta_title || post.title)}</title>`);
    html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
    const ld = JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":sanitize(post.title),"description":sanitize(post.meta_description || post.excerpt),"datePublished":post.date,"author":{"@type":"Person","name":"Alexandra Vásquez","jobTitle":"Abogada"},"publisher":{"@type":"Organization","name":"Alexandra Vásquez - Abogada"},"mainEntityOfPage":url});
    const meta = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMG}" />
    <meta name="keywords" content="${escAttr(post.category)}" />
    <meta name="author" content="Alexandra Vásquez" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">${ld}</script>`;
    html = html.replace("</head>", `${meta}\n</head>`);
  }
  res.send(html);
});

// SPA fallback — known client routes get 200, unknown get 404
const spaRoutes = ["/", "/sobre-mi", "/noticias", "/servicios/abogado-derecho-familia-manizales", "/admin", "/admin/posts", "/admin/contacts"];
app.get("*", (req, res) => {
  const isKnown = spaRoutes.includes(req.path)
    || req.path.startsWith("/noticias/")
    || req.path.startsWith("/servicios/");
  res.status(isKnown ? 200 : 404).sendFile(htmlPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
