// server/index.ts
import express from "express";
import path2 from "path";
import fs from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";

// server/db.ts
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var db = new Database(path.join(__dirname, "..", "data.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'General',
    category_slug TEXT NOT NULL DEFAULT 'general',
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT (date('now')),
    published INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  );
  INSERT OR IGNORE INTO admin (id, username, password) VALUES (1, 'admin', 'admin123');

  INSERT OR IGNORE INTO posts (id, title, slug, excerpt, content, category, category_slug, meta_title, meta_description, date) VALUES
    (1, '\xBFC\xF3mo funciona la custodia compartida en Colombia?', 'como-funciona-la-custodia-compartida-en-colombia', 'Conozca los requisitos legales, derechos y obligaciones que establece la ley colombiana para la custodia compartida de los hijos.', 'La custodia compartida en Colombia permite que ambos padres participen activamente en la crianza de sus hijos tras una separaci\xF3n. La ley busca siempre el inter\xE9s superior del menor, evaluando las condiciones de cada progenitor para garantizar su bienestar integral.', 'Custodia', 'custodia', 'Custodia Compartida en Colombia | Alexandra V\xE1squez Abogada', 'Conozca c\xF3mo funciona la custodia compartida en Colombia. Requisitos, derechos y obligaciones. Asesor\xEDa legal especializada.', '2026-03-25'),
    (2, 'Pasos para tramitar un divorcio en Colombia', 'pasos-para-tramitar-un-divorcio-en-colombia', 'Gu\xEDa completa sobre el proceso de divorcio en Colombia: requisitos, documentos necesarios y tiempos estimados.', 'El divorcio en Colombia puede tramitarse de mutuo acuerdo ante notar\xEDa o de forma contenciosa ante un juez de familia. En ambos casos es fundamental contar con asesor\xEDa legal para proteger sus derechos patrimoniales y familiares.', 'Divorcios', 'divorcios', 'C\xF3mo Tramitar un Divorcio en Colombia | Alexandra V\xE1squez Abogada', 'Gu\xEDa completa para tramitar un divorcio en Colombia. Requisitos, documentos y tiempos. Asesor\xEDa legal en Manizales.', '2026-03-20'),
    (3, 'Derecho de alimentos: lo que todo padre debe saber', 'derecho-de-alimentos-lo-que-todo-padre-debe-saber', 'Entienda c\xF3mo se fija la cuota alimentaria, qui\xE9n tiene derecho a recibirla y qu\xE9 hacer en caso de incumplimiento.', 'La cuota alimentaria es un derecho fundamental de los menores en Colombia. Se fija teniendo en cuenta las necesidades del menor y la capacidad econ\xF3mica del obligado. El incumplimiento puede acarrear sanciones civiles y penales.', 'Alimentos', 'alimentos', 'Derecho de Alimentos en Colombia | Alexandra V\xE1squez Abogada', 'Todo sobre la cuota alimentaria en Colombia. Fijaci\xF3n, aumento y qu\xE9 hacer ante incumplimiento. Asesor\xEDa legal.', '2026-03-15');
`);
var db_default = db;

// server/index.ts
var __dirname2 = path2.dirname(fileURLToPath2(import.meta.url));
var app = express();
app.use(express.json());
function toSlug(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
app.get("/api/posts", (_req, res) => {
  res.json(db_default.prepare("SELECT id, title, slug, excerpt, category, category_slug, date FROM posts WHERE published = 1 ORDER BY id DESC").all());
});
app.get("/api/posts/:catSlug/:slug", (req, res) => {
  const post = db_default.prepare("SELECT * FROM posts WHERE category_slug = ? AND slug = ? AND published = 1").get(req.params.catSlug, req.params.slug);
  if (!post) return res.status(404).json({ error: "No encontrado" });
  res.json(post);
});
app.get("/api/posts/categoria/:catSlug", (req, res) => {
  const posts = db_default.prepare("SELECT id, title, slug, excerpt, category, category_slug, date FROM posts WHERE category_slug = ? AND published = 1 ORDER BY id DESC").all(req.params.catSlug);
  res.json(posts);
});
app.get("/api/categories", (_req, res) => {
  const cats = db_default.prepare("SELECT DISTINCT category, category_slug FROM posts WHERE published = 1 ORDER BY category").all();
  res.json(cats);
});
app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "Campos requeridos" });
  db_default.prepare("INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)").run(name, email, phone || "", message);
  res.json({ ok: true });
});
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const user = db_default.prepare("SELECT * FROM admin WHERE username = ? AND password = ?").get(username, password);
  if (!user) return res.status(401).json({ error: "Credenciales inv\xE1lidas" });
  res.json({ ok: true, token: Buffer.from(`${username}:${password}`).toString("base64") });
});
var auth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Basic ", "");
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    const [username, password] = Buffer.from(token, "base64").toString().split(":");
    const user = db_default.prepare("SELECT * FROM admin WHERE username = ? AND password = ?").get(username, password);
    if (!user) return res.status(401).json({ error: "No autorizado" });
    next();
  } catch {
    res.status(401).json({ error: "No autorizado" });
  }
};
app.get("/api/admin/posts", auth, (_req, res) => {
  res.json(db_default.prepare("SELECT * FROM posts ORDER BY id DESC").all());
});
app.post("/api/admin/posts", auth, (req, res) => {
  const { title, excerpt, content, category, meta_title, meta_description } = req.body;
  if (!title || !excerpt) return res.status(400).json({ error: "T\xEDtulo y extracto requeridos" });
  const slug = toSlug(title);
  const catSlug = toSlug(category || "General");
  const result = db_default.prepare("INSERT INTO posts (title, slug, excerpt, content, category, category_slug, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(title, slug, excerpt, content || "", category || "General", catSlug, meta_title || title, meta_description || excerpt);
  res.json({ id: result.lastInsertRowid, slug, category_slug: catSlug });
});
app.put("/api/admin/posts/:id", auth, (req, res) => {
  const { title, excerpt, content, category, meta_title, meta_description } = req.body;
  if (!title || !excerpt) return res.status(400).json({ error: "T\xEDtulo y extracto requeridos" });
  const slug = toSlug(title);
  const catSlug = toSlug(category || "General");
  db_default.prepare("UPDATE posts SET title=?, slug=?, excerpt=?, content=?, category=?, category_slug=?, meta_title=?, meta_description=? WHERE id=?").run(title, slug, excerpt, content || "", category || "General", catSlug, meta_title || title, meta_description || excerpt, req.params.id);
  res.json({ ok: true, slug, category_slug: catSlug });
});
app.delete("/api/admin/posts/:id", auth, (req, res) => {
  db_default.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});
app.get("/api/admin/contacts", auth, (_req, res) => {
  res.json(db_default.prepare("SELECT * FROM contacts ORDER BY id DESC").all());
});
app.get("/sitemap.xml", (_req, res) => {
  const posts = db_default.prepare("SELECT slug, category_slug, date FROM posts WHERE published = 1 ORDER BY id DESC").all();
  const cats = db_default.prepare("SELECT DISTINCT category_slug FROM posts WHERE published = 1").all();
  const base = "https://alexandravasquez.com";
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  xml += `  <url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
`;
  xml += `  <url><loc>${base}/sobre-mi</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
`;
  xml += `  <url><loc>${base}/noticias</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
`;
  for (const c of cats) {
    xml += `  <url><loc>${base}/noticias/${c.category_slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
`;
  }
  for (const p of posts) {
    xml += `  <url><loc>${base}/noticias/${p.category_slug}/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
`;
  }
  xml += `</urlset>`;
  res.header("Content-Type", "application/xml").send(xml);
});
app.get("/robots.txt", (_req, res) => {
  res.header("Content-Type", "text/plain").send(`User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://alexandravasquez.com/sitemap.xml`);
});
app.use(express.static(path2.join(__dirname2, "public")));
var htmlPath = path2.join(__dirname2, "public", "index.html");
var getHtml = () => fs.readFileSync(htmlPath, "utf-8");
app.get("/", (_req, res) => {
  let html = getHtml();
  const meta = `
    <meta property="og:title" content="Alexandra V\xE1squez | Abogada Especialista en Derecho de Familia" />
    <meta property="og:description" content="Abogada especialista en derecho de familia en Manizales, Colombia. Divorcios, custodia, alimentos, sucesiones." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://alexandravasquez.com/" />
    <meta name="keywords" content="abogada familia manizales, derecho de familia colombia, divorcio manizales, custodia hijos colombia" />
    <meta name="author" content="Alexandra V\xE1squez" />
    <meta name="geo.region" content="CO-CAL" />
    <meta name="geo.placename" content="Manizales" />
    <link rel="canonical" href="https://alexandravasquez.com/" />
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Attorney","name":"Alexandra V\xE1squez","description":"Abogada especialista en derecho de familia en Manizales, Colombia","url":"https://alexandravasquez.com","address":{"@type":"PostalAddress","addressLocality":"Manizales","addressRegion":"Caldas","addressCountry":"CO"},"areaServed":{"@type":"Country","name":"Colombia"},"knowsAbout":["Derecho de Familia","Divorcios","Custodia","Alimentos","Sucesiones"]}
    </script>`;
  html = html.replace("</head>", `${meta}
</head>`);
  res.send(html);
});
app.get("/sobre-mi", (_req, res) => {
  let html = getHtml();
  html = html.replace(/<title>.*?<\/title>/, `<title>Sobre M\xED | Alexandra V\xE1squez - Abogada en Manizales</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="Conozca a Alexandra V\xE1squez, abogada con m\xE1s de 10 a\xF1os de experiencia en derecho de familia en Manizales, Colombia." />`);
  const meta = `<link rel="canonical" href="https://alexandravasquez.com/sobre-mi" />`;
  html = html.replace("</head>", `${meta}
</head>`);
  res.send(html);
});
app.get("/noticias/:catSlug", (req, res) => {
  const cat = db_default.prepare("SELECT DISTINCT category, category_slug FROM posts WHERE category_slug = ? AND published = 1").get(req.params.catSlug);
  let html = getHtml();
  const catName = cat?.category || req.params.catSlug;
  html = html.replace(/<title>.*?<\/title>/, `<title>${catName} | Blog Jur\xEDdico - Alexandra V\xE1squez</title>`);
  html = html.replace(/<meta name="description".*?\/>/, `<meta name="description" content="Art\xEDculos sobre ${catName.toLowerCase()} por Alexandra V\xE1squez, abogada especialista en derecho de familia en Colombia." />`);
  const meta = `<link rel="canonical" href="https://alexandravasquez.com/noticias/${req.params.catSlug}" />`;
  html = html.replace("</head>", `${meta}
</head>`);
  res.send(html);
});
app.get("/noticias/:catSlug/:slug", (req, res) => {
  let html = getHtml();
  const post = db_default.prepare("SELECT * FROM posts WHERE category_slug = ? AND slug = ? AND published = 1").get(req.params.catSlug, req.params.slug);
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
    <meta name="author" content="Alexandra V\xE1squez" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Article","headline":"${post.title}","description":"${desc}","datePublished":"${post.date}","author":{"@type":"Person","name":"Alexandra V\xE1squez","jobTitle":"Abogada"},"publisher":{"@type":"Organization","name":"Alexandra V\xE1squez - Abogada"},"mainEntityOfPage":"${url}"}
    </script>`;
    html = html.replace("</head>", `${meta}
</head>`);
  }
  res.send(html);
});
app.get("*", (_req, res) => res.sendFile(htmlPath));
var PORT = process.env.PORT || 3e3;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
