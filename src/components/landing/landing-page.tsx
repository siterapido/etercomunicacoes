"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── Reveal on scroll ───────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s cubic-bezier(0.25,0.1,0.25,1) ${delay}ms, transform 0.8s cubic-bezier(0.25,0.1,0.25,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Minimal icon ───────────────────────────────────── */
function SvgIcon({ name }: { name: string }) {
  const p = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "layers":
      return (
        <svg {...p}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...p}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
    case "pen":
      return (
        <svg {...p}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    case "compass":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case "film":
      return (
        <svg {...p}>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      );
    case "globe":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Navbar ──────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Serviços", href: "#servicos" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1C2D3A]/95 backdrop-blur-xl py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#">
          <img
            src="/logos/etercom-full.png"
            alt="Etercom"
            className="h-8 md:h-10 w-auto opacity-85 hover:opacity-100 transition-opacity duration-300"
          />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] tracking-[0.2em] uppercase text-[#F5EAD4]/40 hover:text-[#F5EAD4] transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            className="px-5 py-2 text-[11px] tracking-[0.15em] uppercase text-[#F5EAD4]/60 border border-[#F5EAD4]/15 rounded-full hover:border-[#FF7700]/60 hover:text-[#FF7700] transition-all duration-300"
          >
            Plataforma
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F5EAD4"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M4 8h16" />
                <path d="M4 16h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1C2D3A]/98 backdrop-blur-xl border-t border-[#F5EAD4]/5 mt-2">
          <div className="px-6 py-8 flex flex-col gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm tracking-[0.1em] uppercase text-[#F5EAD4]/50 hover:text-[#F5EAD4] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              className="mt-2 px-6 py-3 text-xs tracking-[0.1em] uppercase text-center text-[#F5EAD4]/60 border border-[#F5EAD4]/15 rounded-full"
            >
              Acessar Plataforma
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1C2D3A]">
      {/* Background image - interior design architecture */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Blue overlay with transparency */}
        <div className="absolute inset-0 bg-[#1C2D3A]/78" />
      </div>

      {/* Geometric arcs */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-[10%] right-[-15%] w-[70vw] h-[70vw] rounded-full border border-[#467192]/20" />
        <div className="absolute bottom-[-25%] left-[-20%] w-[80vw] h-[80vw] rounded-full border border-[#467192]/12" />
        <div className="absolute top-[35%] left-[8%] w-[35vw] h-[35vw] rounded-full border border-[#467192]/8" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <img
            src="/logos/etercom-text.png"
            alt="Etercom Comunicação"
            className="h-44 md:h-64 w-auto mx-auto"
          />
        </div>

        <div
          className="animate-fade-in-up mt-16"
          style={{ animationDelay: "0.7s", animationFillMode: "both" }}
        >
          <p className="text-[#F5EAD4]/35 text-sm md:text-base font-light max-w-sm mx-auto leading-relaxed">
            Estratégia, branding e conteúdo
            <br />
            que conecta marcas a pessoas.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in-up"
        style={{ animationDelay: "1.1s", animationFillMode: "both" }}
      >
        <div className="w-px h-14 bg-gradient-to-b from-[#FF7700]/40 to-transparent" />
      </div>
    </section>
  );
}

/* ── Services ────────────────────────────────────────── */
const services = [
  { icon: "layers", label: "Branding" },
  { icon: "monitor", label: "Social Media" },
  { icon: "pen", label: "Conteúdo" },
  { icon: "compass", label: "Estratégia" },
  { icon: "film", label: "Audiovisual" },
  { icon: "globe", label: "Assessoria" },
];

function ServicesSection() {
  return (
    <section id="servicos" className="py-24 md:py-32 bg-[#F5EAD4]">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#1C2D3A]/30 text-center mb-16 md:mb-20">
            Serviços
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-14 md:gap-16">
          {services.map((s, i) => (
            <Reveal key={s.label} delay={i * 60} className="text-center">
              <div className="flex flex-col items-center gap-4 group cursor-default">
                <div className="text-[#1C2D3A]/25 group-hover:text-[#467192] transition-colors duration-300">
                  <SvgIcon name={s.icon} />
                </div>
                <span className="text-sm text-[#1C2D3A]/50 group-hover:text-[#1C2D3A]/70 tracking-wide transition-colors duration-300">
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Portfolio ───────────────────────────────────────── */
const works = [
  {
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=85",
    title: "Construtora Apex",
    tag: "Branding",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85",
    title: "Lumière Imóveis",
    tag: "Social Media",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85",
    title: "Maison Belle",
    tag: "Identidade Visual",
  },
  {
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1400&q=85",
    title: "Arcadia Engenharia",
    tag: "Comunicação",
  },
];

function ImageCard({
  item,
  aspect,
}: {
  item: (typeof works)[0];
  aspect: string;
}) {
  return (
    <div
      className={`group relative ${aspect} rounded-lg overflow-hidden cursor-pointer`}
    >
      <img
        src={item.src}
        alt={item.title}
        className="w-full h-full object-cover brightness-[0.95] saturate-[0.85] transition-all duration-[800ms] ease-out group-hover:scale-[1.03] group-hover:brightness-100 group-hover:saturate-100"
      />
      <div className="absolute inset-0 bg-[#1C2D3A]/0 group-hover:bg-[#1C2D3A]/40 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#FF7700]">
          {item.tag}
        </span>
        <h3 className="text-lg md:text-xl text-white mt-1 font-light">
          {item.title}
        </h3>
      </div>
    </div>
  );
}

function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#1C2D3A]/30 mb-12 md:mb-16 px-2 md:px-4">
            Portfolio
          </p>
        </Reveal>

        <div className="space-y-3 md:space-y-4">
          {/* Panoramic */}
          <Reveal>
            <ImageCard item={works[0]} aspect="aspect-[2.2/1]" />
          </Reveal>

          {/* Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Reveal delay={80}>
              <ImageCard item={works[1]} aspect="aspect-[4/3]" />
            </Reveal>
            <Reveal delay={160}>
              <ImageCard item={works[2]} aspect="aspect-[4/3]" />
            </Reveal>
          </div>

          {/* Panoramic */}
          <Reveal>
            <ImageCard item={works[3]} aspect="aspect-[2.2/1]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── About ───────────────────────────────────────────── */
function AboutSection() {
  const stats = [
    { n: "8+", label: "Anos" },
    { n: "150+", label: "Projetos" },
    { n: "40+", label: "Clientes" },
  ];

  return (
    <section
      id="sobre"
      className="py-24 md:py-32 bg-[#1C2D3A] relative overflow-hidden"
    >
      {/* Subtle arc */}
      <div className="absolute top-[-30%] right-[-20%] w-[60vw] h-[60vw] rounded-full border border-[#467192]/12 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        <Reveal>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#467192]/60 mb-8">
            Sobre
          </p>
        </Reveal>

        <Reveal delay={100}>
          <p className="text-[#F5EAD4]/40 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed mb-16 md:mb-20">
            Combinamos estratégia e criatividade para construir narrativas que
            geram conexão e impulsionam negócios.
          </p>
        </Reveal>

        <div className="flex justify-center gap-16 md:gap-24">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={200 + i * 100}>
              <div>
                <div className="text-4xl md:text-5xl font-extralight text-[#F5EAD4]/70 mb-2">
                  {s.n}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#F5EAD4]/25">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ─────────────────────────────────────────── */
function ContactSection() {
  return (
    <section id="contato" className="py-24 md:py-32 bg-[#F5EAD4]">
      <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
        <Reveal>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#1C2D3A]/30 mb-8">
            Contato
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-display text-2xl md:text-3xl text-[#1C2D3A]/80 mb-10 leading-tight font-normal">
            Vamos criar algo{" "}
            <em className="italic text-[#467192]">juntos</em>?
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="mailto:contato@etercomunicacoes.com.br"
              className="px-7 py-3 bg-[#FF7700] text-white text-xs tracking-[0.15em] uppercase rounded-full hover:bg-[#CD5E19] transition-colors duration-300"
            >
              Fale conosco
            </a>
            <Link
              href="/login"
              className="text-[11px] tracking-[0.15em] uppercase text-[#1C2D3A]/40 hover:text-[#1C2D3A]/70 transition-colors duration-300"
            >
              Acessar plataforma &rarr;
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#141F29] py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <img
          src="/logos/etercom-symbol.png"
          alt="Etercom"
          className="h-6 w-auto opacity-15"
        />
        <p className="text-[10px] text-[#F5EAD4]/10 tracking-wider">
          &copy; 2026 Eter Comunicações
        </p>
      </div>
    </footer>
  );
}

/* ── Main Export ─────────────────────────────────────── */
export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#1C2D3A]">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
