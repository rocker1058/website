import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Check, MessageCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {}
  };

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-primary-950">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="text-gold-400/60 text-[11px] uppercase tracking-[0.35em]">Contacto</span>
          <h2 className="font-heading text-4xl md:text-5xl text-white mt-3 font-medium">Hablemos de <em className="text-gold-300">su caso</em></h2>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-6" />
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div>
            <div className="space-y-8 mb-10">
              {[
                { icon: MapPin, label: "Ubicación", value: "Manizales, Caldas — Colombia" },
                { icon: Phone, label: "Teléfono", value: "Contáctenos para agendar su cita" },
                { icon: Mail, label: "Email", value: "Escríbanos para más información" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <item.icon className="text-gold-400/60 mt-0.5 shrink-0" size={18} />
                  <div>
                    <h4 className="text-white/60 text-[11px] uppercase tracking-[0.2em] mb-1">{item.label}</h4>
                    <p className="text-white/70 text-[15px]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="https://wa.me/57" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700/20 border border-green-500/30 text-green-400 text-[12px] uppercase tracking-[0.2em] rounded hover:bg-green-700/30 transition-colors">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
          <motion.form initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="space-y-5">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 border border-gold-400/30 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="text-gold-400" size={22} /></div>
                <h3 className="font-heading text-2xl text-white mb-2">Mensaje Enviado</h3>
                <p className="text-white/40 text-sm">Nos pondremos en contacto pronto.</p>
              </div>
            ) : (
              <>
                <input type="text" placeholder="Nombre completo" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 text-[15px] focus:outline-none focus:border-gold-400/50 transition-colors" />
                <input type="email" placeholder="Correo electrónico" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 text-[15px] focus:outline-none focus:border-gold-400/50 transition-colors" />
                <input type="tel" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 text-[15px] focus:outline-none focus:border-gold-400/50 transition-colors" />
                <textarea placeholder="Describa brevemente su caso" required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 text-[15px] focus:outline-none focus:border-gold-400/50 transition-colors resize-none" />
                <button type="submit" className="w-full py-4 bg-gold-400 text-primary-950 text-[12px] uppercase tracking-[0.25em] font-semibold hover:bg-gold-300 transition-colors duration-300 mt-4">
                  Enviar Mensaje
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
