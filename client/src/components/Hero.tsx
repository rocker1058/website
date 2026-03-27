import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100dvh] flex items-center justify-center bg-primary-950 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900/50 to-primary-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-[120px]" />
      </div>
      {/* Decorative lines */}
      <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-transparent to-gold-400/20" />
      <div className="absolute bottom-0 left-1/2 w-px h-32 bg-gradient-to-t from-transparent to-gold-400/20" />

      <div className="container mx-auto px-6 lg:px-12 py-28 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-12 h-px bg-gold-400/50" />
            <span className="text-gold-400/80 text-[11px] uppercase tracking-[0.35em] font-light">Derecho de Familia</span>
            <span className="w-12 h-px bg-gold-400/50" />
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="font-heading text-5xl md:text-6xl lg:text-7xl text-white font-medium leading-[1.1] mb-8">
          Alexandra<br />
          <span className="italic text-gold-300">Vásquez</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="text-white/40 text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed">
          Protección legal para lo que más importa. Más de una década defendiendo los derechos de las familias colombianas.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contacto" onClick={(e) => { e.preventDefault(); document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }); }} className="px-10 py-4 bg-gold-400 text-primary-950 text-[12px] uppercase tracking-[0.25em] font-semibold hover:bg-gold-300 transition-colors duration-300">
            Agendar Consulta
          </a>
          <a href="#areas" onClick={(e) => { e.preventDefault(); document.querySelector("#areas")?.scrollIntoView({ behavior: "smooth" }); }} className="px-10 py-4 border border-white/15 text-white/60 text-[12px] uppercase tracking-[0.25em] hover:border-gold-400/50 hover:text-gold-400 transition-all duration-300">
            Áreas de Práctica
          </a>
        </motion.div>
      </div>
    </section>
  );
}
