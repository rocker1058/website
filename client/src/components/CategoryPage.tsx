import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useRoute, useLocation } from "wouter";

interface Post { id: number; title: string; slug: string; excerpt: string; date: string; category: string; category_slug: string; }

export default function CategoryPage() {
  const [, params] = useRoute("/noticias/:catSlug");
  const [, setLocation] = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.catSlug) {
      fetch(`/api/posts/categoria/${params.catSlug}`).then((r) => r.json()).then((data) => {
        setPosts(data);
        setLoading(false);
        if (data[0]) {
          const breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://alexandravasquez.com/" },
              { "@type": "ListItem", "position": 2, "name": data[0].category, "item": `https://alexandravasquez.com/noticias/${params.catSlug}` }
            ]
          };
          let el = document.getElementById("breadcrumb-schema");
          if (!el) { el = document.createElement("script"); el.id = "breadcrumb-schema"; (el as HTMLScriptElement).type = "application/ld+json"; document.head.appendChild(el); }
          el.textContent = JSON.stringify(breadcrumb);
        }
      }).catch(() => setLoading(false));
    }
  }, [params?.catSlug]);

  const catName = posts[0]?.category || params?.catSlug || "";

  return (
    <main className="pt-20">
      <section className="py-20 lg:py-28 bg-primary-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-800/15 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="flex items-center gap-2 text-white/30 text-xs mb-8" aria-label="Breadcrumb">
              <a href="/" onClick={(e) => { e.preventDefault(); setLocation("/"); }} className="hover:text-gold-400 transition-colors">Inicio</a>
              <span>/</span>
              <span className="text-white/50">{catName}</span>
            </nav>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-gold-400/50" />
              <span className="text-gold-400/80 text-[11px] uppercase tracking-[0.35em]">Categoría</span>
              <span className="w-12 h-px bg-gold-400/50" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-white font-medium">{catName}</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          {loading ? (
            <p className="text-center text-gray-400">Cargando...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-400">No hay publicaciones en esta categoría.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((p, i) => (
                <motion.article key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer" onClick={() => setLocation(`/noticias/${p.category_slug}/${p.slug}`)}>
                  <div className="h-px w-full bg-gradient-to-r from-primary-700 to-gold-400 mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="font-heading text-xl text-primary-950 mb-3 group-hover:text-primary-700 transition-colors">{p.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{p.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">{p.date}</span>
                    <span className="text-primary-700 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Leer <ArrowRight size={12} /></span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
