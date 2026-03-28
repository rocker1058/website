import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";

const faqs = [
  { q: "¿Cuánto cuesta un divorcio en Manizales?", a: "El costo varía según el tipo de proceso. Un divorcio notarial de mutuo acuerdo puede costar entre $1.100.000 y $2.600.000 pesos. Un divorcio judicial puede costar entre $3.500.000 y $10.000.000 pesos dependiendo de la complejidad." },
  { q: "¿Cuánto tiempo tarda un divorcio en Colombia?", a: "El divorcio notarial tarda entre 1 y 4 semanas si hay acuerdo. El divorcio judicial puede tardar entre 6 meses y 2 años dependiendo del juzgado y la complejidad del caso." },
  { q: "¿Cómo se calcula la cuota alimentaria?", a: "La cuota alimentaria se calcula según los ingresos del obligado y las necesidades del menor. Como referencia, los jueces suelen fijar entre el 20% y el 30% del salario para un hijo." },
  { q: "¿Qué es la custodia compartida en Colombia?", a: "La custodia compartida permite que ambos padres compartan la responsabilidad del cuidado de los hijos. En Colombia es posible acordarla de mutuo acuerdo o solicitarla ante un juez de familia." },
  { q: "¿Necesito un abogado para divorciarme en Colombia?", a: "Para el divorcio notarial no es obligatorio, pero sí muy recomendable para proteger sus intereses. Para el divorcio judicial es indispensable contar con representación legal." },
  { q: "¿Qué pasa con los bienes cuando me divorcio?", a: "Al divorciarse se liquida la sociedad conyugal. Los bienes adquiridos durante el matrimonio se dividen entre ambos cónyuges según lo acordado o lo que determine el juez." },
];

const servicios = [
  { titulo: "Divorcios en Manizales", desc: "Tramitamos su divorcio notarial o judicial de forma rápida y eficiente. Le asesoramos en cada paso del proceso para proteger sus derechos e intereses.", link: "/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026" },
  { titulo: "Cuota Alimentaria", desc: "Le ayudamos a fijar, aumentar o revisar la cuota alimentaria de sus hijos. Defendemos el bienestar de los menores con base en la ley colombiana.", link: "/noticias/custodia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia" },
  { titulo: "Custodia de Hijos", desc: "Asesoramos en procesos de custodia, régimen de visitas y custodia compartida. Buscamos siempre el mejor acuerdo para el bienestar de sus hijos.", link: "/noticias/divorcios/divorcio-express-en-colombia-requisitos-y-pasos-en-2026" },
  { titulo: "Separación de Bienes", desc: "Gestionamos la liquidación de la sociedad conyugal y la separación de bienes de forma justa y legal, protegiendo su patrimonio.", link: "/noticias/divorcios" },
];

export default function Servicios() {
  const [, setLocation] = useLocation();

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-primary-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-gold-400/50" />
              <span className="text-gold-400/80 text-[11px] uppercase tracking-[0.35em]">Manizales, Colombia</span>
              <span className="w-12 h-px bg-gold-400/50" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-medium leading-tight mb-6">
              Abogada de Derecho de Familia<br />
              <span className="italic text-gold-300">en Manizales</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Más de una década resolviendo casos de divorcio, custodia, cuota alimentaria y separación de bienes en Manizales y Caldas. Asesoría legal clara, cercana y efectiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#contacto" onClick={(e) => { e.preventDefault(); setLocation("/"); setTimeout(() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }), 400); }} className="px-10 py-4 bg-gold-400 text-primary-950 text-[12px] uppercase tracking-[0.25em] font-semibold hover:bg-gold-300 transition-colors">
                Agendar Consulta
              </a>
              <a href="https://wa.me/57" target="_blank" rel="noopener noreferrer" className="px-10 py-4 border border-white/15 text-white/60 text-[12px] uppercase tracking-[0.25em] hover:border-gold-400/50 hover:text-gold-400 transition-all flex items-center gap-2 justify-center">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-primary-950 font-medium">Áreas de práctica en derecho de familia</h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-4" />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {servicios.map((s, i) => (
              <motion.div key={s.titulo} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-gray-100 p-8 hover:border-gold-400/50 transition-colors group">
                <h3 className="font-heading text-xl text-primary-950 mb-3">{s.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <a href={s.link} onClick={(e) => { e.preventDefault(); setLocation(s.link); }} className="text-primary-700 text-xs flex items-center gap-1 hover:gap-2 transition-all">
                  Leer más <ArrowRight size={12} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 lg:py-28 bg-primary-950">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-white font-medium">¿Por qué elegir a Alexandra Vásquez?</h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-4" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { titulo: "Más de 10 años de experiencia", desc: "Especialista en derecho de familia con amplia trayectoria en casos de divorcio, custodia y alimentos en Manizales." },
              { titulo: "Atención personalizada", desc: "Cada caso es único. Le brindamos asesoría directa y cercana, explicando cada paso del proceso en términos claros." },
              { titulo: "Resultados comprobados", desc: "Cientos de familias en Manizales y Caldas han resuelto sus casos legales con nuestra asesoría profesional." },
            ].map((item, i) => (
              <motion.div key={item.titulo} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-px h-12 bg-gold-400/30 mx-auto mb-6" />
                <h3 className="font-heading text-lg text-white mb-3">{item.titulo}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-primary-950 font-medium">Preguntas frecuentes</h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-4" />
          </motion.div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="border-b border-gray-100 pb-6">
                <h3 className="font-medium text-primary-950 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-primary-950 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto px-6">
          <h2 className="font-heading text-3xl md:text-4xl text-white font-medium mb-4">¿Necesita un abogado de familia en Manizales?</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Contáctenos hoy para una consulta inicial. Le orientaremos sobre su caso sin compromiso.</p>
          <a href="/#contacto" onClick={(e) => { e.preventDefault(); setLocation("/"); setTimeout(() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }), 400); }} className="inline-block px-10 py-4 bg-gold-400 text-primary-950 text-[12px] uppercase tracking-[0.25em] font-semibold hover:bg-gold-300 transition-colors">
            Contactar Ahora
          </a>
        </motion.div>
      </section>
    </main>
  );
}
