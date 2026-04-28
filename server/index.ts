import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import compression from "compression";
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
  xml += `  <url><loc>${base}/noticias</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  for (const c of cats) {
    xml += `  <url><loc>${base}/noticias/${c.category_slug}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
  }
  for (const p of posts) {
    xml += `  <url><loc>${base}/noticias/${p.category_slug}/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
  }
  xml += `</urlset>`;
  res.header("Content-Type", "application/xml").send(xml);
});

app.get("/robots.txt", (_req, res) => {
  res.header("Content-Type", "text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://alexandravasquez.com/sitemap.xml`);
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
  html = injectH1(html, "Abogado de Familia en Manizales");
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

// SSR: Sobre Mi
app.get("/sobre-mi", (_req, res) => {
  let html = getHtml();
  html = injectH1(html, "Alexandra Vásquez - Abogada en Manizales");
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
  html = injectH1(html, "Abogado de Familia en Manizales");
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
    {"@context":"https://schema.org","@type":"LegalService","name":"Alexandra Vásquez - Abogada de Familia en Manizales","description":"${desc}","url":"${url}","telephone":"","areaServed":{"@type":"City","name":"Manizales"},"serviceType":"Derecho de Familia","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"hasOfferCatalog":{"@type":"OfferCatalog","name":"Servicios Legales","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"Divorcios en Manizales"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Custodia de hijos"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Cuota alimentaria"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Separación de bienes"}}]}}
    </script>`;
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

// SSR: Post page
app.get("/noticias/:catSlug/:slug", (req, res) => {
  let html = getHtml();
  const post = db.prepare("SELECT * FROM posts WHERE category_slug = ? AND slug = ? AND published = 1").get(req.params.catSlug, req.params.slug) as any;
  if (post) {
    html = injectH1(html, post.title);
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
    || req.path.startsWith("/noticias/");
  res.status(isKnown ? 200 : 404).sendFile(htmlPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
