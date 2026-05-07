import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Gavel, Phone } from "lucide-react";

export default function CuotaAlimentariaManizales() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-primary-950 text-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold-400 text-[11px] uppercase tracking-[0.3em] mb-4">Servicios Legales en Manizales</p>
            <h1 className="font-heading text-4xl lg:text-5xl font-medium mb-6">Abogado Cuota Alimentaria en Manizales</h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              Asesoría legal en fijación, aumento, reducción y cobro de cuota alimentaria para hijos. 
              Proteja los derechos de sus hijos con un abogado especialista en Manizales.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">¿En Qué le Podemos Ayudar?</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: DollarSign, t: "Fijación de Cuota", d: "Cuando no hay acuerdo sobre el monto. Presentamos demanda ante juez de familia o conciliación en el ICBF para establecer la cuota." },
                { icon: TrendingUp, t: "Aumento de Cuota", d: "Si los ingresos del obligado aumentaron o las necesidades del hijo crecieron (colegio, salud), se puede pedir aumento." },
                { icon: TrendingDown, t: "Reducción de Cuota", d: "Si el obligado perdió su empleo o sus ingresos disminuyeron significativamente, puede solicitar reducción." },
                { icon: Gavel, t: "Cobro Ejecutivo", d: "Si el obligado no paga, iniciamos proceso ejecutivo de alimentos. Puede incluir embargo de salario y bienes." },
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

      {/* Cómo se calcula */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">¿Cómo se Calcula la Cuota Alimentaria?</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>En Colombia no hay una fórmula fija. El juez considera:</p>
              <ul className="space-y-3 list-none pl-0">
                {[
                  { t: "Ingresos del obligado", d: "Salario, honorarios, rentas, comisiones y cualquier ingreso demostrable." },
                  { t: "Necesidades del hijo", d: "Alimentación, vivienda, educación, salud, vestuario, recreación." },
                  { t: "Capacidad económica de ambos padres", d: "La obligación es proporcional a los ingresos de cada uno." },
                  { t: "Número de hijos", d: "Si el obligado tiene otros hijos, la cuota se distribuye equitativamente." },
                ].map((item) => (
                  <li key={item.t} className="border-l-2 border-gold-400/40 pl-4">
                    <strong className="text-primary-950">{item.t}:</strong> {item.d}
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-gold-50 border border-gold-200 rounded-lg mt-6">
                <p className="text-sm text-primary-950"><strong>Referencia:</strong> Como mínimo, la cuota no puede ser inferior al 50% de un salario mínimo por hijo cuando el obligado tiene ingresos de al menos un salario mínimo.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Qué pasa si no paga */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">¿Qué Pasa si No Pagan la Cuota Alimentaria?</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>El incumplimiento de la cuota alimentaria tiene consecuencias serias en Colombia:</p>
              <div className="space-y-4">
                {[
                  { t: "Proceso ejecutivo", d: "Se puede embargar el salario (hasta 50%), cuentas bancarias y bienes del deudor." },
                  { t: "Denuncia penal", d: "La inasistencia alimentaria es delito en Colombia (Art. 233 Código Penal). Pena de 1 a 3 años de prisión." },
                  { t: "Reporte en centrales de riesgo", d: "El deudor alimentario puede ser reportado en DataCrédito." },
                  { t: "Impedimento de salida del país", d: "Se puede solicitar al juez que impida la salida del país del deudor." },
                ].map((item) => (
                  <div key={item.t} className="p-4 border-l-2 border-red-300 pl-4 bg-red-50/30">
                    <strong className="text-primary-950">{item.t}:</strong>
                    <span className="text-gray-600"> {item.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl text-primary-950 font-medium mb-6">Preguntas Frecuentes sobre Cuota Alimentaria</h2>
            <div className="w-12 h-px bg-gold-400 mb-8" />
            <div className="space-y-6">
              {[
                { q: "¿Hasta qué edad se paga cuota alimentaria?", a: "Hasta los 18 años, o hasta los 25 si el hijo está estudiando. En casos de discapacidad, puede ser indefinida." },
                { q: "¿Se puede acordar la cuota sin ir a juicio?", a: "Sí. La conciliación en el ICBF o en un centro de conciliación es más rápida y económica. El acuerdo tiene la misma fuerza legal que una sentencia." },
                { q: "¿Qué incluye la cuota alimentaria?", a: "No solo comida. Incluye vivienda, educación, salud, vestuario, recreación y todo lo necesario para el desarrollo del menor." },
                { q: "¿Puedo pedir alimentos retroactivos?", a: "Sí. Se pueden cobrar alimentos desde la fecha de la demanda o conciliación, no desde antes." },
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
          <h2 className="font-heading text-2xl font-medium mb-4">¿Necesita un abogado de alimentos en Manizales?</h2>
          <p className="text-white/60 mb-8">Proteja los derechos de sus hijos. Consulte hoy con Alexandra Vásquez.</p>
          <a href="https://wa.me/573207170726" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700/20 border border-green-500/30 text-green-400 text-[12px] uppercase tracking-[0.2em] rounded hover:bg-green-700/30 transition-colors">
            <Phone size={16} /> Consultar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
