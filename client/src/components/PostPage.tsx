import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useRoute, useLocation } from "wouter";
import { marked } from "marked";

interface Post { id: number; title: string; slug: string; excerpt: string; content: string; category: string; category_slug: string; date: string; meta_title: string; }

export default function PostPage() {
  const [, params] = useRoute("/noticias/:catSlug/:slug");
  const [, setLocation] = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.catSlug && params?.slug) {
      fetch(`/api/posts/${params.catSlug}/${params.slug}`).then((r) => r.ok ? r.json() : null).then((data) => {
        setPost(data);
        setLoading(false);
        if (data) {
          document.title = data.meta_title || data.title;
          // Breadcrumb schema
          const breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://alexandravasquez.com/" },
              { "@type": "ListItem", "position": 2, "name": "Noticias", "item": "https://alexandravasquez.com/noticias/" },
              { "@type": "ListItem", "position": 3, "name": data.category, "item": `https://alexandravasquez.com/noticias/${data.category_slug}` },
              { "@type": "ListItem", "position": 4, "name": data.title, "item": `https://alexandravasquez.com/noticias/${data.category_slug}/${data.slug}` }
            ]
          };
          let el = document.getElementById("breadcrumb-schema");
          if (!el) { el = document.createElement("script"); el.id = "breadcrumb-schema"; (el as HTMLScriptElement).type = "application/ld+json"; document.head.appendChild(el); }
          el.textContent = JSON.stringify(breadcrumb);
          // Load related posts
          fetch(`/api/posts/categoria/${data.category_slug}`).then(r => r.json()).then(posts => setRelated(posts.filter((p: Post) => p.slug !== data.slug).slice(0, 3)));
        }
      }).catch(() => setLoading(false));
    }
  }, [params?.catSlug, params?.slug]);

  if (loading) return <main className="min-h-screen bg-white pt-32 text-center text-gray-400">Cargando...</main>;
  if (!post) return (
    <main className="min-h-screen bg-white pt-32 text-center">
      <p className="text-gray-400 mb-4">Publicación no encontrada</p>
      <a href="/" onClick={(e) => { e.preventDefault(); setLocation("/"); }} className="text-primary-700 text-sm underline">Volver al inicio</a>
    </main>
  );

  return (
    <main className="pt-20">
      <section className="py-20 lg:py-28 bg-primary-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-800/15 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Breadcrumb visual */}
            <nav className="flex items-center gap-2 text-white/30 text-xs mb-8" aria-label="Breadcrumb">
              <a href="/" onClick={(e) => { e.preventDefault(); setLocation("/"); }} className="hover:text-gold-400 transition-colors">Inicio</a>
              <span>/</span>
              <a href={`/noticias/${post.category_slug}`} onClick={(e) => { e.preventDefault(); setLocation(`/noticias/${post.category_slug}`); }} className="hover:text-gold-400 transition-colors">{post.category}</a>
              <span>/</span>
              <span className="text-white/50 truncate max-w-[200px]">{post.title}</span>
            </nav>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white font-medium leading-tight">{post.title}</h1>
            <div className="flex items-center gap-2 mt-6 text-white/30 text-sm">
              <Calendar size={14} /><span>{post.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <p className="text-primary-800 text-lg font-medium leading-relaxed mb-8 border-l-2 border-gold-400 pl-6">{post.excerpt}</p>
          <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: marked(post.content) as string }} />
          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm mb-4">¿Necesita asesoría sobre este tema?</p>
            <a href="/#contacto" onClick={(e) => { e.preventDefault(); setLocation("/"); setTimeout(() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }), 400); }} className="inline-block px-8 py-3 bg-primary-950 text-gold-400 text-[12px] uppercase tracking-[0.2em] hover:bg-primary-900 transition-colors">
              Contáctenos
            </a>
          </div>

          {/* Posts relacionados */}
          {related.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-100">
              <h2 className="font-heading text-2xl text-primary-950 mb-8">Artículos relacionados</h2>
              <div className="grid gap-6">
                {related.map(p => (
                  <a key={p.id} href={`/noticias/${p.category_slug}/${p.slug}`} onClick={(e) => { e.preventDefault(); setLocation(`/noticias/${p.category_slug}/${p.slug}`); }} className="group flex gap-4 items-start hover:text-primary-700 transition-colors">
                    <span className="w-1 h-full min-h-[40px] bg-gold-400/30 group-hover:bg-gold-400 transition-colors flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-primary-950 group-hover:text-primary-700 transition-colors">{p.title}</p>
                      <p className="text-gray-400 text-sm mt-1">{p.excerpt}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
}
