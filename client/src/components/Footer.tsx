export default function Footer() {
  return (
    <footer className="bg-primary-950 border-t border-white/5 py-10">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-heading text-white/60 text-lg">Alexandra Vásquez</span>
        <p className="text-white/50 text-xs tracking-wide">Abogada · Derecho de Familia · Manizales, Colombia</p>
        <p className="text-white/40 text-xs">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
