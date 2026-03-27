import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface Post { id: number; title: string; slug: string; excerpt: string; date: string; category: string; category_slug: string; }

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setLocation] = useLocation();
  useEffect(() => { fetch("/api/posts").then((r) => r.json()).then(setPosts).catch(() => {}); }, []);

  return (
    <section id="blog" className="py-24 lg:py-32 bg-gray-50/50">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="text-primary-600/60 text-[11px] uppercase tracking-[0.35em]">Publicaciones</span>
          <h2 className="font-heading text-4xl md:text-5xl text-primary-950 mt-3 font-medium">Blog <em className="text-primary-700">Jurídico</em></h2>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-6" />
        </motion.div>
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm tracking-wide">Próximamente publicaremos artículos de interés jurídico.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((p, i) => (
              <motion.article key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer" onClick={() => setLocation(`/noticias/${p.category_slug}/${p.slug}`)}>
                <div className="h-px w-full bg-gradient-to-r from-primary-700 to-gold-400 mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                <a href={`/noticias/${p.category_slug}`} onClick={(e) => { e.stopPropagation(); e.preventDefault(); setLocation(`/noticias/${p.category_slug}`); }} className="text-[10px] uppercase tracking-[0.3em] text-primary-500/50 hover:text-primary-700">{p.category}</a>
                <h3 className="font-heading text-xl text-primary-950 mt-2 mb-3 group-hover:text-primary-700 transition-colors">{p.title}</h3>
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
  );
}
