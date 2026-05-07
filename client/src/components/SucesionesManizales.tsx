import { motion } from "framer-motion";
import { FileText, Home, Clock, AlertTriangle, Phone } from "lucide-react";

export default function SucesionesManizales() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-primary-950 text-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold-400 text-[11px] uppercase tracking-[0.3em] mb-4">Servicios Legales en Manizales</p>
            <h1 className="font-heading text-4xl lg:text-5xl font-medium mb-6">Abogado de Sucesiones en Manizales</h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              Asesoría legal completa en procesos de sucesión, herencias y testamentos. 
              Tramitamos la liquidación de la herencia de forma ágil y segura en Manizales y Caldas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tipos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Tipos de Sucesión que Manejamos</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: FileText, t: "Sucesión Testada", d: "Cuando el fallecido dejó testamento. Se respeta su voluntad dentro de los límites legales (legítimas y mejoras)." },
                { icon: Home, t: "Sucesión Intestada", d: "Cuando no hay testamento. La ley define el orden de herederos: hijos, cónyuge, padres, hermanos." },
                { icon: Clock, t: "Sucesión Notarial", d: "Cuando todos los herederos están de acuerdo. Se tramita ante notario en Manizales. Más rápida y económica." },
                { icon: AlertTriangle, t: "Sucesión Judicial", d: "Cuando hay desacuerdo entre herederos o menores de edad involucrados. Se tramita ante juez de familia." },
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
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Pasos del Proceso de Sucesión</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="space-y-6">
              {[
                { n: "1", t: "Apertura de la sucesión", d: "Se inicia con el registro civil de defunción. Se identifican los herederos y el patrimonio del fallecido." },
                { n: "2", t: "Inventario de bienes", d: "Se hace un listado completo de bienes (inmuebles, vehículos, cuentas bancarias) y deudas del fallecido." },
                { n: "3", t: "Trabajo de partición", d: "Se elabora el documento que define qué le corresponde a cada heredero según la ley o el testamento." },
                { n: "4", t: "Aprobación y registro", d: "El juez o notario aprueba la partición. Se registran las escrituras de los bienes a nombre de los herederos." },
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

      {/* Errores comunes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Errores Comunes en Sucesiones</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <ul className="space-y-3 list-none pl-0">
                {[
                  { t: "Esperar demasiado tiempo", d: "La sucesión no prescribe, pero los bienes pueden deteriorarse, perderse o ser ocupados por terceros." },
                  { t: "No incluir todos los bienes", d: "Si se descubren bienes después, hay que hacer una sucesión adicional. Es mejor investigar bien desde el inicio." },
                  { t: "Ignorar las deudas", d: "Los herederos responden por las deudas del fallecido hasta el monto de la herencia. Es crucial conocerlas antes de aceptar." },
                  { t: "Intentar hacerlo sin abogado", d: "Los errores en la partición pueden generar demandas entre herederos años después. Un abogado previene conflictos." },
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

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Preguntas Frecuentes sobre Sucesiones</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="space-y-6">
              {[
                { q: "¿Cuánto cuesta un proceso de sucesión en Manizales?", a: "Depende del valor de los bienes. La sucesión notarial es más económica (desde $2.000.000 COP). La judicial puede costar más por los tiempos del proceso." },
                { q: "¿Cuánto tarda una sucesión?", a: "Notarial: 2-4 meses. Judicial: 6-18 meses. Depende de la complejidad y el acuerdo entre herederos." },
                { q: "¿Qué pasa si un heredero no quiere participar?", a: "Se puede hacer la sucesión judicial. El juez notifica al heredero renuente y el proceso continúa con o sin su colaboración." },
                { q: "¿Puedo vender un bien heredado antes de hacer la sucesión?", a: "No. Hasta que no se registre la sentencia de sucesión, los bienes siguen a nombre del fallecido y no se pueden vender legalmente." },
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
          <h2 className="font-heading text-2xl font-medium mb-4">¿Necesita tramitar una sucesión en Manizales?</h2>
          <p className="text-white/60 mb-8">No deje pasar más tiempo. Consulte hoy con Alexandra Vásquez.</p>
          <a href="https://wa.me/573207170726" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700/20 border border-green-500/30 text-green-400 text-[12px] uppercase tracking-[0.2em] rounded hover:bg-green-700/30 transition-colors">
            <Phone size={16} /> Consultar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
