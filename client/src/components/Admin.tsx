import { useState, useEffect } from "react";
import { Trash2, Plus, LogOut, Eye, Send, MessageCircle, Pencil, X } from "lucide-react";

interface Post { id: number; title: string; slug: string; excerpt: string; content: string; category: string; tags: string; meta_title: string; meta_description: string; date: string; published: number; }
interface Contact { id: number; name: string; email: string; phone: string; message: string; created_at: string; }

const emptyForm = { title: "", excerpt: "", content: "", category: "Derecho de Familia", meta_title: "", meta_description: "" };

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"posts" | "contacts">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const headers = { "Content-Type": "application/json", Authorization: `Basic ${token}` };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user, password: pass }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
    } catch { setError("Error de conexión"); }
  };

  const logout = () => { localStorage.removeItem("admin_token"); setToken(""); };

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts", { headers });
      if (!res.ok) { logout(); return; }
      setPosts(await res.json());
    } catch {}
  };

  const loadContacts = async () => {
    try {
      const res = await fetch("/api/admin/contacts", { headers });
      if (res.ok) setContacts(await res.json());
    } catch {}
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/posts/${editingId}` : "/api/admin/posts";
    const method = editingId ? "PUT" : "POST";
    try {
      await fetch(url, { method, headers, body: JSON.stringify(form) });
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
      loadPosts();
    } catch {}
  };

  const editPost = (p: Post) => {
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, category: p.category, meta_title: p.meta_title, meta_description: p.meta_description });
    setEditingId(p.id);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const deletePost = async (id: number) => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE", headers });
    loadPosts();
  };

  useEffect(() => { if (token) { loadPosts(); loadContacts(); } }, [token]);

  if (!token) {
    return (
      <main className="min-h-screen bg-primary-950 flex items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-12 h-12 border border-gold-400/30 flex items-center justify-center mx-auto mb-4">
              <span className="font-heading text-gold-400 text-xl font-bold">A</span>
            </div>
            <h1 className="font-heading text-2xl text-white">Panel Administrativo</h1>
            <p className="text-white/30 text-sm mt-1">Alexandra Vásquez · Abogada</p>
          </div>
          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          <input type="text" placeholder="Usuario" value={user} onChange={(e) => setUser(e.target.value)} className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 text-[15px] focus:outline-none focus:border-gold-400/50 mb-4" />
          <input type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 text-[15px] focus:outline-none focus:border-gold-400/50 mb-8" />
          <button type="submit" className="w-full py-3 bg-gold-400 text-primary-950 text-[12px] uppercase tracking-[0.25em] font-semibold hover:bg-gold-300 transition-colors">Ingresar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary-950 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border border-gold-400/30 flex items-center justify-center">
            <span className="font-heading text-gold-400 text-sm font-bold">A</span>
          </div>
          <span className="font-heading text-white text-sm">Panel Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-white/40 hover:text-gold-400 transition-colors text-xs flex items-center gap-1"><Eye size={14} /> Ver sitio</a>
          <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors text-xs flex items-center gap-1"><LogOut size={14} /> Salir</button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab("posts")} className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${tab === "posts" ? "text-primary-950 border-b-2 border-gold-400 font-semibold" : "text-gray-400"}`}>
            Publicaciones ({posts.length})
          </button>
          <button onClick={() => setTab("contacts")} className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${tab === "contacts" ? "text-primary-950 border-b-2 border-gold-400 font-semibold" : "text-gray-400"}`}>
            Mensajes ({contacts.length})
          </button>
        </div>

        {tab === "posts" && (
          <>
            <button onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(!showForm); }} className="mb-6 px-5 py-2.5 bg-primary-950 text-gold-400 text-[12px] uppercase tracking-wider flex items-center gap-2 hover:bg-primary-900 transition-colors">
              <Plus size={16} /> Nueva Publicación
            </button>

            {showForm && (
              <form onSubmit={savePost} className="bg-white p-6 border border-gray-100 mb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-primary-950 uppercase tracking-wider">{editingId ? "Editar Publicación" : "Nueva Publicación"}</h3>
                  <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>
                <input type="text" placeholder="Título de la publicación" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-primary-500" />
                <input type="text" placeholder="Categoría (ej: Custodia, Divorcios)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-primary-500" />
                <textarea placeholder="Extracto (resumen corto)" required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-primary-500 resize-none" />
                <textarea placeholder="Contenido completo" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-primary-500 resize-none" />
                <details className="border border-gray-200 p-4">
                  <summary className="text-xs uppercase tracking-wider text-gray-400 cursor-pointer">SEO (opcional)</summary>
                  <div className="space-y-3 mt-3">
                    <input type="text" placeholder="Meta título (para Google)" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-primary-500" />
                    <textarea placeholder="Meta descripción (máx 160 caracteres)" rows={2} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-primary-500 resize-none" />
                  </div>
                </details>
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2.5 bg-gold-400 text-primary-950 text-[12px] uppercase tracking-wider font-semibold hover:bg-gold-300 transition-colors flex items-center gap-2">
                    <Send size={14} /> {editingId ? "Guardar Cambios" : "Publicar"}
                  </button>
                  <button type="button" onClick={cancelEdit} className="px-6 py-2.5 border border-gray-200 text-gray-500 text-[12px] uppercase tracking-wider hover:bg-gray-50 transition-colors">Cancelar</button>
                </div>
              </form>
            )}

            {posts.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay publicaciones aún.</p>
            ) : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="bg-white p-5 border border-gray-100 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-primary-500/50">{p.category}</span>
                      <h3 className="text-primary-950 font-medium mt-1">{p.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{p.excerpt}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-gray-300 text-xs">{p.date}</span>
                        <span className="text-gray-200 text-xs">/{p.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 mt-1">
                      <button onClick={() => editPost(p)} className="text-gray-300 hover:text-primary-600 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => deletePost(p.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "contacts" && (
          contacts.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay mensajes aún.</p>
          ) : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <div key={c.id} className="bg-white p-5 border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-primary-950 font-medium flex items-center gap-2"><MessageCircle size={14} className="text-gold-400" /> {c.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{c.email} {c.phone && `· ${c.phone}`}</p>
                    </div>
                    <span className="text-gray-300 text-xs shrink-0">{c.created_at}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3">{c.message}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
}
