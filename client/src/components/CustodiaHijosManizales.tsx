import { motion } from "framer-motion";
import { Users, Shield, Heart, FileText, Phone } from "lucide-react";

export default function CustodiaHijosManizales() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-primary-950 text-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold-400 text-[11px] uppercase tracking-[0.3em] mb-4">Servicios Legales en Manizales</p>
            <h1 className="font-heading text-4xl lg:text-5xl font-medium mb-6">Abogado de Custodia de Hijos en Manizales</h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              Proteja la relación con sus hijos. Asesoría legal especializada en custodia, régimen de visitas, 
              patria potestad y modificación de acuerdos de custodia en Manizales.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tipos de custodia */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Tipos de Custodia en Colombia</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Users, t: "Custodia Compartida", d: "Ambos padres comparten el cuidado personal del hijo. El juez evalúa que sea en el mejor interés del menor y que ambos padres tengan condiciones adecuadas." },
                { icon: Shield, t: "Custodia Exclusiva", d: "Un solo padre tiene el cuidado personal. Se otorga cuando el otro padre representa un riesgo o no tiene condiciones para el cuidado del menor." },
                { icon: Heart, t: "Régimen de Visitas", d: "El padre que no tiene la custodia tiene derecho a mantener contacto regular con sus hijos. Se fija un calendario de visitas." },
                { icon: FileText, t: "Modificación de Custodia", d: "Si las circunstancias cambian, se puede solicitar al juez modificar la custodia, el régimen de visitas o la cuota alimentaria." },
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

      {/* Qué evalúa el juez */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">¿Qué Evalúa el Juez para Decidir la Custodia?</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>En Colombia, el principio rector es el <strong className="text-primary-950">interés superior del menor</strong>. El juez de familia en Manizales evalúa:</p>
              <ul className="space-y-3 list-none pl-0">
                {[
                  "Vínculo afectivo del niño con cada padre",
                  "Capacidad económica y emocional de cada padre",
                  "Estabilidad del entorno (vivienda, colegio, red de apoyo)",
                  "Opinión del menor si tiene edad suficiente (generalmente desde los 12 años)",
                  "Historial de violencia intrafamiliar o negligencia",
                  "Disponibilidad de tiempo para el cuidado del hijo",
                ].map((item) => (
                  <li key={item} className="border-l-2 border-gold-400/40 pl-4">{item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Patria potestad */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Custodia vs. Patria Potestad</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>Muchos padres confunden estos conceptos:</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-primary-950 mb-2">Custodia</h3>
                  <p className="text-sm">Es el cuidado personal diario del hijo. Quién vive con el niño, lo lleva al colegio, lo cuida en el día a día.</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-primary-950 mb-2">Patria Potestad</h3>
                  <p className="text-sm">Son los derechos legales sobre el hijo: autorizar viajes, decidir sobre educación, salud y representarlo legalmente. La tienen ambos padres salvo que un juez la suspenda.</p>
                </div>
              </div>
              <p>Perder la custodia <strong>no</strong> significa perder la patria potestad. Un padre sin custodia sigue teniendo derecho a participar en decisiones importantes sobre su hijo.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Preguntas Frecuentes sobre Custodia</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="space-y-6">
              {[
                { q: "¿A qué edad puede el hijo decidir con quién vivir?", a: "En Colombia no hay una edad fija. Desde los 12 años el juez suele escuchar la opinión del menor, pero no es vinculante. La decisión siempre es del juez basándose en el interés superior del niño." },
                { q: "¿Puede la madre impedir que el padre vea a los hijos?", a: "No. Impedir las visitas es una violación de los derechos del niño y del padre. Se puede denunciar ante el ICBF o solicitar al juez medidas para garantizar el cumplimiento." },
                { q: "¿Cuánto tarda un proceso de custodia en Manizales?", a: "Un acuerdo de conciliación puede lograrse en 1-2 semanas. Un proceso judicial puede tomar entre 4 y 12 meses dependiendo de la complejidad." },
                { q: "¿Se puede cambiar la custodia después de otorgada?", a: "Sí. Si las circunstancias cambian (mudanza, negligencia, cambio económico), se puede solicitar modificación ante el juez de familia." },
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
          <h2 className="font-heading text-2xl font-medium mb-4">¿Necesita un abogado de custodia en Manizales?</h2>
          <p className="text-white/60 mb-8">Proteja su relación con sus hijos. Consulte hoy con Alexandra Vásquez.</p>
          <a href="https://wa.me/573207170726" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700/20 border border-green-500/30 text-green-400 text-[12px] uppercase tracking-[0.2em] rounded hover:bg-green-700/30 transition-colors">
            <Phone size={16} /> Consultar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
