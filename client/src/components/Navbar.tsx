import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";

const scrollLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Áreas", href: "#areas" },
  { label: "Blog", href: "#blog" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      if (location !== "/") {
        setLocation("/");
        setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 400);
      } else {
        setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 300);
      }
    } else {
      setLocation(href);
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-primary-950 shadow-2xl" : "bg-primary-950/70 backdrop-blur-md"}`}>
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <a href="/" onClick={(e) => { e.preventDefault(); handleNav("#inicio"); }} className="flex items-center gap-3">
          <div className="w-8 h-8 border border-gold-400 flex items-center justify-center">
            <span className="font-heading text-gold-400 text-lg font-bold">A</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-heading text-white text-xl tracking-wide">Alexandra Vásquez</span>
            <span className="block text-gold-400/70 text-[10px] uppercase tracking-[0.25em]">Abogada</span>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {scrollLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); handleNav(l.href); }} className="text-white/60 text-[13px] uppercase tracking-[0.2em] hover:text-gold-400 transition-colors duration-300">
              {l.label}
            </a>
          ))}
          <a href="/sobre-mi" onClick={(e) => { e.preventDefault(); handleNav("/sobre-mi"); }} className="text-white/60 text-[13px] uppercase tracking-[0.2em] hover:text-gold-400 transition-colors duration-300">
            Sobre Mí
          </a>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); handleNav("#contacto"); }} className="ml-4 px-6 py-2.5 border border-gold-400/50 text-gold-400 text-[12px] uppercase tracking-[0.2em] hover:bg-gold-400 hover:text-primary-950 transition-all duration-300">
            Consulta
          </a>
        </nav>
        <button className="lg:hidden text-white/70 p-2 hover:text-gold-400 transition-colors" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-primary-950/98 backdrop-blur-md border-t border-white/5">
            <div className="container mx-auto px-6 py-6 flex flex-col gap-1">
              {scrollLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); handleNav(l.href); }} className="py-3 text-white/60 text-sm uppercase tracking-[0.15em] border-b border-white/5 hover:text-gold-400 transition-colors">
                  {l.label}
                </a>
              ))}
              <a href="/sobre-mi" onClick={(e) => { e.preventDefault(); handleNav("/sobre-mi"); }} className="py-3 text-white/60 text-sm uppercase tracking-[0.15em] border-b border-white/5 hover:text-gold-400 transition-colors">
                Sobre Mí
              </a>
              <a href="#contacto" onClick={(e) => { e.preventDefault(); handleNav("#contacto"); }} className="mt-4 py-3 text-center border border-gold-400/50 text-gold-400 text-sm uppercase tracking-[0.15em] hover:bg-gold-400 hover:text-primary-950 transition-all">
                Agendar Consulta
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
