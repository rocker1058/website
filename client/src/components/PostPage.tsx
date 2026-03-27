import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { useRoute, useLocation } from "wouter";

interface Post { id: number; title: string; slug: string; excerpt: string; content: string; category: string; category_slug: string; date: string; meta_title: string; }

export default function PostPage() {
  const [, params] = useRoute("/noticias/:catSlug/:slug");
  const [, setLocation] = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.catSlug && params?.slug) {
      fetch(`/api/posts/${params.catSlug}/${params.slug}`).then((r) => r.ok ? r.json() : null).then((data) => {
        setPost(data);
        setLoading(false);
        if (data) document.title = data.meta_title || data.title;
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
            <a href="/" onClick={(e) => { e.preventDefault(); setLocation("/"); }} className="inline-flex items-center gap-2 text-white/30 text-xs uppercase tracking-[0.2em] hover:text-gold-400 transition-colors mb-8">
              <ArrowLeft size={14} /> Volver al inicio
            </a>
            <div className="flex items-center gap-2 mb-4">
              <a href={`/noticias/${post.category_slug}`} onClick={(e) => { e.preventDefault(); setLocation(`/noticias/${post.category_slug}`); }} className="text-gold-400/60 text-[11px] uppercase tracking-[0.35em] hover:text-gold-400 transition-colors">
                {post.category}
              </a>
            </div>
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
          <div className="text-gray-600 text-[16px] leading-[1.9] whitespace-pre-line">{post.content}</div>
          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm mb-4">¿Necesita asesoría sobre este tema?</p>
            <a href="/#contacto" onClick={(e) => { e.preventDefault(); setLocation("/"); setTimeout(() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }), 400); }} className="inline-block px-8 py-3 bg-primary-950 text-gold-400 text-[12px] uppercase tracking-[0.2em] hover:bg-primary-900 transition-colors">
              Contáctenos
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
