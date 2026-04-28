import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { MessageCircle, ArrowRight, Phone } from "lucide-react";

const faqs = [
  { q: "¿Cuánto cuesta un divorcio en Manizales?", a: "El costo varía según el tipo de proceso. Un divorcio notarial de mutuo acuerdo puede costar entre $1.100.000 y $2.600.000 pesos. Un divorcio judicial puede costar entre $3.500.000 y $10.000.000 pesos dependiendo de la complejidad." },
  { q: "¿Cuánto tiempo tarda un divorcio en Colombia?", a: "El divorcio notarial tarda entre 1 y 4 semanas si hay acuerdo. El divorcio judicial puede tardar entre 6 meses y 2 años dependiendo del juzgado y la complejidad del caso." },
  { q: "¿Cómo se calcula la cuota alimentaria?", a: "La cuota alimentaria se calcula según los ingresos del obligado y las necesidades del menor. Como referencia, los jueces suelen fijar entre el 20% y el 30% del salario para un hijo." },
  { q: "¿Qué es la custodia compartida en Colombia?", a: "La custodia compartida permite que ambos padres compartan la responsabilidad del cuidado de los hijos. En Colombia es posible acordarla de mutuo acuerdo o solicitarla ante un juez de familia." },
  { q: "¿Necesito un abogado para divorciarme en Colombia?", a: "Para el divorcio notarial no es obligatorio, pero sí muy recomendable para proteger sus intereses. Para el divorcio judicial es indispensable contar con representación legal." },
  { q: "¿Qué pasa con los bienes cuando me divorcio?", a: "Al divorciarse se liquida la sociedad conyugal. Los bienes adquiridos durante el matrimonio se dividen entre ambos cónyuges según lo acordado o lo que determine el juez." },
  { q: "¿Puedo cambiar la cuota alimentaria después de fijada?", a: "Sí. La cuota alimentaria puede revisarse cuando cambien los ingresos del obligado o las necesidades del menor. Se debe iniciar un proceso de revisión ante el juzgado de familia." },
  { q: "¿Qué documentos necesito para iniciar un proceso de familia?", a: "Depende del proceso. En general necesita cédula de ciudadanía, registro civil de matrimonio o nacimiento según el caso, y documentos que soporten su situación económica. Un abogado le indicará exactamente qué necesita." },
];

export default function Servicios() {
  const [, setLocation] = useLocation();

  const nav = (path: string) => { setLocation(path); window.scrollTo({ top: 0 }); };
  const navContact = (e: React.MouseEvent) => { e.preventDefault(); setLocation("/"); setTimeout(() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" }), 400); };

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
              Abogado de Derecho de Familia<br />
              <span className="italic text-gold-300">en Manizales</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Más de una década resolviendo casos de divorcio, custodia, cuota alimentaria y separación de bienes en Manizales y Caldas. Asesoría legal clara, cercana y efectiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#contacto" onClick={navContact} className="px-10 py-4 bg-gold-400 text-primary-950 text-[12px] uppercase tracking-[0.25em] font-semibold hover:bg-gold-300 transition-colors">
                Agendar Consulta
              </a>
              <a href="https://wa.me/57" target="_blank" rel="noopener noreferrer" className="px-10 py-4 border border-white/15 text-white/60 text-[12px] uppercase tracking-[0.25em] hover:border-gold-400/50 hover:text-gold-400 transition-all flex items-center gap-2 justify-center">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="prose prose-lg text-gray-600">
            <p>
              El derecho de familia es una de las ramas más sensibles del derecho colombiano. Los procesos de <a href="/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026" onClick={(e) => { e.preventDefault(); nav("/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026"); }} className="text-primary-700 underline">divorcio</a>, custodia de hijos, cuota alimentaria y separación de bienes afectan directamente la vida de las familias y requieren asesoría legal especializada.
            </p>
            <p>
              En Manizales, Alexandra Vásquez lleva más de diez años acompañando a familias en estos procesos. Su enfoque es claro: resolver cada caso de la forma más rápida, económica y favorable posible para sus clientes, siempre dentro del marco legal colombiano.
            </p>
            <p>
              Si está considerando un divorcio, necesita fijar o revisar una <a href="/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia" onClick={(e) => { e.preventDefault(); nav("/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia"); }} className="text-primary-700 underline">cuota alimentaria</a>, o enfrenta un proceso de custodia, el primer paso es una consulta con un abogado especialista que evalúe su caso y le indique el camino más adecuado.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divorcios */}
      <section className="py-16 bg-gray-50" id="divorcios">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Divorcios en Manizales</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>El divorcio es el proceso legal mediante el cual se disuelve el vínculo matrimonial. En Colombia existen dos vías: el <strong>divorcio notarial</strong> (de mutuo acuerdo, ante notario) y el <strong>divorcio judicial</strong> (ante un juzgado de familia, cuando no hay acuerdo entre las partes).</p>
              <p>El divorcio notarial es la opción más rápida y económica. Si ambas partes están de acuerdo y han resuelto los temas de hijos y bienes, el proceso puede completarse en 1 a 4 semanas. El divorcio judicial, en cambio, puede tardar entre 6 meses y 2 años dependiendo de la complejidad del caso.</p>
              <p>En Manizales, Alexandra Vásquez acompaña a sus clientes en ambos tipos de proceso, desde la preparación de documentos hasta la firma ante notario o la representación ante el juzgado de familia.</p>
              <a href="/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026" onClick={(e) => { e.preventDefault(); nav("/noticias/divorcios/cuanto-cuesta-un-divorcio-en-colombia-en-2026"); }} className="inline-flex items-center gap-1 text-primary-700 text-sm hover:gap-2 transition-all">
                Ver costos y requisitos del divorcio en Colombia <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cuota alimentaria */}
      <section className="py-16 bg-white" id="alimentos">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Cuota Alimentaria en Colombia</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>La cuota alimentaria es la obligación legal que tiene uno de los padres de contribuir económicamente al sostenimiento de sus hijos menores de edad. Esta obligación cubre alimentación, vivienda, educación, salud y recreación.</p>
              <p>En Colombia no existe una fórmula fija para calcular la cuota alimentaria. El juez evalúa los ingresos del obligado y las necesidades reales del menor. Como referencia, los jueces suelen fijar entre el 20% y el 30% del salario para un hijo.</p>
              <p>La cuota alimentaria puede fijarse por acuerdo entre las partes (ante comisario de familia o notario) o por proceso judicial. También puede revisarse cuando cambien las circunstancias económicas del obligado o las necesidades del menor.</p>
              <a href="/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia" onClick={(e) => { e.preventDefault(); nav("/noticias/derecho-de-familia/como-calcular-la-cuota-alimentaria-de-los-hijos-en-colombia"); }} className="inline-flex items-center gap-1 text-primary-700 text-sm hover:gap-2 transition-all">
                Cómo se calcula la cuota alimentaria en Colombia <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custodia */}
      <section className="py-16 bg-gray-50" id="custodia">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Custodia de Hijos en Colombia</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>La custodia de los hijos es uno de los temas más delicados en los procesos de separación o divorcio. En Colombia, la custodia puede ser unilateral (un solo padre) o compartida (ambos padres comparten el cuidado del menor).</p>
              <p>Cuando los padres no llegan a un acuerdo sobre la custodia, el juez de familia decide basándose en el bienestar del menor. Se evalúan factores como la estabilidad económica y emocional de cada padre, el vínculo afectivo con el hijo y las condiciones de vida de cada hogar.</p>
              <p>El régimen de visitas también se define en este proceso, estableciendo los días y horarios en que el padre o madre sin custodia puede compartir con sus hijos.</p>
              <a href="/noticias/custodia/como-funciona-la-custodia-compartida-en-colombia" onClick={(e) => { e.preventDefault(); nav("/noticias/custodia/como-funciona-la-custodia-compartida-en-colombia"); }} className="inline-flex items-center gap-1 text-primary-700 text-sm hover:gap-2 transition-all">
                Cómo funciona la custodia compartida en Colombia <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Separación de bienes */}
      <section className="py-16 bg-white" id="bienes">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Separación de Bienes y Sociedad Conyugal</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>Al contraer matrimonio en Colombia, salvo que se haya pactado lo contrario mediante capitulaciones matrimoniales, se forma automáticamente una sociedad conyugal. Esto significa que los bienes adquiridos durante el matrimonio pertenecen a ambos cónyuges por partes iguales.</p>
              <p>Al divorciarse, esta sociedad conyugal debe liquidarse. El proceso de liquidación implica identificar todos los bienes y deudas del matrimonio, valorarlos y distribuirlos entre los cónyuges según lo acordado o lo que determine el juez.</p>
              <p>La liquidación puede hacerse de mutuo acuerdo ante notario (más rápido y económico) o mediante proceso judicial si no hay acuerdo. Contar con un abogado especialista es fundamental para proteger su patrimonio durante este proceso.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 bg-primary-950">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-white font-medium">¿Por qué elegir a Alexandra Vásquez?</h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-4" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { titulo: "Más de 10 años de experiencia", desc: "Especialista en derecho de familia con amplia trayectoria en casos de divorcio, custodia y alimentos en Manizales y Caldas." },
              { titulo: "Atención personalizada", desc: "Cada caso es único. Le brindamos asesoría directa y cercana, explicando cada paso del proceso en términos claros." },
              { titulo: "Resultados comprobados", desc: "Cientos de familias en Manizales han resuelto sus casos legales con nuestra asesoría profesional." },
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

      {/* Cuándo necesita un abogado */}
      <section className="py-16 bg-gray-50" id="cuando-necesita-abogado">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">¿Cuándo necesita un abogado de familia?</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>Hay situaciones en las que la asesoría legal no es opcional — es indispensable:</p>
              <ul className="space-y-3 list-none pl-0">
                {[
                  { t: "Cuando se va a separar o divorciar", d: "Los acuerdos mal redactados pueden perjudicarle años después. Un abogado revisa que el acuerdo sobre bienes, custodia y alimentos sea justo y legalmente sólido." },
                  { t: "Cuando hay hijos de por medio", d: "Los procesos de custodia son emocionalmente intensos y legalmente complejos. Un abogado especialista conoce los criterios que usan los jueces de familia en Manizales." },
                  { t: "Cuando hay bienes que dividir", d: "La liquidación de la sociedad conyugal puede ser fuente de conflictos graves. Un abogado garantiza que la división sea equitativa." },
                  { t: "Cuando un familiar fallece sin testamento", d: "Los procesos de sucesión intestada pueden volverse largos y costosos si no se manejan correctamente desde el inicio." },
                  { t: "Cuando el otro padre incumple acuerdos", d: "Si no paga la cuota alimentaria o impide las visitas, un abogado puede iniciar las acciones legales para hacer cumplir sus derechos." },
                ].map((item) => (
                  <li key={item.t} className="border-l-2 border-gold-400/40 pl-4">
                    <strong className="text-primary-950">{item.t}:</strong> {item.d}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cómo elegir un abogado */}
      <section className="py-16 bg-white" id="como-elegir-abogado">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Cómo elegir un buen abogado de familia en Manizales</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { t: "Especialización real", d: "Busque un abogado que se dedique principalmente al derecho de familia, no uno que lleve todo tipo de casos." },
                { t: "Conocimiento local", d: "Un abogado que conoce los juzgados de familia de Manizales y los criterios de los jueces locales tiene una ventaja práctica importante." },
                { t: "Comunicación clara", d: "Un buen abogado le explica su caso en términos que usted entiende y le dice con honestidad cuáles son sus posibilidades reales." },
                { t: "Honorarios transparentes", d: "Antes de contratar, debe tener claridad sobre cuánto va a costar el proceso y qué está incluido." },
              ].map((item) => (
                <div key={item.t} className="p-5 border border-gray-100 rounded-lg">
                  <h3 className="font-medium text-primary-950 mb-2">{item.t}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-primary-950 font-medium">Preguntas frecuentes sobre derecho de familia</h2>
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto px-6 max-w-2xl">
          <h2 className="font-heading text-3xl md:text-4xl text-white font-medium mb-4">¿Necesita un abogado de familia en Manizales?</h2>
          <p className="text-white/50 mb-8">Contáctenos hoy para una consulta inicial. Le orientaremos sobre su caso sin compromiso.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#contacto" onClick={navContact} className="px-10 py-4 bg-gold-400 text-primary-950 text-[12px] uppercase tracking-[0.25em] font-semibold hover:bg-gold-300 transition-colors">
              Contactar Ahora
            </a>
            <a href="https://wa.me/57" target="_blank" rel="noopener noreferrer" className="px-10 py-4 border border-white/15 text-white/60 text-[12px] uppercase tracking-[0.25em] hover:border-gold-400/50 hover:text-gold-400 transition-all flex items-center gap-2 justify-center">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
