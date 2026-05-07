import { motion } from "framer-motion";
import { Scale, FileText, Clock, CheckCircle, Phone } from "lucide-react";

export default function DivorcioManizales() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-primary-950 text-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold-400 text-[11px] uppercase tracking-[0.3em] mb-4">Servicios Legales en Manizales</p>
            <h1 className="font-heading text-4xl lg:text-5xl font-medium mb-6">Abogado de Divorcios en Manizales</h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              Asesoría legal experta para su proceso de divorcio. Tramitamos divorcios express ante notario, 
              divorcios de mutuo acuerdo y divorcios contenciosos con la protección que usted y su familia necesitan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tipos de divorcio */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Tipos de Divorcio que Tramitamos</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Clock, t: "Divorcio Express", d: "Ante notario, en 1-2 semanas. Requiere mutuo acuerdo y no tener hijos menores o ya tener acuerdo sobre custodia y alimentos." },
                { icon: CheckCircle, t: "Divorcio de Mutuo Acuerdo", d: "Ambos cónyuges acuerdan los términos: bienes, custodia y alimentos. Puede ser notarial o judicial según el caso." },
                { icon: Scale, t: "Divorcio Contencioso", d: "Cuando no hay acuerdo. Se presenta demanda ante juez de familia. Requiere abogado obligatoriamente." },
              ].map((item) => (
                <div key={item.t} className="p-6 border border-gray-100 rounded-lg">
                  <item.icon className="text-gold-400 mb-3" size={24} />
                  <h3 className="font-medium text-primary-950 mb-2">{item.t}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">¿Cómo es el Proceso de Divorcio en Manizales?</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="space-y-6">
              {[
                { n: "1", t: "Consulta inicial", d: "Evaluamos su situación: tipo de divorcio adecuado, bienes a liquidar, situación de hijos menores y expectativas." },
                { n: "2", t: "Preparación de documentos", d: "Redactamos la demanda o el acuerdo notarial. Reunimos registro civil de matrimonio, cédulas y documentos de bienes." },
                { n: "3", t: "Presentación y trámite", d: "Radicamos ante notaría o juzgado de familia de Manizales. Hacemos seguimiento hasta obtener la sentencia." },
                { n: "4", t: "Registro de la sentencia", d: "Inscribimos el divorcio en el registro civil para que tenga plenos efectos legales." },
              ].map((item) => (
                <div key={item.n} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-gold-400/20 text-gold-600 rounded-full flex items-center justify-center text-sm font-medium">{item.n}</span>
                  <div>
                    <h3 className="font-medium text-primary-950">{item.t}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Costos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">¿Cuánto Cuesta un Divorcio en Manizales?</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>El costo depende del tipo de divorcio y la complejidad del caso:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="border-l-2 border-gold-400/40 pl-4"><strong className="text-primary-950">Divorcio express notarial:</strong> Desde $1.500.000 COP incluyendo honorarios y gastos notariales. Tiempo: 1-3 semanas.</li>
                <li className="border-l-2 border-gold-400/40 pl-4"><strong className="text-primary-950">Divorcio de mutuo acuerdo judicial:</strong> Desde $2.000.000 COP. Tiempo: 2-4 meses.</li>
                <li className="border-l-2 border-gold-400/40 pl-4"><strong className="text-primary-950">Divorcio contencioso:</strong> Desde $3.500.000 COP dependiendo de la complejidad. Tiempo: 6-18 meses.</li>
              </ul>
              <p className="text-sm text-gray-500 italic">Los valores son referenciales y pueden variar según las particularidades de cada caso.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Preguntas Frecuentes sobre Divorcios</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="space-y-6">
              {[
                { q: "¿Puedo divorciarme sin el consentimiento de mi pareja?", a: "Sí. El divorcio contencioso permite divorciarse invocando una causal legal, sin necesidad de que el otro cónyuge esté de acuerdo." },
                { q: "¿Qué pasa con los bienes durante el divorcio?", a: "Se debe liquidar la sociedad conyugal. Los bienes adquiridos durante el matrimonio se dividen en partes iguales, salvo acuerdo diferente entre las partes." },
                { q: "¿Puedo divorciarme si tengo hijos menores?", a: "Sí, pero debe definirse custodia, régimen de visitas y cuota alimentaria antes o durante el proceso de divorcio." },
                { q: "¿Cuánto tarda un divorcio express en Manizales?", a: "Entre 1 y 3 semanas si ambas partes están de acuerdo y la documentación está completa." },
              ].map((item) => (
                <div key={item.q} className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-primary-950 mb-2">{item.q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-950 text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="font-heading text-2xl font-medium mb-4">¿Necesita un abogado de divorcios en Manizales?</h2>
          <p className="text-white/60 mb-8">Agende su consulta hoy. Le explicamos sus opciones con claridad y honestidad.</p>
          <a href="https://wa.me/573207170726" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700/20 border border-green-500/30 text-green-400 text-[12px] uppercase tracking-[0.2em] rounded hover:bg-green-700/30 transition-colors">
            <Phone size={16} /> Consultar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
