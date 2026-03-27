import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "..", "data.db"));

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
    (1, '¿Cómo funciona la custodia compartida en Colombia?', 'como-funciona-la-custodia-compartida-en-colombia', 'Conozca los requisitos legales, derechos y obligaciones que establece la ley colombiana para la custodia compartida de los hijos.', 'La custodia compartida en Colombia permite que ambos padres participen activamente en la crianza de sus hijos tras una separación. La ley busca siempre el interés superior del menor, evaluando las condiciones de cada progenitor para garantizar su bienestar integral.', 'Custodia', 'custodia', 'Custodia Compartida en Colombia | Alexandra Vásquez Abogada', 'Conozca cómo funciona la custodia compartida en Colombia. Requisitos, derechos y obligaciones. Asesoría legal especializada.', '2026-03-25'),
    (2, 'Pasos para tramitar un divorcio en Colombia', 'pasos-para-tramitar-un-divorcio-en-colombia', 'Guía completa sobre el proceso de divorcio en Colombia: requisitos, documentos necesarios y tiempos estimados.', 'El divorcio en Colombia puede tramitarse de mutuo acuerdo ante notaría o de forma contenciosa ante un juez de familia. En ambos casos es fundamental contar con asesoría legal para proteger sus derechos patrimoniales y familiares.', 'Divorcios', 'divorcios', 'Cómo Tramitar un Divorcio en Colombia | Alexandra Vásquez Abogada', 'Guía completa para tramitar un divorcio en Colombia. Requisitos, documentos y tiempos. Asesoría legal en Manizales.', '2026-03-20'),
    (3, 'Derecho de alimentos: lo que todo padre debe saber', 'derecho-de-alimentos-lo-que-todo-padre-debe-saber', 'Entienda cómo se fija la cuota alimentaria, quién tiene derecho a recibirla y qué hacer en caso de incumplimiento.', 'La cuota alimentaria es un derecho fundamental de los menores en Colombia. Se fija teniendo en cuenta las necesidades del menor y la capacidad económica del obligado. El incumplimiento puede acarrear sanciones civiles y penales.', 'Alimentos', 'alimentos', 'Derecho de Alimentos en Colombia | Alexandra Vásquez Abogada', 'Todo sobre la cuota alimentaria en Colombia. Fijación, aumento y qué hacer ante incumplimiento. Asesoría legal.', '2026-03-15');
`);

export default db;
