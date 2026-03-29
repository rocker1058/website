import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface Post { id: number; title: string; slug: string; excerpt: string; date: string; category: string; category_slug: string; }

export default function NoticiasPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then(setPosts).catch(() => {});
  }, []);

  return (
    <main className="pt-20">
      <section className="py-20 lg:py-28 bg-primary-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-800/15 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-gold-400/50" />
              <span className="text-gold-400/80 text-[11px] uppercase tracking-[0.35em]">Blog Jurídico</span>
              <span className="w-12 h-px bg-gold-400/50" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-white font-medium">
              Noticias de <em className="text-gold-300">Derecho de Familia</em>
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          {posts.length === 0 ? (
            <p className="text-center text-gray-400 text-sm">Próximamente publicaremos artículos de interés jurídico.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((p, i) => (
                <motion.article key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer" onClick={() => setLocation(`/noticias/${p.category_slug}/${p.slug}`)}>
                  <div className="h-px w-full bg-gradient-to-r from-primary-700 to-gold-400 mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                  <a href={`/noticias/${p.category_slug}`} onClick={(e) => { e.stopPropagation(); e.preventDefault(); setLocation(`/noticias/${p.category_slug}`); }} className="text-[10px] uppercase tracking-[0.3em] text-primary-500/50 hover:text-primary-700">{p.category}</a>
                  <h2 className="font-heading text-xl text-primary-950 mt-2 mb-3 group-hover:text-primary-700 transition-colors">{p.title}</h2>
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
