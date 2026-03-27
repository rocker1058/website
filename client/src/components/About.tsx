import { motion } from "framer-motion";
import { Award, BookOpen, Users, Clock, Scale, GraduationCap } from "lucide-react";

const stats = [
  { icon: Clock, value: "10+", label: "Años de experiencia" },
  { icon: Users, value: "500+", label: "Familias asesoradas" },
  { icon: Award, value: "98%", label: "Casos exitosos" },
  { icon: BookOpen, value: "15+", label: "Especializaciones" },
];

const values = [
  { icon: Scale, title: "Compromiso", desc: "Cada caso recibe mi dedicación completa. Su tranquilidad es mi prioridad." },
  { icon: GraduationCap, title: "Experiencia", desc: "Formación continua y actualización permanente en legislación familiar colombiana." },
  { icon: Users, title: "Cercanía", desc: "Atención personalizada y comunicación constante durante todo el proceso." },
];

export default function About() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-primary-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-800/15 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="w-12 h-px bg-gold-400/50" />
              <span className="text-gold-400/80 text-[11px] uppercase tracking-[0.35em] font-light">Conozca a su abogada</span>
              <span className="w-12 h-px bg-gold-400/50" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-white font-medium">Alexandra <em className="text-gold-300">Vásquez</em></h1>
            <p className="text-white/40 mt-4 text-lg">Abogada Especialista en Derecho de Familia</p>
          </motion.div>
        </div>
      </section>

      {/* Bio + Photo */}
      <section className="py-24 lg:py-32 bg-gray-50/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <div className="absolute inset-0 border border-gold-400/20 translate-x-4 translate-y-4" />
                <div className="relative h-full bg-primary-900 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 border border-gold-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="font-heading text-gold-400 text-4xl italic">AV</span>
                    </div>
                    <p className="text-white/20 text-xs uppercase tracking-[0.3em]">Foto profesional</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary-600/60 text-[11px] uppercase tracking-[0.35em]">Mi Historia</span>
              <h2 className="font-heading text-3xl md:text-4xl text-primary-950 mt-3 mb-6 font-medium">Dedicación al <em className="text-primary-700">Derecho de Familia</em></h2>
              <div className="w-12 h-px bg-gold-400 mb-8" />
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
                Abogada de la Universidad de Caldas con especialización en Derecho de Familia. Con más de una década de trayectoria, he dedicado mi carrera a proteger los derechos de las familias colombianas con un enfoque humano, estratégico y orientado a resultados.
              </p>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
                Cada caso es único y merece una atención personalizada. Mi compromiso es brindarle la tranquilidad de saber que su situación está en manos de una profesional que entiende la importancia de lo que está en juego: su familia.
              </p>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Radicada en Manizales, Caldas, brindo asesoría legal a familias en toda Colombia, combinando el conocimiento jurídico con la sensibilidad que cada situación familiar requiere.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-950">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <s.icon className="text-gold-400/50 mx-auto mb-3" size={22} strokeWidth={1.5} />
                <span className="font-heading text-3xl text-white font-semibold block">{s.value}</span>
                <p className="text-white/30 text-xs uppercase tracking-wider mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary-600/60 text-[11px] uppercase tracking-[0.35em]">Filosofía</span>
            <h2 className="font-heading text-3xl md:text-4xl text-primary-950 mt-3 font-medium">¿Por qué <em className="text-primary-700">elegirme</em>?</h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-6" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <v.icon className="text-gold-400/60 mx-auto mb-4" size={28} strokeWidth={1.5} />
                <h3 className="font-heading text-xl text-primary-950 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
