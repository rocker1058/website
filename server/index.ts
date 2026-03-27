import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

function toSlug(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Public: get published posts
app.get("/api/posts", (_req, res) => {
  res.json(db.prepare("SELECT id, title, slug, excerpt, category, category_slug, date FROM posts WHERE published = 1 ORDER BY id DESC").all());
});

// Public: get post by category_slug + slug
app.get("/api/posts/:catSlug/:slug", (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE category_slug = ? AND slug = ? AND published = 1").get(req.params.catSlug, req.params.slug) as any;
  if (!post) return res.status(404).json({ error: "No encontrado" });
  res.json(post);
});

// Public: get posts by category
app.get("/api/posts/categoria/:catSlug", (req, res) => {
  const posts = db.prepare("SELECT id, title, slug, excerpt, category, category_slug, date FROM posts WHERE category_slug = ? AND published = 1 ORDER BY id DESC").all(req.params.catSlug);
  res.json(posts);
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
  res.json({ id: result.lastInsertRowid, slug, category_slug: catSlug });
});

app.put("/api/admin/posts/:id", auth, (req, res) => {
  const { title, excerpt, content, category, meta_title, meta_description } = req.body;
  if (!title || !excerpt) return res.status(400).json({ error: "Título y extracto requeridos" });
  const slug = toSlug(title);
  const catSlug = toSlug(category || "General");
  db.prepare("UPDATE posts SET title=?, slug=?, excerpt=?, content=?, category=?, category_slug=?, meta_title=?, meta_description=? WHERE id=?").run(title, slug, excerpt, content || "", category || "General", catSlug, meta_title || title, meta_description || excerpt, req.params.id);
  res.json({ ok: true, slug, category_slug: catSlug });
});

app.delete("/api/admin/posts/:id", auth, (req, res) => {
  db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
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
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  xml += `  <url><loc>${base}/sobre-mi</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  xml += `  <url><loc>${base}/noticias</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  for (const c of cats) {
    xml += `  <url><loc>${base}/noticias/${c.category_slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
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

app.use(express.static(path.join(__dirname, "public")));

const htmlPath = path.join(__dirname, "public", "index.html");
const getHtml = () => fs.readFileSync(htmlPath, "utf-8");

// SSR: Home
app.get("/", (_req, res) => {
  let html = getHtml();
  const meta = `
    <meta property="og:title" content="Alexandra Vásquez | Abogada Especialista en Derecho de Familia" />
    <meta property="og:description" content="Abogada especialista en derecho de familia en Manizales, Colombia. Divorcios, custodia, alimentos, sucesiones." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://alexandravasquez.com/" />
    <meta name="keywords" content="abogada familia manizales, derecho de familia colombia, divorcio manizales, custodia hijos colombia" />
    <meta name="author" content="Alexandra Vásquez" />
    <meta name="geo.region" content="CO-CAL" />
    <meta name="geo.placename" content="Manizales" />
    <link rel="canonical" href="https://alexandravasquez.com/" />
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Attorney","name":"Alexandra Vásquez","description":"Abogada especialista en derecho de familia en Manizales, Colombia","url":"https://alexandravasquez.com","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"areaServed":{"@type":"Country","name":"Colombia"},"knowsAbout":["Derecho de Familia","Divorcios","Custodia","Alimentos","Sucesiones"]}
    </script>`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Sobre Mi
app.get("/sobre-mi", (_req, res) => {
  let html = getHtml();
  html = html.replace(/<title>.*?<\/title>/, `<title>Sobre Mí | Alexandra Vásquez - Abogada en Manizales</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="Conozca a Alexandra Vásquez, abogada con más de 10 años de experiencia en derecho de familia en Manizales, Colombia." />`);
  const meta = `<link rel="canonical" href="https://alexandravasquez.com/sobre-mi" />`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Category page
app.get("/noticias/:catSlug", (req, res) => {
  const cat = db.prepare("SELECT DISTINCT category, category_slug FROM posts WHERE category_slug = ? AND published = 1").get(req.params.catSlug) as any;
  let html = getHtml();
  const catName = cat?.category || req.params.catSlug;
  html = html.replace(/<title>.*?<\/title>/, `<title>${catName} | Blog Jurídico - Alexandra Vásquez</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="Artículos sobre ${catName.toLowerCase()} por Alexandra Vásquez, abogada especialista en derecho de familia en Colombia." />`);
  const meta = `<link rel="canonical" href="https://alexandravasquez.com/noticias/${req.params.catSlug}" />`;
  html = html.replace("</head>", `${meta}\n</head>`);
  res.send(html);
});

// SSR: Post page
app.get("/noticias/:catSlug/:slug", (req, res) => {
  let html = getHtml();
  const post = db.prepare("SELECT * FROM posts WHERE category_slug = ? AND slug = ? AND published = 1").get(req.params.catSlug, req.params.slug) as any;
  if (post) {
    const title = post.meta_title || post.title;
    const desc = post.meta_description || post.excerpt;
    const url = `https://alexandravasquez.com/noticias/${post.category_slug}/${post.slug}`;
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="${desc}" />`);
    const meta = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta name="keywords" content="${post.category}" />
    <meta name="author" content="Alexandra Vásquez" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Article","headline":"${post.title}","description":"${desc}","datePublished":"${post.date}","author":{"@type":"Person","name":"Alexandra Vásquez","jobTitle":"Abogada"},"publisher":{"@type":"Organization","name":"Alexandra Vásquez - Abogada"},"mainEntityOfPage":"${url}"}
    </script>`;
    html = html.replace("</head>", `${meta}\n</head>`);
  }
  res.send(html);
});

// SPA fallback
app.get("*", (_req, res) => res.sendFile(htmlPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
