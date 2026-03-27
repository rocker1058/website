import { motion } from "framer-motion";
import { Heart, Users, FileText, Home, HandshakeIcon, Baby } from "lucide-react";

const areas = [
  { icon: Heart, title: "Divorcios", desc: "Procesos de divorcio, separación de bienes y liquidación de sociedad conyugal con acompañamiento integral." },
  { icon: Baby, title: "Custodia", desc: "Defensa de derechos parentales, regulación de visitas y custodia compartida." },
  { icon: Users, title: "Alimentos", desc: "Fijación, aumento y disminución de cuota alimentaria para menores y cónyuge." },
  { icon: FileText, title: "Sucesiones", desc: "Trámite de sucesiones, testamentos y liquidación de herencias familiares." },
  { icon: Home, title: "Violencia Intrafamiliar", desc: "Medidas de protección inmediata y acompañamiento jurídico especializado." },
  { icon: HandshakeIcon, title: "Conciliaciones", desc: "Resolución extrajudicial de conflictos familiares de forma eficiente y confidencial." },
];

export default function Areas() {
  return (
    <section id="areas" className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="text-primary-600/60 text-[11px] uppercase tracking-[0.35em]">Derecho de Familia</span>
          <h2 className="font-heading text-4xl md:text-5xl text-primary-950 mt-3 font-medium">Áreas de <em className="text-primary-700">Práctica</em></h2>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-6" />
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
          {areas.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white p-10 group hover:bg-primary-950 transition-colors duration-500">
              <a.icon className="text-primary-400/50 mb-4 group-hover:text-gold-400 transition-colors duration-500" size={28} strokeWidth={1.5} />
              <span className="text-[11px] text-primary-400/50 uppercase tracking-[0.3em] group-hover:text-gold-400/50 transition-colors">0{i + 1}</span>
              <h3 className="font-heading text-2xl text-primary-950 mt-4 mb-4 group-hover:text-white transition-colors">{a.title}</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed group-hover:text-white/50 transition-colors">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
